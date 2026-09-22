/**
 * i18n helpers: translations, locale-aware paths and the static paths every
 * page under src/pages/[...locale]/ uses.
 *
 * The default locale (src/config/site.ts) is served without a prefix; every
 * other locale lives under /<locale>/.
 */
import { defaultLocale, locales, site, type Locale } from '../config/site';
import en from './en.json';
import es from './es.json';
import de from './de.json';

type Dictionary = typeof en;

/** 'nav.sistema' | 'actions.call' | ... derived from en.json. */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type TranslationKey = Leaves<Dictionary>;

const dictionaries: Record<Locale, unknown> = { en, es, de };

/**
 * Page copy: longer, structured text (lists, steps) lives in
 * src/i18n/<page>/<locale>.json. English defines the shape; a locale whose
 * file is missing a key fails `astro check`.
 */
import homeEn from './home/en.json';
import homeEs from './home/es.json';
import homeDe from './home/de.json';
import sistemaEn from './sistema/en.json';
import sistemaEs from './sistema/es.json';
import sistemaDe from './sistema/de.json';
import serviciosEn from './servicios/en.json';
import serviciosEs from './servicios/es.json';
import serviciosDe from './servicios/de.json';
import sobreEn from './sobre/en.json';
import sobreEs from './sobre/es.json';
import sobreDe from './sobre/de.json';
import empezarEn from './empezar/en.json';
import empezarEs from './empezar/es.json';
import empezarDe from './empezar/de.json';
import casosEn from './casos/en.json';
import casosEs from './casos/es.json';
import casosDe from './casos/de.json';
import legalEn from './legal/en.json';
import legalEs from './legal/es.json';
import legalDe from './legal/de.json';

const pages = {
  home: { en: homeEn, es: homeEs, de: homeDe } satisfies Record<Locale, typeof homeEn>,
  sistema: { en: sistemaEn, es: sistemaEs, de: sistemaDe } satisfies Record<
    Locale,
    typeof sistemaEn
  >,
  servicios: { en: serviciosEn, es: serviciosEs, de: serviciosDe } satisfies Record<
    Locale,
    typeof serviciosEn
  >,
  sobre: { en: sobreEn, es: sobreEs, de: sobreDe } satisfies Record<Locale, typeof sobreEn>,
  empezar: { en: empezarEn, es: empezarEs, de: empezarDe } satisfies Record<
    Locale,
    typeof empezarEn
  >,
  casos: { en: casosEn, es: casosEs, de: casosDe } satisfies Record<Locale, typeof casosEn>,
  legal: { en: legalEn, es: legalEs, de: legalDe } satisfies Record<Locale, typeof legalEn>,
};

export type PageName = keyof typeof pages;

export function pageCopy<P extends keyof typeof pages>(page: P, locale: Locale) {
  return pages[page][locale] as (typeof pages)[P]['en'];
}

function lookup(dictionary: unknown, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
      dictionary,
    );
  return typeof value === 'string' ? value : undefined;
}

/** Returns `t(key)`. A key missing in every locale fails the build on purpose. */
export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    const value = lookup(dictionaries[locale], key) ?? lookup(dictionaries[defaultLocale], key);
    if (value === undefined) throw new Error(`Missing translation: ${key}`);
    return value;
  };
}

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

/** '/sistema/' + 'es' -> '/es/sistema/'. The default locale keeps the bare path. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = `/${path}/`.replace(/\/{2,}/g, '/');
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

/** Strips the locale prefix: '/es/sistema/' -> '/sistema/'. */
export function barePath(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  const bare = isLocale(first) ? `/${rest.join('/')}` : pathname;
  return `/${bare}/`.replace(/\/{2,}/g, '/');
}

/** The same page in every locale, for the language switch and hreflang tags. */
export function alternates(pathname: string) {
  const bare = barePath(pathname);
  return locales.map((locale) => ({
    locale,
    path: localePath(locale, bare),
    url: new URL(localePath(locale, bare), site.url).href,
  }));
}

/** getStaticPaths for pages in src/pages/[...locale]/. */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

/** wa.me link with the locale's prefilled message. */
export function whatsappUrl(locale: Locale): string {
  const message = useTranslations(locale)('actions.whatsappMessage');
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
