# Releases

One production release a month at most (owner, 2026-10-15). Each entry says what went live,
how it was checked, and what is still open. Newest first. The deploy procedure is in the
`sansara-deploy` skill.

## Next release (planned 2026-11-16)

On `develop`, not live: **the human look on the System pages** (`/system/`, `/client-loop/`, `/es/sistema/`; they share
one body), merged from `feat/human-look` on 2026-10-26. The why, decision by decision, is in `decisions.md`
(2026-10-26).

- **Why:** leads stopped after 15 Oct and the page read as generated. The owner compared it with
  funnelarchitektinnen.de ("make it look less AI and more like them"), and the film had no viewers.
- **References checked:**
  - funnelarchitektinnen.de/funnelmentoring-erstgespraech: the hero photo of the people behind it, handwritten
    notes, crossed-out advice, "things people say" answered, the numbered method chart ("Unsere Methode"),
    "an info call, not a sales call";
  - the top-5 competitor research of 2026-10-25 (productised offers that show a price);
  - Meta Pixel data from 22 to 26 Oct: about 470 page views, and the film's 15 s `ViewContent` only 4 times, all on
    22 Oct right after release, none after;
  - Hotjar (Contentsquare) sessions: text masked, nothing usable yet;
  - the lab concept `/lab/client-loop-human/`.
- **Changes:**
  - **Hero:** a bright real photo of Chrissy on the phone at her laptop; "Hi, I'm Chrissy."; three checks; "An info
    call, not a sales call."; "For coaches and business owners with paying clients"; the moving band of services under
    it, fading into the page.
  - **How it works** = our method: the free call, two strategy calls, we build and you review, closing call and
    handover. Drawn as a chart with new icons.
  - **Price section, Sansara Loop Starter, €2,500:**
    - everything included, as icon cards;
    - "Flexible payment. Ask us how.";
    - "There's much more we can do… Just ask";
    - support tickets valid for 3 months.
  - **Removed:** the film (VSL), "Imagine instead", the tiles, the dashboard photo, "A real business", "Meet the
    founders", and the "Why a loop" intro. Their copy stays in `copy.md`.
  - **Style:** headings in heavy Hanken with the italic phrase underlined by the pen; handwritten labels (Caveat,
    a brand font now, `--font-hand`); the client messages taped on; the objections boxed with an "Honest answer"
    sticker; Chrissy laughing beside the call button and in the "Talk to us" form (every page).
- **Pixel:** `PageView`, `LoopCheckStarted` (every button, `content_name` = where: header, hero, price, price: more,
  free call, closing band, floating button), `LeadFormStarted`, `Lead`, `Contact` and `BookingClick` are unchanged and
  were checked on all three pages. The film's `ViewContent` (`system film 15s`) no longer fires, because the film is
  gone. Hotjar's form steps on `/client-loop/` are unchanged.
- **Checked so far:** `npm run verify`; production build without the lab; the two-step form test (57 checks: steps,
  Enter, missing email blocked, numbers from UK, ES, DE, NL, Pixel steps, Calendly, no JS errors); the Hotjar steps;
  desktop (1440) and phone (390) screenshots of every changed section; no sideways scroll.
- **Still to decide before the release:**
  - turn off the scroll pop-up and the floating button;
  - end the page on the call;
  - hero and objection copy that promise more than the Loop Starter;
  - "Two Loops, for example";
  - payment terms behind "Flexible payment".

## 2026-10-25

Owner: "what can we do to increase the probability that people complete the form… do all of this, including
Hotjar", the steps "for the Client Loop only", then the hero ("we could be a bit more specific… option B") and
"publish".

- **Live:** https://sansara-media.com, Netlify deploy `6ade38a221bea3fc1d62b03a`. **Code:** `main` = `develop` =
  `d768008` (merge of `fix/form-friction`), tag `release-2026-10-25`.
- **The contact form in two steps:** the name first with "Next" (Enter too), then the rest under it. Email required,
  WhatsApp optional with a country code beside it (guessed from the browser's language; a local number is sent in
  international form). "What are you interested in?" hidden on the System pages, the note behind a link. The button
  repeats the page's promise ("Get my free assessment" / "Quiero mi evaluación gratis"). A business coach's words
  beside it (shortened with "(…)", "based on a client's message"). "Prefer WhatsApp? Message us" (Pixel `Contact`).
  New intro ("We need your contact details to send you the call invite…") and privacy line ("We only use your details
  for your call…") in place of the required box. Chris's photo is a small portrait beside the title on a phone.
- **Hotjar (Contentsquare):** loads from `assets/cs.js`, off on a local copy; on `/client-loop/` the form's steps are
  page events (opened, started typing, step 2, blocked by <field>, sent, calendar, WhatsApp, closed).
- **Pixel:** off on a local copy (localhost, 127.x, 192.168.x).
- **Hero of The System:** "We build your lead generation, landing pages, payments and bookings for you. As one
  connected system, or piece by piece." / "Te montamos la captación, las landing pages, los cobros y las reservas.
  Como un sistema conectado, o pieza a pieza."; the line under it without "Done for you".
- **Checked:** `npm run verify`; production build without the lab; 15 pages at 1366 and 390 px; the form against the
  build (57 checks: both steps, Enter, empty name and missing email blocked, numbers from UK, ES, DE, NL, Pixel steps,
  Calendly, no JS errors); no request to Meta or Contentsquare from a local copy. After the deploy: the new hero and
  form markup on `/client-loop/`, `/system/`, `/es/sistema/`; Contentsquare loads, records and receives the page events
  on `/client-loop/`; a test lead ("TEST Claude 2026-10-25 (borrar)", +44 7700 900525, test@example.com) reached the
  `lead` form with the number in international form; Netlify filed it as spam, marked "not spam" by hand.
- **Open:** delete the CRM test leads marked "(borrar)"; in Contentsquare add `sansara-media.com` to the project,
  unmask text and media, check the 15 % recording quota (trial ends in 9 days); cookie consent banner.

## 2026-10-23b

- **Live:** https://sansara-media.com, Netlify deploy `6adb4723adce73558f3fd941`. **Code:** `main` = `develop` = `f712c6a`
  (merge of `fix/free-assessment`), tag `release-2026-10-23b`.
- **The hero's small line under "Talk to us"** (owner: "talk to us and get your free assessment, is that bad or lying?",
  then "deploy already"): "Get a free assessment: on a 30-minute call we look at where you're losing clients and what to
  fix first." / "Llévate una evaluación gratis: en una llamada de 30 minutos vemos dónde pierdes clientes y qué arreglar
  primero." The assessment is the call; no written report is promised. Copy only.
- **Checked:** `npm run verify`; production build without the lab; 15 pages at 1366 and 390 px; the form test against the
  build (36 checks); after the deploy the line is live on `/client-loop/`, `/system/` and `/es/sistema/`.

## 2026-10-23

Owner: "talk to us means that they can send us a message, and free call means that they need to show up… then go ahead
… and deploy Netlify once you have done these changes".

- **Live:** https://sansara-media.com, Netlify deploy `6adb45ce560ac3cef1eeab74` (manual upload of the production build).
- **Code:** `main` = `develop` = `2f83938` (merge of `fix/talk-to-us`), tag `release-2026-10-23`.
- **Call buttons say what they open:** **Talk to us** / **Háblanos** on the hero, the closing band, the landing header,
  the site header and the home hero; the hero's small line "Free, no commitment. Book a 30-minute call if you like." /
  "Gratis y sin compromiso. Si quieres, reserva una llamada de 30 minutos." The call section keeps **Book a free call** /
  **Reserva tu llamada gratis**. Copy only, no code.
- **Checked:** `npm run verify`; production build without the lab; the 15 pages at 1366 and 390 px; the form test against
  the build (36 checks). After the deploy: `/client-loop/`, `/system/`, `/es/sistema/` and `/` serve the new words and none
  of the old, `/lab/` is 404. No test lead: the form is unchanged since 2026-10-22e, which was tested live.
- **Open:** the ad text still says "Book your free call" (change it in Ads Manager to match); the items open in
  2026-10-22e.

## 2026-10-22e, hotfix

Owner: no leads since 15 October. The three real leads (4, 13 and 14 October) came from Meta ads to `/client-loop/` and
opened the short form straight away; since then the ads pointed to `/system/` and, from 19 October, every call button
opened the Client Loop Check first. Owner: "revertir el quiz y pasar al formulario simplemente con el enlace de Calendly".

- **Live:** https://sansara-media.com, Netlify deploy `6ada7947f49fa34814f00ebd` (manual upload of the production build).
- **Code:** `main` = `develop` = `25152a6` (merge of `fix/form-first`), tag `release-2026-10-22e`.
- **The form first again:** the call buttons on Home, The System and `/client-loop/` open the short contact pop-up, then
  "Book your call" opens Calendly with name and email filled in. The Check is off (its files stay; each page notes how to
  bring it back).
- **Scroll pop-up** kept, now opening the contact pop-up, on Home, The System, `/client-loop/` and `/es/sistema/`.
- **Contact pop-up:** Chris's photo (top on a phone, beside the form from 760 px) and an optional field "Tell us about your
  case and we'll look into it" / "Cuéntanos tu caso y lo analizaremos" (`message`).
- **Pixel:** `LoopCheckStarted` (custom) when a call button opens the form (not the scroll pop-up), `LeadFormStarted`
  (custom) on the first keystroke, then `Lead` on sending, as before.
- **The System's copy** no longer mentions the two-minute check.
- **Checked:** `npm run verify`; production build without the lab; the 15 pages of the build at 1366 and 390 px (no JS
  errors, broken images, sideways scroll or visible PENDING); the form on `/client-loop/`, `/system/`, `/` and
  `/es/sistema/` against the build (button and scroll open it, `message`, `utm_source` and `fbclid` sent, Calendly after
  sending, Pixel events, no pop-up after sending: 36 checks). After the deploy: the four pages serve the new markup,
  `/lab/` is 404, and a test lead ("TEST Claude 2026-10-22e (borrar)", +44 7700 900422) reached the `lead` form.
- **Known:** Netlify's spam filter put that test lead in spam, as it did the earlier test; it was marked "not spam" by
  hand. Spam never reaches the CRM: check Forms → `lead` → Spam submissions weekly. The CRM doesn't store `message` yet.
- **Open:** delete the CRM test leads marked "(borrar)"; Calendly's confirmation redirect to `/book-a-call/thanks/` (for
  `Schedule`); `loop.sansara-media.com` points at the old host (certificate error), fix its DNS or drop it; cookie consent
  banner for the Pixel and Contentsquare.

## 2026-10-22d

Owner: "olvidaste actualizar los botones… 2 min check before the call not 5", and the pop-up said "free assessment".

- **Live:** Netlify deploy `6ad9cf82cfa498c990ef536c`. **Code:** `main` = `f051344`, tag `release-2026-10-22d`.
- English System pages and the landing: the hero and closing buttons and the landing header say "I want my free call";
  the check is two minutes (hero note, call section, the Check's intro "A few questions, two minutes"); the scroll
  pop-up's first line is "Get your free call: two minutes first" instead of "Take your free assessment".
- **Checked:** verify; production build from a clean worktree; every page on desktop and phone clean; live: the
  buttons, no "five-minute" left, the Check's texts served.

## 2026-10-22c

At the owner's request ("after that i think we can deploy"), the same day: the System pages' new hero and client chats.

- **Live:** Netlify deploy `6ad9ce1af3434d0cc631c84a`. **Code:** `main` = `356859e`, tag `release-2026-10-22c`.
- **Hero** (`/system/`, `/es/sistema/`, `/client-loop/`): "Turn strangers into clients *who keep coming back*" / "Convierte
  desconocidos en clientes *que vuelven*", for practitioners who already have paying clients; more than a sales funnel
  (it keeps going after the sale); done for you, at a fixed price per package. The second button ("See how it works")
  goes to the film. Under the buttons, a moving band with the ten parts of the Loop, "WhatsApp compatible" among them
  with the site's chat icon. The infinity loop is gone: the art is the system map's four illustrations (Spanish ones on
  the Spanish page), clockwise round a flowing orange line.
- **Client words as WhatsApp chats**, side by side under "What our clients write to us": the therapist (Vero and Rafa,
  English reordered and translated, Spanish reworded and marked "based on") and a business coach ("based on a client's
  message"; channel and exact wording not confirmed). No platform logos (Meta's rules); WhatsApp's colours as tokens.
- **Checked:** `npm run verify`; production build from a clean worktree (15 pages, no lab); every page on desktop and
  phone clean; the lead form end to end with the POST intercepted. After the deploy: the three pages serve the new hero,
  the stages, both chats, the band and the film; the stage images answer 200; `/lab/` is 404. The film's 15 s
  `ViewContent` was checked on the live site (intercepted): fires on `/es/sistema/` (es) and `/client-loop/` (en).
- **Open:** both clients' permission to publish their words; confirm whether the coach's message came by WhatsApp and
  in those words (then the chat can say "WhatsApp" and drop "based on"). On a 1366x900 laptop the band sits just under
  the fold.

## 2026-10-22 and 2026-10-22b

At the owner's request ("Publish now", then "correct that, and then deploy"), outside the calendar: the explainer
film on the System pages.

- **Live:** Netlify deploys `6ad94e55b47af1d6a877b6d4` (`13ced81`, tag `release-2026-10-22`) and
  `6ad94fdd4738d799fb8a8601` (`942c53c`, tag `release-2026-10-22b`).
- **The Client Loop film** right under the hero of `/system/` (English, Chris's voice and captions),
  `/es/sistema/` (Spanish, captions) and `/client-loop/` (they share the body): 16:9 on every screen, a poster of the
  full map, `preload="none"` (nothing downloads until play), 6.5 MB per film. Above it: "Already have something
  running? You don't have to start from scratch…", then what the Loop is (a complete sales funnel that doesn't stop
  at the booking). Below it: "Working with us doesn't mean fixing everything at once…". On phones, a note to turn the
  phone sideways.
- **Pixel:** a standard `ViewContent` (`content_name: system film 15s`, `content_category` = en/es) after 15 s of real
  watching (seeking ahead doesn't count), once per page view.
- **Dev server** (`scripts/serve.mjs`, not deployed): serves video as `video/mp4` with byte ranges; without them the
  lab's English film played silent.
- **Checked:** `npm run verify`; production build from a clean worktree of `develop` (15 pages, no lab); every page on
  desktop (1366) and phone (390): no JS errors, broken images, sideways scroll or PENDING, no mp4 requested before
  play; the film plays with sound; the 15 s event fires (and doesn't when seeking); the Spanish page has no English
  Check pop-up; the lead form end to end with the POST intercepted. After the deploy: the three pages serve the film
  and the new line, the videos answer with byte ranges (206), `/lab/` is 404, and one real test lead through
  `/es/sistema/` ("TEST Claude 2026-10-22 (borrar)", +44 7700 900422) reached the success screen and Calendly.
- **Open:** delete that test lead in the CRM; Netlify bandwidth: each full play is 6.5 MB (about 150 plays per GB,
  20 credits per GB).

## 2026-10-19, hotfix

Owner: "Meta me está bloqueando la página web porque dice que falta eso" (Sharing Debugger: missing `og:url`, `fb:app_id`).

- **Live:** Netlify deploy `6ad63f86cb2d7da0003e9fe0`. **Code:** `main` = `3856354`, tag `release-2026-10-19b`.
- `og:url` (the page's own address) and `og:site_name` on every page. `site.url` is now `https://sansara-media.com`, so the share image and the EN/ES hreflang links no longer point at the netlify.app address. `fb:app_id` left out: it is only for a Facebook developer app.
- **Checked:** `npm run verify`, production build without the lab; after the deploy, fetched as `facebookexternalhit`: `/`, `/system/`, `/client-loop/`, `/es/sistema/` answer 200 with `og:url`, `og:image` on sansara-media.com; `/lab/` is 404.
- **Open:** `loop.sansara-media.com` does not reach Netlify: its DNS is a CNAME to All-Inkl (`w0214780.kasserver.com`), HTTPS times out, and the Netlify site has no domain alias for it. Ads must not point there until it is fixed.

## 2026-10-19

At the owner's request ("Okay. Deploy."), outside the calendar: the Spanish System page and the Client Loop Check funnel.

- **Live:** Netlify deploy `6ad635c99d89886c09885c00`. **Code:** `main` = `35c0eca`, tag `release-2026-10-19`.
- **Spanish System page** at `/es/sistema/`: its own Spanish copy (not a translation), the slim landing shell, hreflang to `/system/`. The rest of the site stays in English.
- **The Client Loop Check** before the free call (Home, The System, `/client-loop/`): the call buttons open a short assessment first. Intro with Chris's photo (larger), "A few questions, five minutes", three steps (your biggest leak and one thing to do this week, your personal report written by us, you book your free call). The email step is sent as the `lead` form with `weakest`, `fit` and the answers in words, so it reaches the CRM like any lead.
- **Scroll pop-up:** scrolling opens the Check, centred, with "Take your free assessment": at about half the page, once more near the end after 45 seconds, never a third time in a visit, never once the Check is done.
- **Booking on Calendly** (`calendly.com/sansara-media/business-strategy-call`, name and email filled in) after the Check and after the contact pop-up, in English and Spanish; WhatsApp underneath for questions.
- **Icons** on The System's steps (the new Sansara icon set, `pages/_partials/loop-icons.html`).
- **Contentsquare (Hotjar)** tag `33cbc9dd983b3` on `/system/`, `/client-loop/` and `/es/sistema/`, with its domains in the CSP.
- **Pixel funnel:** `LoopCheckStarted` (custom), `Lead` on the email step, `BookingClick` (custom) on Calendly or `Contact` on WhatsApp, `Schedule` on `/book-a-call/thanks/`.
- **Checked:** `npm run verify`; production build without the lab; on the exact build: 17 pages on desktop (1366) and phone (390) clean; the full Check with the POST intercepted (all fields, `form-name=lead`, Calendly link with name and email, the returning screen, Pixel calls); the contact pop-up's finish screen in English and Spanish; the scroll pop-up's timing. After the deploy: pages respond, `/lab/` and internal docs are 404, Contentsquare loads on `/system/` and `/es/sistema/` with no CSP violations, and a test lead ("TEST Claude 2026-10-19 release (borrar)", +44 7700 900419) reached the `lead` form.
- **Note:** netlify-cli 27 runs `build.command` before a deploy; deploy the checked `dist/` with `--no-build`.
- **Open:** in Calendly, redirect the event's confirmation to `/book-a-call/thanks/` (otherwise `Schedule` never fires) and check the event is the free 30-minute call; delete the CRM test leads marked "(borrar)"; the Check in Spanish (later, owner); a cookie-consent banner for the Pixel and Contentsquare (GDPR); the CRM doesn't store `weakest`/`fit`/`answers` yet (they are in the Netlify submission and the email).

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
