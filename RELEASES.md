# Releases

One production release a month at most (owner, 2026-10-15). Each entry says what went live,
how it was checked, and what is still open. Newest first. The deploy procedure is in the
`sansara-deploy` skill.

## Next release (planned 2026-11-16)

Nothing on `develop` yet.

## 2026-10-15, evening

At the owner's request ("remove the Kickstarter price of the website… and deploy").

- **Live:** Netlify deploy `6ad0f009964e74e6a5af59cb`. **Code:** `main` = `785e6f6`, tag
  `release-2026-10-15-evening`.
- Consulting: **no price on the page.** Kickstarter is "Price on a call" like Growth and Scale; the
  FAQ asks "How much does it cost?" (one fixed price per program, agreed on a call, in writing).
- Consulting, Kickstarter: a program done with us, not a two-hour workshop; the channels of your
  choice (social media, ads or both) instead of Instagram only; 1:1 sessions with an expert and
  WhatsApp support instead of the workshop recording.
- **Checked:** `npm run verify`, production build, every page on desktop and phone (28 of 28 clean).
  After the deploy: `/consulting/` shows no price and no Instagram, and shows the new wording.

## 2026-10-15, hotfix (afternoon)

Outside the calendar, at the owner's request ("Sí, venga, arréglalo"): the lost tap could cost leads.

- **Live:** Netlify deploy `6ad0a11ac618099539789ac1`. **Code:** `main` = `develop` = `6a51bfb`,
  tag `release-2026-10-15-hotfix`.
- Lead form: **Email and WhatsApp as two fields**, one or both, at least one, each checked when
  filled in (owner, 2026-10-15). The CRM reads `email` and `whatsapp` with no change.
- Fix: a tap on the privacy box (or the send button) right after leaving a wrong field was lost,
  because the error message pushed the box down under the finger (25 px on desktop, 47 px on a
  phone). Error messages now wait until the press is over.
- Release notes (this file).
- **Checked:** `npm run verify`, production build without the lab, every page on desktop and phone
  (28 of 28 clean), 9 email/WhatsApp combinations, the tap on the privacy box and on the send button
  with mouse and touch. After the deploy: the live pages serve the two fields and the fix; Netlify
  registered the new `email` and `whatsapp` fields; a test lead with both ("TEST Claude hotfix 15-oct
  (borrar)", test-hotfix@example.com, +44 7700 900124) was saved by the form at 09:47 UTC.

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
