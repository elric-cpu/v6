# Refactor Problem Log

Date: 2026-06-29

This file records problems encountered while completing the Astro/Hono refactor, release isolation, and deployment tasks. Items are ranked by severity.

## Critical

1. Production homepage is still down on the public domain.
   - Evidence: `curl -I -L --max-time 20 https://bensonhomesolutions.com/` and `https://www.bensonhomesolutions.com/` returned HTTP 500.
   - Current mapping: apex and `www` are still mapped to Cloud Run service `benson-website-v6`.
   - Impact: public users can hit a failed homepage even though static SEO files return 200.
   - Next action: deploy/probe a healthy Astro revision, then shift traffic only after raw revision checks pass.

2. `api.bensonhomesolutions.com` is not healthy.
   - Evidence: Cloud Run domain mapping status is `False` with message: `Waiting for certificate provisioning. You must configure your DNS records for certificate issuance to begin. Resource readiness deadline exceeded.`
   - Evidence: `curl -sS --max-time 20 https://api.bensonhomesolutions.com/health` failed with `OpenSSL SSL_connect: SSL_ERROR_SYSCALL`.
   - Impact: public site/API integration through the canonical API hostname is unreliable or unavailable.
   - Next action: inspect DNS records for `api.bensonhomesolutions.com`, repair the Google-managed certificate/domain mapping path, then re-probe HTTPS health.

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
   - Impact: Goal 7 no-traffic revision deployment is blocked until images are confirmed in Artifact Registry.
   - Next action: re-run `docker push` for both images and verify the tags with Artifact Registry before deploying Cloud Run revisions.

## Medium

6. Local default Node version is too old for Astro.
   - Evidence: `node --version` returned `v18.19.1`.
   - Astro 7 requires Node 22.12 or newer.
   - Impact: plain `npm run build:site` or local scripts can fail unless they use the Node 22 wrapper.
   - Current mitigation: `scripts/run-site-command.mjs` and explicit `npx -y -p node@22` checks work.
   - Next action: upgrade the default project Node runtime or keep all site scripts pinned through the wrapper.

7. API Docker image build is slow and over-broad.
   - Evidence: `docker build -f backend/Dockerfile ...` spent about four minutes in root `npm ci` and installed 881 packages.
   - Impact: slower release cycle and more room for transient npm/network failures.
   - Next action: narrow backend production dependencies or use workspace-focused install/build stages.

8. Goal 6 is verified locally, but Goal 7 remains blocked on confirmed images.
   - Evidence: format, hooks, tests, and Astro build passed from a clean pushed tree.
   - Impact: release isolation is good, but no new no-traffic Cloud Run revision has been deployed yet from the committed refactor.
   - Next action: complete image push, deploy no-traffic revisions, and probe raw revision URLs.

## Low

9. The repo still carries legacy Next.js and legacy Node surfaces during migration.
   - Evidence: `frontend` and `backend/src` remain present by design until production cutover is verified.
   - Impact: larger repo and possible confusion about active production paths.
   - Next action: remove legacy surfaces only after Astro/Hono production parity, traffic shift, and rollback window are complete.

10. The latest status documentation has to be kept synchronized with deployment progress.
    - Evidence: Goal statuses were manually advanced as gates passed.
    - Impact: stale docs could mislead future deploy sessions.
    - Next action: update `docs/astro-hono-migration-tasklist.md` after each completed gate and commit those updates with the corresponding operational changes.
