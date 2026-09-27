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
