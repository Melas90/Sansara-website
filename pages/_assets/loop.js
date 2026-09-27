/*
 * The Client Loop in the hero of /system/ and /client-loop/.
 * Places each stop (li[data-at], a share of the path from 0 to 1) on the gold line, draws the line
 * once when it comes into view, and moves an ember spark along it; the stop it passes lights up.
 * Without JavaScript the stops are a plain ordered list under the drawing. Under reduced motion the
 * line is drawn and the spark rests at the start.
 */
(() => {
  const html = document.documentElement;
  const moving = () => html.classList.contains('motion');
  const slow = parseFloat(getComputedStyle(html).getPropertyValue('--slow')) || 900;

  document.querySelectorAll('[data-loop]').forEach((root) => {
    const svg = root.querySelector('svg');
    const line = root.querySelector('.loop-line');
    const sparks = root.querySelectorAll('.loop-spark, .loop-spark-glow');
    const stops = [...root.querySelectorAll('[data-at]')];
    const len = line.getTotalLength();
    const vb = svg.viewBox.baseVal;

    // put each stop on the line, label above in the top half and below in the bottom half
    const at = stops.map((stop) => {
      const k = parseFloat(stop.dataset.at) || 0;
      const p = line.getPointAtLength(k * len);
      stop.style.left = `${(p.x / vb.width) * 100}%`;
      stop.style.top = `${(p.y / vb.height) * 100}%`;
      stop.dataset.side = p.y < vb.height / 2 - 1 ? 'top' : 'bottom';
      return k;
    });
    root.classList.add('is-placed');

    let raf = 0, visible = false, start = 0;
    const lap = slow * 12;
    const step = (now) => {
      if (!start) start = now;
      const k = ((now - start) % lap) / lap;
      const q = line.getPointAtLength(k * len);
      sparks.forEach((s) => { s.setAttribute('cx', q.x); s.setAttribute('cy', q.y); });
      stops.forEach((stop, j) => { const d = Math.abs(k - at[j]); stop.classList.toggle('is-near', Math.min(d, 1 - d) < 0.04); });
      if (moving() && visible) raf = requestAnimationFrame(step);
    };
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) root.classList.add('is-drawn');
      cancelAnimationFrame(raf);
      if (visible && moving()) raf = requestAnimationFrame(step);
    }).observe(root);
  });
})();
