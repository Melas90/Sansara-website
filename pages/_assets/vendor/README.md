# Third-party libraries used by the live site

Self-hosted, because the site's Content-Security-Policy only allows scripts from our own address (netlify.toml).
`npm run verify` skips this folder for the tokens-only check.

| File | Library | Version | Licence | Used for |
|---|---|---|---|---|
| `rough-notation.iife.js` | [Rough Notation](https://roughnotation.com) | 0.5.1 | MIT, © Preet Shihn | The pen on the home's "which offer fits" cards (home.js §5) |
