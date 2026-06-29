FROM node:22-alpine AS deps

WORKDIR /app
ENV NPM_CONFIG_AUDIT=false \
  NPM_CONFIG_FUND=false \
  NPM_CONFIG_FETCH_RETRIES=5 \
  NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
  NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
  NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
  NPM_CONFIG_UPDATE_NOTIFIER=false \
  ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY site/package.json site/package.json
RUN npm ci --workspace @benson/site --workspace @benson/shared --include-workspace-root=false

FROM deps AS builder

COPY frontend/public frontend/public
COPY packages/shared packages/shared
COPY site site
RUN cd packages/shared && npm run typecheck && cd ../../site && npm run build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/site/dist dist
COPY site/server.mjs server.mjs
EXPOSE 8080
CMD ["node", "server.mjs"]
