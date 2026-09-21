/**
 * Mobile menu. The <details data-menu> in Header.astro works without this file;
 * this adds Escape to close (returning focus to the button) and click-away.
 */
const menu = document.querySelector<HTMLDetailsElement>('details[data-menu]');

if (menu) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary')?.focus();
  });

  document.addEventListener('click', (event) => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target)) {
      menu.open = false;
    }
  });
}
