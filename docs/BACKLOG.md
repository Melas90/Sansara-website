# Backlog — Sansara Media website

Everything still open for the website, in one place (owner, 2026-10-16), ordered by priority. Ship
items through the monthly release (`RELEASES.md`, `sansara-deploy` skill): next release 2026-11-16.
Values the site is waiting for also live in the `copy.md` files as `PENDING:` (`npm run verify` lists
them); this file says why they matter and who has to act. Done items move to `RELEASES.md`.

## 1. Legal, before spending more on ads

- [ ] **Privacy policy and Legal notice.** `/privacy/` and `/legal-notice/` are still "coming soon"
      pages, while the lead form links to the privacy policy and the Meta Pixel runs on every page.
      Meta's ad rules and the GDPR need a real policy. The owner's drafts are on the old Astro site
      (`legacy/astro`, `src/i18n/legal/en.json`), with the company details marked pending.
- [ ] **Cookie consent for the Meta Pixel.** The Pixel loads before any consent; in the EU it may only
      load after the visitor accepts. A small banner (accept / reject), the Pixel loaded on accept only,
      the choice remembered. Lead and ViewContent events then fire only for those who accepted.

## 2. Lead form and the way to book

- [ ] **The intro promises "the booking link right after"**, but after sending, visitors get a
      WhatsApp button (+34 611 017 148). Either put a real calendar link on that button (Calendly with
      name and email prefilled: the owner sends the link) or change the sentence.
- [ ] **A "Sansara Media" client in the CRM** for the website's leads; today they land in "Example
      client". Then point the `lead` form's webhook at it (CRM backlog, "Web intake: loose ends").
- [ ] **New-lead alert to the owner's phone.** Today: a Netlify email notification can be switched on
      in the Netlify UI (Forms → Form notifications), no code. Later: a WhatsApp or Telegram alert from
      the CRM (CRM backlog).

## 3. Content and proof

- [ ] **Alice's quote** (Content, live 2026-10-16): send her the link so she sees it; Christiane to
      confirm by ear that she says "gefehlt" at 0:25 of the voice note (translated "what was missing").
- [ ] **Content page values:** tax line ("Prices excl. IGIC/VAT", owner to confirm with the gestor),
      founding-clients line (decide the number and whether to show it), the client's time per month
      (measured in the pilot), the notice period after the 3-month minimum, and three before/after
      pairs (raw clip, finished Reel) with the client's written OK.
- [ ] **Content prices:** the page shows "from" prices for Starter and Complete. Decide whether they
      stay (Kickstarter's price was removed on 2026-10-15: "always the higher price, we can negotiate").
- [ ] **Approved testimonials** for Home and The System (decision #7: name, business and quote, with
      written OK) and for E-learning (plus one case with numbers the client agreed to share).

## 4. Pages still to build

- [ ] **E-learning and Course Platforms** (`/e-learning/`): still a "coming soon" page; the lab has a
      draft (`/lab/e-learning/`).
- [ ] **Book a call** (`/book-a-call/`): planned route; only its thank-you page exists.
- [ ] **Blog** (`/blog/`): phase 2.

## 5. Landings and domains

- [ ] **Three Client Loop landings exist.** The website's `/client-loop/` (live, form to the CRM,
      Pixel, `loop.sansara-media.com` opens it); `agencia/client-loop-landing` (never published);
      `business.sansara-media.com` (an old page uploaded on 2026-08-30). Proposal: redirect
      business.sansara-media.com to `/client-loop/` and keep one landing, or finish the standalone one.
- [ ] **Own domain.** The site still runs on `sansara-website-v2.netlify.app` (decision #10). Point the
      domain, then update `scripts/site.config.mjs` (`url`).

## 6. Spanish version

- [ ] **Translate the site into native Spanish** (Spain, "tú"). About 9,200 words across the 11 live
      pages; the build already supports it (`copy.es.md` next to each `copy.md`, `languages: ['en', 'es']`,
      pages under `/es/`). Also: an EN/ES switch in the header, `lang` and `hreflang` per page. Keep the
      form's answers (interest) in English so the CRM's labels stay one language. Every later copy
      change then has to be made twice. Estimate (2026-10-16): 3–4 hours of work, 1–2 hours of the
      owner's review, one deploy. Decide first: the whole site or the key pages only (Home, Content,
      Consulting, Services, the form: about 5,000 words).

## Ideas

- Keynote animations for other pages, in code like the Content one (`/lab/content-keynote/`).
- More in `docs/DESIGN_IDEAS.md`.
