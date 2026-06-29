# Website Platform Operating Model

Date: 2026-06-29

This document captures the current website hosting state, connected services, recommended technical direction, and connection roadmap for Benson Home Solutions.

## Goal

Build a complete, high-performing website and lead intake platform for a full-service general contractor in Harney County, Oregon that niches publicly toward window and door replacement, weather protection, inspection repairs, and route-aware property maintenance.

The platform should optimize for:

- Fast local SEO pages
- Reliable phone and form conversion
- Strong Google Cloud and Google Workspace fit
- Simple operations
- Clean lead intake
- Future admin and lead-to-cash workflows

## Current Live Hosting

Last verified from local commands on 2026-06-29.

Google Cloud:

- Project: `civic-wall-494004-b3`
- Region: `us-west1`
- Active account observed locally: `website-agent@civic-wall-494004-b3.iam.gserviceaccount.com`

Cloud Run services:

- `benson-website-v6`
  - Raw URL: `https://benson-website-v6-ecdo5oua2a-uw.a.run.app`
  - Current public apex/www target
  - Serves the legacy Next.js app
  - Returned HTTP 500 on `/`
- `benson-website-production-astro`
  - Raw URL: `https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app`
  - Returned HTTP 200 on `/`
  - Not currently receiving apex/www production traffic
- `benson-api-v6`
  - Raw URL: `https://benson-api-v6-ecdo5oua2a-uw.a.run.app`
  - Raw `/health` returned HTTP 200
  - Health status was degraded because email, SMS, and Stripe were unhealthy

Domain mappings:

- `bensonhomesolutions.com` -> `benson-website-v6`, status `True`
- `www.bensonhomesolutions.com` -> `benson-website-v6`, status `True`
- `api.bensonhomesolutions.com` -> `benson-api-v6`, status `False`

DNS observed:

- Apex resolves to Google frontend IPs
- `www.bensonhomesolutions.com` resolves through `ghs.googlehosted.com`
- `api.bensonhomesolutions.com` resolves through Google hosting but HTTPS health failed during review

## Current Production Problem

The public homepage is down because production traffic points to `benson-website-v6`, and that service is returning HTTP 500 on `/`.

Observed error path:

- The legacy Next.js app tries to fetch public services during server render.
- The server render fails with `ApiError: Failed to connect to the server`.
- The failing call is through the frontend API helper that depends on `NEXT_PUBLIC_API_URL`.

The raw API URL responds, so the likely issue is a runtime connectivity/config mismatch in the legacy Next deployment, not total API outage.

The Astro service is already deployed and returns HTTP 200 on its raw Cloud Run URL. It is the better production target after route smoke checks.

## Current Connections

Confirmed enabled or present:

- Cloud Run
- Artifact Registry
- Cloud Build
- Firestore API
- Secret Manager
- Cloud DNS / domain mapping support
- IAM Credentials API
- Gmail API
- Google Analytics APIs
- Search Console related tooling in frontend scripts
- IndexNow submission script
- Google Analytics measurement ID on the current website service
- GTM container ID on the current website service
- Search Console verification value on the current website service

Current backend/API capabilities in code:

- Public content endpoints
- Lead intake
- Emergency intake
- Firestore and Postgres storage abstractions
- Resend mailer
- Twilio SMS sender
- Turnstile verification
- Google admin auth for Hono
- Hono provider health
- Hono lead-cash workflow and webhook routes
- Stripe health placeholder
- DocuSign health placeholder
- QuickBooks health placeholder

Current deployed API env observed:

- `FRONTEND_ORIGIN=https://bensonhomesolutions.com`
- `EMAIL_FROM=office@bensonhomesolutions.com`
- `LEAD_STORAGE_BACKEND=firestore`
- `LEAD_REQUESTS_COLLECTION=lead_requests`
- `EMERGENCY_REQUESTS_COLLECTION=emergency_requests`
- `GMAIL_SERVICE_ACCOUNT_EMAIL=backend-core-sa@civic-wall-494004-b3.iam.gserviceaccount.com`
- `GMAIL_IMPERSONATED_USER=office@bensonhomesolutions.com`
- `LEAD_NOTIFICATION_TO=office@bensonhomesolutions.com`

Important mismatch:

- The deployed legacy API health reports email unhealthy.
- Current legacy mailer code expects Resend-style `EMAIL_API_KEY`, `EMAIL_FROM`, and `EMAIL_TO`.
- The deployed env includes Gmail-oriented variables and `LEAD_NOTIFICATION_TO`.
- Choose one email path and align code, env, health, and docs before relying on production notifications.

## Recommended Stack

Use this as the default technical direction:

- Public website: Astro + TypeScript, static-first
- API/admin/forms: Hono + TypeScript on Cloud Run
- Runtime: Node 22 for new services where practical; Node 20 only when required by package constraints
- Data: Firestore Native in `us-west1`
- Secrets: Secret Manager with Cloud Run bindings
- Email: Google Workspace Gmail API for mailbox-native lead intake and draft-first client workflows
- Optional transactional email: Resend, only if explicitly configured
- SMS: Twilio for urgent alerts, only if configured and tested
- Indexing: Search Console sitemap submission and IndexNow after live route probes pass
- Performance edge: Cloud CDN in front of Cloud Run static assets after the site is stable

Do not choose a framework because it is already in the repo. Choose based on the business and hosting constraints.

### Why Astro For The Public Site

Benson Home Solutions is a mostly static local-service website. It needs durable pages, local SEO, fast rendering, and reliable forms more than dynamic SSR.

Astro is the best fit because:

- Core content can be generated at build time.
- Public pages can survive API outages.
- JavaScript can be limited to forms, calculators, analytics, and admin entry points.
- It pairs cleanly with Cloud Run static serving and future Cloud CDN.
- Shared TypeScript contracts can be reused from `packages/shared`.

### Why Hono For API/Admin

Hono is the best backend fit because:

- The API surface is small and contract-driven.
- Cloud Run runs containers and HTTP services cleanly.
- Hono keeps middleware explicit for CORS, request IDs, auth, JSON errors, and webhooks.
- TypeScript contracts stay shared with the site.
- Operational complexity stays lower than a large full-stack framework.

### What Not To Use By Default

- Do not use WordPress for the production platform.
- Do not keep Next.js SSR for public core pages unless there is a documented need for dynamic rendering.
- Do not introduce Laravel, Django, Rails, or a CMS-first architecture unless the business explicitly chooses editorial workflows over simple static performance.
- Do not introduce heavy workflow orchestration for lead intake. Prefer deterministic handlers, webhooks, scripts, Cloud Scheduler, and Cloud Run jobs.

## Business Positioning

Public positioning should be:

> Full-service GC and property repair company for Harney County, with a visible specialty in window and door replacement, weather protection, inspection repairs, and route-aware maintenance.

The site should make window and door replacement a first-class conversion path, not one service card buried among many.

Priority conversion paths:

- Call
- Window/door quote or review request
- Inspection repair request
- Emergency condition request
- Maintenance plan inquiry
- Photo-first project review

Priority public routes:

- `/`
- `/window-door-replacement-harney-county-or`
- `/window-replacement-burns-or`
- `/door-replacement-burns-or`
- `/services/window-door-replacements`
- `/services/inspection-repairs`
- `/services/water-mold-moisture`
- `/services/emergency-response`
- `/areas/burns`
- `/areas/hines`
- `/contact`
- `/resources/window-door-measurement-guide-harney-county`
- `/resources/inspection-repair-report-prep`

Keep full-service GC breadth visible, but make windows, doors, exterior openings, weather protection, and inspection repair the SEO wedge.

## Content And SEO Requirements

Preserve and verify:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/llms-full.txt`
- Canonical URLs
- LocalBusiness/HomeAndConstructionBusiness schema
- Oregon CCB #258533
- Phone and email consistency
- Harney County geography

Avoid unsupported claims:

- Reviews
- Ratings
- Awards
- Certifications
- Insurance partnerships
- Guaranteed response time
- Staff count
- Years in business
- Guaranteed savings
- Named customers
- Unverified project outcomes

Use `VERIFY BEFORE PUBLISHING` for anything useful but unverified.

## Recommended Connections

### Must Connect Or Repair

- Public domain traffic to the healthy Astro service after raw-route smoke checks
- `api.bensonhomesolutions.com` healthy domain mapping and TLS
- Hono API deployment with current route contracts
- Firestore storage with service account permissions
- Secret Manager bindings for API and site
- Google Analytics 4
- Google Tag Manager
- Search Console property and sitemap submission
- IndexNow submission
- Cloud Monitoring uptime checks

### Should Connect Next

- Google Workspace Gmail API for:
  - inbound lead intake
  - draft-first client replies
  - sent-message threading
  - job communication history
- Turnstile for public forms
- Twilio for emergency or urgent alerts
- Google Business Profile tracking and UTM discipline
- Cloud Scheduler for health checks, reconciliation, and reminder jobs
- Cloud Logging alerts for 5xx rates and failed form submissions

### Connect Later Only When Productized

- QuickBooks for invoice sync
- DocuSign for signed work authorization
- Stripe for deposits or online payment
- Call tracking, only if NAP consistency is preserved
- CRM pipeline tooling, only after the lead workflow is stable

## Operational Rules

- Never deploy from a mixed dirty tree unless the intended release set is explicitly listed.
- Probe raw Cloud Run URLs before shifting domain traffic.
- Probe public domains after shifting traffic.
- Record previous Cloud Run revisions and rollback commands before changing traffic.
- Do not submit Search Console or IndexNow until live route probes pass.
- Treat provider failures as degraded operations, not silent success.
- Lead and emergency submissions must persist durably before notification failures are reported.
- Webhook mutation routes must require authentication or a shared secret.

## Immediate Remediation Sequence

1. Smoke the raw Astro service:
   - `/`
   - `/contact`
   - `/services`
   - `/services/window-door-replacements`
   - `/robots.txt`
   - `/sitemap.xml`
   - `/llms.txt`
   - `/llms-full.txt`
2. Smoke the raw API service:
   - `/health`
   - `/api/services`
   - `/api/plans`
   - `/api/service-areas`
   - `/api/tools/subscription-recommendation`
3. Repair `api.bensonhomesolutions.com` mapping.
4. Deploy or promote the Hono API after tests pass.
5. Align email implementation and env:
   - choose Gmail API or Resend
   - update health checks
   - bind required secrets
   - verify a controlled non-production message path
6. Shift apex/www traffic from failing `benson-website-v6` to the verified Astro service.
7. Probe production public routes.
8. Submit sitemap/Search Console/IndexNow.
9. Add Cloud Monitoring uptime checks and 5xx alerts.

## Verification Commands

Use current equivalents as the repo evolves:

```bash
npm run format:check
npm run hooks:smoke
npm run test
npm run build

gcloud run services list --region=us-west1
gcloud beta run domain-mappings list --region=us-west1

curl -I -L --max-time 20 https://bensonhomesolutions.com/
curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
curl -sS --max-time 20 https://api.bensonhomesolutions.com/health
```

For raw service smoke:

```bash
curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/
curl -sS --max-time 20 https://benson-api-v6-ecdo5oua2a-uw.a.run.app/health
```

## Open Decisions

- Whether Gmail API fully replaces Resend for notifications, or Gmail is used for draft/client workflows while Resend handles transactional delivery.
- Whether the production Astro service should replace `benson-website-v6` directly or be renamed/promoted through a clean Cloud Run service migration.
- Whether Cloud CDN should be added immediately after cutover or after a short stability window.
- Whether a lightweight CRM pipeline should be built in the Hono admin surface or connected to an external CRM.

## Semrush Note

Semrush MCP data was unavailable during the 2026-06-29 review because the current Semrush plan did not include MCP access. If quantitative SEO, traffic, competitor, or keyword reports are required, upgrade access and rerun the SEO research pass.
