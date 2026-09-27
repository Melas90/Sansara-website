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

Decided 2026-09-27; the owner followed every recommendation.

| # | Question | Options in the lab | Decision | Rejected, and why |
|---|---|---|---|---|
| R1.1 | What We Do: how the three equal offers are shown | A three cards · B tabs · C alternating rows · D bento · E flip cards | **A** | B hides two offers behind a click; C needs a visual per offer and makes the section long; D ranks one tile above the others; E hides half the information behind a gesture |
| R1.2 | The helper line for undecided visitors | A visible question with three answers · B one line that opens | **A** | B: the undecided visitor is exactly the one who will not click |
| R1.3 | Section layouts | A centred and airy · B editorial · C mixed | **C**: editorial by default, centred for the statement and the contact band | A everywhere reads as a template; B everywhere never changes rhythm |
| R1.4 | Icons | A line icons · B filled icons · C none | **C**: the ember dot for lists, a numbered circle for real sequences | Icon sets make every agency site look the same |
| R1.5 | Hero visual | A type only · B type plus a visual slot | **A** until real photography exists | B waits for real imagery; never stock |
| R1.6 | Founders layout | 1 person · 2 people · cards; photo style | Open, waits for decision #12 | |
| R1.7 | Contact band | A one button, the form rises in · B two columns | **A** | B is much taller and the form competes with the headline |
| — | Imagery overall | photography · illustration · 3D · abstract · mix | Photography of the team and the work; the warm and dark gradient bands carry the abstract warmth | Stock photos, never |
| — | brown-2 contrast | keep for labels · darken text | `--brown-2` for labels and hints; `--brown-2-text` `#7A5B3B` for sentences under 18px | |

## Per page

### Home (prototype built 2026-09-27, Step 5)
| Section | Layout | Imagery | Components | Status |
|---|---|---|---|---|
| Hero | Left-aligned block, max 56rem; headline, rotating line in italic serif, lead, two buttons | None (R1.5 A) | `.hero`, `.rotator`, primary + ghost button | Built; headline and phrases pending (#4) |
| Statement | Centred, one sentence at H2 size on the card surface | None | `.statement` | Built |
| What We Do | Editorial head (title left, lead right), three equal white cards, helper line below | None | `.offer` cards, `.marks` list, `.link`, `.helper` | Built |
| How We Work | Editorial head, four numbered steps in a row on the card surface | None | `.steps.steps-row` | Built |
| Why Sansara | Editorial: heading left third, four points in a 2×2 grid | None | plain list | Built |
| Founders | One-person frame left, text right (neutral default) | Real portraits only, pending #12 | `.founders`, `.placeholder` | Built as placeholder |
| Proof | Dark gradient band, title and one quote | Optional round portrait later | `.band-dark` | Placeholder until #7 |
| FAQ | Editorial: heading left, plain `details` rows right | None | `.faq-item` | Built |
| Contact | Warm band, one button, panel rises in (R1.7 A) | None | Netlify form partial | Built |
| Footer | Ink, four columns, newsletter form | Wordmark not repeated | partial | Built; newsletter text and socials pending |

### The System · Consulting · Services · Book a call
To be asked page by page in Step 6.
