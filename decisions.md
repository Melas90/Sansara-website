# Decisions

One dated line per decision, newest last. Design answers also go into `docs/DESIGN_SPEC.md` or `docs/MOTION_SPEC.md`.

## 2026-09-27 — The rebuild

- **v2 brief replaces the Astro site.** The owner pasted `docs/CLAUDE_CODE_BRIEF.md` (v2, 27 Sept 2026) and chose option 2 of three: start again from the new brief rather than reconcile it with the Astro/Tailwind site in three languages. Reasons: the new brief reverses the old design rules (pill buttons, italic accent word, gradient bands, expressive motion), is English only, and has a different offer structure (The System, Consulting, Services). Reconciling would have cost more than rebuilding.
- **Same GitHub repo and Netlify site, a fresh branch.** `v2` is an orphan branch with no shared history. The old site stays readable on `develop` and in `main`'s history. Staging and production URLs and the Netlify connection are kept. GitHub cannot open a pull request between branches with no common ancestor, so go-live will be a local merge into `main` with `--allow-unrelated-histories` (or a force-push of `v2` to `main` after the owner's go), recorded here when it happens.
- **Work happens in a git worktree** at `C:\Users\diezg\sansara\website-v2` so the Astro checkout in `website/` is untouched. Once v2 is live, `website-v2` becomes the only checkout.
- **A small build script, no framework.** The brief wants plain HTML with shared partials and copy in `copy.md`. Plain HTML cannot include a header on its own, so `scripts/build.mjs` (about 200 lines, no dependencies) stitches partials and copy into pages. The alternative, copying the header into every page, drifts within a week. The prototype code is the live code on Netlify (open decision #10); every option in the lab still carries an Elementor route.
- **`copy.md` is a strict, small format**: `## Section` headings, `key: value`, lists with `-`, one level of `###`. Words are edited only there. A value that starts with `PENDING` renders as a visible marker and is listed by `npm run verify`.
- **Fonts are self-hosted** (`brand/fonts/`, OFL) rather than loaded from Google Fonts: faster, no third-party request, no consent question for a German or EU audience later.
- **The no-AI-slop rule from the old brief carries over** as a standing rule in `CLAUDE.md`, at the owner's request mid-session. The new brief's explicit choices (pills, italic serif word, gradient bands, entrance animations) are allowed; the rest of the "tells" list stays banned.
- **No `funnels/system-lp-en/index.html`.** The file the brief adapts for the System page is not on this machine. The owner confirmed the System page is built from the brief and `references/live-page-copy.txt`.
- **Header without a `details` element.** The mobile menu is a button plus 15 lines of JS; without JS the list is simply visible below the header. A `details` element cannot be forced open on desktop in every browser.
- **The contact panel hides itself only after JS runs** (`motion.js` sets `hidden`), so the form is always reachable without JavaScript (brief §2.4).
- **Only `transform` and `opacity` are animated, plus the SVG stroke of the success checkmark.** Opening the contact panel changes layout once, on click, which is a user action and not an animation.
- **The lab is left out of production builds** (`CONTEXT=production` on Netlify). Branch deploys and previews include it.
- **Thank-you pages exist from the start** because the two Netlify forms need somewhere to land. They use the foundation only: headline, one line, buttons. No new design element.
- **Derived tokens not in the brief**, flagged in `brand/design-system.md`: `--text-h3`, `--radius-field`, `--text-small`, dark-band text colours. The owner can change them in one place.

## 2026-09-27 — Design interview, Round 1 (owner followed every recommendation)

- **R1.1 What We Do: A, three cards side by side.** All three offers visible at once, same size and structure. Rejected: B tabs (hides two offers behind a click), C alternating rows (needs a visual per offer, makes the section long), D bento (a mosaic always ranks one tile above the others), E flip cards (hides half the information behind a gesture).
- **R1.2 Helper line: A, visible.** A question with three answers under the cards, linking to the three pages, plus "still not sure" to `#contact`. Rejected: B folded line.
- **R1.3 Section layouts: C, mixed.** Editorial (heading in the left third, content offset right) is the default for anything with a list; centred only for the statement and the contact band, so the page changes rhythm.
- **R1.4 Icons: C, none.** Lists use the small ember dot; real sequences use a numbered circle. Rejected: line icons, filled icons (fastest way to look like every other agency site).
- **R1.5 Hero visual and imagery: A, type only** until real photography of the team and the work exists. No stock, no renders or illustrations unless the owner brings a direction later.
- **R1.7 Contact band: A**, one button, the form rises in (as in the brief). Rejected: B two columns with the form always visible.
- **Secondary text colour.** `--brown-2` stays for the 12px bold labels and hints; sentences under 18px use the new `--brown-2-text` `#7A5B3B` (4.5:1 on card). `.muted` uses it.
- **R1.6 Founders layout** stays open until decision #12 (who appears). The home page shows the one-person frame as a neutral default with pending markers.
- **FAQ rows** on the home page are plain `details` elements with a hairline between, no accordion widget. Not a Round 1 question; it is the least "designed" form and can be restyled once the owner sees it.
- **Chosen styles moved from the lab into `site.css`** (offer cards, helper line, editorial layout, placeholder frames). The lab keeps the rejected variants with their labels.

## 2026-09-27 — Five home directions

- **The owner saw the first prototype and found it still looked generated** ("still looks like Claude"). She asked for alternative home designs, first three, then five, on roughly the same colours, and allowed the brief's visual details (pills, italic serif word, gradient band, type roles, ground colour) to be overruled step by step for the sake of comparison. Built as `/lab/home-1/` to `/lab/home-5/` with an index at `/lab/homes/`: 1 Ledger (brief kept, cards replaced by hairline rows, bigger type), 2 Grid (one sans, square corners, twelve columns, margin labels), 3 Sun (serif headlines, ember disc, ember statement band, arch panels), 4 Night (dark ground, cream type, ember light), 5 Poster (square, no serif, edge-to-edge type, colour blocks, underline CTAs, marquee). All use the same copy and tokens; each has one stylesheet in `pages/_assets/lab/`.
- **Honest diagnosis recorded:** the first prototype sat exactly on the most common generated look (cream + serif accent + terracotta + rounded cards + centred statement), which the brief's own spec points to. The way out is composition, scale and structure, not new colours.
- **Mechanical QA (build, screenshots, overflow checks) is delegated to a smaller model**, at the owner's request, so the design work stays with the main session.

## 2026-09-27: hero and photos (lab, round three)

- The orb is out. The owner liked option 4 of the hero lab best: the three offers as a fanned deck of cards, now with an icon each. It sits in Cris's hero (A).
- On the owner's request the lab has two photo variants of Cris's page (A2 mockups, A3 photo-led) next to the version without images. They use free Unsplash photos as placeholders, marked "Stock photo, placeholder" on the page and listed in `pages/_assets/lab/stock/CREDITS.md`. This is a lab-only exception to "placeholder frames, never a stock image": no stock photo goes live, and no stock face stands in for a real person.

## 2026-09-27: home and About built (branch feat/home-about)

- **Home** is the photo-led Cris direction (lab A3) with the offer deck in the hero. Its styles and script moved out of the lab into `pages/_assets/home.css` and `home.js`; the lab files stay for comparison.
- **About** (`/about/`) is built from the owner's own About copy on the Astro site (develop, `src/i18n/sobre/en.json`), marked as working copy waiting for her approval. Nothing new was written. Two portrait frames for Miguel and Christiane; roles, bios and portraits are Pending (decision #12). The service pages wait.
- **Photos:** the home and About use the free Unsplash placeholders from the lab, each marked Pending on the page, so `npm run verify` lists them until real photos replace them. They must not go live (`pages/_assets/images/placeholder/CREDITS.md`). People are never shown with stock photos.
- **Lead pop-up** (owner request): one Netlify form, `lead`, kept short on purpose: name, email or phone, interest, consent, plus a hidden `source` naming the button and page. No outside form tool, no WhatsApp (the owner dropped it). It opens from the closing band's "Let's talk", an "Ask about this offer" button in each offer panel (preselects the offer), a line after the four steps, and a floating "Get in touch" button that appears after the hero and hides over the closing band and footer. It never opens by itself. Submissions land in Netlify Forms; the CRM gets them later through a Netlify webhook or an integration.
- **copy.md:** a list item in double quotes is always a string. Two About lines were silently dropped because they contain ": ".

## 2026-09-27: The System page and the Client Loop landing page (branch feat/system)

- Built from the owner's own landing page (`sansara-CALL-page.html`, kept out of git): the copy is hers, streamlined (fewer dashes and middle dots, the same claims), in `pages/system/copy.md`.
- One body, two pages: `/system/` inside the site (full header and footer) and `/client-loop/`, a standalone landing page for ads (slim header with one button, slim footer, `noindex` with a canonical to `/system/`).
- Every call to action opens the lead pop-up with "The System" preselected and a `source` naming the spot. The owner dropped WhatsApp; the form is the only way in.
- Left out: the Botpress chat assistant (third-party script) and the "live demo" section, which promised an instant confirmation and reminder the Netlify form does not send.
- The hero shows the Client Loop itself: the gold loop from the hero lab with the five moments on it and a spark travelling round.
- To confirm with the owner: that Vero & Rafa (Terapias El Templo) agreed to be named on the site and in this public repo; "live in 15 days" against open decision #6; the portrait of Miguel and Christiane (Pending).
- Owner feedback on the first build (same day): italic accents on this page in the brand's dark orange (`--orange-dk`; the light orange is too pale on sand, it stays for accents on dark); "The real problem" redesigned (the four sentences as chat bubbles, the turn, the cause, a dark conclusion card); "Ends" on the steps renamed "No more"; the founders section reframed as "Meet the founders" with the owner's positioning: Miguel from high tech, semiconductors and scale-ups (operations, infrastructure, business development; no job title), Christiane from a creative background in marketing, digital marketing and automation, the blend as the reason they can tailor any solution. The owner does not want the studio to read as "just two people"; the About page ("Two people. Small on purpose.") needs the same review.
- Build: `copy.md` lines that a block does not read (for example keys written after a list) now fail the build instead of disappearing.

## 2026-09-27 (evening): home first, one form, Netlify preview, CRM link

- **Scope:** the owner wants the home page finished properly before any other page. Consulting, Services, Blog, Book a call and the legal pages stay unbuilt for now.
- **No booking calendar for now.** The form is the way in. Every "Book a free call" button (header, hero, footer) opens the lead form (`/#lead`), and the closing band's "Prefer to pick a time? Book a call" line is removed. A calendar comes back only if the owner asks.
- **The lead form feeds the CRM.** A signed outgoing webhook on the Netlify form `lead` posts each submission to the Sansara CRM, which stores it as a customer (name, email or phone, interest and source in the history). Tested end to end, including a submission typed by the owner. It points at the CRM's test client for now.
- **Hosting (#10), leaning Netlify.** The site runs on the Netlify project `sansara-website-v2`, uploaded by hand, Forms on. Recommended: keep it on Netlify and point sansara-media.com at it, because Netlify Forms stop working if the files move to WordPress. Not decided yet.
- **Icon lab** proposed by the owner, not built yet. It settles the conflict between R1.4 (no icons) and the hero deck's one icon per offer.
- **Bug fixed:** the build swallowed copy errors, so home, About and The System were deployed without text. A copy error now fails the build.
- The brief now opens with a "Current state" section that overrides older sections. Keep it up to date instead of re-asking settled questions.
## 2026-09-28: the client dashboard on The System page

- At the owner's request, "How it actually works" on `/system/` ends with a photo of a tablet on a wooden desk showing Sansara's own CRM pipeline, with the caption "Your own client dashboard. Every enquiry and booking in one pipeline, in your name." The scene is AI-generated (Magnific, Nano Banana Pro) around a real screenshot of the CRM with demo customers only. The client's name is cropped out, and nothing from any real client appears. It is not a stock photo of a person, so the no-stock rule holds. File: `pages/_assets/images/system/crm-tablet.jpg`.
## 2026-09-29: the "Be ___." motto on the home page

- The owner made an animation from the Client Loop keynote (`sansara-loop-keynote.png`): "Be" stays and the italic word swaps (seen, chosen, booked, remembered, Sansara), each with a line icon, a dot moving down a small orange timeline, and the card turning espresso on "Be Sansara."
- **Where:** on Home, in the statement section right under the hero (option 2). The eyebrow reads "The Sansara Client Loop", as on the keynote. The owner sees it as the studio's motto, not as one offer, so it stays on Home. The service cards stay at the top of the page "for now". The hero was the alternative and was not chosen; putting it on /system/ as well is still open.
- Rhythm: one word every `--rotate-every` (the hero line's 2.8 s), and the last word holds a little longer. It runs only while on screen. Without JavaScript or with reduced motion it shows "Be Sansara." still. Screen readers get the whole motto in one sentence.
- The icons are five line icons drawn for this card only. The icon lab (open) may replace them.
- A standalone version (1080×1350 WebM plus the HTML) was made for Canva and social media, outside the repo.
## 2026-09-29: the founders photo

- The owner supplied a photo of the two founders in the studio (`C:\Users\diezg\sansara\founder.png`). It replaces the stock photo in the home founders arch and in the About hero arch, and the Pending frame under "Meet the founders" on /system/ and /client-loop/, where it uses a 4:3 crop. The dark film border is trimmed. Files: `pages/_assets/images/people/founders.jpg` and `founders-wide.jpg`. Alt text is shared as `shared.people.founders_alt`.
- On /system/ the photo now sits at the top of its column and stays in view beside the long story (sticky, desktop only).
- Still open under decision #12: roles, bios and the individual portraits on About, and the founders text on Home.
## 2026-09-29 (evening): the cards stay on top, lighter; more in the offer lists

- Tried and reverted the same evening: the motto in the hero, with the offer cards cascading lower down. The owner decided the cards stay on top. The layout stays hero (cards), then the motto beside the photo, then "Three ways to work with us" (list with panels).
- Less text (the owner found the home too text-heavy): the hero cards now show only number, icon, name, promise and link. The lists live in "Three ways to work with us" only.
- New points in the offer lists (owner): The System adds "Your own CRM, every contact and booking in one place" and "Nurturing and upselling that bring clients back". Done-for-You Services adds "Automations", also in the moving strip of areas. The wording is working copy.- Card 00 (owner, same evening): the hero deck gets a dark cover card on top, "00 · Three ways to work with us", with "Same studio, same standards. You choose how much we take off your plate." and "Take a look at what we do" (to #what-we-do). The three offers sit behind it in a tighter fan of four.- Founders on Home (owner, same evening): the panoramic collage of the two founders (`founders-collage.jpg`, from Magnific) replaces the arch photo. It sits full width in a white print frame, tilted -0.8° and straightening on hover (not tilted on phones), with the title centred above and "More about us" below. The portrait collage was not used: it has text baked into the image ("WHO WE ARE", a "JAN 2024" calendar, and a leftover prompt note "03 / 07 mono, tracking .22em" in the corner). About and The System keep the studio photo.
## 2026-09-30: coming-soon pages, and the go for main

- Services, Consulting, Blog, Privacy and Legal notice are not built yet. Each route now shows one "coming soon" page (`pages/soon/`): "We're building this page. We're working hard to build our website and bring the best to your business. This page is coming soon. In the meantime, feel free to ask us anything.", with a button that opens the lead form. Owner's words, tidied; pending approval. The pages are `noindex`.
- The privacy policy and legal notice have drafts of the owner's own on the old site (`src/i18n/legal/en.json` on `develop`), with the company details marked pending. They should replace the coming-soon page before the site goes on the real domain.
- Every remaining "Book a call" link outside the lab opens the lead form.
- The owner gave the go to put the photo-led site on `main`.

- Branches (2026-09-30, owner): the same flow as the CRM. `develop` holds the site and `main` is production; features come off `develop` and a release fast-forwards `main`. The Astro site moved to `legacy/astro`. `develop` was moved onto the photo-led site by a merge (nothing rewritten). The `website` folder now has `legacy/astro` checked out and `website-v2` has `develop`.
- "Not sure which fits?" as flip cards (owner, 2026-09-30): three cards, the front asks the visitor's situation as a question ("Do you know exactly what you need?", "Do you just want it to work?", "Tried many things and nothing seems to work?") with a "Flip to see" hint; the back names the offer and when it fits, with an Explore link. Consulting's back is the owner's line: guidance first, the strategy drawn together, implementation later, with us or without us. Flips on hover, tap or keyboard (Escape flips back); under reduced motion it crossfades; without JavaScript both faces are stacked and readable. Working copy, pending approval. Replaces the earlier list (R1.2 A).
- Hero photo (owner, 2026-09-30): the owner's photo of the motto cards on linen ("Be seen. Be chosen. Be booked. Be remembered. Be Sansara.", tied with an orange thread; `pages/_assets/images/home/hero-cards.jpg`) fills the hero, and the headline, lead, buttons and facts sit on its plain left half over a soft cream fade. The offer deck left the hero, so the offer cards appear once, in "Three ways to work with us". Under 900px the photo sits below the copy instead of behind it. The photo is 1376×768; a larger version would be sharper on big screens.
- Motto section (owner, 2026-09-30): the "The Sansara Client Loop" label above the card is gone (the hero photo already says it), the Pending tag on the section's photo is hidden (the photo is still a stock placeholder, noted in the markup), and the words swap every 1.7 s (`--motto-every`) instead of 2.8 s, so scrolling visitors notice it moves.

## 2026-09-30: E-learning and Course Platforms, the second product

- The owner wants a second product next to the Client Loop: done-for-you e-learning and course platforms on Kajabi, LearnWorlds and others on demand, sold as one closed package, and built inside the Loop when a client takes the whole path. Positioning and structure follow the reference the owner sent (a Kajabi specialist's page: "built the right way from the start", strategy before setup, what's inside, proof, one call to action), in Sansara's own words, not copied.
- Built at `/e-learning/` (`pages/course/`): hero with the platforms line, the three situations, "strategy before setup", the two ways (on its own / inside the Loop), the package with price ("one fixed price, agreed in writing"), timeline ("agreed on the call") and platforms, the five steps, proof (Pending: testimonial and case), FAQ, the closing band. Every call to action opens the lead form with "E-learning and Course Platforms" preselected (new option in the form). No delivery time and no package levels, on purpose (owner).
- The menu and the footer get an "E-learning" tab; the Services panel on Home gets the line "Building a course? See E-learning and Course Platforms". The hero image slot is Pending (a real platform we built, never stock) and hidden on phones until it exists.
- Flip cards: opening one closes the others (the owner saw several open at once on touch).
- Same evening (owner): the e-learning page goes on standby. `/e-learning/` shows the coming-soon message; the full page is kept as a draft in the lab (`/lab/e-learning/`, `pages/_lab/e-learning.html`, not in production builds). The menu and footer tab are removed; the Services-panel hint on Home stays.
