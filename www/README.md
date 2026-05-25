# @pikegjaku/www

Marketing site for Pikëgjaku — built with Astro 6 + Tailwind 4, deployed to Cloudflare Pages.

## Development

All commands run from the **monorepo root**.

```sh
bun run www:dev       # Start dev server (port 4321)
bun run www:build     # Build static site to www/dist
bun run www:preview   # Preview built site
bun run www:tsc       # Type check
bun run www:lint      # Lint
```

## Environment Variables

Set these in the Cloudflare Pages project settings (Environment variables):

| Variable            | Required | Purpose                                  |
| ------------------- | -------- | ---------------------------------------- |
| `PUBLIC_API_URL`    | yes      | Base URL of the Pikëgjaku API (waitlist) |
| `PUBLIC_GA_ID`      | no       | Google Analytics measurement ID          |
| `PUBLIC_HOTJAR_ID`  | no       | Hotjar site ID (numeric)                 |
| `PUBLIC_CLARITY_ID` | no       | Microsoft Clarity project ID             |

For local dev, create `www/.env` with the same `PUBLIC_*` keys (Astro/Vite picks them up automatically).

## Cloudflare Pages Deployment

**Build settings:**

- Framework preset: **None**
- Build command: `bun run www:build`
- Build output directory: `www/dist`
- Root directory: _(blank)_
- Environment variables: see table above

**Routing:**

- `public/_redirects` strips trailing slashes (matches `trailingSlash: 'never'` in `astro.config.mjs`).
- `public/robots.txt` allows major AI and search crawlers + points to the sitemap.
- `@astrojs/sitemap` generates `sitemap-index.xml` at build time.

## Pages

- `/` — Landing page + waitlist signup
- `/privatesia` — Privacy policy
- `/kushtet-e-sherbimit` — Terms of service
- `/404` — Not found
