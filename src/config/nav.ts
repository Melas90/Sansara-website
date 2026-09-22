/**
 * Navigation. Labels come from i18n (`nav.<key>`), so this file never holds copy.
 *
 * `live` says whether the route has been built yet. A feature branch flips it to
 * true when its page ships, so the header and footer never link to a 404.
 * `flag` ties an item to a feature flag in features.ts.
 */
import { features, type FeatureFlag } from './features';

export interface NavItem {
  key: string;
  /** Path without locale prefix, with leading and trailing slash. */
  path: string;
  live: boolean;
  flag?: FeatureFlag;
}

/** Header: services (product + à la carte), the product itself, client work, about. */
export const mainNav: NavItem[] = [
  { key: 'servicios', path: '/servicios/', live: true },
  { key: 'sistema', path: '/sistema/', live: true },
  { key: 'productos', path: '/productos/', live: true, flag: 'products' },
  { key: 'casos', path: '/casos/', live: true },
  { key: 'sobre', path: '/sobre/', live: true },
];

/** Where the primary call to action points once /empezar exists. */
export const startRoute: NavItem = { key: 'empezar', path: '/empezar/', live: true };

export const legalNav: NavItem[] = [
  { key: 'avisoLegal', path: '/aviso-legal/', live: true },
  { key: 'privacidad', path: '/privacidad/', live: true },
  { key: 'cookies', path: '/cookies/', live: true },
];

export const visible = (items: NavItem[]): NavItem[] =>
  items.filter((item) => item.live && (item.flag ? features[item.flag] : true));
