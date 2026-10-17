# Releases

One production release a month at most (owner, 2026-10-15). Each entry says what went live,
how it was checked, and what is still open. Newest first. The deploy procedure is in the
`sansara-deploy` skill.

## Next release (planned 2026-11-16)

Nothing on `develop` yet.

## 2026-10-17, evening

At the owner's request ("deploy to production and do it"), outside the calendar: The System's new story and the core values.

- **Live:** Netlify deploy `6ad3f607a857b5280a4a8f65`. **Code:** `main` = `151c744`, tag `release-2026-10-17b`.
- **The System** (and `/client-loop/`, same body):
  - The problem section challenges the advice coaches get: three "They tell you" myths (post every day, reply fast, run more ads) with what actually happens. The dark box ends with "Let us show you how easy this can be" and a "Keep reading" link.
  - Imagine instead: four flip cards, pain on the front, the ending on the back (a full calendar of the right people, leads who are ready, no-shows become an anecdote, clients come to you), each with a core-value line.
  - How it works: two example Loops (online coaching with ads, in-person coaching on content and referrals); the dashboard caption covers WhatsApp, email, any CRM or none.
  - Order: the free call now comes after the proof. "Keep going" links between sections. Both main buttons say "I want my free call".
  - Hero facts removed; the quote is signed "Therapist"; the case no longer names the clients; "not for you" adds the open-mind line and its link no longer breaks out of the sentence.
- **Home:** the five core values with icons replace "Why Sansara", right after the statement (one shared list).
- **Delivery time is four weeks everywhere** (home facts, the System promise, FAQ).
- **Checked:** `npm run verify`; production build without the lab; the exact build as a draft first: 14 pages on desktop (1366) and phone (390) with no broken images, sideways scroll or visible Pending; the lead form on `/client-loop/` carries name, WhatsApp, interest, `utm_*` and `fbclid` (POST intercepted); flip cards on the System and the home with mouse, tap, Enter and Escape, one open at a time; every in-page link has a target. After the deploy: sansara-media.com and the netlify.app address serve the new pages, `/lab/` is 404, and a test lead ("TEST Claude 2026-10-17 (borrar)", +44 7700 900417) raised the `lead` form's submissions from 3 to 4.
- **Open:** delete the test lead in the CRM; Meta's pixel tries to load an error-log image from `connect.facebook.net`, which `img-src` blocks (tracking is not affected); Ad 2's on-screen "Built in 10 weeks" should say four weeks; the founders' promises on the System still say "in your name".

## 2026-10-17

At the owner's request ("revísalo"), outside the calendar: a tracking fix.

- **Live:** Netlify deploy `6ad326cef1e83fd4c6049c18`. **Code:** `main` = `8ef2c61`, tag `release-2026-10-17`.
- **Meta Conversions API Gateway let through.** The Pixel has a gateway set up in Events Manager
  (openbridge: AWS primary, Google Cloud fallback); the site's Content-Security-Policy blocked it, so
  only browser events reached Meta. `connect-src` now allows those two exact hosts.
- **Checked:** after the deploy, the live CSP header carries both hosts; visiting `/system/` as an iPhone
  from the Facebook app, the browser sends PageView to Meta and POSTs to the gateway's `/events`, with no
  CSP error (the check answered both locally, so it added no events to the account).

## 2026-10-16, afternoon

At the owner's request ("Okay, deploy").

- **Live:** Netlify deploy `6ad23a3125f2bdbf36d252f1`. **Code:** `main` = `af74320`, tag `release-2026-10-16-afternoon`.
- Content: **the proof section is live with Alice's words.** A WhatsApp-style chat: her voice note (3:01)
  and two moments from it, translated from German and marked so. Not a screenshot of typed text.
  First name only, as the owner gave it.
- **Checked:** `npm run verify`, production build, every page on desktop and phone (28 of 28, no
  visible PENDING). After the deploy: `/content/` shows the chat with her name; `/consulting/` still
  shows no Kickstarter price.

## 2026-10-16

At the owner's request ("ok DEPLOY"), outside the calendar.

- **Live:** Netlify deploy `6ad222abe755e344a511bda8`. **Code:** `main` = `1aa2d7f`, tag `release-2026-10-16`.
- Content: **a keynote animation under the hero.** Attract, Trust and Sell pass with their icon, line
  and node, then the ground turns dark and "Every post has one job." lands. Code, not video:
  6 KB of CSS and 3 KB of JS. Plays once when in view; "Play again"; reduced motion shows the last frame.
- **Checked:** `npm run verify`, production build (no lab), every page on desktop and phone (28 of 28
  clean), the animation plays to the end on `/content/` and is centred on desktop and phone. After the
  deploy: `/content/` serves the animation and its two files; the lab stays private (404).

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
