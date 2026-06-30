# AGENTS.md

Project: Benson Home Solutions website, API, and lead intake platform.

This repo supports a Harney County, Oregon full-service GC that should publicly niche toward window and door replacement, weather protection, inspection repairs, and route-aware property maintenance.

## Core Direction

- Best target stack for this project is Astro + TypeScript for the public website and Hono + TypeScript for API/admin/forms on Google Cloud Run.
- Do not preserve an existing language or framework just because it is present. Choose the stack that best fits Google Cloud Run, Google Workspace, local SEO, fast static pages, reliable lead intake, and simple operations.
- Public pages must render core content without depending on a live backend request.
- Backend/API work must remain contract-first. Shared TypeScript contracts and public data should live in `packages/shared` unless there is a documented reason to split them.
- Do not deploy, publish, commit, or mass-format from a dirty tree unless every dirty file is explicitly part of the intended release set.

## Current Hosting Facts

Last verified from local review on 2026-06-29:

- Google Cloud project: `civic-wall-494004-b3`
- Region: `us-west1`
- Public domain: `bensonhomesolutions.com`
- Current public apex/www mapping targets Cloud Run service `benson-website-v6`
- `benson-website-v6` currently serves the legacy Next.js app and has returned HTTP 500 on `/`
- `benson-website-production-astro` exists on Cloud Run and returned HTTP 200 on its raw run.app URL
- `benson-api-v6` exists on Cloud Run and raw `/health` returned HTTP 200 with degraded provider health
- `api.bensonhomesolutions.com` is mapped to `benson-api-v6` but the mapping was unhealthy

Before claiming any live status, re-run current probes. These facts may drift.

## Module Map

- `packages/shared`: public business facts, TypeScript contracts, route constants, service/area/plan/resource data, and educational calculator assumptions.
- `site`: Astro static public site target. This is the preferred public website direction.
- `backend/src-hono`: Hono API/admin target for Cloud Run.
- `frontend`: legacy Next.js app. Keep only until Astro route parity and production cutover are verified.
- `backend/src`: legacy Node API. Keep only until Hono parity and production cutover are verified.
- `docs`: architecture, migration, hosting, and operational handoff docs. Read relevant docs before platform, deployment, or integration work.
- `scripts`: repo-local verification, hooks, smoke, publish, and migration helpers.

## Business Facts

- Brand: Benson Home Solutions
- Legal entity: Benson Enterprises, LLC where appropriate
- Oregon CCB: #258533
- Phone: (458) 723-0818
- Emergency phone where appropriate: 541-413-0480
- Email: office@bensonhomesolutions.com
- Canonical external image source: `~/Projects/benson-website-v5/images`
- Public geography: Harney County, Oregon

Harney County ZIP-code targets:

- 97710 Fields
- 97720 Burns / Lawen area
- 97721 Princeton
- 97722 Diamond
- 97732 Crane
- 97736 Frenchglen
- 97738 Hines
- 97758 Riley
- 97904 Drewsey

Remote Harney County work is planned, routed, and logistics-dependent unless emergency availability is explicitly confirmed.

## Positioning Rules

- Lead with full-service GC credibility while making window and door replacement a first-class conversion path.
- Treat windows, doors, weather protection, exterior openings, inspection repair, and moisture control as the SEO wedge.
- Keep full-service support visible for inspection repairs, water/mold/moisture, maintenance plans, emergency response, energy/weatherization, property preservation, residential remodeling, commercial maintenance, and church/non-profit facilities.
- Do not imply same-day response across remote communities unless explicitly approved.
- Do not reintroduce Sweet Home, Lebanon, Albany, Linn County, or Willamette Valley positioning without an approved migration plan.

Do not invent:

- Reviews, ratings, awards, certifications, insurance partnerships, response-time guarantees, staff count, years in business, project outcomes, customer names, utility savings, or revenue numbers.
- Use `VERIFY BEFORE PUBLISHING` for useful but unverified business claims.

## Website Requirements

- Public site should be static-first, fast, crawlable, and resilient.
- Core routes to preserve include `/`, `/services`, `/services/[slug]`, `/areas`, `/areas/[area]`, `/resources`, `/resources/[slug]`, `/plans`, `/contact`, `/how-we-work`, `/tools/subscription-recommendation`, `/window-screen-repair-harney-county-or`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt`.
- Add or prioritize window/door-specific routes when improving the site, including Harney County and Burns/Hines landing pages.
- Use real images from `~/Projects/benson-website-v5/images`; do not use fake stock photos or mislabel images as Benson projects when unclear.
- Use responsive images, useful alt text, lazy loading, and compressed production assets.
- Keep public content separate from raw leads, admin notes, job costing, internal pricing, provider secrets, accounting state, and AI/AR roadmap data.

## Brand And UI

Use the Benson brand color system unless an approved redesign plan changes it:

```txt
benson-maroon:      #722F37
benson-maroon-dark: #5C252C
benson-burgundy:    #8B454D
benson-wine:        #4A1F24
benson-cream:       #F5F1E8
benson-offwhite:    #FAF8F3
benson-charcoal:    #2D2D2D
benson-slate:       #4A4A4A
benson-pale:        #E5E5E5
```

Design should feel like a practical local contractor site: clear service paths, visible phone/contact actions, strong local trust facts, real work imagery, and no generic SaaS-style decoration.

## API And Integrations

Required backend baseline:

- `/health`
- Predictable JSON errors: `{ error: { code, message, details? } }`
- Server-side validation for forms and calculators
- Stable IDs for persisted submissions
- CORS configured for the deployed site and local dev
- No exposed secrets
- No public exposure of internal pricing or job-costing data unless explicitly approved

Current and intended connections:

- Google Cloud Run for website and API services
- Google-managed custom domain mappings for apex, www, and API
- Firestore for lead/emergency storage
- Secret Manager for runtime secrets
- Google Analytics and GTM for conversion analytics
- Search Console and IndexNow for indexing workflows
- Google Workspace Gmail API for lead intake, draft-first client replies, and business email workflows
- Resend may be used for transactional delivery when explicitly configured
- Twilio may be used for urgent SMS alerts
- QuickBooks, DocuSign, and Stripe should remain disabled or placeholder-only until productized and tested

Lead-cash and webhook mutation routes must require authentication or a configured shared secret. Never expose unauthenticated state mutation endpoints.

## Recommended Architecture

- Public website: Astro static output on Cloud Run, optionally fronted by Cloud CDN after stability.
- API/admin/forms: Hono on Cloud Run, Node 22 preferred for new work unless package constraints require Node 20.
- Data: Firestore Native in `us-west1`.
- Email: Google Workspace Gmail API for mailbox-native workflows; Resend only where a transactional sender is intentionally chosen.
- Admin auth: approved Google identity plus signed httpOnly session cookies.
- Background/recovery work: deterministic scripts, Cloud Run jobs, Cloud Scheduler, or webhooks; avoid opaque autonomous workflow machinery for core lead intake.

## Subscription Tool

The subscription recommendation tool is educational.

- Validate every input.
- Do not present results as guaranteed savings.
- Return assumptions and disclaimers.
- Keep calculation logic testable.
- Do not expose internal pricing tables or job-costing logic.

## Verification

Before final handoff, report:

1. Summary
2. Files changed
3. Commands run
4. Verification result
5. Risks or `VERIFY BEFORE PUBLISHING` items
6. Next handoff instructions if needed

Do not claim checks passed unless they were run.

For platform or deploy work, verify:

```bash
npm run format:check
npm run hooks:smoke
npm run test
npm run build
curl -I -L --max-time 20 https://bensonhomesolutions.com/
curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
curl -sS --max-time 20 https://api.bensonhomesolutions.com/health
```

If deploying or shifting traffic, also probe raw Cloud Run revision URLs before and after traffic movement and record rollback commands.

## Key Docs

- `docs/website-platform-operating-model.md`: current hosting, connected services, target architecture, and connection roadmap.
- `docs/target-architecture.md`: migration architecture and deployment boundary.
- `docs/astro-hono-migration-tasklist.md`: goal-by-goal migration gates.
- `docs/migration-handoff.md`: handoff and completion criteria; update it when implementation state changes.
