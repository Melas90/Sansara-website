# Sansara Media — website

The studio's website. Plain HTML, CSS and vanilla JavaScript, assembled by one small Node script. Deployed on Netlify from GitHub.

- What we are building and how we work: [docs/CLAUDE_CODE_BRIEF.md](docs/CLAUDE_CODE_BRIEF.md)
- Design decisions per section: [docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md) · motion: [docs/MOTION_SPEC.md](docs/MOTION_SPEC.md)
- Why things are the way they are: [decisions.md](decisions.md)

## Run it

Needs Node 20 or newer. There is nothing to install.

```
npm run dev      # http://localhost:4321/   (the design lab is at /lab/)
npm run build    # writes dist/
npm run verify   # build + checks; run before every commit
```

The dev server rebuilds pages on every reload when a file in `pages/` or `brand/` changed. If you edit something in `scripts/`, restart it.

## Where things live

```
brand/            tokens.css (the only place with colours and durations), fonts, design-system.md, voice.md, positioning.md
pages/
  _assets/        site.css, motion.css, motion.js, images/, icons/, lab/ (lab-only CSS and JS)
  _partials/      head.html, header.html, footer.html, contact.html, contact-form.html, copy.md (shared words)
  _lab/           design-lab.html: options under discussion, side by side
  home/           copy.md, home.html (Step 5)
  system/ consulting/ services/ booking/ legal/   (Step 6)
  thanks/         the three confirmation pages
scripts/          build.mjs, check.mjs, serve.mjs, site.config.mjs
docs/             the brief, DESIGN_SPEC.md, MOTION_SPEC.md, DESIGN_IDEAS.md
references/       live-page-copy.txt and anything the owner adds
```

## How to change a piece of text

Every word is in a `copy.md`: shared words (navigation, footer, contact section) in `pages/_partials/copy.md`, page words in `pages/<page>/copy.md`. Save, and `npm run dev` picks it up on the next reload. You never need to open an HTML file to change copy.

To mark something as missing, write `key: PENDING: what is needed`. It shows as a small "Pending" tag on the page and in the `npm run verify` list.

## Branches

`main` is production and `develop` is where the work lands. Features are built one per branch from `develop` and merged back; a release fast-forwards `main` to `develop`. The old Astro site stays on `legacy/astro`. Netlify: production deploys from `main`; enable a branch deploy for `develop` in Site configuration → Build & deploy → Branches, to get a staging link.
