# Backend Roadmap

## Workflow
- Use TDD for every backend slice: write a failing test, verify red, implement minimal code, verify green, refactor.
- After each completed slice:
  - update this file,
  - write the next slice prompt,
  - start the next slice from that prompt.

## Goal
Ship the Benson backend in product order, not generic hardening order:
- public website content APIs,
- lead intake and emergency intake,
- decision-support tools,
- operational readiness and integrations.

## Current Focus
- `Lead Intake Surface`
- Immediate next slice: add a safe retry/admin view for stored leads and emergency requests, including delivery status lookup and storage-provider diagnostics

## Product-Surface Roadmap

### 1. Public Website Content APIs
Endpoints:
- `/health`
- `/api/services`
- `/api/plans`
- `/api/service-areas`
- future: `/api/images`, `/api/resources`, `/api/seo`

Status:
- Core public content endpoints exist and are covered by tests.
- Public/internal field separation is enforced at the projection layer.
- Public image metadata surface now exists and services expose curated image records for the frontend.

Remaining work:
- [ ] Add resource/content surface for FAQs or resource pages if frontend requires it
- [ ] Reconcile any remaining Harney County ZIP coverage gaps where values are still unknown
- [ ] Reconcile public `href` values with the frontend route contract

### 2. Lead Intake Surface
Endpoints:
- `/api/leads`
- `/api/emergency-requests`

Status:
- Lead endpoint exists with required-field validation, normalization, CORS coverage, invalid JSON handling, payload-shape validation, field-level checks, and public-safe response metadata.
- Emergency request endpoint added with TDD: dedicated route that enforces `urgency="emergency"` and reuses lead validation baseline. Returns same public-safe response shape. Covered by 12 tests.

Remaining work:
- [x] Add persistence abstraction so lead storage can move from memory to Postgres or Firestore
- [x] Add notification delivery integration without leaking provider details in the response
- [ ] Decide whether optional location fields need stricter normalization or region-specific validation beyond current format/length checks

### 3. Decision-Support Tools Surface
Endpoints:
- `/api/tools/subscription-recommendation`
- future: `/api/church-assessments`
- future: `/api/commercial-property-health-score`

Status:
- Subscription recommendation exists with validated inputs, educational disclaimer, and echoed assumptions context.

Remaining work:
- [ ] Add richer assumptions metadata if the frontend contract requires it
- [ ] Add test coverage for commercial and churches/nonprofits recommendation branches
- [ ] Implement church/nonprofit assessment surface if requested by frontend
- [ ] Implement commercial property health score surface if requested by frontend

### 4. Operational Readiness Surface
Concern areas:
- env vars
- health status
- predictable errors
- route/method handling
- CORS
- persistence readiness

Status:
- `/health` exposes safe runtime metadata
- invalid JSON returns `400 INVALID_JSON`
- unsupported methods on known routes return `405 METHOD_NOT_ALLOWED`

Remaining work:
- [x] Document backend env vars in a backend-specific contract section
- [x] Add persistence-ready health substatus once database integration exists
- [ ] Add lightweight request logging/error diagnostics if needed
- [ ] Add startup/config validation for required production env vars

## Completed Foundation Work
- [x] Public service catalog aligned with `AGENTS.md`
- [x] Public image metadata endpoint and curated service image assignments added
- [x] Service-area coverage expanded and Harney remote communities marked `route-dependent`
- [x] Public content allowlists prevent internal field leaks
- [x] Subscription recommendation validation and assumptions baseline hardened
- [x] Lead validation improved for email, payload shape, phone, and message length
- [x] Lead response metadata now includes `createdAt` and public-safe delivery status
- [x] Lead and emergency submissions now persist delivery state after email attempts
- [x] Optional lead location fields now enforce ZIP format and city/address length limits
- [x] CORS, invalid JSON handling, and 405 behavior covered by tests

## Verification Baseline
- `npm test` currently passes

## Risks / Verify Before Publishing
- `VERIFY BEFORE PUBLISHING`: some Harney County entries still have incomplete `zipCodes` values
- `VERIFY BEFORE PUBLISHING`: public route `href` values should be checked against the frontend route contract
- `VERIFY BEFORE PUBLISHING`: if Firestore or Gmail permissions are missing in production, delivery will degrade to stored-only submissions with a failed delivery status

## Next Slice Prompt
`Add a retry/admin surface for stored lead and emergency requests. Write failing tests for listing recent submissions with delivery metadata and exposing a safe storage/provider health summary. Then implement the minimum repository and service changes needed to support operational retry handling without exposing internal-only fields.`
