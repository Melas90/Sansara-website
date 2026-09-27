# Design system

The tokens in `tokens.css` are the brief (§3, §6.1) turned into CSS variables. This file explains the few places where a value had to be derived, and how the tokens are meant to be used. Chosen design decisions per section live in `docs/DESIGN_SPEC.md`.

## Derived values, not in the brief (open to change in one place)

| Token | Value | Why |
|---|---|---|
| `--text-h3` | `clamp(22px, 2.4vw, 28px)` | The brief sets H1, H2, lead, body and label only. Card titles and sub-headings need a size between lead and H2. |
| `--text-small` | `14px` | Captions, form labels, "who it's for" lines. |
| `--radius-field` | `12px` | Inputs sit between "pill" and "card"; a full pill on a textarea looks wrong. |
| `--on-dark`, `--on-dark-muted`, `--line-on-dark` | cream at 100%, 72%, 18% | Text and hairlines on the dark bands and the footer. |
| `--leading-*`, `--tracking-heading` | 1.05 / 1.15 / 1.6, −0.02em | Headline leading tighter than body; the brief gives 1.6 for body only. |
| `--gap`, `--target` | 24px, 44px | Grid gap and the minimum tap target from hard rule 9. |
| `--rotate-every` | 2800ms | "Every ~2.8s" from §6.1 as a token so the lab can scale it. |

## Contrast notes

- `--brown-2` `#8C6A47` on `--card` `#F7F2E8` is about 4.2:1 and on `--bg` about 4.5:1. Below the 4.5:1 floor for body-size text on the card surface. Decided in Round 1 (2026-09-27): `--brown-2` is for the 12px bold uppercase labels and hints only; any sentence under 18px uses `--brown-2-text` `#7A5B3B` (the `.muted` class).
- `--orange` `#EE8B5E` is never text on light backgrounds (2.3:1). Accent text uses `--orange-dk` `#B65A2E` (4.7:1 on cream, large text and bold small text only; body sentences stay `--brown`).
- Cream on `--ink` is 14:1; `--on-dark-muted` about 9:1.

## How to use the tokens

- Surfaces: page `--bg`; alternate sections `--card`; a card that should feel warm `--peach`; forms and quotes `--white`; dark bands `--grad-dark` or `--ink`; the contact band `--grad-warm`.
- Type: headlines Hanken 700 in `--ink`; the emotional word inside a headline is `*word*` in copy.md and renders as Newsreader italic 400; body `--brown`; the `.label` style is for the four footer column titles and form legends, not a badge above every heading.
- Buttons: `.btn.btn-primary` is the dark pill with the round orange arrow badge, at most one per view; `.btn-ghost` is the outlined secondary; `.btn-light` is the primary on a dark band. Text links with an arrow (`.link`) are for "Explore" under an offer only.
- Lists: `.marks` (small ember dot) for "what's included"; `.steps` (numbered circle) only for real sequences.
- Radius: `--radius-pill` for anything you press or a badge; `--radius-card` for cards; `--radius-band` for full-width bands.
- Motion: never write a duration or easing in a page; use `--fast`, `--base`, `--slow`, `--ease`, `--rise`, `--stagger`.
