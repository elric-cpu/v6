# Benson Home Solutions Frontend

Next.js 16 frontend for the Benson Home Solutions website.

## What This App Contains

- Public service pages, service-area pages, resource pages, and the contact flow
- Live `/llms.txt` and `/llms-full.txt` routes generated from shared frontend data
- `robots.txt` and `sitemap.xml` metadata routes
- Educational subscription-recommendation tool

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Node.js scripts for deployment helpers and post-build submissions

## Common Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm test
```

`npm run start` launches the generated standalone server from `.next/standalone`.

## Project Layout

```txt
src/
  app/        Route handlers and pages
  components/ Shared UI components
  data/       Public content and route data
  lib/        Client helpers and text builders
  types/      Shared TypeScript types
scripts/      Deployment and startup helpers
test/         Node test files
```

## Public Route Surface

- `/`
- `/about`
- `/areas`
- `/contact`
- `/how-we-work`
- `/plans`
- `/privacy-policy`
- `/resources`
- `/services/[slug]`
- `/tools/subscription-recommendation`
- `/window-screen-repair-harney-county-or`
- `/llms.txt`
- `/llms-full.txt`

## Notes

- Harney County is the only public service geography.
- The copy intentionally avoids unsupported trust, ranking, outcome, or savings claims.
- Keep public content in `src/data` and route builders in `src/lib` so the page copy and reference files stay in sync.
