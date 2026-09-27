# Decisions

One dated line per decision, newest last. Design answers also go into `docs/DESIGN_SPEC.md` or `docs/MOTION_SPEC.md`.

## 2026-09-27 — The rebuild

- **v2 brief replaces the Astro site.** The owner pasted `docs/CLAUDE_CODE_BRIEF.md` (v2, 27 Sept 2026) and chose option 2 of three: start again from the new brief rather than reconcile it with the Astro/Tailwind site in three languages. Reasons: the new brief reverses the old design rules (pill buttons, italic accent word, gradient bands, expressive motion), is English only, and has a different offer structure (The System, Consulting, Services). Reconciling would have cost more than rebuilding.
- **Same GitHub repo and Netlify site, a fresh branch.** `v2` is an orphan branch with no shared history. The old site stays readable on `develop` and in `main`'s history. Staging and production URLs and the Netlify connection are kept. GitHub cannot open a pull request between branches with no common ancestor, so go-live will be a local merge into `main` with `--allow-unrelated-histories` (or a force-push of `v2` to `main` after the owner's go), recorded here when it happens.
- **Work happens in a git worktree** at `C:\Users\diezg\sansara\website-v2` so the Astro checkout in `website/` is untouched. Once v2 is live, `website-v2` becomes the only checkout.
- **A small build script, no framework.** The brief wants plain HTML with shared partials and copy in `copy.md`. Plain HTML cannot include a header on its own, so `scripts/build.mjs` (about 200 lines, no dependencies) stitches partials and copy into pages. The alternative, copying the header into every page, drifts within a week. The prototype code is the live code on Netlify (open decision #10); every option in the lab still carries an Elementor route.
- **`copy.md` is a strict, small format**: `## Section` headings, `key: value`, lists with `-`, one level of `###`. Words are edited only there. A value that starts with `PENDING` renders as a visible marker and is listed by `npm run verify`.
- **Fonts are self-hosted** (`brand/fonts/`, OFL) rather than loaded from Google Fonts: faster, no third-party request, no consent question for a German or EU audience later.
- **The no-AI-slop rule from the old brief carries over** as a standing rule in `CLAUDE.md`, at the owner's request mid-session. The new brief's explicit choices (pills, italic serif word, gradient bands, entrance animations) are allowed; the rest of the "tells" list stays banned.
- **No `funnels/system-lp-en/index.html`.** The file the brief adapts for the System page is not on this machine. The owner confirmed the System page is built from the brief and `references/live-page-copy.txt`.
- **Header without a `details` element.** The mobile menu is a button plus 15 lines of JS; without JS the list is simply visible below the header. A `details` element cannot be forced open on desktop in every browser.
- **The contact panel hides itself only after JS runs** (`motion.js` sets `hidden`), so the form is always reachable without JavaScript (brief §2.4).
- **Only `transform` and `opacity` are animated, plus the SVG stroke of the success checkmark.** Opening the contact panel changes layout once, on click, which is a user action and not an animation.
- **The lab is left out of production builds** (`CONTEXT=production` on Netlify). Branch deploys and previews include it.
- **Thank-you pages exist from the start** because the two Netlify forms need somewhere to land. They use the foundation only: headline, one line, buttons. No new design element.
- **Derived tokens not in the brief**, flagged in `brand/design-system.md`: `--text-h3`, `--radius-field`, `--text-small`, dark-band text colours. The owner can change them in one place.

## 2026-09-27 — Design interview, Round 1 (owner followed every recommendation)

- **R1.1 What We Do: A, three cards side by side.** All three offers visible at once, same size and structure. Rejected: B tabs (hides two offers behind a click), C alternating rows (needs a visual per offer, makes the section long), D bento (a mosaic always ranks one tile above the others), E flip cards (hides half the information behind a gesture).
- **R1.2 Helper line: A, visible.** A question with three answers under the cards, linking to the three pages, plus "still not sure" to `#contact`. Rejected: B folded line.
- **R1.3 Section layouts: C, mixed.** Editorial (heading in the left third, content offset right) is the default for anything with a list; centred only for the statement and the contact band, so the page changes rhythm.
- **R1.4 Icons: C, none.** Lists use the small ember dot; real sequences use a numbered circle. Rejected: line icons, filled icons (fastest way to look like every other agency site).
- **R1.5 Hero visual and imagery: A, type only** until real photography of the team and the work exists. No stock, no renders or illustrations unless the owner brings a direction later.
- **R1.7 Contact band: A**, one button, the form rises in (as in the brief). Rejected: B two columns with the form always visible.
- **Secondary text colour.** `--brown-2` stays for the 12px bold labels and hints; sentences under 18px use the new `--brown-2-text` `#7A5B3B` (4.5:1 on card). `.muted` uses it.
- **R1.6 Founders layout** stays open until decision #12 (who appears). The home page shows the one-person frame as a neutral default with pending markers.
- **FAQ rows** on the home page are plain `details` elements with a hairline between, no accordion widget. Not a Round 1 question; it is the least "designed" form and can be restyled once the owner sees it.
- **Chosen styles moved from the lab into `site.css`** (offer cards, helper line, editorial layout, placeholder frames). The lab keeps the rejected variants with their labels.

## 2026-09-27 — Five home directions

- **The owner saw the first prototype and found it still looked generated** ("still looks like Claude"). She asked for alternative home designs, first three, then five, on roughly the same colours, and allowed the brief's visual details (pills, italic serif word, gradient band, type roles, ground colour) to be overruled step by step for the sake of comparison. Built as `/lab/home-1/` to `/lab/home-5/` with an index at `/lab/homes/`: 1 Ledger (brief kept, cards replaced by hairline rows, bigger type), 2 Grid (one sans, square corners, twelve columns, margin labels), 3 Sun (serif headlines, ember disc, ember statement band, arch panels), 4 Night (dark ground, cream type, ember light), 5 Poster (square, no serif, edge-to-edge type, colour blocks, underline CTAs, marquee). All use the same copy and tokens; each has one stylesheet in `pages/_assets/lab/`.
- **Honest diagnosis recorded:** the first prototype sat exactly on the most common generated look (cream + serif accent + terracotta + rounded cards + centred statement), which the brief's own spec points to. The way out is composition, scale and structure, not new colours.
- **Mechanical QA (build, screenshots, overflow checks) is delegated to a smaller model**, at the owner's request, so the design work stays with the main session.

## 2026-09-27: hero and photos (lab, round three)

- The orb is out. The owner liked option 4 of the hero lab best: the three offers as a fanned deck of cards, now with an icon each. It sits in Cris's hero (A).
- On the owner's request the lab has two photo variants of Cris's page (A2 mockups, A3 photo-led) next to the version without images. They use free Unsplash photos as placeholders, marked "Stock photo, placeholder" on the page and listed in `pages/_assets/lab/stock/CREDITS.md`. This is a lab-only exception to "placeholder frames, never a stock image": no stock photo goes live, and no stock face stands in for a real person.
