/*
 * Lead pop-up. Any [data-lead-open] opens the #lead dialog; data-topic preselects the interest,
 * data-source is written to the hidden "source" field with the page path, so the CRM knows where
 * the lead came from. The floating button shows once the hero is out of view and hides while the
 * closing band or the footer is on screen. It opens on its own only on pages marked data-lead-popup (see below).
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

  /* Pixel steps before the Lead (owner, 2026-10-22: "more events" to optimise a lead campaign on): LoopCheckStarted when a
     button opens the form (not the scroll pop-up, which opens on its own), LeadFormStarted the first time they type in it.
     LoopCheckStarted is the name the Client Loop Check used for its first step; the owner kept it ("put loop check started
     in the talk to us button") because Meta already knows it and a custom conversion can be built on it right away. */
  const pixel = (event, data) => { if (typeof window.fbq === 'function') window.fbq('trackCustom', event, data); };
  let started = false;
  form.addEventListener('input', () => {
    if (started) return;
    started = true;
    pixel('LeadFormStarted', { content_name: source.value.split(' on ')[0] });
  });
  const open = (trigger) => {
    opener = trigger;
    source.value = `${trigger?.dataset.source || 'link'} on ${location.pathname}`;
    const topic = trigger?.dataset.topic;
    if (topic && [...interest.options].some((o) => o.value === topic)) interest.value = topic;
    if (trigger && trigger.dataset.source !== 'scroll pop-up') pixel('LoopCheckStarted', { content_name: trigger.dataset.source || 'link' });
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

  /* The scroll pop-up (owner, 2026-10-19, kept on 2026-10-22 when the Check came off): on a page whose <body> has
     data-lead-popup, this pop-up opens on its own once the visitor has read about half the page, and once more near the
     end if they closed it and some time has passed. Never more than twice a visit, never once they have sent the form,
     never over another open pop-up. */
  const SENT = 'sansara-lead-sent';
  const AUTO = 'sansara-lead-popups';
  if (document.body.hasAttribute('data-lead-popup')) {
    const seen = () => { try { return JSON.parse(sessionStorage.getItem(AUTO) || '{"n":0,"at":0}'); } catch { return { n: 2, at: 0 }; } };
    const sent = () => { try { return !!sessionStorage.getItem(SENT); } catch { return true; } };
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (dialog.open || document.querySelector('dialog[open]') || sent()) return;
        const st = seen();
        if (st.n >= 2) return;
        const depth = (scrollY + innerHeight) / document.documentElement.scrollHeight;
        if ((st.n === 0 && depth > 0.45) || (st.n === 1 && depth > 0.85 && Date.now() - st.at > 45000)) {
          st.n += 1; st.at = Date.now();
          try { sessionStorage.setItem(AUTO, JSON.stringify(st)); } catch { /* storage blocked: opens once */ }
          open({ dataset: { source: 'scroll pop-up' } });
        }
      });
    }, { passive: true });
  }

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
      try { sessionStorage.setItem(SENT, '1'); } catch { /* storage blocked */ }
      // "Book your call" opens the calendar with name and email filled in, and WhatsApp sits underneath for
      // questions (owner, 2026-10-19). Without a calendar link the button opens WhatsApp with a message that already
      // carries their name; without a number either, it stays hidden rather than linking nowhere.
      const book = success.querySelector('.lead-book');
      const alt = success.querySelector('.lead-wa');
      if (book) {
        const data = new FormData(form);
        const number = (book.dataset.whatsapp || '').replace(/\D/g, '');
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const text = (book.dataset.whatsappMessage || '').replace('{name}', name);
        const wa = number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : '';
        const cal = /^https?:\/\//.test(book.dataset.calendar || '') ? new URL(book.dataset.calendar) : null;
        if (cal) {
          cal.searchParams.set('name', name);
          if (email) cal.searchParams.set('email', email);
        }
        book.href = cal ? String(cal) : wa;
        book.hidden = !book.href;
        book.onclick = () => { if (typeof window.fbq === 'function') cal ? window.fbq('trackCustom', 'BookingClick', { content_name: 'lead pop-up' }) : window.fbq('track', 'Contact', { content_name: 'lead pop-up' }); };
        if (alt) {
          alt.hidden = !(cal && wa);
          alt.href = wa;
          alt.onclick = () => { if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: 'lead pop-up' }); };
        }
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
