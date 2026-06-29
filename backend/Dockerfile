FROM node:22-alpine AS deps

WORKDIR /app
ENV NPM_CONFIG_AUDIT=false \
  NPM_CONFIG_FUND=false \
  NPM_CONFIG_FETCH_RETRIES=5 \
  NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
  NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
  NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
  NPM_CONFIG_UPDATE_NOTIFIER=false
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --workspace backend --workspace packages/shared --include-workspace-root=false

FROM deps AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY backend backend
COPY packages/shared packages/shared
EXPOSE 8080
CMD ["npm", "run", "start:backend:hono"]
