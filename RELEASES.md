# Releases

One production release a month at most (owner, 2026-10-15). Each entry says what went live,
how it was checked, and what is still open. Newest first. The deploy procedure is in the
`sansara-deploy` skill.

## Next release (planned 2026-11-16)

On `develop`, not live yet.

- Lead form: **Email and WhatsApp as two fields**, one or both, at least one, each checked when
  filled in (owner, 2026-10-15). The CRM needs no change.
- Fix: a tap on the privacy box (or the send button) right after leaving a wrong field was lost,
  because the error message pushed the box down under the finger. Live since 2026-10-15.
- Release notes (this file).

## 2026-10-15

- **Live:** https://sansara-website-v2.netlify.app, Netlify deploy `6ad07c31d4348d9b73310a23`
  (manual upload of a production build; the site is not connected to GitHub).
- **Code:** `main` = `develop` = `270284b`, tag `release-2026-10-15`.
- **Previous production:** a manual upload on 2026-10-02 (commit history up to `a9d5f7e`, 2026-09-30).

### New pages

- **Consulting** (`/consulting/`), replacing the coming-soon page. Built from the owner's
  brochure (German PowerPoint): Kickstarter, Growth and Scale as one path, Kickstarter in four
  steps, the Business Foundation Kit (with two new items: the offer structure and concepts of
  the deliverables), Kickstarter at 2,200 €, Growth and Scale priced on a call.
- **Done-for-You Services** (`/services/`): six areas, how a project runs, FAQ.
- **Content and Social Media** (`/content/`): two plans with prices, the monthly process, FAQ.

### Home

- "Which offer fits" is its own section: three large flip cards with a pen that circles
  "Click to discover" (Rough Notation, self-hosted).
- The pen underlines the italic words of the headline.
- Content and Social Media in the offers switcher and the strip of areas.
- Five facts in one line, with operations and the countries served.
- Fix: a mouse click on a flip card no longer turns it straight back (the card already turns on hover).

### Lead form and tracking

- Meta Pixel on every page; `Lead` when a form is saved.
- After sending, "Book your call" opens WhatsApp (+34 611 017 148) with the visitor's name in the message.
- The ad origin (`utm_*`, `fbclid`) travels to the CRM, so ad leads are marked as ads.
- `loop.sansara-media.com` opens the Client Loop landing.
- The contact field is "Email or WhatsApp": a WhatsApp mark shows once a number is typed, and a
  phone must start with its country code (+ or 00), the same rule as the CRM. On 2026-10-14 a UK
  lead wrote "07484 732570", the form let it through and the CRM dropped it.

### Other

- Testimonials in English only on The System and the Client Loop landing.
- The System says content is a separate service, with a link to `/content/`.

### Checked before the deploy

- `npm run verify` (tokens, links, pending list) and a production build (`CONTEXT=production`,
  14 pages, the design lab left out).
- Every page on desktop and on a phone (28 views): no JavaScript errors, no broken images, no
  sideways scroll, no visible PENDING.
- The lead form end to end from Home and from Consulting (sending intercepted), the flip cards
  with mouse, touch and keyboard.
- After the deploy: a test lead sent through the live form ("TEST Claude 15-oct (borrar)") reached
  the CRM's intake (HTTP 200 at 08:41 UTC). To delete in the CRM.

### Known and open

- **Privacy policy and Legal notice are still coming-soon pages**, while the form links to the
  privacy policy and the Meta Pixel runs. The owner's drafts are on the old site.
- **The Meta Pixel loads before cookie consent.** A consent banner is needed in the EU.
- The form's intro promises "the booking link right after"; visitors get a WhatsApp button. A
  Calendly link can replace it once the owner sends it.
- Website leads still land in the CRM's "Example client", not a "Sansara Media" client.
