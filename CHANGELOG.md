# Changelog

Every pull request adds a line here. Format: [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Changed

- The repository is public (`Melas90/Sansara-website`). BRIEF §6 amended, rules for a
  public repo recorded in `DECISIONS.md`.

### Added

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
