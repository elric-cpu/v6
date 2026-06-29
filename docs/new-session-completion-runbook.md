# Production Completion Runbook

Date: 2026-06-29

Use this file as the first read in a fresh Codex session when the goal is to completely finish building, improving, connecting, and publishing the Benson Home Solutions website and related platform tasks. This is the production copy of the completion runbook.

## First Message To Give The New Session

```txt
We are in /home/elric/Projects/benson-home-solutions.

Read AGENTS.md first, then docs/website-platform-operating-model.md, then docs/production-completion-runbook.md.

Goal: finish the Benson Home Solutions public website and platform end to end. This means a high-performing Astro + TypeScript public site on Google Cloud Run, a Hono + TypeScript API/admin/forms backend, working domains, working lead intake, correct Google Workspace/Gmail or Resend email path, Search Console/IndexNow, analytics conversion tracking, uptime monitoring, and clean docs.

Do not preserve old language/framework choices just because they exist. The target is Astro static-first public site plus Hono API/admin on Cloud Run unless current probes prove a better option.

Do not deploy or shift traffic from a dirty tree. Re-probe live hosting state before acting. The 2026-06-29 state may have changed.
```

## Non-Negotiables

- Public site target: Astro + TypeScript, static-first.
- API/admin/forms target: Hono + TypeScript on Cloud Run.
- Shared contracts and public data target: `packages/shared`.
- Public positioning: full-service GC in Harney County, Oregon, with a visible window and door replacement niche.
- Keep Harney County as the public geography.
- Preserve SEO surfaces: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`.
- Do not invent reviews, ratings, awards, certifications, response-time guarantees, staff count, years in business, savings, customer names, or project outcomes.
- Lead and emergency submissions must persist before notification failures are reported.
- Webhook mutation endpoints must be authenticated or shared-secret protected.
- Never expose secrets or commit `.env` files.

## Immediate Recon

Run these first and capture the output in the session notes:

```bash
pwd
git status --short
npm --version
node --version

gcloud config get-value project
gcloud auth list --filter=status:ACTIVE --format='value(account)'
gcloud run services list --region=us-west1
gcloud beta run domain-mappings list --region=us-west1

curl -I -L --max-time 20 https://bensonhomesolutions.com/
curl -I -L --max-time 20 https://www.bensonhomesolutions.com/
curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
curl -sS --max-time 20 https://api.bensonhomesolutions.com/health || true

curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/
curl -sS --max-time 20 https://benson-api-v6-ecdo5oua2a-uw.a.run.app/health
```

Expected older state from 2026-06-29:

- `bensonhomesolutions.com` and `www` mapped to `benson-website-v6`.
- `benson-website-v6` served legacy Next.js and returned HTTP 500 on `/`.
- `benson-website-production-astro` returned HTTP 200 on its raw URL.
- `benson-api-v6` raw `/health` returned HTTP 200 but degraded.
- `api.bensonhomesolutions.com` mapping was unhealthy.

If current probes differ, trust current probes over this file.

## Phase 1: Stabilize The Public Website

1. Verify the Astro service output locally:

   ```bash
   npm run test:shared
   npm run test:site
   npx -y -p node@22 -c 'cd site && npm run build'
   ```

2. Smoke the raw Astro Cloud Run service:

   ```bash
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/contact
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/services
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/services/window-door-replacements
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/robots.txt
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/sitemap.xml
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/llms.txt
   curl -I -L --max-time 20 https://benson-website-production-astro-ecdo5oua2a-uw.a.run.app/llms-full.txt
   ```

3. If raw Astro is healthy, prepare a clean release path before moving domain traffic:
   - list intended files;
   - exclude unrelated dirty work;
   - record current Cloud Run revisions for rollback;
   - deploy a new revision without traffic when practical.

4. Shift `bensonhomesolutions.com` and `www` only after raw probes pass.

5. After traffic shift, verify live:

   ```bash
   curl -I -L --max-time 20 https://bensonhomesolutions.com/
   curl -I -L --max-time 20 https://www.bensonhomesolutions.com/
   curl -I -L --max-time 20 https://bensonhomesolutions.com/contact
   curl -I -L --max-time 20 https://bensonhomesolutions.com/services/window-door-replacements
   curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
   curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
   curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
   curl -I -L --max-time 20 https://bensonhomesolutions.com/llms-full.txt
   ```

## Phase 2: Finish Site Quality And Conversion

Make the public site feel complete for a Harney County GC with a window/door niche.

Required route priorities:

- `/`
- `/services/window-door-replacements`
- `/window-door-replacement-harney-county-or`
- `/window-replacement-burns-or`
- `/door-replacement-burns-or`
- `/services/inspection-repairs`
- `/services/water-mold-moisture`
- `/services/emergency-response`
- `/areas/burns`
- `/areas/hines`
- `/contact`
- `/resources/window-door-measurement-guide-harney-county`
- `/resources/inspection-repair-report-prep`

Required UX:

- phone CTA visible on every page;
- window/door CTA visible above the fold on the homepage;
- contact form works without blanking public content if API is down;
- emergency path is distinct from standard lead path;
- real work images only;
- no fake trust claims;
- clear Oregon CCB #258533;
- Burns/Hines primary, remote Harney County route-dependent.

Required analytics events:

- phone click;
- contact form submit success;
- contact form error;
- emergency CTA click;
- window/door CTA click;
- quote/review request start;
- quote/review request success.

## Phase 3: Finish Hono API And Domains

1. Verify local Hono:

   ```bash
   npm run build:hono --workspace backend
   node --import tsx --test backend/test-hono/*.test.ts
   npm run test --workspace backend
   npm run build --workspace backend
   ```

2. Verify these Hono contracts:
   - `GET /health`
   - `GET /api/services`
   - `GET /api/images`
   - `GET /api/plans`
   - `GET /api/service-areas`
   - `GET /api/tools/subscription-recommendation`
   - `POST /api/leads`
   - `POST /api/emergency-requests`
   - `GET /api/admin/session`
   - `POST /api/admin/auth/google`
   - `GET /api/admin/dashboard`
   - `GET /api/lead-cash/workflows/:workflowId`
   - `POST /api/lead-cash/webhooks`

3. Repair `api.bensonhomesolutions.com` mapping and TLS.

4. Deploy Hono API only after route tests and raw Cloud Run health pass.

5. Verify:

   ```bash
   curl -sS --max-time 20 https://api.bensonhomesolutions.com/health
   curl -sS --max-time 20 https://api.bensonhomesolutions.com/api/services
   ```

## Phase 4: Decide And Connect Email

Choose one primary production notification path and make code, env, health checks, docs, and tests agree.

Recommended:

- Gmail API for Google Workspace-native workflows:
  - inbound lead intake;
  - draft-first client replies;
  - sent-message threading;
  - mailbox continuity for `office@bensonhomesolutions.com`.
- Resend only if intentionally used for transactional outbound messages.

Do not leave mixed production env where health checks expect one provider and delivery code expects another.

Required verification:

- secret bindings present;
- provider health reports healthy or intentionally disabled;
- controlled non-production lead creates durable record;
- notification failure does not lose stored submission;
- no secrets in logs or API payloads.

## Phase 5: Connect Security, Admin, And Lead-Cash

Required production settings:

- `ADMIN_SESSION_SECRET`
- `GOOGLE_OAUTH_CLIENT_ID`
- `ADMIN_ALLOWED_EMAILS` or `ADMIN_ALLOWED_DOMAIN`
- `LEAD_CASH_WEBHOOK_SECRET`
- Firestore/storage config
- frontend origin

Admin requirements:

- approved Google identity only;
- httpOnly signed session cookie;
- dashboard does not expose secrets;
- mutating admin actions require confirmation;
- audit log entries for mutating operations.

Lead-cash requirements:

- workflow created after durable lead intake;
- webhook mutations require shared secret or provider signature;
- duplicate/out-of-order events are safe;
- provider IDs and event keys are stable;
- QuickBooks/DocuSign/Stripe remain disabled until productized.

## Phase 6: Search, Analytics, And Monitoring

After public routes are live and stable:

1. Submit sitemap to Search Console.
2. Submit priority URLs to IndexNow.
3. Verify GA4/GTM events.
4. Add Cloud Monitoring uptime checks:
   - `https://bensonhomesolutions.com/`
   - `https://bensonhomesolutions.com/contact`
   - `https://bensonhomesolutions.com/sitemap.xml`
   - `https://bensonhomesolutions.com/llms.txt`
   - `https://api.bensonhomesolutions.com/health`
5. Add alerts for:
   - website 5xx;
   - API 5xx;
   - failed lead submissions;
   - provider health degradation;
   - Search Console submit failures.

## Phase 7: Documentation Cleanup

Update stale docs after implementation:

- `README.md`
- `backend/README.md`
- `docs/migration-handoff.md`
- `docs/platform-review.md`
- `docs/target-architecture.md`
- `docs/astro-hono-migration-tasklist.md`
- `docs/next-handoff-prompt.md`
- `docs/website-platform-operating-model.md`

Remove or clearly mark superseded Next.js/legacy instructions.

Docs must not claim production is fixed until live probes prove it.

## Phase 8: Final Verification Gate

Run the broad local gate:

```bash
npm run format:check
npm run hooks:smoke
npm run lint
npm run test
npm run build
```

Run live probes:

```bash
curl -I -L --max-time 20 https://bensonhomesolutions.com/
curl -I -L --max-time 20 https://www.bensonhomesolutions.com/
curl -I -L --max-time 20 https://bensonhomesolutions.com/robots.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/sitemap.xml
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms.txt
curl -I -L --max-time 20 https://bensonhomesolutions.com/llms-full.txt
curl -sS --max-time 20 https://api.bensonhomesolutions.com/health
```

Run lead intake smoke in a controlled non-production or explicitly approved production-safe mode.

## Completion Definition

The work is complete only when:

- production homepage returns HTTP 200;
- public domain serves the intended Astro site;
- API custom domain returns healthy `/health`;
- lead and emergency submissions persist durably;
- notification path is chosen, configured, tested, and documented;
- admin auth works for approved Google accounts;
- lead-cash intake and webhook mutation paths are protected and tested;
- Search Console and IndexNow submission succeed after route probes pass;
- analytics events exist for key conversions;
- uptime checks and alerts exist;
- stale docs are updated;
- rollback commands are recorded;
- all claimed local and live checks were actually run.

## Memory And Session Notes

If Mem0 is available in the new session:

```txt
/mem0:onboard
/mem0:health
```

If Mem0 tools are not available, continue using repo-local docs and the existing Codex memory system. Do not block production work on Mem0.
