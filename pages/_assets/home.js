/*
 * Home and About interactions (from the lab: homes.js plus the offer deck of heroes.js).
 *   1. offer switcher: a list on the left, a detail panel on the right that slides to the chosen offer
 *   2. sliding stacked cards: each step sticks and the ones underneath settle back and dim
 *   3. reading highlight: statement words go from faint to full ink as the section scrolls through
 * Everything works without JavaScript (all panels visible, cards simply stacked) and stops under reduced motion.
 */
(() => {
  const reduce = () => !document.documentElement.classList.contains('motion');

  /* 1. offer switcher */
  document.querySelectorAll('[data-switch]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"]')];
    root.classList.add('is-armed');
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        panels[j].hidden = i !== j;
        panels[j].classList.toggle('is-current', i === j);
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) select(i); });
      t.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
      });
    });
    select(0);
  });

  /* 2. sliding stacked cards */
  const stacks = [...document.querySelectorAll('[data-stack]')];
  const updateStacks = () => {
    for (const stack of stacks) {
      const cards = [...stack.children];
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (reduce() || !next) { card.style.removeProperty('--depth'); return; }
        const a = card.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        // how far the next card has slid over this one, 0 to 1
        const overlap = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
        card.style.setProperty('--depth', overlap.toFixed(3));
      });
    }
  };

  /* 3. reading highlight */
  const readers = [...document.querySelectorAll('[data-read]')];
  readers.forEach((el) => {
    // wrap each word, keeping inline elements (the italic word) intact
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const s = document.createElement('span');
            s.className = 'rw';
            s.textContent = part;
            frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(el);
  });
  const updateReaders = () => {
    for (const el of readers) {
      const words = el.querySelectorAll('.rw');
      if (reduce()) { words.forEach((w) => w.classList.add('is-read')); continue; }
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-read', i < lit));
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateStacks(); updateReaders(); ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
  /* 4. offer deck: click a card to bring it to the front */
  document.querySelectorAll('[data-deck]').forEach((deck) => {
    const cards = [...deck.querySelectorAll('.deck-card')];
    let order = cards.map((_, i) => i);
    const place = () => order.forEach((c, p) => cards[c].style.setProperty('--p', p));
    cards.forEach((card, i) => card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      order = [i, ...order.filter((c) => c !== i)];
      place();
    }));
  });
})();
