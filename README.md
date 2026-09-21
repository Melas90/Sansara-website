# Sansara Media — website

The agency's home site. Static Astro site, Tailwind for styling, content in
Markdown files, three languages (English, Spanish, German). Deployed on Netlify.

- What we are building and in which order: [BRIEF.md](BRIEF.md)
- How it should look, and why: [DESIGN.md](DESIGN.md)
- Why things are the way they are: [DECISIONS.md](DECISIONS.md)

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev          # http://localhost:4321
npm run verify       # everything CI runs: check, lint, format, build
npm run check:launch # fails while any placeholder is left
```

## Before launch

These are placeholders today. `npm run check:launch` lists whatever is left.

| What                 | Where                                   | Now                                |
| -------------------- | --------------------------------------- | ---------------------------------- |
| Production domain    | `src/config/site.ts` → `url`            | `PLACEHOLDER.sansara-media.com`    |
| Cal.com booking link | `src/config/site.ts` → `bookingUrl`     | `cal.com/PLACEHOLDER/...`          |
| WhatsApp number      | `src/config/site.ts` → `whatsappNumber` | `PLACEHOLDER`                      |
| Meta Pixel ID        | `src/config/site.ts` → `metaPixelId`    | empty (pixel never loads)          |
| Instagram, LinkedIn  | `src/config/site.ts` → `socials`        | empty (hidden)                     |
| Case-study figures   | `src/content/cases/`                    | `[PENDIENTE]` once the case exists |
| Logo as SVG          | `src/assets/`                           | PNG taken from the live page       |
| Founders photo       | `src/assets/`                           | none yet                           |

Also before launch: connect the repo in Netlify (production branch `main`, branch
deploys for `develop`, deploy previews on), then set the custom domain.

## How to…

### Change a piece of text

Interface text (nav, buttons, footer, cookie notice) is in `src/i18n/en.json`,
`es.json` and `de.json`. Same keys in all three. Page content is in
`src/content/`. You never need to open a `.astro` file to change copy.

### Add a service, product, case, FAQ entry or testimonial

Add one Markdown file per language:

```
src/content/services/en/landing-page.md
src/content/services/es/landing-page.md
src/content/services/de/landing-page.md
```

The frontmatter fields are defined, with comments, in `src/content.config.ts`. A
missing or mistyped field fails the build with a message naming the file. Index
pages, nav and sitemap pick the new entry up by themselves. Set `draft: true` to
keep a file out of the site.

### Switch a feature on

`src/config/features.ts`. Set `products: true` when the first real product file
exists. A flag that is off renders nothing and stays out of nav and sitemap.

### Change the default language

`src/config/site.ts`, `defaultLocale`. The default language is served at `/`, the
others under `/es/`, `/de/`. One line; nothing else to edit.

### Add a language

Add the code to `locales` in `src/config/site.ts` (plus its name and Open Graph
code just below), copy `src/i18n/en.json` to the new code, register it in
`src/i18n/utils.ts`, and add the content files.

### Show a new page in the navigation

`src/config/nav.ts`. Set the route's `live: true` once the page exists. Labels
come from `nav.<key>` in the i18n files.

### Change a colour, font size or spacing

`src/styles/tokens.css`, and only there. Components cannot use raw values:
Tailwind's default palette, radii and shadows are switched off.

### Add a page section

One block = one folder in `src/components/blocks/` = one concern. Start the file
with the README comment (purpose, props, content source), take copy from a
collection or i18n, use tokens only. Re-read the "tells" list in BRIEF §1 before
opening the pull request.

## Structure

```
src/
  components/ui/       Container, Section, Heading, Button, TextLink, Actions
  components/blocks/   page sections, one folder each (from Phase 1)
  components/layout/   Header, Footer, Nav, LanguageSwitch, CookieConsent, SkipLink
  content/             services/ products/ cases/ faq/ testimonials/
  content.config.ts    the schemas for the above
  layouts/             BaseLayout
  pages/[...locale]/   one file per route, built once per language
  i18n/                en.json, es.json, de.json, utils.ts
  config/              site.ts, features.ts, nav.ts
  scripts/             consent.ts (analytics behind consent), menu.ts
  styles/              tokens.css, global.css
docs/live-page-copy.txt   text of the live landing page, the source for tone
```

## Git workflow

`main` is production, `develop` is staging, work happens on `feature/<name>`
branched from `develop` and squash-merged back by pull request. Conventional
Commits. Every pull request updates `CHANGELOG.md` and carries screenshots at 390
and 1280 plus Lighthouse scores. Releases are a pull request from `develop` to
`main`, then a tag. Full detail in BRIEF §6.

## Analytics

Nothing is tracked before the visitor accepts the cookie notice. After that:
`PageView` on load, `Lead` on any element with `data-track="Lead"` (every call
and WhatsApp button), and `Schedule` when a booking completes (wired in
`feature/empezar`). Event names match Meta's Conversions API.
