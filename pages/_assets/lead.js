/*
 * Lead pop-up. Any [data-lead-open] opens the #lead dialog; data-topic preselects the interest,
 * data-source is written to the hidden "source" field with the page path, so the CRM knows where
 * the lead came from. The floating button shows once the hero is out of view and hides while the
 * closing band or the footer is on screen. It never opens on its own.
 * Submits to Netlify Forms with fetch for the inline success state; without fetch it posts normally.
 */
(() => {
  const dialog = document.getElementById('lead');
  if (!dialog || typeof dialog.showModal !== 'function') return; // no dialog support: #lead stays a plain section
  const form = dialog.querySelector('form');
  const source = form.querySelector('[name="source"]');
  const interest = form.querySelector('[name="interest"]');
  const success = dialog.querySelector('.form-success');
  const failure = dialog.querySelector('.form-error');
  let opener = null;

  const open = (trigger) => {
    opener = trigger;
    source.value = `${trigger?.dataset.source || 'link'} on ${location.pathname}`;
    const topic = trigger?.dataset.topic;
    if (topic && [...interest.options].some((o) => o.value === topic)) interest.value = topic;
    dialog.showModal();
    document.documentElement.classList.add('lead-open');
    form.querySelector('input:not([type=hidden])')?.focus();
  };
  const close = () => dialog.close();
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lead-open');
    opener?.focus?.();
  });
  // a click on the backdrop (outside the inner panel) closes
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.querySelector('[data-lead-close]').addEventListener('click', close);
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lead-open]');
    if (!t) return;
    e.preventDefault();
    open(t);
  });
  if (location.hash === '#lead') open(null);

  /* floating button: after the hero, not over the closing band */
  const float = document.querySelector('.lead-float');
  const hero = document.getElementById('hero') || document.querySelector('main > section');
  const ends = [document.getElementById('contact'), document.querySelector('.site-footer')].filter(Boolean);
  if (float && hero) {
    let pastHero = false;
    const inView = new Set();
    const sync = () => { float.hidden = false; float.classList.toggle('is-on', pastHero && inView.size === 0); };
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe(hero);
    const watch = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target))); sync(); });
    ends.forEach((el) => watch.observe(el));
  }

  /* validation and sending */
  const msg = form.dataset;
  // an email address, or a phone number with at least 6 digits
  const isReach = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || v.replace(/\D/g, '').length >= 6;
  const fields = [...form.querySelectorAll('.field')];
  const check = (field) => {
    const input = field.querySelector('input:not([type=hidden]), select, textarea');
    const out = field.querySelector('.field-error');
    let text = '';
    if (input.type === 'checkbox') { if (input.required && !input.checked) text = msg.msgConsent; }
    else if (input.required && !input.value.trim()) text = msg.msgRequired;
    else if (input.hasAttribute('data-reach') && !isReach(input.value)) text = msg.msgReach;
    out.textContent = text;
    field.classList.toggle('is-invalid', Boolean(text));
    input.setAttribute('aria-invalid', String(Boolean(text)));
    return !text;
  };
  fields.forEach((f) => f.querySelector('input, select, textarea')?.addEventListener('change', () => check(f)));
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', async (e) => {
    const ok = fields.map(check).every(Boolean);
    if (!ok) { e.preventDefault(); form.querySelector('.is-invalid input, .is-invalid select, .is-invalid textarea')?.focus(); return; }
    if (!window.fetch) return; // plain POST, then Netlify's redirect to the thanks page
    e.preventDefault();
    const button = form.querySelector('[type=submit]');
    const label = button.querySelector('.btn-label');
    const idle = label.textContent;
    button.disabled = true;
    label.textContent = msg.msgSending;
    failure.hidden = true;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      success.hidden = false;
      success.querySelector('h3').focus();
    } catch {
      failure.hidden = false;
    } finally {
      button.disabled = false;
      label.textContent = idle;
    }
  });
})();
