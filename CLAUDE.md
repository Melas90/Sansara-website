# Sansara Media website (v2)

Read `docs/CLAUDE_CODE_BRIEF.md` first: it is the source of truth for scope, brand, working rules and the work plan. Then `decisions.md`, `docs/DESIGN_SPEC.md` and `docs/MOTION_SPEC.md`. Start every session by listing the open design questions relevant to the task and asking them before building (brief §0.2).

## Working rules, in short

- **English by default**, everywhere. Build so a second language can be added later (`copy.<lang>.md`), don't build one until asked.
- **The owner decides the design.** Propose options, show them in the lab (`/lab/`), build only what she chose. Write every answer into `decisions.md` and the specs the same day.
- **Never invent facts.** Missing content is a `PENDING: what is needed` value in `copy.md`; the build renders the visible marker and `npm run verify` lists every one.
- **Tokens only.** `brand/tokens.css` is the only file with hex values and durations. `npm run verify` fails on raw values in `pages/`.
- **Plain HTML, CSS and small vanilla JS.** No frameworks, no Tailwind, no animation library. The only build step is `scripts/build.mjs`, which stitches partials and copy into pages.
- **No AI slop.** The owner has rejected templated work before. Apply the frontend-design discipline of a studio that gives each client a distinct identity: ground every choice in the subject (a small, warm, honest studio), critique each screen against the generic default before showing it, spend boldness deliberately. The brief chooses pill buttons, an italic serif word in headlines, warm gradient bands and section entrance animations; those are allowed. Still never ship: tracked-caps labels above every heading, middle-dot strings, `WORD — fragment` labels, `01/02/03` on lists that are not sequences, uniform shadowed cards, arrows on every link, tinted greys, monospace labels, hover lift on every card, stock photography.
- **The repo is public.** Never commit secrets, tokens, unpublished client figures or private contact details.
- Commit messages in English: `area: what changed`. Run `npm run verify` before every commit.

## Layout of the repo

| Layer | Lives in |
|---|---|
| Brand tokens | `brand/tokens.css` (+ `design-system.md`, `voice.md`, `positioning.md`) |
| Content | `pages/<page>/copy.md`, shared words in `pages/_partials/copy.md` |
| Structure | `pages/<page>/<page>.html`, `pages/_partials/` |
| Motion and interaction | `pages/_assets/motion.css`, `pages/_assets/motion.js` |
| Components and layout CSS | `pages/_assets/site.css` |
| Design lab | `pages/_lab/design-lab.html` + `pages/_assets/lab/` (left out of production builds) |
| Build | `scripts/build.mjs`, `scripts/check.mjs`, `scripts/serve.mjs`, `scripts/site.config.mjs` |

Template syntax and the `copy.md` format are documented at the top of `scripts/build.mjs`.

## Commands

```
npm run dev      # http://localhost:4321/  rebuilds on every request when a source file changed
npm run build    # writes dist/
npm run verify   # build + checks: tokens only, links resolve, list of pending items
```

## Git

`main` is production and `develop` is where the work lands, as in the CRM: feature branches come off `develop` and go back into it; a release is a fast-forward of `main` to `develop`. The old Astro site lives on `legacy/astro` (and in `main`'s history). `v2`, `feat/system` and `release/photo-led` are the rebuild's history up to 2026-09-30 and are no longer used.
