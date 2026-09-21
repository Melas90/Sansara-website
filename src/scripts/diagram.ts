/**
 * System diagram: the one orchestrated animation on the site.
 *
 * The diagram is fully drawn in the HTML. This script hides it ("armed") only
 * if the visitor accepts motion and the block is still below the fold, then
 * lets CSS draw it once when it scrolls into view ("live").
 */
const diagrams = document.querySelectorAll<HTMLElement>('[data-diagram]');
const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (motionOk && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const diagram = entry.target as HTMLElement;
        diagram.dataset.live = '';
        delete diagram.dataset.armed;
        observer.unobserve(diagram);
      }
    },
    { threshold: 0.25 },
  );

  diagrams.forEach((diagram) => {
    // Already on screen at load: leave it drawn rather than flash it away.
    if (diagram.getBoundingClientRect().top < window.innerHeight) return;
    diagram.dataset.armed = '';
    observer.observe(diagram);
  });
}

export {};
