# v6

Monorepo for the Benson Home Solutions v6 project.

## Structure

- `frontend/`: Next.js marketing site and landing pages
- `backend/`: Node-based API surface for site content, lead intake, and tools
- `scripts/`: project utility scripts
- `tmp/`: local scratch output

## Git Notes

This repository was scaffolded at the project root so the frontend and backend can be versioned together.

The original nested frontend git metadata is preserved separately as a backup during migration.

## Quick Start

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm test
npm start
```
