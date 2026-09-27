# Design spec

Chosen visual decisions per page section, filled in from the design interview (brief §6.2). Rejected options stay listed with the reason. Tokens: `brand/tokens.css`. Lab: `/lab/`.

## Decided by the brief (§3), built in Step 3

| Topic | Decision |
|---|---|
| Palette | Cream `--bg`, `--card`, `--peach`, white; ink `--ink` / `--ink-2`; body `--brown`; secondary `--brown-2`; the one accent `--orange`, with `--orange-dk` for accent text on light backgrounds. Warm, dark and orange gradients. |
| Type | Hanken Grotesk 700 for headlines, 400 for body; Newsreader italic 400 for the emotional half of a headline (`*word*` in copy.md), quotes and card titles. H1 `clamp(40px,6vw,72px)`, H2 `clamp(34px,4.6vw,50px)`, lead 19px, body 16px/1.6, label 12px/.28em. |
| Shape | Pills for buttons and badges; 20–28px card radius; 32px band radius; max 1200px; 56px side padding (28px ≤ 980px); 96px section padding (72px ≤ 980px). |
| Signature elements | Italic serif word inside headlines · dark pill button with a round orange arrow badge · warm gradient band before the footer · "rise through a mask" motion. |
| Header | Logo · The System · Consulting · Services · About · Blog · one filled button "Book a free call". Mobile: logo, burger, button stays visible. |
| Footer | Dark (ink). Four columns: Offers · Studio · Legal · Newsletter (field, consent, socials pending). Tagline and copyright line below a hairline. |
| Contact section | Warm gradient band, `id="contact"`, headline, one line, "Let's talk" opens the form panel, "Book a call" text link. Netlify form with the six fields from §2.4, inline validation, sending, success and error states. |
| Pending marker | Small dashed peach pill reading "Pending", produced by the build from any `PENDING:` value. |

Not in the brief, derived in Step 3 and open to change: `--text-h3` 22–28px, `--text-small` 14px, `--radius-field` 12px for inputs, text colours on dark bands (`--on-dark`, `--on-dark-muted`), the small ember dot as list mark for "what's included" lists, the numbered circle for real sequences.

## Round 1 — Visual style and layout (open, shown in the lab)

| # | Question | Options in the lab | Recommendation | Decision | Reason |
|---|---|---|---|---|---|
| R1.1 | What We Do: how the three equal offers are shown | A three cards · B tabs · C alternating rows · D bento · E flip cards | A | | |
| R1.2 | The helper line for undecided visitors | A visible question with three answers · B one line that opens | A | | |
| R1.3 | Section layouts | A centred and airy · B editorial (heading left, content offset right) · C mixed | C, with B as the default | | |
| R1.4 | Icons | A line icons · B filled icons · C none, the ember mark and words | C | | |
| R1.5 | Hero visual | A type only · B type plus a visual slot (render, photo, animation) | A until real imagery exists | | |
| R1.6 | Founders layout | 1 person · 2 people · cards; photo style | Depends on decision #12 | | |
| R1.7 | Contact band | A one button, the form rises in · B two columns, form always visible | A | | |
| — | Imagery overall | real photography · illustration (style?) · 3D renders · abstract shapes · a mix | Photography of the team and work; abstract warmth (the gradient bands) in between; no stock | | |
| — | brown-2 contrast | keep `#8C6A47` for labels only · darken secondary text to `#7A5B3B` | Darken for any text under 18px | | |

## Per page (filled in as pages are built)

### Home
| Section | Layout | Imagery | Components | Status |
|---|---|---|---|---|
| Hero | | | | |
| Statement | | | | |
| What We Do | | | | |
| How We Work | | | | |
| Why Sansara | | | | |
| Founders | | | | |
| Proof | | | | |
| FAQ | | | | |
| Contact | Warm band, panel opens (brief §2.4) | | Netlify form | Built, exact treatment open (R1.7) |

### The System · Consulting · Services · Book a call
To be asked page by page in Step 6.
