# Benson Home Solutions Backend

Node.js API for the Benson Home Solutions website.

## Purpose

This service exposes the public content and intake endpoints used by the frontend. It keeps the contract small, predictable, and aligned with the docs-style site copy.

## Runtime

- Node.js 18+
- JavaScript ES modules
- Built-in `http` server
- In-memory public content fixtures
- Durable lead and emergency intake storage through Firestore by default in production, with Postgres support when `DATABASE_URL` is configured
- Resend email delivery plus Twilio SMS notifications when the delivery env vars are present

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

The submission is stored durably through the active storage backend:

- `LEAD_STORAGE_BACKEND=firestore` uses the configured Firestore collections
- `DATABASE_URL` enables the Postgres-backed repository
- non-production test/dev defaults use in-memory storage unless a backend is configured

Notification delivery follows the active notification env vars:

- Resend email when `EMAIL_API_KEY`, `EMAIL_FROM`, and `EMAIL_TO` are set
- Twilio SMS when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, and `SMS_TO` are set

### `POST /api/emergency-requests`

Submits a priority condition request.

The submission follows the same delivery path as `POST /api/leads`.

## Environment Variables

- `PORT`
- `FRONTEND_ORIGIN`
- `LEAD_STORAGE_BACKEND`
- `LEAD_REQUESTS_COLLECTION`
- `EMERGENCY_REQUESTS_COLLECTION`
- `DATABASE_URL`
- `EMAIL_FROM`
- `EMAIL_API_KEY`
- `EMAIL_TO`
- `SMS_TO`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `TURNSTILE_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Notes

- CORS allows the frontend development origin and any configured `FRONTEND_ORIGIN`
- Errors use the predictable `{ error: { code, message, details? } }` shape
- Keep internal pricing assumptions out of public responses unless explicitly approved
