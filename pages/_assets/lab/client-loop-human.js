/* Lab: the pen on the "less AI" Client Loop concept. A marker stroke under the italic phrase of each heading and a line
   through each piece of advice, drawn by Rough Notation when they come into view. Nothing moves with reduced motion. */
(() => {
  const ready = () => {
    if (!window.RoughNotation) return;
    const css = getComputedStyle(document.documentElement);
    const orange = css.getPropertyValue('--orange').trim();
    const ink = css.getPropertyValue('--ink').trim();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const time = parseInt(css.getPropertyValue('--slow'), 10) || 0;
    const marks = [];
    document.querySelectorAll('[data-hu-mark] em').forEach((el) => {
      marks.push([el, RoughNotation.annotate(el, { type: 'underline', color: orange, strokeWidth: 4, padding: 2, multiline: true, animate: !still, animationDuration: time })]);
    });
    document.querySelectorAll('[data-hu-strike]').forEach((el) => {
      marks.push([el, RoughNotation.annotate(el, { type: 'strike-through', color: ink, strokeWidth: 3, multiline: true, animate: !still, animationDuration: time })]);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const m = marks.find(([el]) => el === e.target);
        if (m) m[1].show();
        io.unobserve(e.target);
      });
    }, { threshold: 0.8 });
    marks.forEach(([el]) => io.observe(el));
  };
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
})();
