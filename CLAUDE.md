# Pikegjaku

A TypeScript monorepo with a React Native (Expo) mobile app, a Hono.js API, and an Astro marketing site.

## Project Structure

```
pikegjaku-/
├── app/               # React Native + Expo mobile app
│   ├── ui/            # UI layer (components, icons, illustrations, layouts, styles, views)
│   ├── controllers/   # Data controllers (cities, countries, posts, users, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── libs/          # Utility libraries
│   ├── helpers/       # Helper functions
│   ├── ts/            # Centralized types (Interfaces.ts, Types.ts)
│   └── data/          # Static data
├── api/               # Hono.js backend (Bun runtime)
│   ├── controllers/   # Business logic (actions, filters, helpers, libs, middlewares)
│   ├── router/        # Route definitions
│   ├── data/          # Data layer (models, structures, constants, etc.)
│   ├── scripts/       # Utility scripts
│   └── ts/            # Centralized types (Interfaces.ts, Types.ts)
├── www/               # Astro marketing site (deployed to Cloudflare Pages)
│   ├── public/        # Static assets (_redirects, robots.txt, llms.txt, fonts, images)
│   ├── src/           # Astro pages, components, layouts, scripts, styles
│   └── astro.config.mjs
├── packages/
│   └── shared/        # @pikegjaku/shared - constants, helpers, validations
└── package.json       # Workspace root
```

## Tech Stack

- **App**: React Native 0.76 + Expo 52 + Expo Router + Zustand + twrnc (Tailwind) + Phosphor Icons + RNEUI
- **API**: Hono.js + Bun + Mongoose (MongoDB) + AWS S3 + Sharp + JWT
- **WWW**: Astro 6 + Tailwind 4 + sitemap (deployed to Cloudflare Pages)
- **Shared**: @pikegjaku/shared - validations, helpers, constants

## Code Conventions

### Import Rules

Always use `@/` path aliases. Never use `../` or `./` relative imports.

```typescript
// CORRECT - app, api, www workspaces
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
- **App Views** (`app/ui/views/`): One component per view/screen
- **App Components** (`app/ui/components/`): Reusable UI components
- **App Hooks** (`app/hooks/`): One hook per file

### Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for React components
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE for routes/config, camelCase otherwise

### Formatting & Linting Rules

Enforced by ESLint 9 flat config (`eslint.config.js` at root) + Prettier (`.prettierrc` at root). Pre-commit hook runs both via Husky.

**Prettier**: single quotes, no semicolons, 4-space indent, no trailing commas, single JSX quotes
**ESLint**: same as above plus no-multiple-empty-lines (max 1), eol-last never, no-empty (allow empty catch), consistent-type-imports, no-unused-vars (warn), no-explicit-any (warn), react-hooks rules for app/

**Commands**: `bun run format` (Prettier + ESLint fix), `bun run lint` (ESLint check), `bun run check` (format + lint)

### Text

All user-facing text is direct Albanian (sq_AL) string literals — no translation system. Write text inline in the UI as needed.

### Validation

All input validation length limits must be defined in `packages/shared/validations/` as a single source of truth. Never hardcode min/max lengths in controllers or components.

### Scripts & Running

All scripts are defined in the **root** `package.json` and must be run from the project root. Never add or modify scripts in workspace `package.json` files (`api/package.json`, `app/package.json`, etc.).

- `bun run api:dev` — Start API dev server (port 9999)
- `bun run api:build` — Build API
- `bun run api:start` — Start API production server (port 9999)
- `bun run app:start` — Start Expo dev server
- `bun run www:dev` — Start www dev server
- `bun run format` / `bun run lint` / `bun run check` — Formatting & linting

When adding new scripts, always add them to the root `package.json` following the `<workspace>:<command>` naming pattern (e.g., `api:migrate`, `app:test`).

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
16. Phosphor icons only — never use inline SVGs for icons. Use `phosphor-react-native` (duotone) in `app/`, `@phosphor-icons/react` (duotone) in `admin/` and `www/`
17. Use Zustand persist middleware for user preferences
18. Use camelCase for SVG attributes in JSX
