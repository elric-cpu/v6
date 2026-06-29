# Astro/Hono Migration Tasklist

Date: 2026-06-28

## Operating Rules

- Execute one goal at a time.
- After each goal reaches its acceptance criteria, run that goal's verification gate.
- Do not start the next goal until the current gate passes or the blocker is documented.
- Keep the legacy Next frontend and legacy Node backend intact until the replacement has route/API parity.
- Do not deploy, commit, or publish from the current dirty tree.
- Keep every new source file under 400 lines.
- Keep public data separate from lead/admin/internal operations data.

## Status Key

- `pending`: not started.
- `active`: currently being worked.
- `blocked`: cannot continue without a fix or decision.
- `verified`: acceptance criteria and verification gate passed.

## Goal 0: Handoff And Baseline Gate

Status: `verified`

Purpose:
- Make the next-agent prompt and tasklist explicit.
- Confirm the current scaffold is still verifiable after the handoff files are added.

Acceptance criteria:
- `docs/next-handoff-prompt.md` exists.
- `docs/astro-hono-migration-tasklist.md` exists.
- Current scaffold checks still pass.

Verification gate:

```bash
npm run format:check
npm run hooks:smoke
npm run test:shared
npm run test:site
npm run test:backend
npm run build:backend
npx -y -p node@22 -c 'cd site && npm run build'
npm audit --audit-level=high
```

## Goal 1: Full Public Content Parity

Status: `verified`

Purpose:
- Move the public site content from the legacy Next data files into `packages/shared` or Astro content collections.
- Preserve route URLs and public service geography.

Acceptance criteria:
- All current public resources from `frontend/src/data/resources.ts` exist in the Astro route output.
- All current public services, areas, plans, service pages, and SEO/LLM content are represented in the Astro build.
- No invented business claims are added.
- No internal pricing, lead, job-costing, admin, or provider secrets are exposed in public bundles.

Verification gate:

```bash
npm run test:shared
npm run test:site
npx -y -p node@22 -c 'cd site && npm run build'
find site/dist -maxdepth 4 -type f | sort
```

## Goal 2: Astro Interactive Islands

Status: `verified`

Purpose:
- Replace static placeholder forms with production-ready islands for contact, emergency intake, calculator, FAQ/mobile nav, and admin entry points.

Acceptance criteria:
- Contact and emergency forms post to Hono-compatible API contracts.
- Calculator uses shared educational assumptions and does not claim guaranteed savings.
- Public pages still render core content without backend access.
- UI remains consistent with Benson brand tokens and accessibility expectations.

Verification gate:

```bash
npm run test:shared
npm run test:site
npx -y -p node@22 -c 'cd site && npm run build'
```

## Goal 3: Hono Durable Intake

Status: `verified`

Purpose:
- Replace Hono in-memory/stub lead and emergency handlers with durable Firestore-backed persistence and notification degradation semantics.

Acceptance criteria:
- `/api/leads` validates, persists, and returns stable IDs.
- `/api/emergency-requests` validates, persists, forces emergency urgency, and returns stable IDs.
- Notification/provider failures do not silently lose stored submissions.
- Error responses follow the documented `ApiError` shape.

Verification gate:

```bash
npm run test:backend
npm run build:backend
```

## Goal 4: Hono Admin And Lead-Cash Parity

Status: `verified`

Purpose:
- Port admin auth, dashboard, lead-cash workflow, webhooks, provider status, deployments, settings, and audit-log routes to Hono.

Acceptance criteria:
- Admin routes require approved Google identity/session.
- Mutating admin actions require confirmation and write audit entries.
- Integration statuses are `healthy`, `disabled`, or `unhealthy`.
- No raw secrets are exposed through the UI or API payloads.

Verification gate:

```bash
npm run test:backend
npm run build:backend
```

## Goal 5: Container And Smoke Scripts

Status: `verified`

Purpose:
- Add production container and smoke-test scripts for the Astro site and Hono backend.

Acceptance criteria:
- Astro site container builds with Node 22 and serves static output on Cloud Run's `$PORT`.
- Hono backend container builds with Node 20+ or Node 22 and serves `/health` on `$PORT`.
- Smoke scripts verify local route parity, SEO files, API health, and rollback metadata placeholders.

Verification gate:

```bash
npm run format:check
npm run hooks:smoke
npm run test
npm run build:backend
npx -y -p node@22 -c 'cd site && npm run build'
npm run smoke:migration
```

## Goal 6: Clean Publish Tree

Status: `pending`

Purpose:
- Isolate the intended migration diff into a clean branch or temporary clean checkout before any Cloud Run deploy.

Acceptance criteria:
- Dirty unrelated files are excluded from the publish tree.
- The intended release set is listed.
- Rollback command placeholders identify previous frontend/backend revisions before traffic movement.

Verification gate:

```bash
git status --short
npm run format:check
npm run hooks:smoke
npm run test
npx -y -p node@22 -c 'cd site && npm run build'
```

## Goal 7: Revision Deploy Without Traffic

Status: `pending`

Purpose:
- Deploy new Cloud Run revisions for the Astro site and Hono backend without shifting public traffic.

Acceptance criteria:
- New frontend revision URL responds with HTTP 200 for `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
- New backend revision URL responds with HTTP 200 for `/health`.
- Previous revision IDs and rollback commands are recorded.

Verification gate:

```bash
gcloud run services describe benson-website-v6 --region=us-west1
gcloud run services describe benson-api-v6 --region=us-west1
curl -I -L --max-time 20 FRONTEND_REVISION_URL/
curl -I -L --max-time 20 FRONTEND_REVISION_URL/robots.txt
curl -I -L --max-time 20 FRONTEND_REVISION_URL/sitemap.xml
curl -I -L --max-time 20 FRONTEND_REVISION_URL/llms.txt
curl -I -L --max-time 20 FRONTEND_REVISION_URL/llms-full.txt
curl -sS --max-time 20 BACKEND_REVISION_URL/health
```

## Goal 8: DNS, Traffic Shift, And Indexing

Status: `pending`

Purpose:
- Repair API DNS if still broken, shift traffic only after revision checks pass, then submit Search Console and IndexNow.

Acceptance criteria:
- `https://bensonhomesolutions.com/` returns HTTP 200.
- `https://api.bensonhomesolutions.com/health` returns HTTP 200.
- Public SEO/LLM routes return HTTP 200.
- Search Console and IndexNow automation succeeds after live probes pass.

Verification gate:

```bash
dig +short bensonhomesolutions.com A
dig +short www.bensonhomesolutions.com CNAME
dig +short api.bensonhomesolutions.com A
dig +short api.bensonhomesolutions.com CNAME
curl -I -L --max-time 20 https://bensonhomesolutions.com/
curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms-full.txt
curl -sS --max-time 20 https://api.bensonhomesolutions.com/health
npm run publish:site
```
