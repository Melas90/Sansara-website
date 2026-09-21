/**
 * Reveal on scroll, for sequences only (steps, figures). Same contract as the
 * system diagram: content is complete in the HTML; this script hides a block
 * ("armed") only when motion is welcome and the block is below the fold, then
 * lets CSS bring its items in one after another ("live").
 *
 * Markup:  <ol data-reveal> <li data-reveal-item style="--i:0"> ...
 * Figures: <dd data-count>38%</dd> counts up from zero when revealed.
 */
const blocks = document.querySelectorAll<HTMLElement>('[data-reveal]');
const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(el: HTMLElement) {
  const text = el.textContent ?? '';
  const match = text.match(/\d+(?:[.,]\d+)?/);
  if (!match || match.index === undefined) return;
  const raw = match[0];
  const decimals = raw.split(/[.,]/)[1]?.length ?? 0;
  const separator = raw.includes(',') ? ',' : '.';
  const target = parseFloat(raw.replace(',', '.'));
  const [before, after] = [text.slice(0, match.index), text.slice(match.index + raw.length)];
  const duration = 1400;
  const start = performance.now();

  const frame = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = (target * eased).toFixed(decimals).replace('.', separator);
    el.textContent = `${before}${progress === 1 ? raw : value}${after}`;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

if (motionOk && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const block = entry.target as HTMLElement;
        block.dataset.live = '';
        delete block.dataset.armed;
        block.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
        observer.unobserve(block);
      }
    },
    { threshold: 0.2 },
  );

  blocks.forEach((block) => {
    if (block.getBoundingClientRect().top < window.innerHeight) return;
    block.dataset.armed = '';
    observer.observe(block);
  });
}

export {};
