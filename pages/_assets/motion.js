/*
 * Motion and interaction, vanilla JS. Sections:
 *   1. motion gate (reduced motion, lab toggle)
 *   2. reveal, stagger, mask
 *   3. rotating line
 *   4. header menu
 *   5. contact panel and form
 * Durations are read from the tokens, never written here.
 */
(() => {
  const html = document.documentElement;
  html.classList.add('js');
  const token = (name) => parseFloat(getComputedStyle(html).getPropertyValue(name)) || 0;
  const speed = () => parseFloat(getComputedStyle(html).getPropertyValue('--speed')) || 1;

  /* 1. motion gate */
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !mq.matches && html.dataset.motion !== 'reduce';
  const applyGate = () => html.classList.toggle('motion', motionAllowed());
  applyGate();
  mq.addEventListener('change', applyGate);
  new MutationObserver(applyGate).observe(html, { attributes: true, attributeFilter: ['data-motion'] });

  /* 2. reveal, stagger, mask */
  const showAll = (root = document) => root.querySelectorAll('.reveal, .mask, .mask-img').forEach((el) => el.classList.add('is-in'));
  window.addEventListener('beforeprint', () => showAll());
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  const stagger = (root = document) =>
    root.querySelectorAll('.stagger').forEach((p) => [...p.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const arm = (root = document) => {
    stagger(root);
    if (!('IntersectionObserver' in window)) return showAll(root);
    root.querySelectorAll('.reveal, .mask, .mask-img').forEach((el) => {
      // A masked element inside a revealing parent rides on the parent's .is-in. Nested .reveal
      // elements are observed on their own, so a card inside a revealing section still staggers.
      if (!el.classList.contains('reveal') && el.parentElement?.closest('.reveal')) return;
      io.observe(el);
    });
  };
  const replay = (root = document) => {
    root.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'));
    void root.offsetWidth; // let the browser see the reset before observing again
    arm(root);
    rotators.forEach((r) => r.restart());
  };
  arm();

  /* 3. rotating line */
  const rotators = [];
  class Rotator {
    constructor(el) {
      this.el = el;
      this.items = [...el.children];
      this.i = 0;
      this.timer = 0;
      this.items.forEach((s, i) => s.classList.toggle('is-current', i === 0));
      this.schedule();
      document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.schedule()));
    }
    schedule() {
      this.stop();
      if (!motionAllowed() || this.items.length < 2) return;
      this.timer = setTimeout(() => this.next(), token('--rotate-every') / speed());
    }
    stop() { clearTimeout(this.timer); }
    next() {
      const from = this.items[this.i];
      this.i = (this.i + 1) % this.items.length;
      const to = this.items[this.i];
      from.classList.remove('is-current');
      from.classList.add('is-out');
      to.classList.remove('is-out');
      to.classList.add('is-current');
      setTimeout(() => from.classList.remove('is-out'), token('--base') / speed());
      this.schedule();
    }
    restart() {
      this.stop();
      this.items.forEach((s) => s.classList.remove('is-current', 'is-out'));
      this.i = 0;
      this.items[0].classList.add('is-current');
      this.schedule();
    }
  }
  document.querySelectorAll('.rotator').forEach((el) => rotators.push(new Rotator(el)));
  mq.addEventListener('change', () => rotators.forEach((r) => r.schedule()));
  new MutationObserver(() => rotators.forEach((r) => r.schedule())).observe(html, { attributes: true, attributeFilter: ['data-motion'] });

  /* 4. header menu */
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      navList.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-nav') && !e.target.closest('.menu-toggle')) setOpen(false);
    });
    const here = location.pathname.replace(/index\.html$/, '');
    navList.querySelectorAll('a').forEach((a) => {
      const path = new URL(a.href).pathname;
      if (path !== '/' && here.startsWith(path)) a.setAttribute('aria-current', 'page');
    });
  }

  /* 5. contact panel and form */
  const contact = document.getElementById('contact');
  if (contact) {
    const panel = contact.querySelector('.contact-panel');
    const openBtn = contact.querySelector('[data-contact-open]');
    const closeBtn = contact.querySelector('[data-contact-close]');
    const form = contact.querySelector('form');
    const openPanel = (focus = true) => {
      if (!panel || !panel.hidden) return;
      panel.hidden = false;
      panel.classList.add('is-opening');
      openBtn?.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        panel.classList.remove('is-opening');
        panel.classList.add('is-open');
      }));
      if (focus) form?.querySelector('input:not([type=hidden])')?.focus({ preventScroll: true });
    };
    const closePanel = () => {
      panel.hidden = true;
      panel.classList.remove('is-open');
      openBtn?.setAttribute('aria-expanded', 'false');
      openBtn?.focus();
    };
    if (panel && openBtn) {
      panel.hidden = true; // hidden only once JS is here; without JS the form is simply visible
      openBtn.addEventListener('click', () => openPanel());
      closeBtn?.addEventListener('click', closePanel);
      contact.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && closePanel());
      // The footer "Contact" link and any /#contact link open the form.
      const maybeOpen = () => { if (location.hash === '#contact') openPanel(false); };
      maybeOpen();
      window.addEventListener('hashchange', maybeOpen);
      document.querySelectorAll('a[href$="#contact"]').forEach((a) => a.addEventListener('click', () => setTimeout(() => openPanel(false), 0)));
    }

    if (form) {
      const msg = form.dataset;
      const fields = [...form.querySelectorAll('.field')];
      const validate = (field) => {
        const input = field.querySelector('input, select, textarea');
        const out = field.querySelector('.field-error');
        if (!input || !out) return true;
        let text = '';
        if (input.type === 'checkbox') { if (input.required && !input.checked) text = msg.msgConsent; }
        else if (input.required && !input.value.trim()) text = msg.msgRequired;
        else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) text = msg.msgEmail;
        field.classList.toggle('is-invalid', Boolean(text));
        input.setAttribute('aria-invalid', text ? 'true' : 'false');
        out.textContent = text;
        return !text;
      };
      fields.forEach((f) => {
        const input = f.querySelector('input, select, textarea');
        input?.addEventListener('blur', () => validate(f));
        input?.addEventListener('input', () => f.classList.contains('is-invalid') && validate(f));
      });
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', async (e) => {
        const ok = fields.map(validate).every(Boolean);
        if (!ok) {
          e.preventDefault();
          fields.find((f) => f.classList.contains('is-invalid'))?.querySelector('input, select, textarea')?.focus();
          return;
        }
        if (!window.fetch) return; // plain POST to Netlify, then the redirect to /contact/thanks/
        e.preventDefault();
        const button = form.querySelector('[type=submit]');
        const labelEl = button.querySelector('.btn-label');
        const label = labelEl.textContent;
        button.disabled = true;
        labelEl.textContent = msg.msgSending;
        contact.querySelector('.form-error').hidden = true;
        try {
          const res = await fetch(form.getAttribute('action') || '/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)),
          });
          if (!res.ok) throw new Error(String(res.status));
          form.hidden = true;
          const success = contact.querySelector('.form-success');
          success.hidden = false;
          success.querySelector('h3')?.focus();
        } catch {
          contact.querySelector('.form-error').hidden = false;
          button.disabled = false;
          labelEl.textContent = label;
        }
      });
    }
  }

  window.sansara = { arm, replay, rotators, motionAllowed };
})();
