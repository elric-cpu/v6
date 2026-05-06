# Benson Home Solutions - Frontend

Next.js 14 frontend for Benson Home Solutions website.

## Overview

Benson Home Solutions provides practical repair, restoration, and maintenance work for Oregon properties. This frontend is built with Next.js 14, TypeScript, and Tailwind CSS, featuring a contractor-focused design with clear documentation and practical messaging.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 24 LTS recommended)
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

### Sweet Home 25-Mile Silo

Primary service area within roughly 25 miles of Sweet Home, Oregon:

- Sweet Home (97386)
- Lebanon (97355)
- Albany (97321, 97322)
- Brownsville (97327)
- Cascadia (97311)

**Localized risks**: Rain and moisture intrusion, moss growth, drainage issues, crawlspace moisture, gutter overflow.

### Harney County Silo

Remote service area in Eastern Oregon:

- Burns (97720)
- Hines (97738)
- Fields (97710)
- Diamond (97722)
- Riley (97758)
- Drewsey (97904)
- Princeton (97721)
- Frenchglen (97736)

**Localized risks**: Freeze risk and burst pipes, high-desert wind damage, winterization needs, remote property maintenance, weather-damaged exterior openings.

## Services

1. **Inspection Repairs** - Clear inspection flags with practical repairs
2. **Water, Mold & Moisture** - Water intrusion investigation and moisture control
3. **Window & Door Replacements** - Replacement work for drafty or damaged windows and doors
4. **Maintenance Plans** - Scheduled maintenance for ongoing property care
5. **Emergency Response** - Urgent repairs for water intrusion, storm damage, or systems failures
6. **Energy & Weatherization** - Weatherization work to reduce energy costs
7. **Property Preservation** - Vacant property maintenance and preservation
8. **Residential Remodeling** - Practical remodeling for kitchens, bathrooms, and living spaces

## Maintenance Plans

### Residential

| Tier | Square Footage | Monthly Price |
|------|---------------|---------------|
| Essential | 0–1,500 SF | $119/mo |
| Standard | 1,501–2,500 SF | $149/mo |
| Premium | 2,501–3,500 SF | $179/mo |
| Estate | 3,501+ SF | $219/mo |

### Commercial

| Tier | Size | Monthly Price |
|------|------|---------------|
| Small Business | 0–2,500 SF | $349/mo |
| Office | 2,501–5,000 SF | $449/mo |
| Retail | 5,001–10,000 SF | $599/mo |
| Industrial | 10,001–20,000 SF | $799/mo |

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
- Send the list, send the photos, text the address
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

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_API_URL=https://api.bensonhomesolutions.com
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Ensure all linters pass before committing
4. Test on mobile and desktop
5. Follow the voice and copy guidelines

## License

Copyright © 2026 Benson Enterprises, LLC. All rights reserved.
