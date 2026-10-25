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
  const interestField = form.querySelector('[data-interest-field]');
  let opener = null;

  /* Form steps to Contentsquare (Hotjar), on a page whose <body> has data-hotjar-steps (owner, 2026-10-25: the Client
     Loop landing only): each step is a page event, so Session Replay can show just the visits that opened the form and
     where they stopped. Nothing typed is sent; names of the fields that blocked sending are. Nothing goes to Meta. */
  const hj = (name) => {
    if (!document.body.hasAttribute('data-hotjar-steps')) return;
    (window._uxa = window._uxa || []).push(['trackPageEvent', name]);
  };
  let sentNow = false;

  /* Less friction after "Talk to us" (owner, 2026-10-24): the button repeats the page's promise where the page sets
     data-lead-submit; the note about their case opens from a link; the WhatsApp country code is pre-chosen. */
  const submitLabel = form.querySelector('[type=submit] .btn-label');
  if (document.body.dataset.leadSubmit) submitLabel.textContent = document.body.dataset.leadSubmit;
  const noteToggle = form.querySelector('.lead-note-toggle');
  noteToggle?.addEventListener('click', () => {
    const field = document.getElementById(noteToggle.getAttribute('aria-controls'));
    field.hidden = false;
    noteToggle.closest('.lead-note').hidden = true;
    field.querySelector('textarea')?.focus();
  });
  /* Two steps (owner, 2026-10-25: "what can we do so more people complete the form"): only the name shows first, with
     "Next"; the rest appears under it once the name is in. The interest question stays hidden where the offer is known,
     the note stays folded until its link is pressed. Without JavaScript none of this runs and every field shows. */
  let knownTopic = false;
  let step = 1;
  const stepTwo = [...form.querySelectorAll('[data-step="2"]')];
  const nextRow = form.querySelector('[data-step-only="1"]');
  const nameField = form.querySelector('[data-step="1"]');
  const showStep = (n) => {
    step = n;
    nextRow.hidden = n !== 1;
    stepTwo.forEach((el) => {
      if (n === 1) { el.hidden = true; return; }
      if (el === interestField) el.hidden = knownTopic;
      else if (el.id === 'l-message-field') el.hidden = !noteToggle?.closest('.lead-note').hidden;
      else el.hidden = false;
    });
  };
  const goNext = () => {
    if (!check(nameField)) { nameField.querySelector('input')?.focus(); return; }
    showStep(2);
    hj('Form: step 2 (name in)');
    form.querySelector('#l-email')?.focus();
  };
  form.querySelector('.lead-next')?.addEventListener('click', goNext);
  showStep(1);
  // "Prefer WhatsApp?": straight to WhatsApp, reported to the Pixel like the other WhatsApp links
  form.querySelector('.lead-wa-direct a')?.addEventListener('click', () => { hj('Form: WhatsApp instead'); if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: 'lead pop-up direct' }); });

  const ccSelect = form.querySelector('.wa-cc');
  if (ccSelect) {
    // the browser's language guesses the country: en-GB +44, de +49, es +34…; else the page's language
    const BY_REGION = { ES: '+34', GB: '+44', UK: '+44', IE: '+353', DE: '+49', AT: '+43', CH: '+41', NL: '+31', BE: '+32', FR: '+33', IT: '+39', PT: '+351', SE: '+46', DK: '+45', NO: '+47', US: '+1' };
    const BY_LANG = { es: '+34', de: '+49', nl: '+31', fr: '+33', it: '+39', pt: '+351', sv: '+46', da: '+45', nb: '+47', no: '+47', en: '+44' };
    const guess = (navigator.languages || [navigator.language || '']).map((l) => {
      const [lang, region] = String(l).split('-');
      return BY_REGION[(region || '').toUpperCase()] || BY_LANG[(lang || '').toLowerCase()];
    }).find(Boolean) || (document.documentElement.lang === 'es' ? '+34' : '+44');
    if ([...ccSelect.options].some((o) => o.value === guess)) ccSelect.value = guess;
  }

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
    hj('Form: started typing');
  });
  const open = (trigger) => {
    opener = trigger;
    source.value = `${trigger?.dataset.source || 'link'} on ${location.pathname}`;
    // The offer is known from the button or the page (owner, 2026-10-24: one field less): set it and hide the question.
    const topic = trigger?.dataset.topic || document.body.dataset.leadTopic;
    const known = Boolean(topic && [...interest.options].some((o) => o.value === topic));
    if (known) interest.value = topic;
    knownTopic = known;
    showStep(step); // a reopened form keeps the step it was at
    if (trigger && trigger.dataset.source !== 'scroll pop-up') pixel('LoopCheckStarted', { content_name: trigger.dataset.source || 'link' });
    hj(trigger?.dataset.source === 'scroll pop-up' ? 'Form: opened by scroll pop-up' : 'Form: opened by a button');
    dialog.showModal();
    document.documentElement.classList.add('lead-open');
    form.querySelector('input:not([type=hidden])')?.focus();
  };
  const close = () => dialog.close();
  dialog.addEventListener('close', () => {
    if (!sentNow) hj(started ? 'Form: closed after typing, not sent' : 'Form: closed without typing');
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
  // Email, WhatsApp, or both: at least one, and each one valid when filled in. The CRM's intake needs the
  // international form (+44 7484 732570); a local number ("07484 732570", "612 345 678") takes the country code
  // chosen beside it, without its leading 0. With no code to take, it gets "add your country code".
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const phoneDigits = (v) => {
    const t = v.trim();
    if (!/^(\+|00)?[\d\s().\/-]+$/.test(t)) return null; // not a phone number at all
    const d = t.replace(/\D/g, '');
    if (t.startsWith('+')) return d;
    if (d.startsWith('00')) return d.slice(2);
    return ccSelect ? ccSelect.value.replace(/\D/g, '') + d.replace(/^0/, '') : '';
  };
  const emailInput = form.querySelector('[data-contact="email"]');
  const whatsappInput = form.querySelector('[data-contact="whatsapp"]');
  const contactError = (input) => {
    const v = input.value.trim();
    if (input === emailInput) {
      // the email is required (owner, 2026-10-25: "I would put mail mandatory"); WhatsApp is optional
      if (v) return isEmail(v) ? '' : msg.msgEmail;
      return msg.msgContact;
    }
    if (!v) return '';
    const d = phoneDigits(v);
    if (d === null) return msg.msgWhatsapp;
    if (!d) return msg.msgCountry;
    return /^[1-9]\d{7,14}$/.test(d) ? '' : msg.msgWhatsapp;
  };
  const fields = [...form.querySelectorAll('.field')];
  const check = (field) => {
    const input = field.querySelector('[data-contact]') || field.querySelector('input:not([type=hidden]), select, textarea');
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
  whatsappInput?.addEventListener('change', () => { checkSoon(whatsappInput.closest('.field')); checkSoon(emailInput.closest('.field')); });
  ccSelect?.addEventListener('change', () => { if (whatsappInput.value.trim()) checkSoon(whatsappInput.closest('.field')); });
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', async (e) => {
    // Enter in the name field on step 1 means "Next", not "send"
    if (step === 1) { e.preventDefault(); goNext(); return; }
    const ok = fields.map(check).every(Boolean);
    if (!ok) {
      e.preventDefault();
      hj(`Form: blocked by ${[...form.querySelectorAll('.is-invalid [name]')].map((el) => el.name).join(', ') || 'a field'}`);
      form.querySelector('.is-invalid input, .is-invalid select, .is-invalid textarea')?.focus();
      return;
    }
    if (!window.fetch) return; // plain POST, then Netlify's redirect to the thanks page
    e.preventDefault();
    // the number goes out in international form, the way the CRM stores it
    if (whatsappInput?.value.trim()) whatsappInput.value = `+${phoneDigits(whatsappInput.value)}`;
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
      sentNow = true;
      hj('Form: sent');
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
        book.onclick = () => { hj(cal ? 'Form: opened the calendar' : 'Form: WhatsApp after sending'); if (typeof window.fbq === 'function') cal ? window.fbq('trackCustom', 'BookingClick', { content_name: 'lead pop-up' }) : window.fbq('track', 'Contact', { content_name: 'lead pop-up' }); };
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
