import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site, locales, defaultLocale } from './src/config/site';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  // One small stylesheet: inlining it removes the only render-blocking request.
  build: { inlineStylesheets: 'always' },

  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },

  // Self-hosted variable fonts. The upright Newsreader is our own subset
  // (scripts/subset-fonts.mjs); the rest come straight from the fontsource packages.
  // Astro generates metric-matched fallbacks, so swapping fonts does not shift layout.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/newsreader-display.woff2'],
            weight: '300 500',
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/newsreader-italic.woff2'],
            weight: '300 500',
            style: 'italic',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2',
            ],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
          {
            src: [
              '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-italic.woff2',
            ],
            weight: '100 900',
            style: 'italic',
            display: 'swap',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    // Never inline scripts: the CSP in netlify.toml only allows script-src 'self'.
    build: { assetsInlineLimit: 0 },
  },
});
