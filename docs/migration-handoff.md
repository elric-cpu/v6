# Benson Migration Handoff

Date: 2026-06-28

## Goal

Migrate Benson Home Solutions off Next.js to Astro + TypeScript for the public site and Hono + TypeScript on Node 20 for the API/admin backend, while preserving Google Cloud Run hosting, public route parity, SEO surfaces, lead intake contracts, provider health visibility, and rollback.

## Current State

Repo: `/home/elric/Projects/benson-home-solutions`

Staged migration structure:

- `packages/shared`: shared contracts, public business facts, public service/area/plan data, resource data, route generation, and educational calculator assumptions.
- `site`: Astro static public site scaffold.
- `backend/src-hono`: Hono API/admin scaffold.
- `frontend`: legacy Next.js app remains until Astro parity and deployment acceptance are proven.
- `backend/src`: legacy Node API remains until Hono parity and deployment acceptance are proven.

Important dirty-worktree warning:

- The checkout already contains many unrelated modified and untracked files.
- Do not publish, commit, or deploy this tree as-is.
- Before any production fix, isolate the intended diff in a clean branch or temporary clean publish tree.

## Guardrails

- Do not deploy from a dirty tree unless every dirty file is explicitly listed as part of the intended release set.
- Preserve `/`, `/services`, `/areas`, `/resources`, `/plans`, `/contact`, `/how-we-work`, `/tools/subscription-recommendation`, `/window-screen-repair-harney-county-or`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
- Do not let public pages depend on a live backend request to render core content.
- Keep public website content separate from internal operations data.
- Do not expose internal pricing, job costing, customer data, secrets, admin notes, or lead records.
- Do not invent business claims, reviews, awards, guarantees, staff counts, certifications, outcomes, or savings.
- Every integration must have an owner, health check, required secrets/config list, failure mode, and verification command.
- Provider statuses must be `healthy`, `disabled`, or `unhealthy`.
- Mutating admin actions must require confirmation and audit log entries before production use.

## Known Production Issues

Known as of 2026-06-28, unless live commands prove otherwise:

- `https://bensonhomesolutions.com/` returns HTTP 500.
- `api.bensonhomesolutions.com` does not resolve publicly.
- Direct API health at the raw Cloud Run URL returns 200 but degraded provider health.

## Completion Criteria

The migration/refactor task is complete only when all of these are achieved:

- Production homepage returns HTTP 200 at `https://bensonhomesolutions.com/`.
- `api.bensonhomesolutions.com` resolves publicly and `https://api.bensonhomesolutions.com/health` returns HTTP 200.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` return HTTP 200 and preserve the public SEO/LLM surfaces.
- No Next.js runtime assets are required by the public production site.
- Public pages render core content without requiring a live backend request.
- Lead and emergency submissions validate server-side, persist durably, and clearly report notification/provider failures without silent data loss.
- Provider statuses are either healthy or explicitly documented as intentionally disabled.
- Admin dashboard login works for approved Google accounts.
- Dashboard can view/manage leads, emergency requests, workflows, integrations, deployments, and audit logs.
- Required local checks pass for the implementation scope: format, hooks, lint, tests, and build.
- Production deployment uses an isolated intended diff, probes the revision before/after traffic, submits Search Console/IndexNow after route probes pass, and records rollback commands.

Until every item above is true, documentation and scaffolding are migration milestones, not task completion.

## Next Implementation Tasks

1. Install and lock the new workspace dependencies from a Node 20 shell.
2. Expand `packages/shared` resource data to full parity with the current Next data files.
3. Convert Astro pages from scaffold content to full route parity, including content collections and interactive islands.
4. Replace the Hono in-memory lead/emergency stubs with durable Firestore-backed persistence and notification degradation.
5. Port Google admin auth, dashboard views, lead-cash workflows, webhooks, and audit logging to Hono.
6. Add route, component, API, provider, admin, and smoke tests for the new stack.
7. Build Cloud Run containers for `site` and Hono backend, then deploy revisions without traffic.
8. Probe revision URLs, shift traffic only after checks pass, submit Search Console/IndexNow, and record rollback.
