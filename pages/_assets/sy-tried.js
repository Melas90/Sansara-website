/* "What have you already tried?" on the System pages (owner, 2026-11-02): the reader ticks what they have tried. A tap
   toggles aria-pressed, which draws the tick (system.css). Nothing is stored or sent; without the script the cards are
   plain buttons that do nothing. */
(() => {
  document.querySelectorAll('.sy-tried-card').forEach((card) =>
    card.addEventListener('click', () =>
      card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'))));
})();
