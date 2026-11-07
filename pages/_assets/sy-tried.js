/* "What have you already tried?" on the System pages (owner, 2026-11-02): the reader ticks what they have tried. A tap
   toggles aria-pressed, which draws the tick (system.css). Nothing is stored or sent; without the script the cards are
   plain buttons that do nothing.
   A card may have a one-line reply after it (2026-11-05): hidden until its card is ticked. Without the script every
   reply is simply visible. */
(() => {
  document.querySelectorAll('.sy-tried-card').forEach((card) => {
    const reply = card.nextElementSibling?.matches('.sy-tried-reply') ? card.nextElementSibling : null;
    if (reply) reply.hidden = true;
    card.addEventListener('click', () => {
      const on = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', String(on));
      if (reply) reply.hidden = !on;
    });
  });
})();
