## Project

Read BRIEF.md (spec and roadmap), DESIGN.md (design plan) and DECISIONS.md before changing anything.
The GitHub repo is PUBLIC: never commit secrets, tokens, unpublished client figures or private contact details.
One feature per branch from `develop`; never start the next feature without the owner's go.
Run `npm run verify` before every commit. All copy in `src/i18n/*.json` or `src/content/`, in en, es and de.
Tokens only (`src/styles/tokens.css`). Re-read the "tells" list in BRIEF section 1 before every PR.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
