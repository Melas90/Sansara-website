# Decisions

Short records of choices that are not obvious from the code. Newest last.

## Dependencies, and why each is here

| Package                                                                 | Why                                                                                                    |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `astro`                                                                 | The framework (BRIEF §5). Static output, content collections, i18n, image and font pipelines built in. |
| `tailwindcss`, `@tailwindcss/vite`                                      | Styling (BRIEF §5). v4 reads the tokens through `@theme`; no `tailwind.config`.                        |
| `@fontsource-variable/newsreader`                                       | Source of the self-hosted Newsreader woff2 files (latin subset, variable, OFL).                        |
| `@fontsource-variable/hanken-grotesk`                                   | Same, for Hanken Grotesk.                                                                              |
| dev: `@astrojs/check`, `typescript`                                     | `astro check` in CI.                                                                                   |
| dev: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro` | Linting for `.ts` and `.astro`.                                                                        |
| dev: `prettier`, `prettier-plugin-astro`                                | Formatting check in CI.                                                                                |

Not dependencies on purpose: Lighthouse CI runs through `npx` in the workflow only.
No UI framework, no animation library, no icon set, no cookie-banner package.

## 2026-09-21 — Foundation

**Three locales, not two.** The owner added German to the brief: `en`, `es`, `de`.
All three are wired from Phase 0 and every page must exist in all three.

**Default locale has no URL prefix.** `/` is English, `/es/` and `/de/` are the
others. Pages live once, in `src/pages/[...locale]/`, and get their paths from
`localeStaticPaths()`. Flipping `defaultLocale` in `src/config/site.ts` moves the
prefixes; nothing else changes. The alternative (every locale prefixed, `/`
redirecting) needs a redirect rule that would have to be edited in a second place.

**Route slugs stay Spanish in every locale** (`/sistema`, `/de/sistema`), exactly
as BRIEF §3 draws the tree. Localised slugs are possible later but would need a
route map; not worth it before there is traffic to protect.

**Tokens come from the live page, not the brand proposals.** The live stylesheet
says ground `#FCFAF4`, rust `#B65A2E`, ink `#2A1E14`; the brief's sanity-check
values (`#F6F1EB`, `#B4613F`) differ slightly. The live page is what customers
have seen, so it wins. Full table in `DESIGN.md`.

**Two colours were adjusted for contrast.** The live muted brown `#8C6A47` fails
AA on the oat surface (4.2:1), so muted text uses `#7A5B3B`. The rust `#B65A2E`
is 4.2–4.5:1 at text size, so links and focus rings use `clay-deep` `#A44F26`;
the original clay stays for rules and large type.

**Typefaces: no substitution needed.** Newsreader and Hanken Grotesk are both
open-licensed, so the live page's families are reused. What changed is their
roles: the live page sets headlines in bold Hanken with an italic Newsreader
accent word (a listed tell). Here Newsreader carries every heading.

**Fonts use Astro's Fonts API with the local provider**, pointing at the woff2
files inside the fontsource packages. Builds need no network, the files are
latin-subset and `font-display: swap`, and Astro generates metric-matched
fallback faces so the swap does not shift layout. Only the two upright files are
preloaded; italics download if a page uses them.

**Tailwind's default theme is cleared.** `--color-*`, `--radius-*`, `--shadow-*`,
`--text-*` and friends are reset in `global.css`, then re-filled from tokens. A
class like `bg-blue-500`, `rounded-xl` or `shadow-md` does not exist here, so
"tokens only" is enforced by the build rather than by review.

**Surface tokens.** Components ask for `fg`, `accent`, `action-bg`, not for
`espresso` or `ember`. A `.surface-slate` wrapper re-points them, so the same
Button is dark-on-light on linen and ember-on-slate in the final CTA.

**`live` flag in `nav.ts`.** Routes that are not built yet are hidden from the
header and footer instead of linking to a 404. Each feature branch flips its own
route to `live: true`. Until `/empezar` exists, the primary CTA goes to the
booking URL directly.

**Content config location.** Astro reads collections from `src/content.config.ts`
with glob loaders. BRIEF §5 shows `content/config.ts`, the pre-v5 location.

**CSP and scripts.** `vite.build.assetsInlineLimit: 0` keeps every script in its
own file, so `script-src` needs no `'unsafe-inline'`. The Meta Pixel is loaded by
`src/scripts/consent.ts` (not by Meta's inline snippet) and only after consent.
`style-src` keeps `'unsafe-inline'`: Astro inlines the `@font-face` block and the
Cal.com embed injects styles.

**Mobile menu is a `<details>` element.** It opens without JavaScript. A 20-line
script adds Escape and click-away.

**No `eslint-plugin-jsx-a11y`.** Its current release does not accept ESLint 10 as
a peer. Accessibility is gated by Lighthouse CI (≥ 90) instead. Revisit when the
plugin catches up.

**`npm run check:launch` is separate from CI.** Staging may carry placeholders;
production may not. Run it before every release PR to `main`.

## 2026-09-22 — Public repository

**The repo is public** (`Melas90/Sansara-website`), by the owner's decision; BRIEF
§6 is amended. What that buys: branch protection on `main` is free for public
repos, and deploy previews and CI logs can be shared by link. What it costs: the
brief, the strategy and all copy are readable by anyone, including competitors.

Rules that follow from it:

- Nothing secret is committed. The Meta Pixel ID, the Cal.com link and the
  WhatsApp number are public by nature (they ship in the page source anyway). A
  Conversions API token, form webhook or any other credential goes in Netlify
  environment variables, never in `site.ts`.
- Case-study figures are only committed once the client has agreed to them being
  published, because committing is publishing.
- No private contact details of clients in content files or commit messages.

**One approving review cannot work with a single GitHub account.** GitHub does
not let the author of a pull request approve it, and Claude's pull requests are
opened under the owner's account. Protect `main` with "require a pull request"
and "require the `build` check", but set required approvals to 0. The owner's
approval is the act of merging.

## 2026-09-22 — Home

**Structured page copy lives in `src/i18n/<page>/<locale>.json`**, read with
`pageCopy(page, locale)`. The flat interface files stay small, and lists and steps
keep their shape. English defines the type; a locale missing a key fails
`astro check`.

**The four pains sit in the hero, beside the headline.** BRIEF §3 has no separate
pains section on the home page, but they are the strongest lines the brand owns, so
they take the place a stock photo would have had.

**The hero facts are the agency’s own claims, not third-party proof.** BRIEF §3 asks
for a real, third-party proof strip. None exists yet (no reviews, no client logos), so
the strip states three plain facts instead. Replace it when real proof arrives.

**Proof shows `[PENDIENTE]` on purpose.** The case exists with its three result labels
so the layout can be judged on staging; `npm run check:launch` blocks a release
while any figure is still pending.

**The diagram hides itself only after its script has run**, and only if it is below
the fold and motion is allowed. Every other state (no JavaScript, reduced motion,
already on screen) shows the finished drawing.
