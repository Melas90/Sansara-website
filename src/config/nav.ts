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

/** Header: the three doors, then cases and about. */
export const mainNav: NavItem[] = [
  { key: 'sistema', path: '/sistema/', live: false },
  { key: 'servicios', path: '/servicios/', live: false },
  { key: 'productos', path: '/productos/', live: false, flag: 'products' },
  { key: 'casos', path: '/casos/', live: false },
  { key: 'sobre', path: '/sobre/', live: false },
];

/** Where the primary call to action points once /empezar exists. */
export const startRoute: NavItem = { key: 'empezar', path: '/empezar/', live: false };

export const legalNav: NavItem[] = [
  { key: 'avisoLegal', path: '/aviso-legal/', live: false },
  { key: 'privacidad', path: '/privacidad/', live: false },
  { key: 'cookies', path: '/cookies/', live: false },
];

export const visible = (items: NavItem[]): NavItem[] =>
  items.filter((item) => item.live && (item.flag ? features[item.flag] : true));
