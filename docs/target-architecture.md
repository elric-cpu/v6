# Benson Target Architecture

Date: 2026-06-28

## Boundary Map

| Layer               | Target                                                                                         | Owner            | Health check                                                                                     | Required secrets/config                                                                                     | Failure mode                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Public frontend     | Astro static site on Cloud Run service `benson-website-v6`                                     | Frontend         | `curl -I https://bensonhomesolutions.com/`, plus route probes for SEO files                      | `PUBLIC_API_URL`, `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_GTM_ID`, `PUBLIC_GSC_VERIFICATION`                    | Public routes fail or forms cannot reach API               |
| Public SEO surfaces | Astro-generated static routes for `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt` | Frontend         | `curl -I` for each route and sitemap submission status                                           | Search Console property `sc-domain:bensonhomesolutions.com`, IndexNow key/config                            | Search engines lose canonical route discovery              |
| API/admin           | Hono TypeScript service on Node 20, Cloud Run service `benson-api-v6`                          | Backend          | `curl https://api.bensonhomesolutions.com/health` after DNS repair; raw Cloud Run URL until then | `FRONTEND_ORIGIN`, storage/provider env, service account                                                    | Lead capture/admin unavailable or degraded provider status |
| API custom domain   | `api.bensonhomesolutions.com` mapped to `benson-api-v6`                                        | Infra            | `dig +short api.bensonhomesolutions.com` and HTTPS `/health`                                     | Cloud Run domain mapping and DNS records                                                                    | Frontend must use raw Cloud Run URL until fixed            |
| Shared contracts    | `packages/shared` TypeScript package                                                           | Frontend/Backend | `cd packages/shared && npm run typecheck && npm run test`                                        | None                                                                                                        | Frontend/backend contract drift                            |
| Data                | Firestore Native `(default)` in `us-west1`                                                     | Backend/Infra    | API `/health` database status and Firestore console checks                                       | Service account IAM, collection names                                                                       | Leads/emergency requests fail to persist                   |
| Admin auth          | Google OAuth/Workspace identity plus signed session cookie                                     | Backend/Frontend | `GET /api/admin/session`, admin login smoke                                                      | `GOOGLE_OAUTH_CLIENT_ID`, `ADMIN_SESSION_SECRET`, `ADMIN_ALLOWED_EMAILS` or `ADMIN_ALLOWED_DOMAIN`          | Admin disabled or unauthorized access risk                 |
| Lead intake         | `/api/leads` and `/api/emergency-requests`                                                     | Backend          | Valid test submission in non-production or controlled production smoke                           | `LEAD_STORAGE_BACKEND`, `LEAD_REQUESTS_COLLECTION`, `EMERGENCY_REQUESTS_COLLECTION`, `LEAD_NOTIFICATION_TO` | Store-only or reject submissions; notify owner             |
| Email notification  | Google Workspace Gmail delegated send or Resend if explicitly configured                       | Backend/Ops      | Provider health key and controlled message test                                                  | Gmail delegation env or Resend API vars                                                                     | Submission stored but email notification unhealthy         |
| SMS notification    | Twilio if enabled                                                                              | Backend/Ops      | Provider health key and controlled SMS test                                                      | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `SMS_TO`                                   | Submission stored but SMS notification unhealthy           |
| Payments            | Stripe only if productized                                                                     | Backend/Ops      | Provider health and webhook smoke                                                                | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`                                                                | Payment/admin features disabled                            |
| Documents           | DocuSign only when contract workflow is enabled                                                | Backend/Ops      | Provider health and template smoke                                                               | `DOCUSIGN_INTEGRATION_KEY`, `DOCUSIGN_ACCOUNT_ID`                                                           | Contract automation disabled                               |
| Accounting          | QuickBooks only when invoice sync is enabled                                                   | Backend/Ops      | Provider health and sandbox sync test                                                            | `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_REFRESH_TOKEN`, `QUICKBOOKS_REALM_ID`       | Draft invoice/sync disabled                                |

## Runtime Topology

```txt
User/browser
  -> bensonhomesolutions.com / www.bensonhomesolutions.com
  -> Cloud Run custom domain mapping
  -> benson-website-v6
       - Astro-generated public pages and SEO files
       - API-dependent islands only for forms, calculator, and admin

API clients
  -> api.bensonhomesolutions.com after DNS repair
  -> fallback raw Cloud Run URL until then
  -> benson-api-v6
       - Hono routes
       - /health
       - public content APIs where still needed
       - lead and emergency request validation/persistence
       - admin auth/session/dashboard
       - provider health aggregation
       - lead-to-cash orchestration
```

## Public Route Preservation

Preserve these routes exactly unless an explicit redirect map is committed and tested:

- `/`
- `/services`
- `/services/[slug]`
- `/areas`
- `/areas/[area]`
- `/resources`
- `/resources/[slug]`
- `/plans`
- `/contact`
- `/how-we-work`
- `/tools/subscription-recommendation`
- `/window-screen-repair-harney-county-or`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/llms-full.txt`

Core content for those routes must come from `packages/shared`, Astro content collections, or checked-in static data at build time. Backend outages may affect forms and admin screens, but must not blank public pages.

## Deployment Boundary

Safe release order:

1. Build and test locally in a clean branch or isolated clean publish tree.
2. Deploy a new Cloud Run revision without moving traffic where practical.
3. Probe the revision URL directly.
4. Probe public SEO routes and API health.
5. Submit sitemap/IndexNow only after route probes pass.
6. Move traffic.
7. Probe live domains.
8. Keep the previous revision available for rollback.

Rollback:

- Frontend: shift Cloud Run traffic back to the previous known-good `benson-website-v6` revision.
- API: shift Cloud Run traffic back to the previous known-good `benson-api-v6` revision.
- DNS: keep `bensonhomesolutions.com` and `www` mapped to the frontend service; repair `api` DNS separately without disturbing apex/www.
- Data: do not run destructive Firestore migrations without an export and explicit approval.
