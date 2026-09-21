# Changelog

Every pull request adds a line here. Format: [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Changed

- Motion (owner request): the sun rises and the hero quotes arrive on load, the statement lights
  up word by word on scroll (CSS only), process steps and proof figures reveal in sequence and
  figures count up, hovering a station lights its node on the loop. All off with reduced motion.
- Photo slots: `src/assets/photos/founders.*` is picked up automatically; testimonials show a
  round portrait when `photo:` is set.
- One client script bundle instead of one per block; italic serif subset to 44 kB.

### Fixed

- Case entries in the three languages overwrote each other because Astro uses a `slug` field as
  the entry id. The field is now `key`.
- Warm palette (owner feedback): the cool slate surface is replaced by the espresso brown of the
  original landing, so every surface stays in the cream, brown and orange family.
- New `Testimonials` block on the home page, fed by `src/content/testimonials/`. Entries carry a
  `consent` field; `pending` blocks a release through `npm run check:launch`.
- Redesign after owner feedback (`feature/redesign`): poster-size display type, the ember sun in
  the hero, the system diagram redrawn as a loop, an ember `Statement` band, slate footer with
  the wordmark. See DESIGN.md, Revision 2.
- Display font is now our own subset of Newsreader (94 kB instead of 132 kB); italic uses the
  lighter weight-only file. LCP back under 2.3 s on throttled mobile.
- The repository is public (`Melas90/Sansara-website`). BRIEF §6 amended, rules for a
  public repo recorded in `DECISIONS.md`.

### Added

- Home page (`feature/home`) in English, Spanish and German: Hero, SystemDiagram (the one
  animated moment, static with reduced motion or without JavaScript), Doors, Proof,
  FitList, Process, Founders, FAQ and FinalCTA blocks.
- Page copy files in `src/i18n/home/`, FAQ entries in `src/content/faq/`, and the first case
  (Terapias El Templo) with figures marked `[PENDIENTE]`.
- Foundation (Phase 0): Astro 7 static site with Tailwind 4 reading design tokens
  extracted from the live landing page (`src/styles/tokens.css`).
- `DESIGN.md` with the two-pass design plan; `DECISIONS.md`; `README.md`.
- Three locales (English, Spanish, German) with a language switch in the header,
  the mobile menu and the footer; `hreflang` and canonical tags on every page.
- Config: `site.ts`, `features.ts` (products and blog off), `nav.ts`.
- `BaseLayout` with skip link, header, footer and cookie consent. The Meta Pixel
  loads only after consent; `Lead` fires on call-to-action clicks.
- UI primitives: Container, Section, Heading, Button, TextLink, Actions.
- Content collection schemas: services, products, cases, faq, testimonials.
- Self-hosted Newsreader and Hanken Grotesk (latin subset, swap, matched fallbacks).
- CI workflow (`build` job: check, lint, format, build, Lighthouse CI) and
  `netlify.toml` with security headers and a CSP limited to self, Cal.com and Meta.
- `npm run check:launch` to catch placeholders before a release.
