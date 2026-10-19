# Shared copy: header, footer, contact section, helper line

<!-- Every word used by the partials lives here. Lines marked "working" are from the brief and wait for the owner's approval. A value starting with PENDING renders as a visible Pending marker. -->

## Nav

skip: Skip to content
home: Sansara Media, home
menu: Menu
close: Close
main_label: Main
system: The System
consulting: Consulting
services: Services
elearning: E-learning
content: Content and Social Media
about: About
blog: Blog
book: Book a free call

## Footer

offers_title: Offers
studio_title: Studio
legal_title: Legal
newsletter_title: Newsletter
about: About
blog: Blog
book: Book a call
contact: Contact
legal_notice: Imprint
privacy: Privacy policy
newsletter_text: Practical notes on marketing that works, now and then. No spam.
newsletter_label: Your email address
newsletter_placeholder: you@example.com
newsletter_button: Subscribe
newsletter_consent: I'd like to receive the newsletter and agree to the [privacy policy](/privacy/). Unsubscribe any time.
rights: All rights reserved.
tagline: We take digital marketing off your plate, so you can focus on your core business.

## Contact

<!-- working: headline candidates for decision #11; the first is the current default -->
label: Contact
headline: Ready to scale your *digital business*?
headline_alternatives:
- Ready to take marketing *off your plate*?
- Tell us what you need. We'll take it *from there*.
line: Tell us briefly what you need and we'll get back to you.
response_time: We reply within two working days.
open_button: Let's talk
book_prefix: Prefer to pick a time?
book_link: Book a call
close: Close the form

### form

title: Send us a message
name: Name
email: Email
company: Company or website
optional: Optional
topic: What can we help with?
topic_placeholder: Choose one
topic_options:
- The System
- E-learning and Course Platforms
- Consulting
- Services
- I'm not sure yet
message: Message
privacy: I've read the [privacy policy](/privacy/) and agree that my details are stored so you can contact me.
submit: Send message
sending: Sending
success_title: Thank you. Your message is on its way.
success_text: We'll reply by email. If you'd rather talk sooner, you can also book a call.
error_title: That didn't go through.
error_text: Please try again in a moment, or email us directly at
error_email: info@sansara-media.com
required: Please fill in this field.
invalid_reach: Please enter an email address or a phone number.
consent_needed: Please tick the box so we're allowed to contact you.

## Lead

<!-- Owner request 2026-09-27: a pop-up where visitors leave their details and we get back to them. It opens from buttons along the page and a floating button, never on its own. Saved as the Netlify form "lead", to be connected to the CRM later. -->
float: Get in touch
title: Let's *talk*
intro: Before you book your call, we need a few details. You'll get the booking link right after.
name: Your name
email: Email
whatsapp: WhatsApp
contact_hint: One or both, whichever you prefer.
whatsapp_hint: Start with your country code, like +44 7123 456789.
need_contact: Please give us an email or a WhatsApp number.
invalid_whatsapp: Please check the number, with its country code, like +44 7123 456789.
need_country_code: Please add your country code at the start, like +44 7123 456789.
interest: What are you interested in?
interest_placeholder: Choose one
interest_options:
- The System
- E-learning and Course Platforms
- Done-for-You Services
- Content and Social Media
- Consulting
- I'm not sure yet
privacy: I've read the [privacy policy](/privacy/) and agree that my details are stored so you can contact me.
submit: Get back to me
sending: Sending
close: Close
success_title: Thank you. We'll be in touch.
success_text: We have your details. Want to pick a time for your free call right now?
<!-- Owner 2026-10-02: "Book your call" opens WhatsApp for now (no booking calendar yet). Number in international format, digits only, no + (e.g. 34600123456). {name} is replaced with the name from the form. -->
book_button: Book your call
whatsapp_number: 34611017148
<!-- 2026-10-19 (owner): people book the call on Calendly (after the Client Loop Check and after this form), and can still write on WhatsApp. Without a link here, WhatsApp becomes the main button again. -->
calendar_url: https://calendly.com/sansara-media/business-strategy-call
whatsapp_alt: Questions first? Write to us on WhatsApp
whatsapp_message: Hi Sansara, I'm {name}. I just left my details on your website and I'd like to book my free call.
error_title: That didn't go through.
error_text: Please try again in a moment.
required: Please fill in this field.
invalid_email: Please enter an email address we can reply to.
consent_needed: Please tick the box so we're allowed to contact you.
ask: Ask about this offer
nudge: Not sure where to start?
nudge_button: Leave your details

## Helper

<!-- working, from the brief §1 -->
question: Three ways to *work with us* on your project.
hint: Flip to see
<!-- 2026-10-11 (owner): the cards are their own section with a "Click to discover" button; the hint above is no longer shown on the home. Working copy. -->
discover: Click to discover
<!-- 2026-09-30 (owner): flip cards. Front: the visitor's situation as a question. Back: the offer and when it is the right one. Consulting's back in the owner's words. -->
options:
- situation: Do you know exactly what you need?
  offer: Services
  answer: You bring a clear brief and we build it: web, branding, funnels and email, e-learning, automations. Fixed scope, fixed price.
  link: /services/
  explore: Explore Services
- situation: Do you just want it to work?
  offer: The System
  answer: We build the whole loop, from the ad to the booking and the follow-up, in your name, and hand it over running.
  link: /system/
  explore: Explore The System
- situation: Tried many things and nothing seems to work?
  offer: Consulting
  answer: You want some guidance. First we draw the strategy together; the implementation can come later, with us or without us.
  link: /consulting/
  explore: Explore Consulting
still_unsure: Still not sure? Tell us where you are
still_unsure_link: /#contact

## Thanks

<!-- confirmation pages -->
contact_title: Thank you. Your message is on its way.
contact_text: We'll reply by email. If you'd rather talk sooner, you can also book a call.
newsletter_title: You're on the list.
newsletter_text: Please check your inbox for a confirmation email.
booking_title: Your call is booked.
booking_text: You'll get a calendar invitation by email. Nothing to prepare.
home_link: Back to the home page

## LP

<!-- Slim header and footer of the standalone landing pages (/client-loop/). From the owner's landing page. -->
header_button: Get my free call
footer_line: We build the thing that brings clients in, so you don't have to chase them.
footer_site: Visit the full site

## People

founders_alt: Christiane and Miguel, the two founders of Sansara Media, in their studio

## Values

<!-- 2026-10-17 (owner): Sansara Media's five core values, in the owner's words (from the partner programme work). One list for the whole site: the home shows it in full; About and The System should read it from here too, instead of their own lists. The "in practice" line carries the weight. -->
title: Values that change *how we work*.
lead: Anyone can write values on a website. These are the ones that decide what we do, and what we say no to.
items:
- title: Clarity before complexity
  icon: clarity
  text: We understand the business before recommending a solution. We challenge assumptions, identify the real bottleneck, and prioritise what matters instead of adding unnecessary tools, campaigns, or processes.
  practice: Diagnose first, recommend second.
- title: Honesty over hype
  icon: honesty
  text: We communicate openly about what is realistic, what is uncertain, and what results depend on. We don't promise guaranteed growth or sell services simply because we can.
  practice: Transparent pricing, realistic expectations, and honest advice, even when the best answer is not to buy from us.
- title: Strategy that becomes reality
  icon: reality
  text: Good advice is only valuable when it can be put into practice. We bridge the gap between knowing what should change and actually making it happen, combining strategic thinking with hands-on implementation.
  practice: Recommendations are actionable, responsibilities are clear, and implementation is part of the conversation.
- title: Partnership built on trust
  icon: trust
  text: We treat clients and collaborators as long-term partners, not transactions. We respect their expertise, protect their reputation, communicate openly, and aim to make every relationship better for everyone involved.
  practice: Clear boundaries, confidentiality, mutual respect, and no surprises.
- title: Progress through evidence
  icon: evidence
  text: We focus on meaningful business outcomes, measure what matters, learn from what happens, and continuously improve. We value evidence over assumptions and progress over appearances.
  practice: Define success upfront, track relevant metrics, and adjust based on results.
