# BRIEF.md — Sansara Media agency website

> **How to run:** open Claude Code in this folder and say: _"Read BRIEF.md. Do the
> next feature in the roadmap. Stop and show me before starting the one after."_
> Features are built one at a time, each on its own branch.
>
> **Amendment, 2026-09-21 (owner):** the site has **three** languages with a
> language switch: English, Spanish and German. Wherever this brief says
> "both locales" or `['en','es']`, read "all three" and `['en','es','de']`.

---

## 0. What we are building, in one paragraph

A premium, highly responsive marketing website for **Sansara Media**, a small
two-person digital marketing agency (Miguel and Christiane). It replaces the
"single landing page" model with a proper home: it presents one flagship
done-for-you offer (the client-acquisition system), a catalogue of done-for-you
modules, and (later) digital products, with real proof and one clear way to start.
It must look and read like a deliberate, human-made site — **not AI slop** — and
be **modular, maintainable and scalable**, because features will be added little
by little over a long time.

The existing live page `https://business.sansara-media.com` stays as the
paid-traffic landing for the free-call offer. The new site is the home.

---

## 1. Standards to apply (read before designing or coding)

**Anthropic frontend-design principles** — apply them as if you were the design
lead of a studio known for giving every client a distinct identity. The client has
rejected templated work before. Concretely:

- Ground every choice in the subject: a small, honest, done-for-you agency for
  people who get booked directly. Warm, plain, confident, unhurried.
- Work in **two passes**: (1) write a compact design plan — palette as named hex,
  typefaces and roles, layout concept with alignment, principles; (2) **critique
  it against the generic default** you would produce for any agency site, revise
  anything that matches, say what changed and why. Only then code.
- **Spend boldness in one place.** The memorable element of this site is the
  **system diagram** (the path from "never heard of you" to "booked", and the
  funnel behind it). Everything else stays quiet and disciplined.
- Typography carries the personality. One or two families, clearly distinct,
  with a real type scale; type used as an active element, not a neutral carrier.
  Line length under ~80 characters.
- Motion: one orchestrated moment (the system diagram coming alive), nothing else
  animates on scroll. Motion that answers a user action is fine.
- Structure is information: borders, numbering, dividers only where they encode
  meaning. Number things only if they are a sequence.
- Copy is design: plain verbs, sentence case, active voice, from the reader's
  point of view. CTAs say what happens.
- Quality floor without announcing it: responsive to 320px, visible keyboard
  focus, `prefers-reduced-motion` respected, WCAG AA contrast.

**The "generated page" tells — do NOT ship any of these:**

- Tracked-out ALL-CAPS eyebrow labels above headings.
- Meta strings joined with middle dots (`A · B · C`).
- Labels built as `WORD — fragment` with a spaced em dash.
- `01 / 02 / 03` numbering on lists that are not sequences.
- One word in a headline set in italic/colour/another face as the "accent".
- Fade-and-slide-up entrance on every section; hover lift on every card.
- Content chopped into identical rounded cards with the same soft grey shadow;
  one border-radius on everything; gradient washes as decoration.
- `→` or `↗` appended to every link and button.
- Tinted near-black (`#0B0B0B`, `#111`) standing in for black; monospace for
  small data labels.
- Stock-photo hero. Use real photography (founders, real client work) or none.

**Google web standards** — treat these as pass/fail:

- Core Web Vitals in the good range on mobile: LCP < 2.5s, INP < 200ms,
  CLS < 0.1. Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO
  for every page, measured on a throttled mobile profile.
- Mobile-first responsive layout; test at 360, 390, 768, 1024, 1280, 1440.
- Semantic HTML, one `h1` per page, logical heading order, landmarks, alt text,
  focus management, skip link. Touch targets ≥ 44px.
- Images: responsive `srcset`, modern formats (AVIF/WebP), explicit dimensions,
  lazy below the fold. Fonts: self-hosted, `font-display: swap`, subset.
- Metadata: title/description per page, Open Graph, canonical, sitemap, robots,
  structured data (Organization, Service, FAQ where present).

---

## 2. Positioning, offering and voice

### Who it's for

Businesses where clients book you directly: coaches, consultants, therapists,
clinics, local service businesses. Umbrella line (from the live page):
**"For coaches, entrepreneurs & business owners."** Proof today: a holistic
therapy centre in Tenerife (Terapias El Templo).

### The three doors (the site's spine, and the nav)

A ladder: _do it yourself → we do it for you → we build and run the whole thing._

1. **The System** (flagship, done-for-you program) — the client-acquisition
   system: landing + booking + Meta Ads + follow-up/CRM + WhatsApp nurture,
   one fixed-scope program in phases (Setup → Launch → Growth retainer).
   Use the live page's language: _"One path. From 'never heard of you' to
   'booked.'"_ — They see you → They reach out → It follows up → They book you.
   Done for you. Plain words. One fixed price. Live in days.
2. **Done-for-you modules** (à la carte, fixed scope, fixed price) — the
   building blocks the System is made of: Landing page · Website · Meta Ads setup
   · Meta Ads management · Booking system setup · WhatsApp / ManyChat automation
   · Chatbot · Email marketing · Creative pack.
3. **Products** (digital, self-serve, low-ticket) — templates and kits that let
   people do it themselves and lead toward the done-for-you tier. **Feature-flagged
   off until the first real product exists** (see config).

### Primary action

**Book the free 30-minute call** ("Show me where I'm losing clients"). Secondary
door: WhatsApp. Tertiary: contact form. Every page offers all three; the call is
always the visually primary one.

### Voice (inherit exactly — this is the site's best asset)

Warm, plain, second person, short lines, honest enough to turn people away.
Three values: **Done for you** · **Plain words** · **Honest fit.** Source of
truth for tone and reusable copy: `https://business.sansara-media.com` (a text
copy is in `docs/live-page-copy.txt`). Reuse its hero, the four pains, the "same
four moments, different endings" contrast, the four-step system, the "for you /
not for you" lists, the founders' text and the FAQ — adapted per page, never
padded. Spanish and German copy is written in the same voice, not translated
word-for-word.

---

## 3. Site tree (information architecture)

```
/                          Home
  ├─ Hero: the promise + one primary CTA + proof strip (real, third-party)
  ├─ How the system works   (the system diagram — the signature moment)
  ├─ Three doors             System · Done-for-you · Products (flagged)
  ├─ Proof                   named case study with real numbers
  ├─ Who it's for            umbrella line + "for you / not for you"
  ├─ How working with us goes (the onboarding gates)
  ├─ Who's behind this       founders, real photo
  ├─ FAQ
  └─ Final CTA

/sistema                   The System (flagship page: promise, path, what's included,
                           phases, price model, proof, FAQ, CTA)
/servicios                 Done-for-you index (cards from the collection)
  └─ /servicios/[slug]     one page per module (same template, data-driven)
/productos                 Products index  [feature flag: products]
  └─ /productos/[slug]     one page per product (low-ticket sales page template)
/casos                     Case studies index
  └─ /casos/[slug]         Terapias El Templo first
/sobre                     Founders, why small on purpose, the method, values
/empezar                   Book the call (Cal.com embed) + WhatsApp + short form
/aviso-legal  /privacidad  /cookies

Global: header (logo, nav = three doors + Casos + Sobre, language switch, CTA) ·
footer (contact, legal, socials, language switch, one-line promise) ·
cookie consent · 404
```

Every locale gets the same tree under its prefix (see i18n). Add a route by
adding a content file, never by editing layout.

---

## 4. Visual identity (direction B: keep the DNA, retire the tells)

**Step one, before any styling:** fetch `https://business.sansara-media.com`,
read its stylesheet, and extract the real tokens (colours, font families, type
scale, spacing, radii) into `src/styles/tokens.css` as CSS custom properties.
Those are the base. Known from the brand proposals, to sanity-check against:

- Ground: warm cream `#F6F1EB`
- Accent: rust / clay `#B4613F` (deeper and more distinctive than the generic
  terracotta — lean into it)
- Paper: white `#FFFFFF`; hairline rules; soft radii used sparingly
- Ink: a warm near-black from the brand (not a tinted grey) for headlines;
  warm taupe-grey for body
- Type: high-contrast serif for display + clean sans for body (reuse the actual
  families from the live page; if unavailable, pick a deliberate pair and record
  the substitution in `DECISIONS.md`)

**Evolve, don't copy:** the cream + serif + warm-clay combination is the most
common generated-page look today, and this brand sits right on it. So:

- Keep the palette core and the serif/sans pairing.
- Retire every tell listed in §1 (eyebrows, middle dots, em-dash labels,
  arrow-buttons, numbered non-sequences, uniform cards).
- Add **one deliberate departure**: a second material against the cream — a
  deep ink or slate surface — used for the system section and the final CTA, so
  the site has a rhythm no template has.
- The system diagram is the one place for expressive treatment.

Record the final design plan (tokens, type roles, layout concept, principles,
and what you changed away from the generic default) in `DESIGN.md` at the repo
root before writing components.

---

## 5. Tech stack and architecture

- **Astro** (static output) + **Tailwind CSS** (tokens exposed as CSS variables;
  Tailwind reads them — never hardcode a colour in a component).
- **Content collections** for `services`, `products`, `cases`, `faq`,
  `testimonials` — Markdown/MDX with typed frontmatter (`zod` schemas). Adding a
  service = adding one file; index pages, nav and sitemap update themselves.
- **i18n via Astro's built-in routing.** `locales: ['en','es','de']`,
  `defaultLocale` in `src/config/site.ts` (default `'en'` — flip in one line).
  UI strings in `src/i18n/{en,es,de}.json`; content collections carry a `locale`
  field. Phase 1 pages exist in all three locales. A language switch is in the
  header and footer.
- **Feature flags** in `src/config/features.ts`: `{ products: false, blog: false }`.
  A flagged-off section renders nothing and is excluded from nav and sitemap.
- **Booking:** Cal.com embed on `/empezar` (URL in `site.ts`). **Forms:** Netlify
  Forms with a honeypot. **WhatsApp:** `wa.me` link with a prefilled message.
- **Analytics & consent:** Meta Pixel + Conversions-API-ready event names
  (`PageView`, `ViewContent`, `Lead` on CTA click, `Schedule` on booking) fired
  only after cookie consent; consent state stored locally; no tracking before
  accept. Cookie/privacy/legal pages present from Phase 1.
- **Images:** Astro `<Image>` with AVIF/WebP, explicit sizes. **Fonts:**
  self-hosted, subset, swap.
- **Deploy:** Netlify, static. Production = `main`. Branch deploy = `develop`
  (staging URL). Deploy previews on every pull request.

### Folder structure (modular by design)

```
src/
  components/
    ui/          Button, Link, Section, Container, Heading, Eyebrow-free labels...
    blocks/      Hero, SystemDiagram, ThreeDoors, Proof, FitList, Process,
                 Founders, FAQ, FinalCTA  (one block = one folder = one concern)
    layout/      Header, Footer, Nav, CookieConsent, SkipLink
  content/       services/ products/ cases/ faq/ testimonials/  (+ config.ts schemas)
  layouts/       BaseLayout, PageLayout, SalesPageLayout
  pages/         (locale)/ ...routes mirror §3
  i18n/          en.json, es.json, de.json, utils.ts
  config/        site.ts, features.ts, nav.ts
  styles/        tokens.css, global.css
public/          fonts/, images/, favicons, robots.txt
```

### Maintainability rules (non-negotiable)

- One feature = one block component + its content type. No page-specific CSS.
- Content lives in collections, never in components. Copy changes never require
  touching a `.astro` file.
- All colours, type, spacing, radii come from `tokens.css`. Zero magic numbers.
- Every block has a short README comment at the top: purpose, props, content
  source.
- Keep dependencies minimal; justify each one in `DECISIONS.md`.
- Every PR updates `CHANGELOG.md`.

---

## 6. Repository and Git workflow (Phase 0)

Prerequisite: GitHub CLI authenticated (`gh auth status`). If it is not, stop and
tell the owner the single command to run (`gh auth login`), then continue.

```bash
# 1. Initialise and first commit
git init -b main
# scaffold Astro project here (see Phase 0 tasks), then:
git add -A && git commit -m "chore: scaffold astro site with tailwind and tokens"

# 2. Create the private GitHub repo and push main
gh repo create sansara-media-web --private --source=. --push

# 3. Integration branch
git checkout -b develop && git push -u origin develop

# 4. Protect main: PRs only, no direct pushes, 1 review, CI must pass
gh api -X PUT repos/{owner}/sansara-media-web/branches/main/protection \
  -f required_status_checks.strict=true \
  -f "required_status_checks.contexts[]=build" \
  -f enforce_admins=false \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=
```

**Branch model**

- `main` — production. Only receives merges from `develop` via a release PR.
- `develop` — integration. Always deployable to staging.
- `feature/<short-name>` — one per feature, branched from `develop`, merged back
  by PR with **squash merge**. Delete after merge.
- `fix/<short-name>` — same flow for fixes. `hotfix/<name>` branches from `main`
  and is merged to both `main` and `develop`.

**Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`,
`refactor:`, `style:`, `content:`). Small, atomic.

**Per-feature loop (repeat for every item in the roadmap)**

1. `git checkout develop && git pull && git checkout -b feature/<name>`
2. Build the feature to Definition of Done (§8).
3. `gh pr create --base develop --fill` — the PR body lists what changed,
   screenshots at 390px and 1280px, and the Lighthouse scores.
4. Wait for CI green and the owner's approval. Squash-merge. Delete branch.
5. Netlify deploys `develop` to staging automatically.

**Release:** `gh pr create --base main --head develop --title "release: vX.Y"`.
Merge = production deploy. Tag it: `git tag vX.Y && git push --tags`.

**CI (`.github/workflows/ci.yml`):** on every PR and push to `develop`/`main`:
install → lint (`astro check`, eslint, prettier check) → build → Lighthouse CI on
the built site (mobile, budgets: perf/a11y/bp/seo ≥ 90). Job name must be `build`
(the protection rule references it).

**Netlify:** connect the repo; production branch `main`; enable branch deploys
for `develop` and deploy previews for PRs; set the custom domain later. Commit
`netlify.toml` with the build command, publish dir and security headers
(CSP allowing only self, Cal.com, and Meta Pixel hosts).

---

## 7. Roadmap — build one feature per branch, in this order

**Phase 0 — Foundation** (`feature/foundation`)
Astro + Tailwind scaffold; `tokens.css` extracted from the live page; `DESIGN.md`
(the two-pass design plan); `site.ts`, `features.ts`, `nav.ts`; i18n wiring with
`en` + `es` + `de`; `BaseLayout` with Header/Footer/SkipLink/CookieConsent; the
`ui/` primitives; content collection schemas; CI workflow; `netlify.toml`;
`README.md` (how to add a service/product/case, how to flip a flag or the default
locale); `DECISIONS.md`; `CHANGELOG.md`. Then the Git/GitHub setup in §6.
_Stop and show the owner the empty shell on staging before Phase 1._

**Phase 1 — MVP that can go live** (one branch per bullet)

- `feature/home` — Home per §3, including the **SystemDiagram** block (the
  signature moment; responsive, reduced-motion fallback is a static diagram).
- `feature/sistema` — `/sistema` flagship page.
- `feature/empezar` — booking page with Cal.com, WhatsApp, form; `Lead`/`Schedule`
  events wired behind consent.
- `feature/legal` — aviso legal, privacidad, cookies (all locales), linked in footer.
- `feature/seo` — metadata, OG images, sitemap, robots, structured data, 404.
  _Release v1.0 to `main`._

**Phase 2 — Depth**

- `feature/servicios` — collection + index + `[slug]` template, all nine modules
  as content files (short pages: what it is, what you get, who it's for, price
  model, CTA).
- `feature/casos` — collection + index + `[slug]`; first case: Terapias El Templo
  with real numbers (cost per attended client, no-show recovery, repeat rate) —
  placeholders clearly marked `[PENDIENTE]` until the owner supplies figures.
- `feature/sobre` — founders page with real photography.
  _Release v1.1._

**Phase 3 — Growth**

- `feature/productos` — collection, index, `SalesPageLayout` for low-ticket
  pages; flip `features.products` on when the first real product file exists.
- `feature/i18n-complete` — every Phase 2 page in all locales.
- `feature/blog` — `/recursos` behind `features.blog`.
  _Release v1.2._

Do not start a phase, or a second feature within a phase, without the owner's go.

---

## 8. Definition of Done (every feature, before the PR)

- Builds cleanly; `astro check`, eslint and prettier pass; no console errors.
- Responsive and reviewed at 360, 390, 768, 1024, 1280, 1440. No horizontal
  scroll. Touch targets ≥ 44px.
- Lighthouse mobile ≥ 90 on all four categories for every new/changed page;
  CLS < 0.1; no layout shift from fonts or images.
- Keyboard: every interactive element reachable, visible focus, logical order.
  Screen-reader pass with landmarks and alt text. Contrast AA.
- `prefers-reduced-motion` honoured; the one animated moment has a static
  fallback.
- All copy comes from content collections or `i18n/*.json`; all three locales
  present for the page.
- No item from the "generated page tells" list in §1 is present. Re-read the
  list before opening the PR.
- Tokens only; no hardcoded colours/sizes. New block has its README comment.
- `CHANGELOG.md` updated; PR body has screenshots and scores.

---

## 9. Config defaults and open decisions (each is one line to change)

| Decision                            | Default                                              | Where                    |
| ----------------------------------- | ---------------------------------------------------- | ------------------------ |
| Default locale                      | `en` (Spanish and German fully present)              | `src/config/site.ts`     |
| Products section                    | off until first product                              | `src/config/features.ts` |
| Brand direction                     | B — keep DNA, retire tells                           | `DESIGN.md`              |
| Booking URL                         | placeholder until provided                           | `src/config/site.ts`     |
| WhatsApp number & prefilled message | placeholder                                          | `src/config/site.ts`     |
| Typefaces                           | extracted from live page, else recorded substitution | `DESIGN.md`              |
| Case-study figures                  | `[PENDIENTE]` markers                                | `src/content/cases/`     |

Placeholders must be visibly marked and listed in `README.md` under "Before
launch", so nothing ships pointing at `example.com`.

---

## 10. Explicitly out of scope (for now)

- A CMS or admin UI (content is files in the repo; the agency edits via Git).
- User accounts, e-commerce checkout for products (link out to a checkout
  provider when products go live).
- Anything that runs on a server. This is a static site by design.
