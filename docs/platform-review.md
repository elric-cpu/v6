# Benson Website Platform Review

Date: 2026-06-28

## Decision

Adopt a verified non-Next migration path:

- Public site: Astro + TypeScript, static output, deployed to Google Cloud Run first as the replacement for `benson-website-v6`.
- API/admin backend: Hono + TypeScript on Node 20, deployed to Google Cloud Run service `benson-api-v6`.
- Shared contracts: `packages/shared` owns public TypeScript contracts, business facts, route constants, public data, and educational calculator assumptions.
- Data: Firestore Native in `us-west1` for lead and emergency intake records.
- Auth: Google Workspace identity for admin workflows with signed httpOnly session cookies.
- Secrets: Secret Manager and Cloud Run secret bindings, not plaintext runtime configuration.

The repo previously recommended hardening the existing Next.js app first. The current migration intent is different: prove Astro/Hono in parallel with route parity, keep production reversible, then switch traffic only after public routes, API health, SEO files, Search Console, IndexNow, and rollback are verified.

## Why Astro + Hono

Astro fits the public website because Benson Home Solutions is mostly static, content-driven, and SEO-sensitive. Public pages should render core content without a live backend dependency. Astro gives static generation by default and allows islands only where forms, calculators, or admin widgets need client-side behavior.

Hono fits the API/admin backend because the service surface is small, contract-driven, and Cloud Run friendly. It gives explicit middleware for CORS, request IDs, auth, JSON errors, audit logging, and route grouping without a large framework runtime.

## Migration Guardrails

- Do not deploy from the dirty worktree.
- Preserve route parity for `/`, `/services`, `/areas`, `/resources`, `/plans`, `/contact`, `/how-we-work`, `/tools/subscription-recommendation`, `/window-screen-repair-harney-county-or`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
- Do not let public pages depend on backend health for core content.
- Keep public content separate from lead records, admin notes, job costing, pricing internals, payment state, and accounting data.
- Provider health statuses must be `healthy`, `disabled`, or `unhealthy`.
- Client-facing emails, payment actions, document sends, and accounting syncs remain draft-first or approval-gated unless the user explicitly approves automatic sends/syncs.

## Current Implementation State

The migration is staged in parallel:

- `packages/shared`: TypeScript contracts, business facts, service/area/plan data, route generation, and educational calculator logic.
- `site`: Astro static site scaffold consuming `@benson/shared`.
- `backend/src-hono`: Hono API scaffold consuming `@benson/shared`.
- `frontend`: legacy Next.js app remains present until Astro route parity and deployment acceptance are proven.
- `backend/src`: legacy Node API remains present until the Hono API fully replaces it.

## Production Snapshot

Known production issues as of 2026-06-28 remain unresolved unless live checks prove otherwise:

- `https://bensonhomesolutions.com/` returns HTTP 500.
- `api.bensonhomesolutions.com` does not resolve publicly.
- Direct API health at the raw Cloud Run URL returns 200 but degraded provider health.

Do not present the migration as complete until those items are verified fixed.
