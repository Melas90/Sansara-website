/**
 * Site-wide settings. Every open decision in BRIEF.md §9 is one line here.
 *
 * Anything still containing the word PLACEHOLDER is listed in README.md under
 * "Before launch" and is caught by `npm run check:launch`.
 */

export const locales = ['en', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

/** Flip the default language here. The default locale is served without a prefix. */
export const defaultLocale: Locale = 'en';

/** How each language names itself in the language switch. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  en: 'en_GB',
  es: 'es_ES',
  de: 'de_DE',
};

export const site = {
  name: 'Sansara Media',
  /** Production origin, no trailing slash. PLACEHOLDER until the domain is decided. */
  url: 'https://PLACEHOLDER.sansara-media.com',
  /** Paid-traffic landing for the free-call offer. Stays live next to this site. */
  landingUrl: 'https://business.sansara-media.com',

  /** Cal.com booking link, embedded on /empezar. */
  bookingUrl: 'https://cal.com/PLACEHOLDER/free-call',

  /** Digits only, with country code, as wa.me expects. The prefilled message lives in i18n. */
  whatsappNumber: 'PLACEHOLDER',

  email: 'info@sansara-media.com',

  /** Browser chrome colour. Meta tags cannot read CSS variables: keep equal to --sm-linen. */
  themeColor: '#fcfaf4',

  /** Meta Pixel ID. Empty = the pixel never loads, even after consent. */
  metaPixelId: '',

  /** Only entries with a URL are rendered in the footer. */
  socials: [
    { name: 'Instagram', url: '' },
    { name: 'LinkedIn', url: '' },
  ],
} as const;
