/*
 * Lab, 2026-10-16: the Content page's keynote (pages/_lab/content-keynote.html). Plays once when it comes into view:
 * each job (Attract, Trust, Sell) with its icon, line and node, then the ground turns dark and the closing line lands.
 * All timings come from the motion tokens (--base, --slow). With reduced motion it shows the last frame.
 */
(() => {
  const root = document.querySelector('[data-ck]');
  if (!root) return;
  const token = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const base = token('--base');
  const slow = token('--slow');
  const hold = slow * 2; // how long each job stays on screen
  const wait = (ms) => new Promise((done) => window.setTimeout(done, ms));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const words = [...root.querySelectorAll('[data-word]')];
  const lines = [...root.querySelectorAll('[data-line]')];
  const icons = [...root.querySelectorAll('[data-icon]')];
  const nodes = [...root.querySelectorAll('[data-node]')];
  let run = 0;

  const show = (i) => {
    [words, lines, icons].forEach((set) => set.forEach((el, j) => {
      el.classList.toggle('is-in', j === i);
      el.classList.toggle('is-out', j !== i && el.classList.contains('is-in'));
    }));
    nodes.forEach((n, j) => { n.classList.toggle('is-lit', j <= i); n.classList.toggle('is-now', j === i); });
    root.style.setProperty('--ck-fill', String(Math.min(i, nodes.length - 1) / (nodes.length - 1)));
  };

  const reset = () => {
    root.classList.remove('is-on', 'is-final', 'is-done');
    [words, lines, icons].forEach((set) => set.forEach((el) => el.classList.remove('is-in', 'is-out')));
    nodes.forEach((n) => n.classList.remove('is-lit', 'is-now'));
    root.style.setProperty('--ck-fill', '0');
  };

  const finish = () => {
    show(words.length - 1);
    root.style.setProperty('--ck-fill', '1');
    root.classList.add('is-on', 'is-final', 'is-done');
  };

  const play = async () => {
    const id = ++run;
    reset();
    if (reduce) return finish();
    await wait(base);
    root.classList.add('is-on');
    for (let i = 0; i < nodes.length; i++) {
      if (id !== run) return;
      show(i);
      await wait(hold);
    }
    if (id !== run) return;
    root.classList.add('is-final');
    show(words.length - 1);
    root.style.setProperty('--ck-fill', '1');
    await wait(slow * 2);
    if (id === run) root.classList.add('is-done');
  };

  new IntersectionObserver((entries, observer) => {
    if (entries.some((e) => e.isIntersecting)) { observer.disconnect(); play(); }
  }, { threshold: 0.5 }).observe(root);
  root.querySelector('[data-ck-replay]').addEventListener('click', play);
})();
