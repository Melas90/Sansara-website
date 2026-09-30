/*
 * Lab: the four hero options that replace the orb.
 *   1. kinetic type: the italic half of the headline turns through the promises, letter by letter
 *   2. dot field: a grid of gold dots breathing in a slow wave, parted by the cursor, springing back
 *   3. the loop: the gold line draws itself, an ember spark travels it, the nearest offer lights up
 *   4. offer deck: a click brings a card to the front
 * Timings come from the motion tokens. Under reduced motion everything rests: first word, still dots, drawn line.
 */
(() => {
  const html = document.documentElement;
  const moving = () => html.classList.contains('motion');
  const css = getComputedStyle(html);
  const token = (name) => css.getPropertyValue(name).trim();
  const slow = parseFloat(token('--slow')) || 900;
  const inView = (el, cb) => new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting))).observe(el);

  /* 1. kinetic type */
  document.querySelectorAll('[data-kt]').forEach((kt) => {
    const words = [...kt.querySelectorAll('.kt-word')];
    words.forEach((w) => {
      const text = w.textContent;
      w.setAttribute('aria-hidden', 'true');
      w.textContent = '';
      // letters animate one by one, but stay grouped per word so a word never breaks across lines
      let c = 0;
      text.split(' ').forEach((word, n) => {
        if (n) w.appendChild(document.createTextNode(' '));
        const box = document.createElement('span');
        box.className = 'kt-w';
        [...word].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'kt-ch';
          s.style.setProperty('--c', c++);
          s.textContent = ch;
          box.appendChild(s);
        });
        w.appendChild(box);
      });
    });
    // screen readers get the whole sentence once
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = words.map((w) => w.textContent).join(' ');
    kt.appendChild(sr);
    let i = 0, timer = 0, visible = false;
    const turn = () => {
      if (!moving() || !visible) return;
      const prev = words[i];
      i = (i + 1) % words.length;
      prev.classList.remove('is-on');
      prev.classList.add('is-out');
      words[i].classList.remove('is-out');
      words[i].classList.add('is-on');
      kt.classList.remove('is-turning');
      void kt.offsetWidth;
      kt.classList.add('is-turning');
      setTimeout(() => prev.classList.remove('is-out'), slow);
    };
    inView(kt, (v) => {
      visible = v;
      clearInterval(timer);
      if (v) timer = setInterval(turn, slow * 3.2);
    });
  });

  /* 2. dot field */
  document.querySelectorAll('[data-field]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    const gold = token('--gold'), ember = token('--orange');
    let dots = [], w = 0, h = 0, dpr = 1, raf = 0, visible = false, t0 = performance.now();
    const pointer = { x: -9999, y: -9999, on: false };
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = Math.max(18, Math.round(w / 22));
      dots = [];
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2;
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) {
        const d = Math.hypot(x - cx, y - cy) / R;
        if (d > 1) continue; // a round field, not a rectangle
        dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, d });
      }
      draw(performance.now());
    };
    const draw = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const reach = Math.min(w, h) * 0.22;
      for (const p of dots) {
        if (moving()) {
          // spring home, pushed by the pointer
          let fx = (p.hx - p.x) * 0.06, fy = (p.hy - p.y) * 0.06;
          if (pointer.on) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy);
            if (dist < reach && dist > 0.1) { const f = (1 - dist / reach) * 3.2; fx += (dx / dist) * f; fy += (dy / dist) * f; }
          }
          p.vx = (p.vx + fx) * 0.82; p.vy = (p.vy + fy) * 0.82;
          p.x += p.vx; p.y += p.vy;
        }
        // slow breathing wave from the centre outwards
        const wave = moving() ? Math.sin(t * 1.1 - p.d * 7) : 0;
        const r = 1.4 + (1 - p.d) * 2.4 + wave * 0.9;
        const disp = Math.min(1, Math.hypot(p.x - p.hx, p.y - p.hy) / 14);
        ctx.globalAlpha = Math.max(0.2, (1 - p.d * 0.7) * (0.8 + wave * 0.2) + disp * 0.4);
        ctx.fillStyle = disp > 0.35 ? ember : gold;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.6, r + disp * 1.4), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (moving() && visible) raf = requestAnimationFrame(draw);
    };
    const move = (e) => { const b = canvas.getBoundingClientRect(); pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top; pointer.on = true; };
    canvas.parentElement.addEventListener('pointermove', move);
    canvas.parentElement.addEventListener('pointerdown', move);
    canvas.parentElement.addEventListener('pointerleave', () => { pointer.on = false; });
    new ResizeObserver(build).observe(canvas);
    inView(canvas, (v) => { visible = v; cancelAnimationFrame(raf); if (v && moving()) raf = requestAnimationFrame(draw); });
  });

  /* 3. the loop */
  document.querySelectorAll('[data-loop]').forEach((root) => {
    const line = root.querySelector('.loop-line');
    const sparks = root.querySelectorAll('.loop-spark, .loop-spark-glow');
    const pins = [...root.querySelectorAll('.loop-pin')];
    const len = line.getTotalLength();
    const vb = root.querySelector('svg').viewBox.baseVal;
    // where each pin sits, as a share of the path, found once by nearest point
    const pinAt = pins.map((pin) => {
      const px = parseFloat(pin.style.left || getComputedStyle(pin).left) / root.clientWidth * vb.width;
      const py = parseFloat(pin.style.top || getComputedStyle(pin).top) / root.clientHeight * vb.height;
      let best = 0, bd = Infinity;
      for (let s = 0; s <= 200; s++) { const q = line.getPointAtLength((s / 200) * len); const d = Math.hypot(q.x - px, q.y - py); if (d < bd) { bd = d; best = s / 200; } }
      return best;
    });
    let raf = 0, visible = false, start = 0;
    const lap = slow * 11;
    const step = (now) => {
      if (!start) start = now;
      const k = ((now - start) % lap) / lap;
      const q = line.getPointAtLength(k * len);
      sparks.forEach((s) => { s.setAttribute('cx', q.x); s.setAttribute('cy', q.y); });
      pins.forEach((pin, j) => { const d = Math.abs(k - pinAt[j]); pin.classList.toggle('is-near', Math.min(d, 1 - d) < 0.03); });
      if (moving() && visible) raf = requestAnimationFrame(step);
    };
    inView(root, (v) => {
      visible = v;
      if (v) root.classList.add('is-drawn');
      cancelAnimationFrame(raf);
      if (v && moving()) raf = requestAnimationFrame(step);
    });
  });

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
