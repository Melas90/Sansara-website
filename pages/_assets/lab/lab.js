/* Design lab controls. Depends on window.sansara from motion.js. Lab only. */
(() => {
  const html = document.documentElement;
  if (new URLSearchParams(location.search).has('frame')) html.classList.add('in-frame');

  /* speed */
  document.querySelectorAll('input[name="speed"]').forEach((r) =>
    r.addEventListener('change', () => {
      html.style.setProperty('--speed', r.value);
      window.sansara?.rotators.forEach((x) => x.schedule());
    }),
  );

  /* reduced motion */
  const reduce = document.querySelector('[data-reduce]');
  reduce?.addEventListener('change', () => {
    if (reduce.checked) html.dataset.motion = 'reduce';
    else delete html.dataset.motion;
  });

  /* replay */
  document.querySelector('[data-replay]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.sansara?.replay();
  });
  document.querySelectorAll('[data-replay-block]').forEach((b) =>
    b.addEventListener('click', () => {
      const block = document.getElementById(b.dataset.replayBlock);
      if (block) window.sansara?.replay(block);
    }),
  );

  /* phone-width preview */
  const mobileBtn = document.querySelector('[data-mobile]');
  const frame = document.querySelector('.lab-frame');
  mobileBtn?.addEventListener('click', () => {
    const on = mobileBtn.getAttribute('aria-pressed') !== 'true';
    mobileBtn.setAttribute('aria-pressed', String(on));
    frame.hidden = !on;
    document.body.classList.toggle('has-frame', on);
  });

  /* tabs (option B) */
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const list = [...tabs.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      list.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.focus();
    };
    list.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const next = e.key === 'ArrowRight' ? list[(i + 1) % list.length] : e.key === 'ArrowLeft' ? list[(i - 1 + list.length) % list.length] : null;
        if (next) { e.preventDefault(); select(next); }
      });
    });
  });

  /* flip cards (option E) */
  document.querySelectorAll('[data-flip]').forEach((card) => {
    const btn = card.querySelector('[data-flip-toggle]');
    const set = (on) => { card.classList.toggle('is-flipped', on); btn.setAttribute('aria-expanded', String(on)); };
    btn?.addEventListener('click', () => set(!card.classList.contains('is-flipped')));
    card.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
    // Keyboard users reach the back by tabbing into it; flip so they can see what they focus.
    card.querySelector('.flip-back')?.addEventListener('focusin', () => set(true));
    card.querySelector('.flip-front')?.addEventListener('focusin', () => set(false));
  });
})();
