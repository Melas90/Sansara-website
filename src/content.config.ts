/**
 * Content collections. Adding a service, product, case, FAQ entry or testimonial
 * means adding one Markdown file per locale; index pages, nav and sitemap follow.
 *
 * File naming: src/content/<collection>/<locale>/<slug>.md
 * (Astro reads collection config from this file; BRIEF.md's content/config.ts
 * was the pre-v5 location. See DECISIONS.md.)
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales } from './config/site';

const locale = z.enum(locales);

/** Shared by everything that gets its own page. */
const page = {
  locale,
  /**
   * Same value across locales, so translations of one entry can find each other;
   * also the last part of the URL. Not called `slug`: Astro would use that as the
   * entry id and the three locales would overwrite each other.
   */
  key: z.string(),
  title: z.string(),
  /** One or two plain sentences. Used on index pages and as meta description. */
  summary: z.string().max(240),
  order: z.number().default(100),
  draft: z.boolean().default(false),
};

const priceModel = z.object({
  kind: z.enum(['fixed', 'from', 'monthly', 'on-call']),
  /** Free text so "[PENDIENTE]" is possible until the owner supplies figures. */
  amount: z.string().optional(),
  note: z.string().optional(),
});

const load = (name: string) => glob({ base: `./src/content/${name}`, pattern: '**/*.{md,mdx}' });

const services = defineCollection({
  loader: load('services'),
  schema: z.object({
    ...page,
    whatYouGet: z.array(z.string()).min(1),
    whoItsFor: z.string(),
    /** Who should not buy this. Part of the brand’s honesty, so it is required. */
    notFor: z.string(),
    /** What we need from the client, in one or two sentences. */
    yourPart: z.string(),
    price: priceModel,
    /** True for the modules the System is made of. */
    partOfSystem: z.boolean().default(true),
  }),
});

const products = defineCollection({
  loader: load('products'),
  schema: z.object({
    ...page,
    price: priceModel,
    /** External checkout link. There is no checkout on this site. */
    checkoutUrl: z.url(),
    includes: z.array(z.string()).min(1),
    leadsTo: z.string().optional(),
  }),
});

const cases = defineCollection({
  loader: load('cases'),
  schema: ({ image }) =>
    z.object({
      ...page,
      client: z.string(),
      sector: z.string(),
      location: z.string().optional(),
      /** Real numbers only. Use "[PENDIENTE]" as the value until supplied. */
      results: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      servicesUsed: z.array(z.string()).default([]),
    }),
});

const faq = defineCollection({
  loader: load('faq'),
  schema: z.object({
    locale,
    question: z.string(),
    /** Where this entry shows: 'home', 'sistema', or a service slug. */
    pages: z.array(z.string()).min(1),
    order: z.number().default(100),
  }),
});

const testimonials = defineCollection({
  loader: load('testimonials'),
  schema: ({ image }) =>
    z.object({
      locale,
      name: z.string(),
      role: z.string(),
      /** Link to the third-party source (Google review, LinkedIn) when there is one. */
      sourceUrl: z.url().optional(),
      photo: image().optional(),
      caseSlug: z.string().optional(),
      /** Where the words come from, shown under the name: "from a WhatsApp message after launch". */
      source: z.string().optional(),
      /** Set when the body is a translation, e.g. 'es'. The page then says so. */
      translatedFrom: locale.optional(),
      /**
       * Written permission from the person to publish name, business and words.
       * 'pending' shows on staging but makes `npm run check:launch` fail.
       */
      consent: z.enum(['confirmed', 'pending']),
      order: z.number().default(100),
    }),
});

export const collections = { services, products, cases, faq, testimonials };
