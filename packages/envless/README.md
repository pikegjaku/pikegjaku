# @pikegjaku/envless

Pulls an [Envless](https://envless.cloud) exposed feed, decrypts it with the workspace passphrase, and hands the values to a process. Node-only: it is never imported by app code, only run as a process.

## Setup

1. Expose the environment in Envless (Settings, Virtual envs, then the per-environment **Expose** toggle) and copy its feed URL.
2. Put two lines in that app's `.env`, and nothing else:

```
ENVLESS_VERSION_LINK=https://api.envless.cloud/exposed/<workspace>/<product>/<project>/<environment>/versions/latest
ENVLESS_PASSPHRASE=<workspace passphrase>
```

That is the whole configuration. `.env` is the only file involved: each app points at its own environment, and every other value comes from the feed. An exported shell variable still overrides both.

`ENVLESS_KEY` (base64url, 32 bytes) works instead of the passphrase and skips PBKDF2. Today the feed embeds its own salt, so the link and the passphrase are all you need; if a feed ever arrives without one, add `ENVLESS_WORKSPACE_ID` (from `envless workspace list`) and decryption keeps working.

## Use

Every script lives in the root `package.json`, as the rest of this repo does, and is run from the project root:

There is no unwrapped variant of anything. Every script that starts or builds an app already runs through the injector, so the ordinary name is the injected one:

```bash
bun run api:dev          # api, feed injected
bun run web:dev          # web, PUBLIC_* included
bun run admin:dev        # admin, VITE_* included
bun run mobile:start     # expo, EXPO_PUBLIC_* included
```

That covers `api:dev`, `api:build`, `api:start`, `api:seed`, `web:dev`, `web:build`, `web:preview`, `admin:dev`, `admin:build`, `admin:preview`, `mobile:start`, `mobile:android`, `mobile:ios`, `mobile:web`, `mobile:run:android` and `mobile:run:ios`.

Type checks, linters and the `mobile:eas:*` scripts are deliberately left unwrapped: the first need no environment, and EAS bundles on its own servers.

`<app>:exec` runs anything else with that app's feed injected, and `<app>:diff` compares the feed against the local `.env`:

```bash
bun run api:exec -- bun run scripts/backfill.ts
bun run web:exec -- bunx astro check
bun run api:diff
```

Flags: `--link=<url>` overrides the configured feed, `--diff` compares against the local `.env`, `--verbose` lists variable names with masked values and prints full stack traces on failure, `--write=<file>` renders a dotenv file, `--force` allows `--write` to replace an existing file, `--optional` runs the command unchanged when no feed is configured instead of failing.

## Precedence

1. A variable exported in the shell wins over everything.
2. The Envless feed wins over the app's `.env`.
3. Anything the feed does not carry falls through to the app's `.env`.

Rule 3 is a migration affordance, not something this repo relies on any more: every `.env` here is down to the two Envless lines, so the feed is the only source. `<app>:diff` is what proves that — when it reports nothing as "still only local", the file is fully migrated.

The injector never writes to a `.env` and never deletes one.

Every script runs the injector under `bun --env-file=/dev/null`. That suppresses Bun's automatic load of the app's `.env` into the injector itself, so anything left in its environment is genuinely exported and rule 1 can be applied without guessing. The child process still loads `.env` normally, which is what makes rule 3 work. Drop that flag and the app's `.env` would shadow the feed for every variable it defines.

`--write` refuses to replace a file that already exists unless `--force` is passed, so no run can destroy a `.env` that has not been migrated yet. Values are encoded so that Bun reads back exactly what the feed carried, including newlines, `#`, `$` and quotes. A value that a dotenv file cannot represent losslessly raises an error naming the variable rather than being written corrupted.

The feed is retried with backoff only for failures that can clear on their own: connection errors, timeouts, 5xx, 408, 425 and 429. A 404, a wrong format, or a malformed link fails immediately, and the server's own explanation is included in the message. A published version with no variables is a warning, not an error: the run continues on the app's `.env` alone.

## What the child does not get

Every `ENVLESS_*` variable is removed from the environment handed to the wrapped process, so vite, astro, metro, the API server and anything they spawn never see the passphrase or key that decrypts the whole workspace.

One caveat, locally: a child run through `bun` or `bunx` loads the app's `.env` itself, which is where the two bootstrap lines live, so it reads them back. That is the same mechanism rule 3 depends on and it cannot be switched off for one file. It does not reach any bundle, because `PUBLIC_*`, `VITE_*` and `EXPO_PUBLIC_*` are the only prefixes those tools expose. In the container there is no `.env` at all (`.dockerignore` drops it), so the stripping holds and the API process never sees the passphrase.

The first Ctrl-C is forwarded to the child; a second one escalates to `SIGKILL` so an unresponsive child can always be stopped.

## Vite and Astro

`loadEnv` applies `process.env` after the `.env` files and lets it win, so injected `VITE_*` values reach admin's `import.meta.env` and injected `PUBLIC_*` values reach web's, in both dev and build, with no config change.

## Expo

`@expo/env` skips any key that is already present in `process.env`, so the injected `EXPO_PUBLIC_*` values survive and babel inlines them into the bundle. That covers `expo start`, `expo run:android` and `expo run:ios`, which all bundle locally. It does not cover `eas build` or `eas submit`: those bundle on EAS servers, where the environment comes from `eas.json` and the EAS dashboard, so those scripts are deliberately left unwrapped.

## Production

The container entrypoint runs through the injector, from `WORKDIR /app/api`:

```
CMD ["bun", "--env-file=/dev/null", "../packages/envless/src/Inject.ts", "--", "bun", "index.ts"]
```

The image carries no `.env` at all — `.dockerignore` drops it — so `ENVLESS_VERSION_LINK` and `ENVLESS_PASSPHRASE` have to be set as platform variables, pointed at the API's production environment. The platform holds two variables instead of dozens.

There is no `--optional` here on purpose. The flag exists, and it runs the command unchanged when no feed is configured, but an API with no `MONGO_URI`, no token secrets and no CORS allowlist should not boot. Without the two variables the container exits non-zero on the first start rather than coming up misconfigured. An unreachable feed or a wrong passphrase fails the same way.

Because there is no `.env` in the image, the `ENVLESS_*` stripping described above holds: the API process never sees the passphrase.

Platform variables win over the feed, so an explicit `ENV` in the Dockerfile (`PORT`, `NODE_ENV`) keeps its value.

The web build runs on Cloudflare Pages, whose build command lives in the Cloudflare dashboard rather than in this repo. Point it at `bun run web:build` — it already runs through the injector — and set `ENVLESS_VERSION_LINK` and `ENVLESS_PASSPHRASE` as Pages environment variables. `.nvmrc` pins Node 22.12.0, the minimum Astro 6 accepts. Admin builds the same way, with `bun run admin:build`.