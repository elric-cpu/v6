# Benson Home Solutions - Frontend

Next.js 16 frontend for Benson Home Solutions website.

## Overview

Benson Home Solutions provides practical repair, restoration, maintenance, screen/window/door work, and documentation-first service for Harney County properties. This frontend is built with Next.js 16, TypeScript, and Tailwind CSS, featuring route-aware messaging for Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond, Princeton, Riley, Lawen, and remote South County communities.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Google Cloud Run

## Getting Started

### Prerequisites

- Node.js 20.9+ (Node.js 24 LTS recommended)
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

This runs the ESLint CLI through the flat config in `eslint.config.mjs`.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    areas/               # Service area pages
      [area]/            # Dynamic area pages
    contact/             # Contact form page
    how-we-work/         # Process explanation page
    plans/               # Maintenance plans page
    services/            # Services pages
      inspection-repairs/ # Service detail pages
    layout.tsx           # Root layout
    page.tsx             # Home page
  components/            # Reusable React components
    CTAButton.tsx        # Call-to-action button
    FAQ.tsx              # Accordion FAQ component
    Footer.tsx           # Site footer
    Header.tsx           # Site header
    MaintenancePlanCard.tsx # Plan display card
    ServiceCard.tsx      # Service display card
  data/                 # Mock data (to be replaced with API calls)
    mockData.ts          # Service, plan, and area data
  types/                # TypeScript type definitions
    index.ts             # Shared interfaces
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with services overview |
| `/services` | All services listing |
| `/services/inspection-repairs` | Inspection repairs detail |
| `/plans` | Maintenance plans |
| `/areas` | Service areas overview |
| `/areas/[area]` | Individual service area pages |
| `/contact` | Contact form |
| `/how-we-work` | Process explanation |

## Brand Colors

```css
benson-maroon:      #722F37
benson-maroon-dark: #5C252C
benson-burgundy:    #8B454D
benson-wine:        #4A1F24
benson-cream:       #F5F1E8
benson-offwhite:    #FAF8F3
benson-charcoal:    #2D2D2D
benson-slate:       #4A4A4A
benson-pale:        #E5E5E5
```

## Service Areas

### Harney County

- Burns (97720)
- Hines (97738)
- Crane (97732)
- Drewsey (97904)
- Frenchglen (97736)
- Fields (97710)
- Diamond (97722)
- Riley (97758)
- Princeton (97721)
- Lawen area (97720)
- Remote South County communities

Harney County is the only public service geography. Route fit depends on photos, dimensions, address or location, access notes, priority level, weather, materials, and timing constraints.

**Localized risks**: Freeze risk and burst pipes, high-desert wind damage, winterization needs, remote property maintenance, weather-damaged exterior openings.

## Services

1. **Inspection Repairs** - Clear inspection flags with practical repairs
2. **Water, Mold & Moisture** - Water intrusion investigation and moisture control
3. **Window & Door Replacements** - Replacement work for drafty or damaged windows and doors
4. **Maintenance Plans** - Scheduled maintenance for ongoing property care
5. **Emergency Response / Priority Condition Review** - Active water intrusion, storm damage, or exposed conditions reviewed without unsupported response-time promises
6. **Energy & Weatherization** - Weatherization work for practical comfort and building-envelope concerns
7. **Property Preservation** - Vacant property maintenance and preservation
8. **Residential Remodeling** - Practical remodeling for kitchens, bathrooms, and living spaces

## Remote Intake

Public copy should ask customers to send:

- Photos of the condition
- Dimensions, counts, or rough measurements where relevant
- Address or precise location
- Access notes, gates, road conditions, tenant limits, or animal notes
- Priority level and whether the condition is active now
- Timing constraints tied to weather, occupancy, events, inspections, or travel

Do not promise response timing or unrestricted availability. Do not publish trust, credential, ranking, outcome, demand, or financial-benefit claims unless verified before publishing.

## Business Information

- **Business**: Benson Home Solutions
- **Legal Entity**: Benson Enterprises, LLC
- **Oregon CCB**: #258533
- **Phone**: 541-321-5115
- **Emergency Phone**: 541-413-0480
- **Email**: office@bensonhomesolutions.com

## Voice and Copy Guidelines

The website copy should be:

- Direct and clear
- Practical and contractor-led
- Specific and documentation-focused
- Calm and competent

**Use phrases like:**
- Repairs that clear the list
- Maintenance that keeps it that way
- Send photos, dimensions, location, access notes, priority, and timing
- Clear scopes, clean documentation, completed work

**Avoid:**
- Transform your space
- Dream home
- Premier provider
- Top-rated (unless verified)
- Unmatched quality
- One-stop solution
- Fake urgency

## Performance Targets

- LCP under 2.5s
- FID under 100ms
- CLS under 0.1
- WCAG 2.1 AA compliance

## Deployment

### Google Cloud Run

```bash
docker build -t benson-website-v6 .
```

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_API_URL=https://api.bensonhomesolutions.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RLQ31P5HD0
NEXT_PUBLIC_GSC_VERIFICATION=BZhBkLGmJPNnDGbiCFGp9Z-FnZTt5XhAuNPIKtdjv2o
```

### IndexNow

- Hosted key file: `https://bensonhomesolutions.com/c31e7f3b1dda4c72beb68ec70efaf085.txt`
- Submit public URLs after deploy:

```bash
cd frontend
npm run indexnow:submit
```

### Deploy and Submit

Run the full frontend deploy plus IndexNow and Search Console submission in one command:

```bash
cd frontend
npm run deploy:indexnow
```

For content changes, use the publishing hook command:

```bash
cd frontend
npm run publish:site
```

That command deploys the frontend, submits the live URLs to IndexNow, and submits the live sitemap to Google Search Console through the authenticated API.

Google Search Console discovery comes from the live sitemap plus the authenticated Search Console API submission. Bing discovery should come from the live sitemap, `robots.txt`, the homepage verification meta, and Bing Webmaster Tools sitemap submission. Google and Bing no longer support the old anonymous sitemap ping endpoints, so the publish hook does not call them.

### GitHub Action

The repository also has a GitHub Action at [`.github/workflows/publish-site.yml`](../.github/workflows/publish-site.yml) that runs `npm run publish:site` on pushes to `main` when files under `frontend/src/app/**`, `frontend/src/data/**`, or `frontend/src/components/**` change.

Required GitHub secrets:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_PROJECT_ID`

The production frontend currently runs as `benson-website-v6` in Google Cloud Run.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Ensure all linters pass before committing
4. Test on mobile and desktop
5. Follow the voice and copy guidelines

## License

Copyright © 2026 Benson Enterprises, LLC. All rights reserved.
