# Refactor Problem Log

Date: 2026-06-29

This file records problems encountered while completing the Astro/Hono refactor, release isolation, and deployment tasks. Items are ranked by severity.

## Critical

1. Public Astro forms initially failed through same-origin `/api/*`.
   - Evidence: after shifting the public site to Astro, `POST https://bensonhomesolutions.com/api/leads` returned HTTP 404.
   - Cause: Astro forms posted to same-origin `/api/leads` and `/api/emergency-requests`, but the static site server only served files and did not proxy API routes.
   - Mitigation: added a same-origin `/api/*` proxy in `site/server.mjs` with `API_ORIGIN` support, defaulting to the raw API Cloud Run service URL.
   - Verification: local proxy smoke through `http://127.0.0.1:4329/api/leads` returned success and persisted lead `6e3a0b4c-d28c-47fe-b736-b126c116cb74`.
   - Updated verification: tagged revision `benson-website-v6-00041-tat` proxied `/api/leads` successfully, traffic was shifted to it, and live public `https://bensonhomesolutions.com/api/leads` persisted lead `f81bffaa-f1fa-4757-81c2-2ed9fe177530`.
   - Next action: keep the proxy until `api.bensonhomesolutions.com` is healthy and the frontend can intentionally use the canonical API host if desired.

2. Production homepage was down on the public domain before the Astro traffic shift.
   - Evidence: `curl -I -L --max-time 20 https://bensonhomesolutions.com/` and `https://www.bensonhomesolutions.com/` returned HTTP 500.
   - Current mapping: apex and `www` are still mapped to Cloud Run service `benson-website-v6`.
   - Mitigation: deployed and probed Astro revision `benson-website-v6-00039-wiy`, then shifted `benson-website-v6` traffic to it.
   - Verification: apex, `www`, `/contact`, `/services/window-door-replacement`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` all returned HTTP 200 after the traffic shift.

3. `api.bensonhomesolutions.com` is not healthy.
   - Evidence: Cloud Run domain mapping status is `False` with message: `Waiting for certificate provisioning. You must configure your DNS records for certificate issuance to begin. Resource readiness deadline exceeded.`
   - Evidence: `curl -sS --max-time 20 https://api.bensonhomesolutions.com/health` failed with `OpenSSL SSL_connect: SSL_ERROR_SYSCALL`.
   - Mitigation attempt: deleted and recreated the Cloud Run domain mapping on 2026-06-29. The recreated mapping is routable and still requires `api CNAME ghs.googlehosted.com`, which public DNS already returns.
   - Current state after recreation: certificate status is `Unknown` / `CertificatePending`; Cloud Run reports it will retry certificate polling after the next interval, and HTTPS still fails.
   - Impact: public site/API integration through the canonical API hostname is unreliable or unavailable.
   - Next action: re-probe certificate status after Google-managed certificate polling; if it remains stuck, inspect authoritative DNS/CAA and consider moving API behind a load balancer certificate or using the same-origin site proxy permanently.

## High

3. Raw deployed API is degraded.
   - Evidence: `https://benson-api-v6-ecdo5oua2a-uw.a.run.app/health` returned `status: degraded`.
   - Reported unhealthy providers: `email`, `sms`, and `stripe`.
   - Impact: lead storage may work, but production notifications and payment-adjacent provider health are not production-clean.
   - Next action: choose the production email path, preferably Gmail API for Workspace-native workflows, align environment variables and health checks, and intentionally disable or configure SMS/Stripe.

4. Existing Cloud Build triggered by the pushed refactor commit failed.
   - Evidence: `gcloud builds list --limit=3` showed build `0eab69a4-db18-4504-8808-8f3c30d5392c` as `FAILURE` for branch `main`.
   - Impact: automated deploy/build pipeline cannot be trusted until logs are reviewed and the trigger is repaired or disabled.
   - Next action: inspect Cloud Build logs, identify whether the trigger is legacy Next.js, missing Dockerfile context, Node-version mismatch, or configuration drift.

5. Deployment image pushes did not complete visibly.
   - Evidence: local Docker builds for the site and API images succeeded, but Artifact Registry did not show the expected `223fc32` image tags after the push sessions were interrupted.
   - Updated evidence: the site image tag `6bc85a3` pushed successfully, but the API image push for `us-west1-docker.pkg.dev/civic-wall-494004-b3/benson-api/benson-api-v6:6bc85a3` remained active with no output for more than six minutes and the tag was still absent from Artifact Registry, so the stalled push was stopped.
   - Mitigation: narrowed `backend/Dockerfile` to install only the backend and shared workspaces; the rebuilt API image dropped from 1.37GB to 278MB.
   - Impact: Goal 7 no-traffic revision deployment is blocked until images are confirmed in Artifact Registry.
   - Next action: push the reduced API image and verify the tag with Artifact Registry before deploying the API revision.

## Medium

6. Astro site initially lacked GA/GTM and conversion event tracking.
   - Evidence: the Astro layout had no GA4/GTM scripts, and form submission code did not emit conversion events.
   - Build issue encountered: first analytics pass failed Astro type checking because `window.trackBensonEvent` was not typed.
   - Mitigation: added GA4 `G-RLQ31P5HD0`, GTM `GTM-TTZ2Z92K`, phone/contact/window-door click tracking, quote/emergency form start/success/error events, and a typed local tracking helper.
   - Verification: `npm run format:check` and Node 22 Astro build passed with 0 errors, 0 warnings, and 0 hints.

7. Local default Node version is too old for Astro.
   - Evidence: `node --version` returned `v18.19.1`.
   - Astro 7 requires Node 22.12 or newer.
   - Impact: plain `npm run build:site` or local scripts can fail unless they use the Node 22 wrapper.
   - Current mitigation: `scripts/run-site-command.mjs` and explicit `npx -y -p node@22` checks work.
   - Next action: upgrade the default project Node runtime or keep all site scripts pinned through the wrapper.

8. API Docker image build is slow and over-broad.
   - Evidence: `docker build -f backend/Dockerfile ...` spent about four minutes in root `npm ci` and installed 881 packages.
   - Mitigation: the workspace-scoped install now adds 142 packages and produced a 278MB image.
   - Impact: slower release cycle and more room for transient npm/network failures.
   - Next action: keep the workspace-scoped Dockerfile and verify future API pushes remain stable.

9. Goal 6 is verified locally, but Goal 7 remains blocked on confirmed images.
   - Evidence: format, hooks, tests, Astro build, image push, no-traffic revision deploys, and raw revision probes passed.
   - Mitigation: Goal 7 is now complete; website traffic is on `benson-website-v6-00041-tat` and API traffic is on `benson-api-v6-00017-nok`.
   - Remaining impact: Goal 8 is still active because the canonical API domain certificate remains unhealthy and indexing/monitoring work remains.
   - Next action: repair API domain mapping/certificate, then run indexing and monitoring follow-through.

## Low

10. The repo still carries legacy Next.js and legacy Node surfaces during migration.
   - Evidence: `frontend` and `backend/src` remain present by design until production cutover is verified.
   - Impact: larger repo and possible confusion about active production paths.
   - Next action: remove legacy surfaces only after Astro/Hono production parity, traffic shift, and rollback window are complete.

11. The latest status documentation has to be kept synchronized with deployment progress.
    - Evidence: Goal statuses were manually advanced as gates passed.
    - Impact: stale docs could mislead future deploy sessions.
    - Next action: update `docs/astro-hono-migration-tasklist.md` after each completed gate and commit those updates with the corresponding operational changes.
