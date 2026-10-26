/* The pen on the System pages (owner, 2026-10-26: "less AI, more like them"). Rough Notation (assets/vendor/), when each
   piece comes into view: an orange underline under the italic phrase of every heading and under each stage's ending
   ([data-hand-mark]), and an ink line through the advice and the pains ([data-hand-strike]). Under reduced motion the
   marks appear at once; without the library the page reads the same, unmarked. */
(() => {
  const go = () => {
    if (!window.RoughNotation) return;
    const css = getComputedStyle(document.documentElement);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = { animate: !still, animationDuration: parseFloat(css.getPropertyValue('--slow')) || 0, multiline: true };
    const marks = new Map();
    const add = (el, opts) => marks.set(el, window.RoughNotation.annotate(el, { ...base, ...opts }));
    document.querySelectorAll('.sy h1 em, .sy main h2 em, .sy-get-title em, [data-hand-mark]').forEach((el) =>
      add(el, { type: 'underline', color: css.getPropertyValue('--orange').trim(), strokeWidth: 4, padding: 2 }));
    document.querySelectorAll('[data-hand-strike]').forEach((el) =>
      add(el, { type: 'strike-through', color: css.getPropertyValue('--orange-dk').trim(), strokeWidth: 2 }));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      // the headings rise into place first (motion.css) and the fonts must be in, or the pen draws where the words were
      const wait = still ? 0 : (parseFloat(css.getPropertyValue('--slow')) || 0) + (parseFloat(css.getPropertyValue('--base')) || 0);
      document.fonts.ready.then(() => setTimeout(() => { e.target.closest('h1, h2')?.classList.add('is-marked'); marks.get(e.target)?.show(); }, wait));
      io.unobserve(e.target);
    }), { threshold: 0.9 });
    marks.forEach((_, el) => io.observe(el));
  };
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
