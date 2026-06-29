# Next Handoff Prompt

Use this prompt for the next agent or fresh Codex context.

```txt
You are continuing the Benson Home Solutions Astro/Hono migration in `/home/elric/Projects/benson-home-solutions`.

User intent:
- Complete the verified non-Next migration.
- Public site target: Astro + TypeScript.
- API/admin backend target: Hono + TypeScript.
- Shared contract target: `packages/shared`.
- Hosting target remains Google Cloud Run, but do not deploy from the dirty tree.
- Run the tasklist goal by goal. After each goal reaches its acceptance criteria, run that goal's verification gate before moving on.

Required first reads:
1. `AGENTS.md`
2. `docs/platform-review.md`
3. `docs/target-architecture.md`
4. `docs/migration-handoff.md`
5. `docs/astro-hono-migration-tasklist.md`

Current implementation state:
- `packages/shared` exists and owns public business facts, route constants, public service/area/plan data, resource stubs, subscription assumptions, and tests.
- `site` exists as an Astro static scaffold. It builds 32 static pages under Node 22.
- `backend/src-hono` exists as a Hono API scaffold. It preserves basic public API contracts and health/provider status semantics.
- Legacy `frontend` Next.js and legacy `backend/src` Node API remain present until route/API parity and deployment acceptance are proven.
- The worktree has many pre-existing unrelated dirty files. Do not publish, commit, deploy, or mass-format this tree as-is.

Known verification facts from the prior pass:
- `npm run test:shared` passed.
- `npm run test:site` passed.
- `npm run test:backend` passed, including legacy backend tests and Hono tests.
- `npm run build:backend` passed.
- `npx -y -p node@22 -c 'cd site && npm run build'` passed.
- `npm run format:check` passed.
- `npm run hooks:smoke` passed.
- `npm audit --audit-level=high` exited 0 after Playwright remediation; moderate audit findings remain.

Important runtime note:
- Astro 7 requires Node >=22.12.0. Use Node 22 for `site`.
- Hono/backend remains Node >=20.9.0.
- The local default shell Node may be v18.19.1, so use an explicit Node 22 runner for Astro checks until the host default is upgraded.

Execution rule:
- Work one goal at a time from `docs/astro-hono-migration-tasklist.md`.
- Do not mark a goal complete unless its acceptance criteria and verification gate pass.
- If a gate fails, fix the failure or document the blocker before starting the next goal.
- Do not deploy until the tasklist reaches the clean publish tree and Cloud Run revision gates.
```
