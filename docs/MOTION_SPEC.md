# Motion spec

One table per page section: effect, trigger, timing (tokens), mobile, reduced motion, production route, status. Tokens: `--fast` 200ms · `--base` 550ms · `--slow` 900ms · `--ease` cubic-bezier(.22,1,.36,1) · `--rise` 40px (20px ≤ 980px) · `--stagger` 110ms (70ms ≤ 980px) · `--rotate-every` 2800ms.

Rules that apply everywhere (brief §6.1): only `transform` and `opacity` animate; every entrance plays once per page view; nothing hidden longer than a moment; no scroll-jacking; everything off under `prefers-reduced-motion` and without JavaScript (the page is complete in the HTML, `motion.js` only adds the `motion` class that arms the CSS).

## Baseline, decided (brief §6.1), built in Step 3

| Where | Effect | Trigger | Timing | Mobile | Reduced motion | Route | Status |
|---|---|---|---|---|---|---|---|
| Every section | Rise 40px + fade (`.reveal`) | Scroll, 8% visible | `--slow` transform, `--base` opacity | Rise 20px | Off, visible | Custom CSS + JS (IntersectionObserver) | Decided |
| Children of a section (`.stagger`) | Same, one after another | With the section | + `--stagger` × index | 70ms | Off | Same | Decided |
| Hero headline, every H2 (`.mask`) | Rise through a mask, text slides up from behind its own bottom edge | Scroll or load | `--slow` | Same | Off | Custom CSS + JS | Decided |
| Images (`.mask-img`) | Rise 12% + settle from 1.04 scale inside the frame | Scroll | `--slow` / `--base` | Same | Off | Custom CSS + JS | Decided |
| Hero rotating line (`.rotator`) | Current phrase exits upward, next rises from below | Timer every `--rotate-every` | `--base` transform, `--fast` opacity | Same | Stops on the first phrase | Custom CSS + JS (Elementor: Animated Headline) | Decided |
| Primary button, Explore links | Arrow slides 3px right | Hover | `--fast` | No hover | Off | Custom CSS | Decided |
| Buttons, fields, nav links | Colour change | Hover, focus | `--fast` | Tap | Off | Custom CSS | Decided |
| Contact band | Form panel rises in from below inside the band | Click "Let's talk", or arriving at `/#contact` | `--slow` transform, `--base` opacity | Same | Panel appears without movement | Custom CSS + JS (Elementor: Form widget + snippet) | Decided (brief §2.4) |
| Contact form success | Checkmark draws itself | After a successful send | `--slow` circle, then `--base` tick | Same | Drawn already | Custom CSS (SVG stroke) | Decided (brief §2.4) |

## Open (design interview, Rounds 2 to 7)

Filled in as the owner answers. Rejected options are kept with the reason so they do not come back.

| Round | Topic | Options shown | Decision | Reason |
|---|---|---|---|---|
| 2 | Flip cards | 3D flip (lab R1.1 E) · back slides up · lift only | | |
| 2 | Card hover | lift + shadow · tilt · glow · image zoom | | |
| 2 | Stacking cards | yes · no | | |
| 2 | Expanding cards | yes · no | | |
| 3 | Moving patterns | gradient mesh · flowing lines · grain · reactive dots · none | | |
| 3 | Section transitions | colour fade · organic edges · straight | | |
| 4 | Dynamic fonts | weight grows on scroll · shifts on hover · serif morphs · none | | |
| 4 | Statement reveal | line-by-line mask · word-by-word fade · reading highlight | | |
| 4 | Big type moments | marquee · counters (real numbers only) · none | | |
| 5 | Scroll-drawn lines | yes · no | | |
| 5 | System flow diagram | signal travels · boxes light up · chat bubbles type · combined | | |
| 5 | Parallax | desktop only · none | | |
| 5 | Pinned sections | yes · no (fragile on mobile) | | |
| 6 | Buttons | arrow (baseline) · magnetic · fill sweep | | |
| 6 | Cursor | normal · dot · "View" label | | |
| 6 | Nav | underline grows · sliding highlight · header hides on scroll | | |
| 6 | Page transitions | soft fade · curtain · none | | |
| 6 | Loading | none · logo reveal on first visit | | |
| 7 | Mobile dosage | per effect | | |
