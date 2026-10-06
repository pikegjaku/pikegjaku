# Pikegjaku

A TypeScript monorepo with a React Native (Expo) mobile app, a Hono.js API, and an Astro marketing site.

Pikëgjaku is a volunteer blood donation platform connecting donors with people in need across Kosovo, Albania, and North Macedonia. When someone needs blood they create a request specifying the blood type and location, and matching donors nearby are notified immediately.

**Features**

- Urgent requests posted with blood type, location, and details
- Smart notifications matched on blood type and proximity
- Donation center directory with contacts and locations
- Three countries and 30+ cities covered

## Project Structure

```
pikegjaku-/
├── mobile/            # React Native + Expo mobile app
│   ├── ui/            # UI layer (components, icons, illustrations, layouts, styles, views)
│   ├── controllers/   # Data controllers (cities, countries, posts, users, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── libs/          # Utility libraries
│   ├── helpers/       # Helper functions
│   ├── ts/            # Centralized types (Interfaces.ts, Types.ts)
│   └── data/          # Static data
├── api/               # Hono.js backend (Cloudflare Workers + D1)
│   ├── controllers/   # Business logic (actions, filters, helpers, libs, middlewares)
│   ├── router/        # Hono app wiring the routes to their middlewares
│   ├── data/          # Data layer (tables, constants, seed data, etc.)
│   ├── migrations/    # D1 schema migrations (SQL)
│   ├── scripts/       # Utility scripts
│   └── ts/            # Centralized types (Interfaces.ts, Types.ts)
├── web/               # Astro marketing site (deployed to Cloudflare Pages)
│   ├── public/        # Static assets (_redirects, robots.txt, llms.txt, fonts, images)
│   ├── src/           # Astro pages, components, layouts, scripts, styles
│   └── astro.config.mjs
├── admin/             # Vite + React admin dashboard
├── packages/
│   └── shared/        # @pikegjaku/shared - constants, helpers, validations
└── package.json       # Workspace root
```

## Tech Stack

- **Mobile**: React Native 0.83 + Expo 55 + Expo Router + Zustand + twrnc (Tailwind) + Phosphor Icons + RNEUI
- **API**: Hono.js + Cloudflare Workers + D1 (SQLite) + R2 + Cloudflare Images + jose (JWT)
- **Web**: Astro 6 + Tailwind 4 + sitemap (deployed to Cloudflare Pages)
- **Admin**: React + Vite
- **Shared**: @pikegjaku/shared - validations, helpers, constants

## Code Conventions

### Import Rules

Always use `@/` path aliases. Never use `../` or `./` relative imports.

```typescript
// CORRECT - mobile, api, web workspaces
import { something } from '@/controllers/posts'
import { MyComponent } from '@/ui/components/MyComponent'

// CORRECT - workspace packages
import { something } from '@pikegjaku/shared'

// CORRECT - inside packages/shared, use self-referencing for cross-directory imports
import type { ValidationReturnType } from '@pikegjaku/shared/ts'
import { T } from '@pikegjaku/shared/helpers'

// INCORRECT - never use relative imports
import { something } from '../controllers/posts'
import { MyComponent } from './MyComponent'
```

Inside `packages/shared/`, use the package name `@pikegjaku/shared/` for all imports (self-referencing). Subpath exports in `package.json` handle resolution.

### One Export Per File

Every `.ts` and `.tsx` file must export exactly ONE function, component, constant, or class via `export default`. No file should have multiple exports.

When a module needs multiple exports, convert it to a folder with one file per export and a barrel `index.ts`.

Barrel `index.ts` files must import defaults first, then re-export by name. Never use `export { default as X } from` syntax.

**Exempt**: `ts/Types.ts`, `ts/Interfaces.ts`, `ts/index.ts`, barrel `index.ts` files.

### Types and Interfaces

All types and interfaces must be centralized in `@/ts/`. Never define types, interfaces, or inline object types anywhere else.

- `@/ts/Types.ts` - All type aliases
- `@/ts/Interfaces.ts` - All interfaces (including component props, hook params, API responses)
- `@/ts/index.ts` - Barrel export

Type imports must be at the top of the file, separated by an empty line from regular imports. Always use `import type`.

```typescript
import type { PostData, UserProfile } from '@/ts/Interfaces'
import type { ViewMode } from '@/ts/Types'

import { useState } from 'react'
import { api } from '@/libs/api'
```

Never define inline object types in function parameters or return types. Create named interfaces in `@/ts/Interfaces.ts` instead.

### React Component Pattern

All React components must use the arrow function pattern with explicit typing and a separate default export at the end.

Components without props use `FC`. Components with props use `FC<PropsType>` where PropsType is defined in `@/ts/Interfaces.ts`. Always annotate return type as `ReactNode`.

Never use `export default function` or untyped arrow functions for components.

### Fragment Syntax

Never use the shorthand `<>...</>` fragment syntax. Always use the explicit `<Fragment>...</Fragment>` imported from React.

### File Organization

- **API Controllers** (`api/controllers/`): Group by resource with subdirectories for actions, filters, helpers, libs, middlewares
- **API Routes** (`api/router/`): One file per resource, import controllers and wire to Hono routes
- **Mobile Views** (`mobile/ui/views/`): One component per view/screen
- **Mobile Components** (`mobile/ui/components/`): Reusable UI components
- **Mobile Hooks** (`mobile/hooks/`): One hook per file

### Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for React components
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE for routes/config, camelCase otherwise

### Formatting & Linting Rules

Enforced by ESLint 9 flat config (`eslint.config.js` at root) + Prettier (`.prettierrc` at root). Pre-commit hook runs both via Husky.

**Prettier**: single quotes, no semicolons, 4-space indent, no trailing commas, single JSX quotes
**ESLint**: same as above plus no-multiple-empty-lines (max 1), eol-last never, no-empty (allow empty catch), consistent-type-imports, no-unused-vars (warn), no-explicit-any (warn), react-hooks rules for mobile/

**Commands**: `bun run format` (Prettier + ESLint fix), `bun run lint` (ESLint check), `bun run check` (format + lint)

### Text

All user-facing text is direct Albanian (sq_AL) string literals — no translation system. Write text inline in the UI as needed.

### Validation

All input validation length limits must be defined in `packages/shared/validations/` as a single source of truth. Never hardcode min/max lengths in controllers or components.

### Scripts & Running

All scripts are defined in the **root** `package.json` and must be run from the project root. Never add or modify scripts in workspace `package.json` files (`api/package.json`, `mobile/package.json`, etc.).

Every script that runs an app goes through `envless run --workspace bfzli --product pikegjaku --project <project> --env <env>`, so its environment is decrypted in memory from Envless. There is no non-wrapped variant.

- `bun run api:dev` / `api:deploy` / `api:migrate` / `api:seed` — API (`wrangler dev` on 1111 against a local D1, deployed to Cloudflare Workers)
- `bun run mobile:start` / `mobile:android` / `mobile:ios` / `mobile:web` / `mobile:run:android` / `mobile:run:ios` — Expo (Metro on 3333)
- `bun run web:dev` / `web:build` / `web:preview` — web (2222)
- `bun run admin:dev` / `admin:build` / `admin:preview` — admin (5555)
- `bun run <workspace>:exec -- <command>` — run anything with that workspace's variables
- `bun run format` / `bun run lint` / `bun run check` — Formatting & linting

Type checks, linters, `api:build` (a `wrangler deploy --dry-run` bundle), `api:types`, `api:migrate`, `api:seed` and EAS builds are not wrapped: they need no environment, and EAS bundles on its own servers where the environment comes from `eas.json` and the EAS dashboard.

When adding new scripts, always add them to the root `package.json` following the `<workspace>:<command>` naming pattern (e.g., `api:migrate`, `mobile:test`), and wrap anything that reads environment variables in `envless run`.

### Prerequisites & Setup

- Node.js v22.12+ (pinned in `.nvmrc`, required by Astro 6)
- Bun 1.4+ (runs the API scripts)
- Expo CLI

Every value comes from Envless. There are no `.env` files, no `.env.example` files and no local secrets. Code never falls back to a default: a variable the code reads exists in Envless, and a variable nothing reads is removed from Envless. The server's `ENV` is `local` or `prod`.

```bash
bun install
bunx envless login
```

After one `envless login` on the machine, every script resolves its variables itself. Anywhere a person cannot log in (CI, a container, Cloudflare Pages) set two variables instead: `ENVLESS_TOKEN`, an `ev_sk_` API key that authenticates, and `ENVLESS_KEY`, the workspace key that decrypts (Envless dashboard, CI / Machine Access). `ENVLESS_PASSPHRASE` works in place of `ENVLESS_KEY`.

### Web Deployment (Cloudflare Pages)

**Build settings**

- Framework preset: None
- Build command: `bun run web:build`
- Build output directory: `web/dist`
- Root directory: empty
- Node version: `.nvmrc` pins 22.12.0, the minimum Astro 6 accepts

**Environment variables**: Cloudflare Pages holds only `ENVLESS_TOKEN` and `ENVLESS_KEY`. `web:build` runs `envless run --env prod` for the web project, so everything below is decrypted at build time and inlined into the bundle. Local development uses the machine's `envless login` instead.

| Variable            | Required | Purpose                                              |
| ------------------- | -------- | ---------------------------------------------------- |
| `PUBLIC_API_URL`    | yes      | Base URL of the Pikëgjaku API, used for the waitlist |
| `PUBLIC_GA_ID`      | no       | Google Analytics measurement ID                      |
| `PUBLIC_HOTJAR_ID`  | no       | Hotjar site ID (numeric)                             |
| `PUBLIC_CLARITY_ID` | no       | Microsoft Clarity project ID                         |

**Routing**

- `public/_redirects` strips trailing slashes, matching `trailingSlash: 'never'` in `astro.config.mjs`
- `public/robots.txt` allows the major AI and search crawlers and points to the sitemap
- `@astrojs/sitemap` generates `sitemap-index.xml` at build time

**Pages**: `/` (home + waitlist signup), `/privatesia` (privacy policy), `/kushtet-e-sherbimit` (terms of service), `/404`.

**Other web commands**: `bun run web:preview` (preview the built site), `bun run web:tsc` (type check), `bun run web:lint`, `bun run web:build`.

### API Deployment (Cloudflare Workers)

The API runs on Cloudflare Workers, configured in `api/wrangler.json`. `api/index.ts` serves the Hono app from `api/router/`, and every route reads and writes the D1 database `pikegjaku` through the helpers in `api/controllers/libs/d1/` (`Find`, `FindOne`, `Count`, `Insert`, `Update`, `Increment`, `Remove`, `Exists`, `Query`). `references` on `Find` and `FindOne` replaces an id column with the row it points to, so a post comes back with its user, city and country nested inside it.

**Bindings**

| Binding  | Resource                                      | Used for                 |
| -------- | --------------------------------------------- | ------------------------ |
| `DB`     | D1 database `pikegjaku` (`eu` jurisdiction)   | All API data             |
| `CDN`    | R2 bucket `pikegjaku-cdn` (`eu` jurisdiction) | Avatars                  |
| `IMAGES` | Cloudflare Images                             | Resizing avatars to WebP |

**Secrets**: `secrets.required` in `api/wrangler.json` is the one list of variables the API reads. `api:dev` binds them from the Envless `local` environment, and `api:deploy` uploads them from the Envless `prod` environment together with the code through `wrangler deploy --secrets-file`, so nothing is written to disk. A new variable goes into Envless and `secrets.required`, then `bun run api:types` regenerates `api/worker-configuration.d.ts`.

**Database**: the schema lives in `api/migrations/` as numbered SQL files, and each table has a column map in `api/data/tables/` that tells the helpers which columns hold booleans, dates (ISO 8601 text) or JSON. A schema change is a new file from `bunx wrangler d1 migrations create DB <name>` (run in `api/`) plus the matching edit in `data/tables/`. `api:deploy` applies pending migrations to the remote database before it uploads the code. Locally, `wrangler dev` uses its own D1 in `api/.wrangler/state`: `bun run api:migrate` creates the tables and `bun run api:seed` fills the countries and cities, so local development never touches production data. Ids stay 24-character hex strings in the ObjectId format, and D1 Time Travel restores the database to any minute of the last 30 days (7 on the Workers Free plan). Workers also ship no Albanian locale data, so Albanian dates are formatted by `FormatDate` instead of `Intl`.

**Deploying**: Workers Builds deploys every push to `Production` that touches `api/`, `packages/` or the root manifests (Workers & Pages → pikegjaku-api → Settings → Builds). It runs in the root directory `api` with the build command `cd .. && bun install --frozen-lockfile` and the deploy command `cd .. && bun run api:deploy`, the variables `SKIP_DEPENDENCY_INSTALL=true` and `BUN_VERSION=1.4.2`, and the secrets `ENVLESS_TOKEN` and `ENVLESS_KEY`. To deploy from a machine instead, run `bunx wrangler login` once, then `bun run api:deploy`. The API hostname is attached to the `pikegjaku-api` Worker as a Custom Domain (Workers & Pages → pikegjaku-api → Settings → Domains & Routes). Logs are in Workers Logs.

### Contributing

Contributions are welcome. Before opening a PR:

1. Follow the existing code conventions
2. Use `@/` path aliases, never relative imports
3. Centralize types in `@/ts/`
4. Write user-facing text as direct Albanian string literals
5. Run `bun run check`

Licensed MIT, see [LICENSE](LICENSE).

## Guidelines for AI

1. Always read files before modifying — understand existing patterns first
2. Always use `@/` imports — never `../` or `./` relative imports
3. Centralize types in `@/ts/` — never define types/interfaces inline
4. Always use `import type` for type-only imports, placed at top of file
5. Use the FC arrow function pattern for all React components
6. Follow existing patterns — match the style of surrounding code
7. Keep it simple — avoid over-engineering
8. Controllers handle logic — routes should be thin wrappers
9. Zustand for state — don't introduce additional state management
10. User-facing text is direct Albanian (sq_AL) string literals — no translation layer
11. Never write comments — code should be self-explanatory (exception: truly non-obvious logic)
12. Never add console.log — use console.error only in catch blocks
13. No section markers — never write `// Section Name` or `{/* Section */}` comments
14. Strict formatting — 4-space indent, single quotes, no semicolons, no trailing commas
15. Full cleanup on feature removal — delete ALL related code across the entire codebase
16. Phosphor icons only — never use inline SVGs for icons. Use `phosphor-react-native` (duotone) in `mobile/`, `@phosphor-icons/react` (duotone) in `admin/` and `web/`
17. Use Zustand persist middleware for user preferences
18. Use camelCase for SVG attributes in JSX
