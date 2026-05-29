# 2026-05-24 Stashed Work Instructions

## Current Baseline

- Repository: `/home/elric/Projects/benson-home-solutions`
- Branch: `main`
- Baseline status when this file was created: clean, tracking `origin/main`
- Preserved stash: `stash@{0}`
- Stash message: `On main: wip-before-companycam-cleanup-2026-05-24`
- Stash timestamp: `Sun May 24 22:50:50 2026`

Do not apply this stash directly to `main` before new CompanyCam work. Keep `main`
clean and recover this work on a separate branch when it is ready for review.

## Recovery Commands

Inspect the preserved work:

```bash
git stash list --date=local
git stash show --stat stash@{0}
git stash show --name-status --include-untracked stash@{0}
```

Recover the work onto a dedicated branch:

```bash
git stash branch wip/rebate-portal-recovery stash@{0}
```

If the stash reference changes because newer stashes are added, use the stash
message `wip-before-companycam-cleanup-2026-05-24` to identify the correct entry.
Do not run `git stash pop` from `main`.

## Workstreams In The Stash

The stash is not one small change. It should be reviewed and split before merging.

### Monorepo and Runtime Setup

- Root workspace files: `package.json`, `package-lock.json`, `.nvmrc`, `.env.template`
- Workspace packages under `packages/analytics`, `packages/config`, `packages/content`,
  `packages/contracts`, and `packages/seo`
- Root dev script: `scripts/dev.mjs`
- Dependency and runtime changes in `frontend/package.json`, `frontend/package-lock.json`,
  `backend/package.json`, and `backend/package-lock.json`

Review first because later frontend/backend changes import these packages.

### Infrastructure and Deployment

- Docker files: `backend/Dockerfile`, `backend/.dockerignore`, and frontend Docker edits
- Terraform and infra docs under `infra/`
- Config changes in `frontend/next.config.mjs`
- Local/deployment docs in `README.md`, `backend/README.md`, `backend/CLAUDE_HANDOFF.md`,
  and `backend/TODO.md`

Review separately from product features. Verify these changes do not introduce
secret-shaped values into committed docs.

### Same-Origin API Proxy and Public Content

- Next API proxy: `frontend/src/app/api/[...path]/route.ts`
- Public content client/data files: `frontend/src/lib/public-api.ts`,
  `frontend/src/data/publicContent.ts`, and `backend/src/data/public-data.js`
- API client/type changes in `frontend/src/lib/api.ts` and `frontend/src/types/index.ts`

This group should be checked before any page or tool work that depends on backend
requests from the staff portal or website.

### Analytics and Consent

- Consent UI: `frontend/src/components/ConsentBanner.tsx`
- Analytics package and Google Analytics rewiring:
  `packages/analytics/` and `frontend/src/components/GoogleAnalytics.tsx`
- Related metadata/layout changes in `frontend/src/app/layout.tsx` and
  `frontend/src/lib/metadata.ts`

Verify consent-gated tracking behavior before deployment. Do not treat source
wire-up alone as proof that production analytics behavior is correct.

### Tools and Lead-Generation Features

- Rebate finder backend: `backend/src/data/rebate-programs.js`,
  `backend/src/services/rebate-finder.js`, and route wiring in `backend/src/app.js`
- Rebate finder frontend: `frontend/src/app/tools/rebate-finder/page.tsx`,
  `frontend/src/components/RebateFinderCTA.tsx`, and
  `frontend/src/components/RebateFinderForm.tsx`
- Church and commercial tools:
  `backend/src/services/church-assessments.js` and
  `backend/src/services/commercial-property-health-score.js`
- Tests expanded in `backend/test/public-api.test.js` and
  `frontend/test/content-contract.test.ts`

Split this group by tool if review gets large. Confirm all claims and program
guidance are presented as planning-oriented, not guaranteed eligibility or official
authority.

### Notification and Intake Work

- Intake persistence and delivery services:
  `backend/src/services/intake-store.js`,
  `backend/src/services/notification-delivery.js`,
  `backend/src/services/leads.js`, and
  `backend/src/services/emergency-requests.js`
- Notification tests: `backend/test/notification-delivery.test.js`
- HTTP/health support changes: `backend/src/lib/http.js` and
  `backend/src/services/health.js`

Review this as an operations batch. Verify degraded health payloads are reported
plainly and that Gmail-only notification expectations are preserved.

### Website Content and Presentation

- Page/content edits across home, services, areas, plans, contact, and resources
- New testimonials data/components:
  `frontend/src/components/TestimonialsSection.tsx` and
  `frontend/src/data/testimonials.ts`
- Brand/company and image metadata changes in `frontend/src/data/company.ts`,
  `frontend/src/data/servicePageContent.ts`, and `frontend/src/data/siteImages.ts`
- Generated or exported docs: `llms-full.txt` and `frontend/public/llms-full.txt`

Review claims carefully. Do not publish invented testimonials, reviews, awards,
certifications, staff counts, response guarantees, or customer names.

### Agent and Project Instructions

- `AGENTS.md` was heavily rewritten in the stash.
- Root `TODO.md` was added.
- Backend research notes were added in `backend/TOOL_BACKLINK_RESEARCH.md`.

Review these before accepting them because agent instructions affect future work
across the repo.

## Recommended Review Order

1. Create `wip/rebate-portal-recovery` from the stash.
2. Verify the branch builds or at least exposes current failures without making
   more edits.
3. Split infrastructure/config and workspace package changes first.
4. Split same-origin API proxy and public content extraction second.
5. Split analytics/consent third.
6. Split notification/intake fourth.
7. Split each tool feature separately.
8. Review content/docs last after the underlying data and routes are stable.

## Cleanup Notes

Ignored local files still present after cleanup were intentionally left alone:

- `node_modules/`, `backend/node_modules/`, and `frontend/node_modules/`
- `.claude/`, `frontend/.claude/`, `.remember/`, `.turbo/`
- `.git-frontend-backup/`
- `frontend/.env.example`
- `frontend/next-env.d.ts`

Do not run a broad `git clean -fdX` unless you explicitly want to remove local
dependencies, agent state, and backup metadata.
