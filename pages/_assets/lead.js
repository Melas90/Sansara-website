/*
 * Lead pop-up. Any [data-lead-open] opens the #lead dialog; data-topic preselects the interest,
 * data-source is written to the hidden "source" field with the page path, so the CRM knows where
 * the lead came from. The floating button shows once the hero is out of view and hides while the
 * closing band or the footer is on screen. It never opens on its own.
 * Submits to Netlify Forms with fetch for the inline success state; without fetch it posts normally.
 */
(() => {
  /* Ad origin: an ad link carries utm_* and Meta adds fbclid. They are kept for the whole visit,
     so a visitor who clicks around before sending is still credited to the ad in the CRM. */
  const AD_KEYS = ['utm_source', 'utm_campaign', 'utm_content', 'fbclid'];
  const STORE = 'sansara-ad-origin';
  let adOrigin = {};
  try { adOrigin = JSON.parse(sessionStorage.getItem(STORE) || '{}'); } catch { /* storage blocked */ }
  const params = new URLSearchParams(location.search);
  if (AD_KEYS.some((k) => params.get(k))) {
    adOrigin = Object.fromEntries(AD_KEYS.map((k) => [k, params.get(k) || '']));
    try { sessionStorage.setItem(STORE, JSON.stringify(adOrigin)); } catch { /* storage blocked */ }
  }
  const leadForm = document.querySelector('#lead form');
  if (leadForm) AD_KEYS.forEach((k) => { if (leadForm.elements[k]) leadForm.elements[k].value = adOrigin[k] || ''; });

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
  // Email, WhatsApp, or both: at least one, and each one valid when filled in. A phone must be in
  // international form (+44 7484 732570, 0044…), the same rule as the CRM's intake, which drops
  // anything else; a local number ("07484 732570") gets "add your country code".
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const phoneDigits = (v) => {
    const t = v.trim();
    if (!/^(\+|00)?[\d\s().\/-]+$/.test(t)) return null; // not a phone number at all
    const d = t.replace(/\D/g, '');
    if (t.startsWith('+')) return d;
    return d.startsWith('00') ? d.slice(2) : '';
  };
  const emailInput = form.querySelector('[data-contact="email"]');
  const whatsappInput = form.querySelector('[data-contact="whatsapp"]');
  const contactError = (input) => {
    const v = input.value.trim();
    if (input === emailInput) {
      if (v) return isEmail(v) ? '' : msg.msgEmail;
      return whatsappInput.value.trim() ? '' : msg.msgContact; // neither given: asked once, on the email
    }
    if (!v) return '';
    const d = phoneDigits(v);
    if (d === null) return msg.msgWhatsapp;
    if (!d) return msg.msgCountry;
    return /^[1-9]\d{7,14}$/.test(d) ? '' : msg.msgWhatsapp;
  };
  const fields = [...form.querySelectorAll('.field')];
  const check = (field) => {
    const input = field.querySelector('input:not([type=hidden]), select, textarea');
    const out = field.querySelector('.field-error');
    let text = '';
    if (input.type === 'checkbox') { if (input.required && !input.checked) text = msg.msgConsent; }
    else if (input.required && !input.value.trim()) text = msg.msgRequired;
    else if (input.dataset.contact) text = contactError(input);
    out.textContent = text;
    field.classList.toggle('is-invalid', Boolean(text));
    input.setAttribute('aria-invalid', String(Boolean(text)));
    return !text;
  };
  // A field is checked when it loses focus, and an error message pushes everything below it down.
  // When that happens because the visitor pressed something else (the privacy box, the button),
  // the message waits until the finger or mouse is lifted; otherwise the press lands on empty space.
  let pressing = false;
  const waiting = new Set();
  // the timeout covers touch: there the field loses focus after the finger is lifted, just before the tap's click
  const checkSoon = (f) => setTimeout(() => { if (pressing) waiting.add(f); else check(f); }, 0);
  dialog.addEventListener('pointerdown', () => { pressing = true; }, true);
  document.addEventListener('pointerup', () => { pressing = false; waiting.forEach(check); waiting.clear(); }, true);
  document.addEventListener('pointercancel', () => { pressing = false; waiting.forEach(check); waiting.clear(); }, true);
  fields.forEach((f) => f.querySelector('input, select, textarea')?.addEventListener('change', () => checkSoon(f)));
  // a WhatsApp number answers "email or WhatsApp", so the email's "give us one" clears with it
  whatsappInput?.addEventListener('change', () => checkSoon(emailInput.closest('.field')));
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
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'lead pop-up' });
      // "Book your call" opens WhatsApp with a message that already carries their name.
      // Without a number in copy.md the button stays hidden rather than linking nowhere.
      const book = success.querySelector('.lead-book');
      if (book) {
        const number = (book.dataset.whatsapp || '').replace(/\D/g, '');
        const name = String(new FormData(form).get('name') || '').trim();
        const text = (book.dataset.whatsappMessage || '').replace('{name}', name);
        book.hidden = !number;
        book.href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      }
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
