FROM oven/bun:1.2-debian AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY web/package.json ./web/
COPY packages/shared/package.json ./packages/shared/

RUN bun install

FROM oven/bun:1.2-debian AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY package.json bun.lock ./
COPY api ./api
COPY packages/shared ./packages/shared

EXPOSE 2040

WORKDIR /app/api

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD ["bun", "--eval", "fetch('http://127.0.0.1:2040/').then(r => process.exit(r.status < 500 ? 0 : 1)).catch(() => process.exit(1))"]

# @goenvless/cli is a root dependency, so its binary is in the root node_modules, not api/node_modules. A container has no
# .envless link file, so envless run refuses to start without --workspace and --env. It also needs ENVLESS_TOKEN and
# ENVLESS_KEY in the container's environment.
CMD ["bun", "/app/node_modules/.bin/envless", "run", "--workspace", "bfzli", "--product", "pikegjaku", "--project", "server", "--env", "prod", "--", "bun", "index.ts"]
