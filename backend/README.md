# Benson Home Solutions Backend

Node.js API for the Benson Home Solutions website.

## Purpose

This service exposes the public content and intake endpoints used by the frontend. It keeps the contract small, predictable, and aligned with the docs-style site copy.

## Runtime

- Node.js 18+
- JavaScript ES modules
- Built-in `http` server
- In-memory storage for the current public content and lead intake flows

## Getting Started

```bash
cd backend
npm install
npm start
```

The server listens on `http://localhost:4000` by default.

## Test

```bash
npm test
```

## Routes

### `GET /health`

Returns runtime health plus safe metadata.

Response shape:

```json
{
  "status": "healthy",
  "timestamp": "2026-05-29T00:00:00.000Z",
  "version": "0.1.0",
  "metadata": {
    "frontendOrigin": "http://localhost:5173",
    "port": 4000
  },
  "services": {
    "database": "unhealthy",
    "email": "unhealthy",
    "stripe": "unhealthy"
  }
}
```

### `GET /api/services`

Returns the active service cards used by the frontend.

### `GET /api/images`

Returns public image metadata only.

### `GET /api/plans`

Returns active public maintenance plans.

### `GET /api/service-areas`

Returns the current Harney County service-area data.

### `GET /api/tools/subscription-recommendation`

Educational recommendation endpoint for public plan fit.

Required query parameters:

- `propertyType`
- `squareFootage`
- `propertyAge`
- `region=harney-county`

Optional query parameter:

- `homeValue`

The response returns the recommended plan, calculation assumptions, and a disclaimer. It does not guarantee price, timing, or savings.

### `POST /api/leads`

Submits a standard lead request.

### `POST /api/emergency-requests`

Submits a priority condition request.

## Environment Variables

- `PORT`
- `FRONTEND_ORIGIN`
- `DATABASE_URL`
- `EMAIL_FROM`
- `EMAIL_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Notes

- CORS allows the frontend development origin and any configured `FRONTEND_ORIGIN`
- Errors use the predictable `{ error: { code, message, details? } }` shape
- Keep internal pricing assumptions out of public responses unless explicitly approved
