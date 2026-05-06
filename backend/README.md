# Benson Home Solutions Backend

Node.js backend API for Benson Home Solutions website.

## Overview

This backend provides the API endpoints required by the Benson Home Solutions frontend. It's built with Node.js and follows the contract defined in the frontend documentation.

## Tech Stack

- **Runtime**: Node.js 18+ (Node.js 24 LTS recommended)
- **Language**: JavaScript (ES modules)
- **HTTP Server**: Node.js built-in `http` module
- **Database**: PostgreSQL (planned, currently using in-memory storage)
- **Email**: Planned integration
- **Payments**: Stripe (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd backend
npm install
```

### Development

```bash
npm start
```

The server will start on `http://localhost:4000`.

### Testing

```bash
npm test
```

## Project Structure

```
src/
  app.js              # Main application router
  server.js           # Server entry point
  lib/
    errors.js         # Error handling utilities
    http.js            # HTTP response utilities
    sanitize.js        # Input sanitization
  data/
    public-data.js     # Static data (services, plans, areas)
  services/
    health.js          # Health check service
    leads.js           # Lead submission service
    public-content.js  # Public content services
    subscription-recommendation.js # Plan recommendation logic
test/
  integration/        # Integration tests
```

## API Endpoints

### GET /health

Returns service health status.

**Response:**

```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2026-05-04T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy" | "unhealthy",
    "email": "healthy" | "unhealthy",
    "stripe": "healthy" | "unhealthy"
  }
}
```

### GET /api/services

Returns active service cards.

**Response:**

```json
{
  "services": [
    {
      "id": "inspection-repairs",
      "title": "Inspection Repairs",
      "summary": "Clear inspection flags with practical repairs...",
      "href": "/services/inspection-repairs",
      "ctaLabel": "Request Inspection Repair",
      "serviceType": "inspection-repairs",
      "tags": ["Inspections", "Repairs", "Documentation"],
      "displayOrder": 1,
      "active": true
    }
  ]
}
```

### GET /api/plans

Returns active maintenance plans.

**Response:**

```json
{
  "plans": [
    {
      "id": "essential",
      "name": "Essential",
      "priceMonthly": 119,
      "squareFootageRange": "0–1,500 SF",
      "description": "Condos and small homes...",
      "features": ["Quarterly property inspection", ...],
      "popular": false,
      "audience": "residential",
      "ctaLabel": "Start Essential Plan",
      "active": true
    }
  ]
}
```

### GET /api/service-areas

Returns all service areas.

**Response:**

```json
{
  "areas": [
    {
      "id": "sweet-home",
      "city": "Sweet Home",
      "zipCodes": ["97386"],
      "silo": "sweet-home-25-mile",
      "priority": "primary",
      "regionLabel": "Willamette Valley",
      "localizedRisks": ["Rain and moisture", "Moss growth", "Drainage issues"],
      "services": [
        {
          "label": "Inspection Repairs",
          "href": "/services/inspection-repairs",
          "serviceType": "inspection-repairs"
        }
      ]
    }
  ]
}
```

### GET /api/tools/subscription-recommendation

Get subscription plan recommendation based on property details.

**Query Parameters:**

- `propertyType`: "residential" | "commercial" | "churches-nonprofits"
- `squareFootage`: number
- `propertyAge`: number
- `homeValue`: number (optional)
- `region`: "sweet-home-25-mile" | "harney-county"

**Response:**

```json
{
  "recommendedPlan": {
    "id": "standard",
    "name": "Standard",
    "priceMonthly": 149,
    "squareFootageRange": "1,501–2,500 SF",
    "description": "Average family homes...",
    "features": ["All Essential features", ...],
    "popular": true,
    "audience": "residential",
    "ctaLabel": "Start Standard Plan",
    "active": true
  },
  "annualSavings": 1208,
  "assumptions": {
    "ageBasedRate": 0.02,
    "annualMaintenanceCost": 7000,
    "annualSubscriptionCost": 1788
  }
}
```

### POST /api/leads

Submit a lead request.

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "541-321-5115",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "Sweet Home",
  "zipCode": "97386",
  "serviceType": "inspection-repairs",
  "message": "Need inspection repairs for closing",
  "urgency": "soon",
  "sourcePage": "/services/inspection-repairs"
}
```

**Response:**

```json
{
  "success": true,
  "leadId": "lead_abc123",
  "message": "Lead submitted successfully"
}
```

## Environment Variables

```env
PORT=4000
FRONTEND_ORIGIN=https://bensonhomesolutions.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_FROM=office@bensonhomesolutions.com
EMAIL_API_KEY=...
```

## Current Implementation Status

### Completed

- [x] Basic HTTP server with routing
- [x] CORS support
- [x] Error handling
- [x] Input sanitization
- [x] Health check endpoint
- [x] Services endpoint (in-memory data)
- [x] Plans endpoint (in-memory data)
- [x] Service areas endpoint (in-memory data)
- [x] Subscription recommendation endpoint
- [x] Lead submission endpoint (in-memory storage)
- [x] Integration tests

### In Progress

- [ ] PostgreSQL database integration
- [ ] Email service integration
- [ ] Stripe payment integration
- [ ] JWT authentication
- [ ] Rate limiting

### Planned

- [ ] Admin dashboard API
- [ ] Analytics tracking
- [ ] Logging system
- [ ] Backup system
- [ ] Monitoring alerts
- [ ] API documentation (Swagger/OpenAPI)

## Data Models

### ServiceCard

```js
{
  id: string;
  title: string;
  summary: string;
  href: string;
  ctaLabel: string;
  serviceType: ServiceType;
  tags?: string[];
  displayOrder?: number;
  active: boolean;
}
```

### MaintenancePlan

```js
{
  id: string;
  name: string;
  priceMonthly: number;
  squareFootageRange?: string;
  description: string;
  features: string[];
  popular?: boolean;
  audience: "residential" | "commercial" | "churches-nonprofits";
  ctaLabel: string;
  active: boolean;
}
```

### ServiceArea

```js
{
  id: string;
  city: string;
  zipCodes: string[];
  silo: "sweet-home-25-mile" | "harney-county";
  priority: "primary" | "secondary" | "route-dependent";
  regionLabel: string;
  localizedRisks: string[];
  services: ServiceAreaLink[];
}
```

### Lead

```js
{
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  serviceType: ServiceType;
  message: string;
  urgency: "standard" | "soon" | "emergency";
  sourcePage?: string;
  createdAt: string;
}
```

## Rate Limiting

Planned rate limits:

- `/api/leads`: 5 requests per minute per IP
- `/api/tools/subscription-recommendation`: 10 requests per minute per IP
- All other endpoints: 100 requests per minute per IP

## Security

- Input sanitization on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- CSRF protection (planned)
- Secure headers (planned)
- Content Security Policy (planned)

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t benson-backend .
docker run -p 4000:4000 benson-backend
```

## Testing

Run integration tests:

```bash
npm test
```

## Contributing

1. Follow the existing code style
2. Ensure all tests pass before committing
3. Add tests for new features
4. Update documentation as needed

## License

Copyright © 2026 Benson Enterprises, LLC. All rights reserved.
