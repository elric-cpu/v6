# Benson Home Solutions

Monorepo for the Benson Home Solutions website and supporting API.

## What’s In Here

- `frontend/`: Next.js App Router site, docs-style pages, and public UI
- `backend/`: Node.js API for public content, intake, and the educational tool endpoints
- `docs/`: project notes and hook audits added during prior agent passes
- `llms.txt` / `llms-full.txt`: repo-level reference files for current public positioning

## Current Operating Model

- Public geography is Harney County only
- South County work is route-planned and logistics-dependent
- Public copy should stay documentation-first and avoid unsupported claims
- Real contact and license facts belong in code and docs, not in marketing guesses

## Production Target

- Frontend service: `benson-website-v6`
- API service: `benson-api-v6`
- Platform: Google Cloud Run
- Region: `us-west1`
- Custom domain: `bensonhomesolutions.com`

## Key Facts

- Brand: Benson Home Solutions
- Legal entity: Benson Enterprises, LLC
- Oregon CCB: #258533
- Phone: 541-321-5115
- Emergency phone: 541-413-0480
- Email: office@bensonhomesolutions.com

## Main Routes

- `/`
- `/services`
- `/services/[slug]`
- `/areas`
- `/areas/[area]`
- `/plans`
- `/contact`
- `/how-we-work`
- `/resources`
- `/resources/[slug]`
- `/tools/subscription-recommendation`
- `/window-screen-repair-harney-county-or`

## Public API Surface

- `GET /health`
- `GET /api/services`
- `GET /api/images`
- `GET /api/plans`
- `GET /api/service-areas`
- `GET /api/tools/subscription-recommendation`
- `POST /api/leads`
- `POST /api/emergency-requests`

## Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm test
npm start
```

## Verification

- Run frontend checks from `frontend/`
- Run backend tests from `backend/`
- Smoke the public routes and API endpoints after docs changes
- After deployment, verify `bensonhomesolutions.com` no longer serves the old Mid-Willamette Valley pages
