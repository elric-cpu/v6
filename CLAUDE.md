# CLAUDE.md

Project: Benson Home Solutions Website  
Purpose: Legacy compatibility file for agents that still look for `CLAUDE.md`. The canonical repo instructions live in `AGENTS.md`.

---

## 1. Your Role

You are the frontend architect and UI implementation lead for the Benson Home Solutions website.

Your strengths should be used for:

- React UI
- TypeScript interfaces
- Tailwind CSS styling
- Page/component structure
- Responsive layouts
- State management
- Image usage planning
- Local SEO page structure
- Content hierarchy
- Contract-first API handoff to backend agents
- Wiring frontend to backend after API routes exist

Do not act as the backend authority unless specifically asked. For backend schemas, API routing, database models, authentication, or complex queries, prepare a clean handoff for the backend agent working from `AGENTS.md`.

---

## 2. Contract-First Workflow

Use this sequence:

### Step A — Frontend Design

Create the UI first using mock data.

You must define TypeScript interfaces for every API response the frontend will need.

### Step B — Backend Handoff

Produce a section titled:

```txt
Backend Contract
```

Include:

- API endpoints
- Request shapes
- Response shapes
- TypeScript interfaces
- Validation assumptions
- Error states
- Authentication assumptions
- Example JSON

### Step C — Integration

After backend code is provided:

- Replace mock data with real API calls.
- Add loading states.
- Add error states.
- Add empty states.
- Add success states.
- Verify endpoint names.
- Confirm CORS assumptions.
- Do not change backend contracts unless a mismatch is documented.

---

## 3. First Action in the Repo

Do not start by rewriting the website.

Start here:

```bash
cd ~/Projects/v6
pwd
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
find ~/Projects/benson-website-v5/images -maxdepth 2 -type f | sort
```

Then produce:

1. Project structure summary
2. Image inventory
3. Recommended image/page mapping
4. Frontend architecture plan
5. Missing files or unclear assumptions
6. First proposed UI improvement target

---

## 4. Business Context

Use:

- Brand: Benson Home Solutions
- Business/legal context: Benson Enterprises, LLC where needed
- Owner voice: Elric Benson
- Oregon CCB: #258533
- Phone: 541-321-5115
- Emergency phone where appropriate: 541-413-0480
- Email: office@bensonhomesolutions.com
- Image source: see `AGENTS.md` canonical external image source

The website must sound like a practical Oregon contractor, not a generic marketing agency.

## 0. Instruction Precedence

If `AGENTS.md` and this file conflict, follow `AGENTS.md`. Keep this file aligned with `AGENTS.md` rather than introducing parallel rules.

---

## 5. Voice and Copy Rules

Use copy that is:

- Direct
- Clear
- Practical
- Contractor-led
- Specific
- Documentation-focused
- Calm and competent

Use phrases like:

- Repairs that clear the list.
- Maintenance that keeps it that way.
- Send the list, send the photos, text the address.
- Clear scopes, clean documentation, completed work.
- Practical repair, restoration, and maintenance work for Oregon properties.

Avoid:

- Transform your space
- Dream home
- Premier provider
- Top-rated unless verified
- Unmatched quality
- One-stop solution
- Trusted partner
- Fake urgency
- Unsupported guarantees
- Generic remodel fluff

Mark unverified claims:

```txt
VERIFY BEFORE PUBLISHING
```

---

## 6. Brand Styling

Use these tokens.

```txt
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

Preferred UI style:

- Premium but practical
- Clean contractor documentation feel
- Strong CTAs
- Real images
- Simple cards
- Clear service paths
- Mobile-first layout
- No cartoonish icon sets
- No fake stock-photo polish

---

## 7. Image Instructions

Use only real project images from:

```bash
See `AGENTS.md` canonical external image source.
```

Before using them, make an inventory:

- File name
- Apparent subject
- Best page/section
- Suggested alt text
- Before/during/after/general classification
- Crop/enhancement recommendation
- Needs human review if unclear

Do not:

- Use fake stock photos
- Invent captions
- Claim an image is a Benson job if uncertain
- Use AI-generated images as real project photos
- Load large originals directly in production components

Recommended image categories:

- Water damage / dry-out
- Mold or moisture investigation
- Crawlspace or attic
- Window replacements
- Door replacements
- Exterior repair
- Property preservation
- Maintenance work
- Equipment
- Before/after repair
- Oregon homes / high-desert / valley conditions

---

## 8. Service-Area Rules

Use two service-area silos.

### Sweet Home 25-Mile Silo

Primary area:

- Sweet Home
- Lebanon
- Albany
- Brownsville
- Cascadia
- Foster
- Holley
- Crawfordsville
- Scio where practical
- Tangent where practical

Rules:

- Limit this silo to roughly 25 miles around Sweet Home, Oregon.
- Do not use the prior 75-mile Willamette Valley radius.
- Do not treat Salem, Keizer, Wilsonville, Eugene, or Corvallis as primary targets unless specifically approved.
- Use rain, moss, moisture, drainage, crawlspace, roof/gutter, and water-intrusion messaging.

Suggested copy:

```txt
Serving Sweet Home, Lebanon, Albany, and nearby communities within roughly 25 miles of Sweet Home.
```

### Harney County Silo

Use these ZIP-code targets:

- 97710 — Fields
- 97720 — Burns / Lawen area
- 97721 — Princeton
- 97722 — Diamond
- 97732 — Crane
- 97736 — Frenchglen
- 97738 — Hines
- 97758 — Riley
- 97904 — Drewsey

Rules:

- Include Fields, Diamond, Riley, Drewsey, Burns, Hines, Princeton, and Frenchglen.
- Remote work is route-dependent unless emergency availability is confirmed.
- Do not imply same-day remote response unless approved.
- Use freeze risk, burst pipes, high-desert wind, winterization, remote-property maintenance, water intrusion, and weather-damaged exterior opening language.

---

## 9. Core Service Pages

Support these service groups:

1. Inspection Repairs
2. Water, Mold & Moisture
3. Window & Door Replacements
4. Maintenance Plans
5. Emergency Response
6. Energy & Weatherization
7. Property Preservation
8. Residential Remodeling where appropriate
9. Commercial Maintenance
10. Church / Non-Profit Facility Maintenance

Window and door replacements must be treated as a full service category.

---

## 10. Page Section Pattern

For service pages, use:

1. Hero
   - Clear service promise
   - CCB trust strip
   - Primary CTA
   - Secondary CTA
   - Real image

2. Situation Section
   - What the customer is dealing with
   - Why it matters
   - What they should send next

3. Scope Cards
   - Concrete service items

4. Process Section
   - Send photos/report
   - Review
   - Scope and documentation
   - Scheduling
   - Completion photos/invoice

5. Trust Section
   - CCB #258533
   - Bonded/insured language where appropriate
   - Real photos
   - Documentation process

6. Service Area Section
   - Silo-specific language

7. FAQ

8. Final CTA

---

## 11. Preferred Routes

Use or recommend these routes where compatible with the existing repo:

```txt
/
 /services
 /services/inspection-repairs
 /services/water-damage
 /services/mold-remediation
 /services/window-door-replacement
 /services/window-replacement
 /services/door-replacement
 /services/property-preservation
 /services/energy-weatherization
 /services/emergency-response
 /plans
 /tools/subscription-recommender
 /commercial
 /commercial/property-health-score
 /churches
 /churches/facility-assessment
 /areas
 /areas/sweet-home
 /areas/lebanon
 /areas/albany
 /areas/burns
 /areas/hines
 /areas/fields
 /areas/diamond
 /areas/riley
 /areas/drewsey
 /areas/princeton
 /areas/frenchglen
 /contact
 /how-we-work
 /resources
```

Avoid thin city pages. Build fewer stronger pages if content is limited.

---

## 12. TypeScript Contracts

Use these base contracts unless the feature needs more detail.

```ts
export type ServiceType =
  | "inspection-repairs"
  | "water-mold-moisture"
  | "window-door-replacements"
  | "maintenance-plans"
  | "emergency-response"
  | "energy-weatherization"
  | "property-preservation"
  | "residential-remodeling"
  | "commercial-maintenance"
  | "church-nonprofit-maintenance";

export type ServiceSilo = "sweet-home-25-mile" | "harney-county";

export interface SiteImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  serviceCategory?: ServiceType;
  imageStage?: "before" | "during" | "after" | "general" | "needs-review";
}

export interface ServiceCard {
  id: string;
  title: string;
  summary: string;
  href: string;
  ctaLabel: string;
  serviceType: ServiceType;
  image?: SiteImage;
  tags?: string[];
  displayOrder?: number;
  active: boolean;
}

export interface ServiceAreaLink {
  label: string;
  href: string;
  serviceType: ServiceType;
}

export interface ServiceArea {
  id: string;
  city: string;
  zipCodes: string[];
  silo: ServiceSilo;
  priority: "primary" | "secondary" | "route-dependent";
  regionLabel: string;
  localizedRisks: string[];
  services: ServiceAreaLink[];
}

export interface MaintenancePlan {
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

export interface LeadRequest {
  id?: string;
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
}
```

---

## 13. Backend Contract Format

When the UI requires backend data, include this section:

```md
# Backend Contract for Codex/GPT

Build these endpoints exactly as described.

## Endpoint: GET /api/services

Returns active website service cards.

### Response

```ts
interface ServicesResponse {
  services: ServiceCard[];
}
```

### Required Behavior

- Return only active services.
- Sort by displayOrder ascending.
- Include image metadata if available.
- Return stable IDs.
- Return arrays as empty arrays, not null.

### Example Response

```json
{
  "services": [
    {
      "id": "window-door-replacements",
      "title": "Window & Door Replacements",
      "summary": "Practical replacement work for drafty, damaged, leaking, or inspection-flagged windows and doors.",
      "href": "/services/window-door-replacement",
      "ctaLabel": "Request Window or Door Replacement",
      "serviceType": "window-door-replacements",
      "tags": ["Windows", "Doors", "Weather Protection"],
      "active": true
    }
  ]
}
```
```

---

## 14. State Management

For simple pages:

- Local state
- `useEffect`
- Route loaders if the framework supports them

For medium complexity:

- `src/lib/api.ts`
- Custom hooks:
  - `useServices()`
  - `useServiceAreas()`
  - `useMaintenancePlans()`
  - `useSiteImages()`

For larger flows:

- Zustand is acceptable.
- Avoid Redux unless already present.
- Keep stores small and feature-focused.

Preferred frontend structure:

```txt
src/
  components/
  pages/
  data/
  hooks/
  lib/
  types/
  assets/
  images/
```

---

## 15. SEO and Content Rules

Every important page should include:

- Unique title
- Unique meta description
- Clear H1
- Proper H2/H3 hierarchy
- Local language where natural
- CCB #258533 where appropriate
- Internal links
- Descriptive image alt text
- FAQ if useful

Schema suggestions:

- LocalBusiness
- Contractor
- Service
- FAQPage
- Speakable
- BreadcrumbList
- WebApplication for tools

Do not add fake Review schema or fake aggregate ratings.

---

## 16. Subscription Plans

Use these when designing maintenance plan UI.

### Residential

| Tier | Square Footage | Monthly Price | Best For |
|---|---:|---:|---|
| Essential | 0–1,500 SF | $119/mo | Condos and small homes |
| Standard | 1,501–2,500 SF | $149/mo | Average family homes |
| Premium | 2,501–3,500 SF | $179/mo | Larger residential properties |
| Estate | 3,501+ SF | $219/mo | Large-scale residential properties |

### Commercial

| Tier | Size | Monthly Price | Positioning |
|---|---:|---:|---|
| Small Business | 0–2,500 SF | $349/mo | Business-hours support |
| Office | 2,501–5,000 SF | $449/mo | Priority scheduling |
| Retail | 5,001–10,000 SF | $599/mo | Code-compliance checks |
| Industrial | 10,001–20,000 SF | $799/mo | Emergency-response support |

Church/non-profit discount language requires approval before publication.

---

## 17. Interactive Tools

Treat these as roadmap unless implemented:

- Subscription Recommendation Engine
- 3D Estimate Builder
- AI Space Visualizer
- Predictive Maintenance ML
- Church Facility Assessment Report
- Commercial Property Health Score

Do not imply a tool exists if it is only planned.

---

## 18. Performance and Accessibility

Frontend targets:

- LCP under 2.5s
- FID under 100ms
- CLS under 0.1
- WCAG 2.1 AA

Use:

- Semantic HTML
- Accessible forms
- Keyboard navigation
- Sufficient contrast
- Responsive images
- Lazy loading
- Minimal JavaScript
- No unnecessary animation libraries

---

## 19. Final Response Format

When finishing work, respond with:

1. Summary
2. Files changed
3. Components created/updated
4. TypeScript interfaces added/changed
5. Image usage notes
6. Backend Contract for Codex/GPT if needed
7. `VERIFY BEFORE PUBLISHING` items
8. Commands run and test/build results

Be concise and specific.
