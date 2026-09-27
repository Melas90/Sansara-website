# Project brief for Claude Code – Sansara Media website

**Owner:** Christiane Valoskova (Sansara Media) · **Date:** 27 September 2026 · **Version:** 2
**How to use this file:** put it in the repo at `docs/CLAUDE_CODE_BRIEF.md` and start Claude Code from the repo root with: *"Read docs/CLAUDE_CODE_BRIEF.md and start with Step 1."*

> **This brief is the newest source of truth.** Older files in the repo (`PRD.md`, `CLAUDE.md`, `copy.md` files, `decisions.md`) were written when the site was planned in German. Where they conflict with this brief, this brief wins. Point out each conflict you find and update the older file.

---

## 0. Your role and how we work together

You are the front-end designer and developer on this project, working **with** the owner, not for a spec you guess at. Treat this as co-work.

### 0.1 Default language: English

- **Everything is in English by default:** all website copy, UI labels, form fields, error messages, URLs, file names, code comments, commit messages, docs and your questions to the owner.
- Copy that exists only in German (older files) is a source to translate, not text to ship. Translate it into natural English, mark it `pending approval`, and let the owner approve it.
- Build everything so a second language can be added later without rework (see §3.4), but don't build a second language unless the owner asks.

### 0.2 You must ask about design

This is the most important working rule. **The owner decides the design. You propose, she chooses.**

1. **Never add a design element on your own.** Anything not already specified in this brief (a new section, component, layout pattern, image style, icon set, illustration, decorative shape, color use, font treatment, animation or interaction) is proposed as a question first and only built after she answers.
2. **Actively suggest design ideas.** Asking isn't only about closing gaps. When you see a place where a design element could make the site better (e.g. "this section could use a before/after slider" or "the offer cards could flip"), propose it as a question with options. Keep a running list of such ideas in `docs/DESIGN_IDEAS.md` and bring 1–3 of them up at natural moments.
3. **Ask in rounds.** 3–5 questions per round, grouped by topic. Every question has 2–4 concrete options, a one-line description of what the visitor sees and feels, where on the site it would go, and your recommendation marked. Never a wall of 30 questions.
4. **Show, don't describe.** For anything judged by eye (animations, patterns, fonts, layouts, image styles), build a small live demo in the lab (§6.3) and let her compare options side by side before she decides.
5. **Write every decision down.** After each answer, add one dated line to `decisions.md` and update the relevant spec (`DESIGN_SPEC.md` or `MOTION_SPEC.md`). The next session must continue without re-asking.
6. **Start every working session** by listing open design questions relevant to the task you're about to do, and ask them before building.

### 0.3 Other working rules

- **Never invent** numbers, testimonials, client names, logos, prices, delivery times or guarantees. Missing content gets a visible pending marker (§5).
- **Talk plainly.** The owner is a marketer, not a developer. Explain choices by what the visitor will see and feel, not by technical terms.

---

## 1. The business in one page

**Sansara Media** is a small digital studio. It speaks as **"we"** and addresses visitors as **"you"**.

**Audience:** small businesses and solopreneurs who are good at their core work and don't want to spend their time on marketing. (Which markets the English site targets first is open decision #13.)

**Positioning:** *We are the expert partner who takes digital marketing off your plate, so you can focus on your core business.*

**Three offers, separated by who takes responsibility** (think of a manufacturer):

| Offer | Page | Manufacturing analogy | Client brings | We own |
|---|---|---|---|---|
| **The System** (flagship; final name open) | `/system` | Design & build (turnkey) | A problem ("I need clients to book") | The whole solution, end to end: ad → page → follow-up → booking, until it runs |
| **Consulting** | `/consulting` | The consulting engineer | Their own team and time | The direction. Programs: Kickstarter → Growth → Scale |
| **Services** (done for you) | `/services` | Build to print | A clear brief ("I need a website") | Executing it well. Areas: Web Design · Branding & Graphic Design · Funnel & Email Marketing · E-Learning & Online Courses |

**The homepage is the brand's front door, not a sales page for one offer.** It introduces Sansara Media and gives a clear, well-branded overview of everything we do, with the three offers presented **side by side, as equals**. The deep selling (leaks, flow diagram, pricing, case study, fit list) happens on each offer's own page, never on Home. See §2.3.

A helper line can guide undecided visitors (working copy, pending approval): *"Not sure which fits? Ask yourself: do you know what you need?"* → know exactly what you need: Services · just want it to work: The System · want to do it yourself with an expert by your side: Consulting.

**Promise boundary:** we promise that things are built, connected, tested, working and in the client's name. Never a number of bookings, leads or revenue.

**Not on the website:** digital products (courses, templates). They are sold through email funnels only.

**Main goal of every page:** lead to `/book-a-call` ("Book a free call", working label). The contact form (§2.4) is the lighter alternative.

---

## 2. Site architecture

### 2.1 Page tree

```
/                      Home
/system                The System (flagship)
/consulting            Consulting – one page, 3 programs as a path
/services              Services – one page, one card per area
/about                 About                            (phase 2)
/blog                  Blog archive                     (phase 2)
/blog/[slug]           Blog post                        (phase 2)
/book-a-call           Booking page (calendar + short form)
/book-a-call/thanks    Booking confirmation
/contact/thanks        Contact form confirmation
/newsletter/thanks     Newsletter confirmation
/legal-notice          Legal notice / imprint (footer only)
/privacy               Privacy policy (footer only)
/404
```

URLs: lowercase English words, hyphens, no dates. They stay stable even if an offer gets a new name.

### 2.2 Navigation

- **Header:** Logo · The System · Consulting · Services · About · Blog · **[Book a free call]** (the only filled button)
- **Mobile:** logo · burger · booking button stays visible
- **Footer, 4 columns:** Offers (the 3 offers) · Studio (About, Blog, Book a call, Contact → `/#contact`) · Legal (Legal notice, Privacy) · Newsletter (field + consent + social icons)

### 2.3 Page sections

**Home – a real brand homepage.** It must feel like the home of a studio, not like a funnel landing page. No offer dominates it.

1. **Hero** – who we are and the feeling we give (headline + rotating line + subtext + 2 buttons: "Book a free call" / "See what we do" → `#what-we-do`). About Sansara as a studio, not about one offer.
2. **Statement** – 1–2 lines: we take marketing off your plate so you can focus on your core business.
3. **What We Do** (`id="what-we-do"`) – **the core of the homepage: a branded overview of all our offers, the three shown as equals** (same size, same weight, same structure):
   - **The System** – *"A complete system, fully built for you and handed over, yours to keep."* We design and build the whole thing (ad → page → follow-up → booking), take end-to-end responsibility until it runs, then hand it over. → `/system`
   - **Done-for-You Services** – *"You know what you need, we build it."* Show the four areas inside this block: Web Design · Branding & Graphic Design · Funnel & Email Marketing · E-Learning & Online Courses. → `/services`
   - **Consulting** – *"You build it, we guide you."* Kickstarter → Growth → Scale. → `/consulting`
   - Per offer: name, one-line promise, 3–4 things it includes, who it's for in one line, link "Explore →". (All lines are working copy, pending approval.)
   - Under the three: the helper line from §1 for undecided visitors, linking to `#contact`.
   - The visual form of this overview (three cards, tabs, large alternating rows, bento grid, flip cards…) is **the owner's choice**: ask it as the first question of the design interview (§6.2, Round 1) and show options in the lab.
4. **How We Work** – 4 steps valid for every offer: Intro call → Plan → Build → Launch & improve.
5. **Why Sansara** – 4 points: end-to-end responsibility · everything in your name · one fixed contact person · no jargon.
6. **The People Behind Sansara** – founders (§2.5).
7. **Proof** – testimonial(s).
8. **Blog teaser** – hidden until ≥ 3 posts.
9. **FAQ** – general questions (cost ranges, timelines, which offer fits, ownership of accounts), not offer-specific.
10. **Contact** – final CTA + contact form (§2.4).
11. Newsletter + Footer.

**Not on Home:** the 4 leaks, the System flow diagram, pricing cards, the case study in full, fit/not-fit lists, "you're inside one right now". Those belong to `/system`.

**The System:** Hero → "You're inside one right now" (the page is a live demo) → short testimonial → the 4 leaks → the 4 steps (animated flow diagram) → case study → Why Sansara → Is it a fit? (fit / not a fit) → Process → Pricing → FAQ → Final CTA
Source: `funnels/system-lp-en/index.html` is already in English; adapt it, don't rewrite from scratch.

**Consulting:** Hero → Who it's for → Kickstarter → Growth → Scale (as a connected path) → What a session looks like → "Not sure what fits?" (links to the other two offers) → FAQ → Final CTA

**Services:** Hero → service cards → How a project runs → "Want a whole system instead?" (link to `/system`) → FAQ → Final CTA

Don't use Kickstarter / Growth / Scale anywhere outside the Consulting context.

### 2.4 Contact section with form (Home, last section before the footer)

**Purpose:** the minimum way for a visitor to reach us without booking a calendar slot. It complements `/book-a-call`, it doesn't replace it.

**Layout:**
- Warm gradient band (`--grad-warm`), `id="contact"`.
- Headline: **"Ready to scale your digital business?"** (working; ask the owner to pick from 2–3 alternatives).
- Supporting line, e.g. *"Tell us briefly what you need – we'll get back to you within [X] working days."* (⚠️ response time must be real).
- Primary button **"Let's talk"** (label open). Clicking it **opens the form**: the form panel rises in from below inside the band with the signature animation (desktop and mobile). Focus moves to the first field; Escape or a close button collapses it.
- Secondary text link under the button: "Prefer to pick a time? → Book a call" (`/book-a-call`).
- A "Contact" link in the footer scrolls to `#contact` and opens the form.
- **Without JavaScript the form is simply visible** (never lock the only contact path behind a script).
- Exact visual treatment of the band and panel: ask in the design interview (§6.2, Round 1).

**Form fields:**
| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Email | email | yes |
| Company / website | text | no |
| What can we help with? | select: The System · Consulting · Services · I'm not sure yet | yes |
| Message | textarea, 4 rows | yes |
| Privacy | checkbox: "I've read the privacy policy and agree that my details are stored so you can contact me." (link to `/privacy`) | yes |

Submit button: **"Send message"**. The select value is submitted so we know which offer the lead belongs to.

**States:** inline validation when leaving a field (message next to the field) · sending state on the button · success state that replaces the form with a short thank-you and a checkmark animation, or a redirect to `/contact/thanks` · error state with a fallback email address.

**Technical: Netlify Forms** (see open decision #10 about hosting):
- `<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact/thanks">`
- Hidden `<input type="hidden" name="form-name" value="contact">` and a hidden honeypot field `bot-field`.
- Every field has a `name`; the form exists in the static HTML (Netlify detects forms at deploy time, not in JS-rendered markup).
- For the inline success state, submit with `fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams(new FormData(form))})`.
- Email notifications are set up by the owner in the Netlify dashboard. Don't put her email address in the code.

### 2.5 Founders section ("The People Behind Sansara")

**Purpose:** the studio speaks as "we", so visitors must see who "we" is. A real face is one of the strongest trust signals a small studio has.

- Placement: on Home after "Why Sansara", before Proof. Reused in longer form on `/about` later.
- Per person: portrait photo, name, role, a 2–3 sentence bio, one personal detail, optional LinkedIn link.
- Layout adapts to the number of people: 1 person = large portrait left, text right · 2 people = portraits side by side · 3+ = cards. Final layout and photo style: ask in the design interview (§6.2, Round 1).
- Closing link: "More about us → /about" (phase 2) or to `#contact`.
- ⚠️ Names, roles, bios and photos come only from the owner. Only real people who work on client projects appear here. Until then: pending markers and a neutral placeholder frame, never stock photos.

---

## 3. Branding

### 3.1 Colors

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FCFAF4` | Page background (cream) |
| `--card` | `#F7F2E8` | Alternate section, muted card |
| `--peach` | `#FBE7D3` | Soft highlight card |
| `--white` | `#FFFFFF` | Cards, inputs |
| `--ink` | `#2A1E14` | Headings, primary button, dark bands |
| `--ink-2` | `#3E2A19` | Dark gradient partner |
| `--brown` | `#5B4A3B` | Body text |
| `--brown-2` | `#8C6A47` | Secondary text, labels |
| `--orange` | `#EE8B5E` | The only accent: icons, arrows, highlights |
| `--orange-dk` | `#B65A2E` | Accent **text** on light backgrounds (contrast), hover |
| `--line` | `rgba(42,30,20,.12)` | Borders |

**Gradients:** warm wash `linear-gradient(120deg,#FDEEDF 0%,#F9DCC2 55%,#F2B98C 120%)` (final CTA / contact band) · dark `linear-gradient(135deg,#2A1E14,#3E2A19)` (case study, proof) · orange `linear-gradient(160deg,#EE8B5E,#D8703F)` (small accents only).

**Rule:** orange is never used for body text on cream. Use `--orange-dk` for accent text.

### 3.2 Typography

- **Hanken Grotesk** (variable, weight 100–900): headlines 700, body 400, labels 700 uppercase with wide letter-spacing.
- **Newsreader** (variable, weight and optical size, with italics): the emotional half of a headline in italic, quotes, card titles.
- Sizes: H1 `clamp(40px,6vw,72px)` · H2 `clamp(34px,4.6vw,50px)` · lead 19px · body 16px / 1.6 · label 12px, letter-spacing .28em.
- Both are variable fonts, which makes "dynamic font" effects possible (§6.2, Round 4).

### 3.3 Shape, space, signature

- Buttons and badges: pill (`border-radius:100px`). Primary button: dark pill with a round orange arrow badge.
- Cards: 20–28px radius. Bands: 32px radius.
- Max width 1200px, side padding 56px (28px ≤ 980px), section padding 96px (72px ≤ 980px).
- Signature elements: italic serif word inside headlines · dark pill button with orange arrow · warm gradient band before the footer · the "rise through a mask" motion (§6.1).

### 3.4 Voice and language

- English, "we" for the studio, "you" for the visitor. Warm, direct, plain, like an experienced partner across the table.
- Outcomes over features. No hype words ("revolutionary", "explode", "guaranteed"), no exclamation marks in headlines, no jargon without a one-sentence explanation (e.g. explain "funnel" once).
- British or American spelling: open decision #14. Until decided, use American and keep it consistent.
- **Ready for a second language later:** `<html lang="en">` on every page, all text only in `copy.md` (so a `copy.de.md` can be added), no text baked into images, and room in the header for a future language switch. Don't build it now.

### 3.5 Copy status

- **Hero subtext** (translated from the approved German version, ⚠️ pending approval in English): *"More clients, more visibility, less effort – we take care of your online presence so you don't have to. With years of experience in web, branding and marketing, we're the reliable partner at your side – [ending open]"*
- **Primary CTA:** "Book a free call" (working).
- **Hero headline and the three rotating phrases:** still open. Candidates discussed: "Let's grow your business…", "Unlock Your Growth"; the "Marketing that feels easy" direction was liked.

---

## 4. The layers (keep them separate)

The site is built in five layers. Each has one home, and nothing is duplicated between them.

| # | Layer | What it holds | Lives in | Rule |
|---|---|---|---|---|
| 1 | **Brand** | Colors, fonts, spacing, radius, motion tokens | `brand/tokens.css` (+ `design-system.md`) | The only place with hex values and durations |
| 2 | **Content** | Every word on every page | `pages/<page>/copy.md` | Words are only ever edited here |
| 3 | **Structure** | Page HTML, sections, reusable components | `pages/<page>/<page>.html`, `pages/_partials/` | Section ids match copy.md headings (`## Hero` ↔ `<section id="hero">`) |
| 4 | **Motion** | All animation and interaction | `pages/_assets/motion.css`, `pages/_assets/motion.js` | Uses only the motion tokens; no animation library unless the owner approves one |
| 5 | **Production** | The live site: this repo deployed on Netlify **or** a WordPress/Elementor rebuild (decision #10) | Depends on #10 | Built from layers 1–4 |

### Repo structure

```
sansara-website/
├── CLAUDE.md
├── decisions.md
├── docs/
│   ├── CLAUDE_CODE_BRIEF.md     ← this file
│   ├── PRD.md                   ← older, partly German; this brief wins
│   ├── DESIGN_SPEC.md           ← you create it from the design interview
│   ├── MOTION_SPEC.md           ← you create it from the design interview
│   └── DESIGN_IDEAS.md          ← your running list of ideas to propose
├── brand/
│   ├── tokens.css
│   ├── design-system.md
│   ├── voice.md
│   └── positioning.md
├── pages/
│   ├── _assets/    motion.css · motion.js · icons/ · images/
│   ├── _partials/  header.html · footer.html · contact.html
│   ├── _lab/       design-lab.html   ← playground for design and motion options (§6.3)
│   ├── home/       copy.md · home.html
│   ├── system/     copy.md · system.html
│   ├── consulting/ copy.md · consulting.html
│   ├── services/   copy.md · services.html
│   ├── booking/    copy.md · booking.html
│   ├── about/      copy.md             (phase 2)
│   ├── blog/                           (phase 2)
│   └── legal/
├── funnels/system-lp-en/        ← existing English landing page of the System
└── references/                  ← screenshots, old prototype
```

---

## 5. Hard rules

1. **Ask about design before adding it** (§0.2).
2. **English by default** (§0.1).
3. No invented facts. Unknown content = `<!-- ⚠️ PENDING: what is needed -->` + visible `<span class="pend">Pending</span>`. List every pending item at the end of your task.
4. No result promises (bookings, revenue, leads).
5. No file copies (`home_v2.html`). Git keeps history; experiments go on a branch.
6. No hardcoded colors, fonts or durations in pages: use the tokens.
7. Plain HTML, CSS and small vanilla JS. No frameworks. No Tailwind (it overrides our design system).
8. Mobile-first and tested at 375px, 768px, 1024px, 1440px.
9. Accessibility floor: body contrast ≥ 4.5:1, visible focus states, meaningful `alt` text, keyboard access for everything clickable, `prefers-reduced-motion` respected.
10. Performance: Lighthouse mobile ≥ 85, no layout shift from animations (CLS < 0.1), hero text visible immediately.
11. If the `ui-ux-pro-max` skill is installed: use it only for UX guidelines, accessibility checks and its pre-delivery checklist. Never use its generated colors, fonts or styles.
12. Commit messages in English: `area: what changed` (e.g. `lab: add flip card variants`).

---

## 6. Design and motion

### 6.1 Already decided

| Topic | Decision |
|---|---|
| Motion level | **Expressive.** Motion is part of the brand, but the rhythm stays soft: nothing bouncy, flashy or looping fast. |
| Signature move | **"Rise through a mask":** text and images slide up from behind an invisible edge. Used for the hero headline, every H2, the rotating line and images. |
| Rotating hero line | **Slide up:** current phrase exits upward, the next rises in from below, every ~2.8s. |
| Every section | Gets an entrance animation, played once per page view. |
| Rolling images | **Testimonial carousel only.** It becomes a carousel at ≥ 3 approved testimonials; until then it shows one quote without arrows or dots. |
| Starting tokens | `--ease: cubic-bezier(.22,1,.36,1)` · fast 200ms · base 550ms · slow 900ms · rise 40px (mobile 20px) · stagger 110ms (mobile 70ms) |
| Limits | Only `transform` and `opacity` animated; no scroll-jacking; no text hidden longer than a moment; everything off under reduced motion. |

### 6.2 The design interview (your first real task)

The owner decides which design elements and effects the site uses. Run this as an interview, in rounds, **before** building pages. Follow §0.2: options, what the visitor experiences, where it goes, your recommendation, then a demo in the lab.

**Round 1 – Visual style and layout**
- **Home overview "What We Do" (ask this first):** how the three equal offers are shown: three cards side by side · tabs (one offer visible at a time) · large alternating rows with a visual each · bento grid with the four service areas as small tiles · flip cards (front = promise, back = what's included). Also: should the overview carry an icon/illustration per offer, and should the helper question be visible or subtle.
- **Imagery:** real photography of the team and work · illustrations (which style?) · 3D renders (like the infinity shape in her original hero template) · abstract shapes and gradients only · a mix.
- **Hero visual:** static 3D render · slowly floating/rotating render · animated SVG line drawing · Lottie animation · photo · no visual, type only.
- **Icons:** line icons · filled icons · hand-drawn · no icons, numbers and type instead. Which icon set.
- **Section layouts:** centered and airy · asymmetric/editorial (text left, visual offset right) · bento grid (tiles of different sizes) · mixed per section.
- **Founders section and contact band:** layout options from §2.4 and §2.5, and photo style (background, color vs. black and white, framing).

**Round 2 – Cards and blocks**
- **Flip cards:** should any cards turn over on hover/tap to show a back side? Candidates: the 3 offer cards on Home (front = the visitor's situation, back = the offer and what they get), the service cards, the 4 process steps. Options: 3D flip · back side slides up · no flip, just a lift. On phones a flip needs a tap, and the back content must also be accessible without flipping.
- **Card hover:** lift + shadow · tilt towards the cursor (3D) · glow following the cursor · image zoom inside the card.
- **Stacking cards:** process or System steps stack on top of each other while scrolling (sticky stacked cards) · no.
- **Expanding cards:** cards that grow to show details (e.g. services) · no.

**Round 3 – Backgrounds and patterns**
- **Moving patterns:** slow gradient mesh (warm peach blobs) · animated flowing lines/waves · subtle grain texture · dotted grid that reacts to the cursor · none.
- **Where:** hero only · hero + contact band · subtle on every section divider.
- **Section transitions:** background color fades between sections as you scroll · curved/organic section edges · straight edges.

**Round 4 – Typography and text**
- **Dynamic fonts** (both are variable): headline weight grows as it scrolls into view · weight/italic shifts on hover · serif word morphs from upright to italic · none.
- **Text reveal for statements:** line-by-line mask (our signature) · word-by-word fade · "reading highlight" (words go from light to dark ink as you scroll).
- **Big type moments:** an oversized marquee line scrolling across a section (e.g. "Web Design · Branding · Funnels · Email · E-Learning") · counters that count up (only with real numbers) · none.

**Round 5 – Scroll and storytelling**
- **Scroll-drawn lines:** an orange line drawing itself along the process steps and the Consulting path · no. Thickness and style.
- **System flow diagram** (Ad → Page → Follow-up → Booking): a signal travelling through the 4 boxes · boxes light up one by one · chat bubbles type in and a booking confirmation pops up · combined.
- **Parallax:** images and shapes move at different speeds (desktop only) · none.
- **Pinned sections:** a section stays fixed while its content changes (e.g. horizontal scroll through the offers). Warn that it's the most fragile effect on mobile.

**Round 6 – Interaction details**
- **Buttons:** arrow slides right (baseline) · plus magnetic pull towards the cursor · fill sweep on hover.
- **Cursor:** normal (recommended for a business audience) · small custom dot that grows over links · a "View" label over cards.
- **Links and nav:** underline grows from left · highlight slides between nav items · header hides on scroll down, returns on scroll up.
- **Page transitions:** soft fade · curtain wipe in the brand color · none.
- **Loading:** no loader (recommended, speed) · short logo reveal on the first visit only.

**Round 7 – Mobile and dosage**
- Which effects stay on phones, which get simplified, which switch off.
- Intensity check after seeing the lab: does it feel "expressive and premium" or "busy"? Adjust together.

After the interview, keep proposing ideas from `DESIGN_IDEAS.md` whenever you work on a section (§0.2 point 2).

### 6.3 The design lab

Build `pages/_lab/design-lab.html` early: one playground page where every option under discussion sits in its own labeled block, 2–3 variants side by side, using the real brand tokens, fonts and sample copy.

- Control bar: replay animations, speed (0.5× / 1× / 1.5×), reduced-motion toggle, mobile-width preview.
- Each block shows: name, where it would be used, production route (§6.4), and a "chosen / rejected / maybe" label you update after her answer.
- The lab is for deciding, not for shipping. Once an option is chosen, move it into the real components and styles.

### 6.4 Every option needs a production route

State for each design or motion option how it will be built on the live site. If decision #10 is Netlify, the prototype code is the live code. If it's WordPress/Elementor, it must be rebuildable there:

| Route | Meaning (Elementor case) | Examples |
|---|---|---|
| **Native** | Built-in Elementor (Free or Pro) | Entrance animations, Flip Box, Animated Headline, scrolling effects, sticky header, carousel, accordion |
| **Custom CSS** | A class plus CSS | Mask reveal, variable-font shift, card tilt, gradient mesh, underline grow |
| **Custom JS** | A small script via a snippet | Scroll-drawn line, reading highlight, cursor effects, magnetic buttons |
| **Asset** | A file we produce and embed | Lottie, animated SVG, video loop, 3D render |

Flag anything that needs Elementor Pro or would be hard to maintain for a non-developer.

### 6.5 Outputs of the interview

- `docs/DESIGN_SPEC.md`: chosen visual decisions (imagery, icons, layouts, components) per page section.
- `docs/MOTION_SPEC.md`: one table per page section: section · effect · trigger (load / scroll / hover / tap) · duration and delay (tokens) · mobile behavior · reduced-motion behavior · production route · status.
- Both list rejected options with the reason, so they don't come back.

---

## 7. Work plan

Do these in order. Finish one step, show the result, commit, then continue.

**Step 1 – Orientation (no code)**
Read this brief, `CLAUDE.md`, `decisions.md` and `docs/PRD.md` if present. Check the repo matches §4. Report in 5–10 lines: what exists, what's missing, and every place where older files are German or conflict with this brief. Create missing folders and empty spec files.

**Step 2 – Update the older files**
Update `CLAUDE.md`, `decisions.md` and the `copy.md` files to this brief: English, new URLs, new section names. German copy becomes an English translation marked `pending approval`. Show the owner the list of translated lines to approve.

**Step 3 – Foundation**
Make sure `brand/tokens.css` contains every token from §3 and §6.1. Create `motion.css` and `motion.js` with the decided baseline only: section reveal, stagger, mask reveal, rotating slide-up line, button arrow, reduced motion. Build the header, footer and contact partials.

**Step 4 – Design interview**
Run §6.2 round by round and build the lab alongside. Don't build page sections whose design is still open, unless the owner says so.

**Step 5 – Home prototype**
Build `pages/home/home.html` with the decided design, including the founders section (§2.5) and the contact section with the Netlify form (§2.4). Pending markers wherever copy is missing.

**Step 6 – Offer pages**
`system.html` (adapt `funnels/system-lp-en/`), `consulting.html`, `services.html`, then `booking.html`. Ask the design questions specific to each page before building it.

**Step 7 – QA**
Test each page at 375 / 768 / 1024 / 1440px, keyboard only, and with reduced motion on. Run Lighthouse. Test the contact form end to end. List remaining pending items.

**Step 8 – Go live**
Depends on #10: either set up Netlify deployment from GitHub (write `docs/DEPLOY.md`), or write `docs/ELEMENTOR_BUILD.md` with widgets, custom CSS and snippets per page.

---

## 8. Open decisions (don't decide these yourself)

| # | Question |
|---|---|
| 1 | Final name of "The System" |
| 2 | Is The System for all small businesses, or a niche product for wellness / coaches / retreats? |
| 3 | Merge Funnel + Email Marketing into one service card? |
| 4 | Final hero headline, 3 rotating phrases, subtext ending |
| 5 | Consulting: format, duration and price per program |
| 6 | The System: price, delivery time, spots per month, any guarantee that can always be kept |
| 7 | Written approval + numbers from Vero & Rafa (Terapias El Templo), and English translation of their quote |
| 8 | Newsletter lead magnet |
| 9 | Everything in the design interview (§6.2) |
| 10 | **Hosting:** is this repo deployed on Netlify, or rebuilt in WordPress/Elementor? Netlify Forms only work on a Netlify-hosted site |
| 11 | Contact section: final headline, button label, real response time |
| 12 | Founders: who appears, names, roles, bios, photos |
| 13 | Target market of the English site (international, Spain/Canary Islands, DACH in English…) and whether a German version comes later |
| 14 | British or American spelling |

**About #10.** Netlify Forms only work when the page itself is served by Netlify.
- **A) Netlify:** this repo becomes the live site. GitHub push → Netlify publishes automatically. The form works out of the box, and the design is exactly what we prototype. Trade-off: text changes happen in the repo (with Claude Code), not in a visual editor; the blog needs a solution later.
- **B) WordPress/Elementor:** use Elementor Pro's Form widget with the same fields and states.
Until decided, build the form for A and note the B equivalent.

When a task depends on one of these, build with a pending marker and ask, don't guess.

---

## 9. Definition of done (per page)

- [ ] Every design element on the page was approved by the owner
- [ ] All copy in English, from `copy.md`; no invented content
- [ ] Only tokens used; no stray hex values or durations
- [ ] Every section has its decided animation, and nothing more
- [ ] Works at 375px with no horizontal scroll; tap targets ≥ 44px
- [ ] Keyboard and screen reader usable; reduced motion respected
- [ ] Lighthouse mobile ≥ 85, CLS < 0.1
- [ ] Production route documented for every effect
- [ ] Contact form tested end to end: required fields, consent, honeypot, success and error states, notification email received
- [ ] Pending items listed; decisions logged; committed
