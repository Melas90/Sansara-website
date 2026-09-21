# DESIGN.md — Sansara Media

Brand direction **B: keep the DNA, retire the tells.** This file is the design
plan the components are built from. Tokens live in `src/styles/tokens.css`; if
this file and the tokens disagree, the tokens are wrong.

Subject the choices are grounded in: a two-person, done-for-you agency for
people who get booked directly. Warm, plain, confident, unhurried. Honest enough
to turn people away.

---

## Pass 1 — the plan

### What the live page actually uses

Read from the inline stylesheet of `business.sansara-media.com` on 2026-09-21.
The brand proposals quoted slightly different values; the live page wins.

| Role     | Live value                       | Brief said | Kept as                                     |
| -------- | -------------------------------- | ---------- | ------------------------------------------- |
| Ground   | `#FCFAF4`                        | `#F6F1EB`  | **linen** `#FCFAF4`                         |
| Card     | `#F7F2E8`                        | —          | **oat** `#F7F2E8`                           |
| Paper    | `#FFFFFF`                        | `#FFFFFF`  | **paper** `#FFFFFF`                         |
| Ink      | `#2A1E14`                        | warm black | **espresso** `#2A1E14`                      |
| Body     | `#5B4A3B`                        | taupe-grey | **bark** `#5B4A3B`                          |
| Muted    | `#8C6A47`                        | —          | **driftwood** `#7A5B3B` (darker, see below) |
| Orange   | `#EE8B5E` (logo colour)          | —          | **ember** `#EE8B5E`                         |
| Rust     | `#B65A2E`                        | `#B4613F`  | **clay** `#B65A2E`                          |
| Hairline | `rgba(42,30,20,.12)`             | hairlines  | **hairline** 14% espresso                   |
| Display  | Newsreader (italic accents only) | serif      | Newsreader, promoted to all headings        |
| Body     | Hanken Grotesk                   | sans       | Hanken Grotesk                              |

### Palette

- **linen** `#FCFAF4` — the ground. Most of the site.
- **oat** `#F7F2E8` — a quiet second ground for alternating bands.
- **paper** `#FFFFFF` — only where something is literally a sheet: a form, a quote.
- **espresso** `#2A1E14` — headlines and primary buttons. A real warm brown-black
  from the brand, not a tinted grey.
- **bark** `#5B4A3B` — body text. 8.0:1 on linen.
- **driftwood** `#7A5B3B` — notes and captions. 5.6:1 on oat.
- **clay** `#B65A2E` — rules, marks, large type. **clay-deep** `#A44F26` is the
  same hue taken down until it passes AA at text size (5.0:1 on oat, 5.4:1 on
  linen); links and focus rings use it.
- **ember** `#EE8B5E` — the logo orange. On light surfaces it is fill only, never
  text (2.3:1). On slate it becomes the accent and the button (5.7:1).
- **slate** `#1F2E35` — the second material. See "one deliberate departure".

### Type

| Role                  | Face           | Setting                                                        |
| --------------------- | -------------- | -------------------------------------------------------------- |
| Display, all headings | Newsreader     | weight 380, optical size auto, tracking −0.022em, leading 1.04 |
| Body, UI, buttons     | Hanken Grotesk | 400 / 600, 17px base, leading 1.6                              |

Newsreader is a variable face with an optical-size axis: at headline sizes it
draws its high-contrast display cut, at 20px it draws a sturdier text cut. That
is what lets one family carry both the hero and a footer sentence. It is set
slightly lighter than regular (380) so large sizes feel unhurried rather than loud.

Scale: eight steps, fluid from the 4th up (`--sm-text-xs` … `--sm-text-4xl`),
about 1.25 on phones opening to 1.333 on desktop. Body measure is capped at
38rem (about 68 characters); headlines at 52rem.

### Layout concept

**One left edge.** Everything aligns to a single left margin, like a letter.
From 1024px a section's heading hangs in a 4-column left rail and its content
takes the other 8 (`Section.astro`). Below that, they stack on the same edge.
Nothing is centred except the contents of a button.

Sections are full-bleed bands of one surface. They are separated by the change
of surface or by one hairline, never both.

### The signature: the system diagram

The one place for expression. On slate, a single ember line is drawn from
"never heard of you" to "booked" through four stations (they see you, they
reach out, it follows up, they book you), with the funnel behind it. It draws
once when it enters view. With `prefers-reduced-motion`, or without JavaScript,
it is simply already drawn. Nothing else on the site animates on scroll.

### Principles

1. Spend boldness once (the diagram). Everything else is quiet.
2. Type carries the personality; colour carries meaning.
3. Structure is information: a rule separates rows of a list, a number marks a
   step in a sequence. Otherwise neither appears.
4. Copy is design: plain verbs, sentence case, buttons say what happens.
5. Surfaces are square. Only things you press are rounded.

---

## Pass 2 — critique against the generic default

The live page is a good page, but cream + serif + warm clay is today's most
common generated look, and it carries most of the known tells. Each was checked
against the plan above. What changed, and why:

| Generic default (and what the live page does)                   | This site                                                                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Centred hero with a pill badge above the headline               | Left-aligned on the single edge. No badge. The umbrella line is a sentence in the "who it's for" section.    |
| Tracked-out caps eyebrow over every heading (`.eyebrow`, .28em) | Removed. There is no eyebrow component; headings stand alone in the rail.                                    |
| Bold sans headline with one word in orange serif italic         | Whole headline in Newsreader, one colour, one style. No accent word.                                         |
| Pill buttons with an arrow in a circle; `↗` on every CTA        | Rectangular buttons, 4px radius, label only. No arrow glyphs anywhere.                                       |
| Blurred gradient blobs behind the hero; gradient final band     | No gradients. Flat surfaces.                                                                                 |
| Everything in white cards, 20px radius, same soft brown shadow  | No shadows exist (`--shadow-*` is cleared). Content sits on the band; lists are rows divided by hairlines.   |
| One radius on everything                                        | Two radii, each with a job: 4px for controls, 18px for chat bubbles inside the diagram. Surfaces are square. |
| `01 02 03 04` on the four pains (not a sequence)                | Numbers only on real sequences: the four-step path and the onboarding gates.                                 |
| `Free · 30 minutes · nothing to prepare`                        | A sentence: "Free, 30 minutes, nothing to prepare."                                                          |
| Fade-and-slide on the pain bubbles, hover lift on buttons       | One animated moment (the diagram). Hover changes colour only.                                                |
| Dark band in a darker shade of the same brown                   | **Slate**, a cool material against the warm ground (below).                                                  |
| Monospace or caps micro-labels                                  | Small labels are sentence-case Hanken at 13–15px.                                                            |

### The one deliberate departure: slate

The brief asks for a second material. The obvious choice, the espresso brown the
live page already uses for its founders band, keeps the page inside one warm
family and reads as "cream template, dark variant". **Slate `#1F2E35`** is cool
where everything else is warm, so the two places it appears — the system diagram
and the final call to action — feel like a different room. The ember logo colour
is at its best on it. It is used for nothing else (the cookie notice borrows it
because it must not be mistaken for page content).

### Self-check against BRIEF.md §1 before every PR

No eyebrows, no middle-dot strings, no `WORD — fragment` labels, no numbering
of non-sequences, no accent word in headlines, no entrance animations or hover
lifts, no uniform shadowed cards, no arrows on links, no tinted greys or
monospace labels, no stock photography.

---

## Open items for the owner

- **Logo file.** The header uses the PNG wordmark taken from the live page
  (898×118). An SVG would be sharper and lighter; drop it in `src/assets/`.
- **Slate.** One token (`--sm-slate`). If it feels off-brand once the diagram
  exists, espresso is the fallback and nothing else changes.
- **Photography.** Founders and client work only. Until real photos exist, the
  blocks that need them render without an image rather than with a placeholder.
