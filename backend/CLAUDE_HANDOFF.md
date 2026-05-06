# Backend Handoff

## Purpose
This file summarizes:
- what has been completed in the backend,
- what remains on the backend roadmap,
- where Claude, the frontend developer, should pick up next.

## Role Split
- Claude owns frontend work for this repo.
- Codex owns backend work for this repo.

This handoff is based on the current backend state in `/home/elric/Projects/v6/backend` and the roadmap in [TODO.md](/home/elric/Projects/v6/backend/TODO.md).

## Current Backend Status

### Implemented API Surfaces

#### Public Website Content APIs
Implemented:
- `GET /health`
- `GET /api/services`
- `GET /api/plans`
- `GET /api/service-areas`
- `GET /api/tools/subscription-recommendation`

#### Lead Intake API
Implemented:
- `POST /api/leads`

### Validation and Contract Work Completed

#### Public Content
Completed:
- service catalog aligned to the AGENTS-defined service groups
- added `commercial-maintenance` and `church-nonprofit-maintenance`
- Sweet Home 25-mile and Harney County service-area coverage expanded
- Harney remote communities marked `route-dependent`
- public/internal separation guardrails added through explicit response projection
- public endpoints now avoid leaking accidental internal-only source fields

#### Subscription Recommendation
Completed:
- validates `propertyType`
- validates `region`
- rejects missing required numeric inputs
- rejects zero-valued `squareFootage` and `propertyAge`
- preserves educational disclaimer
- echoes validated `propertyType` and `region` in `assumptions`

#### Lead Intake
Completed:
- required-field validation
- email validation
- phone validation
- message max-length validation
- plain-object payload validation
- invalid JSON handling
- optional `zipCode` format validation
- optional `city` max-length validation
- optional `address` max-length validation
- normalization/sanitization of stored string fields
- public-safe success response metadata:
  - `success`
  - `leadId`
  - `message`
  - `createdAt`
  - `delivery`

#### HTTP / Routing Baseline
Completed:
- CORS behavior covered
- invalid JSON returns `400 INVALID_JSON`
- unsupported methods on known routes return `405 METHOD_NOT_ALLOWED`
- OPTIONS preflight behavior covered by tests
- `/health` includes safe runtime metadata:
  - `frontendOrigin`
  - `port`

## Test Status
Current backend test result:
- `npm test` passes
- 29 tests passing
- 0 failing

## Remaining Backend Work

### Public Website Content APIs
Remaining:
- add `/api/images` if the frontend needs image metadata from backend instead of static imports
- add `/api/resources` if the frontend needs backend-driven FAQ/resource data
- reconcile incomplete Sweet Home-area ZIP coverage where values are still unknown
- confirm all public `href` values match actual frontend routes

### Lead Intake Surface
Remaining:
- decide whether optional location fields need stricter normalization beyond current format/length checks
- add dedicated `POST /api/emergency-requests` if frontend wants a separate emergency flow
- add persistence abstraction for leads instead of in-memory storage
- integrate actual delivery/notification provider behind the current `delivery` response metadata

### Decision-Support Tools
Remaining:
- add broader test coverage for non-residential recommendation branches
- implement `/api/church-assessments` if frontend needs it
- implement `/api/commercial-property-health-score` if frontend needs it

### Operational Readiness
Remaining:
- add env-var contract documentation for production setup
- add persistence-aware health status once database integration exists
- add startup/config validation for required production env vars

## Where Claude Should Pick Up

### 1. Confirm Frontend Route Contract Against Backend Hrefs
Claude should verify that frontend routes match the backend-public `href` values used in:
- `/api/services`
- `/api/service-areas`

Potential mismatch area:
- service links such as `/services/window-door-replacement` vs any actual frontend slug

If frontend routes differ, Claude should either:
- update the frontend to match backend contract, or
- hand back the exact contract delta so backend can change deliberately.

### 2. Decide Whether Frontend Needs Backend-Driven Images or Resources
Claude should confirm whether frontend still wants:
- `GET /api/images`
- `GET /api/resources`
- `GET /api/seo`

These are listed in `AGENTS.md` as suggested modules, but they are not implemented yet because no frontend contract currently requires them.

### 3. Decide Whether Emergency Intake Is a Separate Surface
Claude should confirm whether the frontend wants:
- one combined lead flow using `POST /api/leads`, or
- a separate emergency workflow using `POST /api/emergency-requests`

If Claude wants a separate emergency surface, backend is ready to implement it next using the existing lead-validation baseline.

### 4. Confirm Subscription Tool UI Scope
Claude should confirm whether the frontend will expose:
- residential recommendations only, or
- commercial and churches/nonprofits recommendation flows too

The backend data model already supports those branches, but frontend contract confirmation should drive next backend work.

## Recommended Next Backend Slice
If we continue backend work immediately, the most product-tied next slice is:

`Add an emergency intake surface with TDD. Write failing tests for POST /api/emergency-requests that reuses the lead-validation baseline but requires urgency to be emergency and returns the same public-safe response metadata shape as POST /api/leads.`

## Notes for Claude
- The backend is still in-memory for lead storage. Do not assume persistence exists yet.
- The API error contract is stable and should be preserved:

```ts
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

- The backend has been built contract-first where possible, but remaining surfaces should still be driven by explicit frontend needs.
