/**
 * Site-wide settings for the build. One place for anything a page or partial
 * should not hardcode. Open decisions from the brief (§8) stay as PENDING here.
 */
export const site = {
  name: 'Sansara Media',
  /** Production origin, no trailing slash. PENDING: decision #10 and the domain. */
  url: 'https://PENDING.sansara-media.com',
  /** Languages built. Only English until the owner asks for a second one (§3.4). */
  languages: ['en'],
  defaultLanguage: 'en',
  /** Routes that are planned (phase 2) but not built. Links to them are reported, not failed. */
  plannedRoutes: ['/about/', '/blog/'],
};

/**
 * Which page folder becomes which route. A page can also declare its route with
 * `<!-- @route /path/ -->` on its first line; this map is the fallback.
 */
export const routes = {
  home: '/',
  system: '/system/',
  consulting: '/consulting/',
  services: '/services/',
  booking: '/book-a-call/',
  'booking-thanks': '/book-a-call/thanks/',
  'contact-thanks': '/contact/thanks/',
  'newsletter-thanks': '/newsletter/thanks/',
  'legal-notice': '/legal-notice/',
  privacy: '/privacy/',
  '404': '/404.html',
  'design-lab': '/lab/',
};
