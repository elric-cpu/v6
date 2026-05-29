# AGENTS.md

Project: Benson Home Solutions Website  
Purpose: Instructions for Codex, GPT, and other coding agents working in this repository.

---

## 1. Core Rule

Use contract-first development.

Codex or the frontend agent defines the UI and TypeScript data contracts first. Backend agents must implement the API to match those contracts exactly.

Do not rename fields, change response shapes, or invent backend requirements unless there is a clear mismatch. If there is a mismatch, document it before changing code.

---

## 2. Repository First

Before editing, inspect the existing repo.

```bash
cd ~/Projects/benson-home-solutions
pwd
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
find ~/Projects/benson-website-v5/images -maxdepth 2 -type f | sort
```

Existing working repo structure wins unless the user explicitly requests migration.

Do not replace the project architecture without a written migration plan.

---

## 3. Business Context

You are working on the Benson Home Solutions website.

Business facts:

- Brand: Benson Home Solutions
- Company/legal context: Benson Enterprises, LLC where appropriate
- Oregon CCB: #258533
- Phone: 541-321-5115
- Emergency phone where appropriate: 541-413-0480
- Email: office@bensonhomesolutions.com
- Canonical external image source: `~/Projects/benson-website-v5/images`

Do not invent:
- Reviews
- Ratings
- Awards
- Certifications
- Insurance partnerships
- Response-time guarantees
- Staff count
- Years in business
- Project outcomes
- Customer names
- Utility savings
- Revenue numbers

Use `VERIFY BEFORE PUBLISHING` for anything useful but unverified.

---

## 4. Service Areas

Use Harney County as the public service geography.

Harney County ZIP-code targets:

- 97710 — Fields
- 97720 — Burns / Lawen area
- 97721 — Princeton
- 97722 — Diamond
- 97732 — Crane
- 97736 — Frenchglen
- 97738 — Hines
- 97758 — Riley
- 97904 — Drewsey

Remote Harney County work is planned, routed, and logistics-dependent unless emergency-response availability is explicitly confirmed.

Do not imply same-day response across remote communities unless approved.

Do not reintroduce Sweet Home, Lebanon, Albany, or a Willamette Valley-wide public service-area model unless the user explicitly requests a migration plan.

---

## 5. Core Services

Support these service groups:

- Inspection Repairs
- Water, Mold & Moisture
- Window & Door Replacements
- Maintenance Plans
- Emergency Response
- Energy & Weatherization
- Property Preservation
- Residential Remodeling where appropriate
- Commercial Maintenance
- Church / Non-Profit Facility Maintenance

Window and door replacement is a dedicated service category, not just a minor add-on.

---

## 6. Brand and UI Tokens

Use the Benson brand color system:

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

Do not introduce conflicting brand colors unless the repo already uses them and a migration plan exists.

---

## 7. Image Handling

Canonical external image source:

```bash
~/Projects/benson-website-v5/images
```

Real images must come from:

```bash
~/Projects/benson-website-v5/images
```

Before using images, create or update image metadata.

Do not:
- Use fake stock photos
- Invent captions
- Mislabel images as completed Benson projects if unclear
- Load full-size originals directly in production pages

Use responsive images, lazy loading, useful alt text, and appropriate compression.

---

## 8. Backend Responsibilities

Backend agents should handle:

- API routes
- Validation
- Error handling
- Database schemas
- Authentication where needed
- CORS
- Environment variables
- Health checks
- Server-side data contracts
- Stripe integration if enabled
- Sanity/Postgres integration if present
- Calculator logic where backend-owned

Frontend-owned data contracts must remain the source of truth unless explicitly changed.

---

## 9. Required Backend Baseline

If creating or updating backend services, include:

- `/health`
- CORS for frontend dev port, likely `5173`
- Predictable JSON errors
- Input validation
- Stable IDs
- Clear route organization
- Environment variable documentation
- No exposed secrets
- No public exposure of internal pricing data unless explicitly approved

Example error shape:

```ts
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

---

## 10. Public vs. Internal Data

Keep public website content separate from internal operations data.

### Public candidate data

- Service cards
- Service areas
- Public image metadata
- Public subscription plan descriptions
- FAQs
- Contact form submissions
- Blog/resource content
- Schema metadata

### Internal or restricted data

- Detailed Q1 2026 construction rates
- Job costing logic
- Margin assumptions
- Estimate logs
- Admin notes
- Raw lead data
- Uploaded customer files
- Internal pricing assumptions
- AI/AR roadmap logic not yet launched

Do not expose internal pricing tables by default.

---

## 11. Suggested API Modules

Implement only what the frontend contract requires.

Potential modules:

```txt
/api/services
/api/service-areas
/api/images
/api/plans
/api/leads
/api/emergency-requests
/api/tools/subscription-recommendation
/api/church-assessments
/api/commercial-property-health-score
/api/seo
/api/resources
```

---

## 12. TypeScript Types

Use these as baseline types unless Claude provides more specific contracts.

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

export type ServiceSilo = "harney-county";

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

## 13. Subscription Calculator Logic

If implementing the subscription recommendation engine, treat it as educational.

Inputs:

- Property type
- Square footage
- Property age
- Region
- Risk factors
- Desired support level

Age-based assumptions:

```txt
Under 5 years: 1%
6–15 years: 2%
16–30 years: 3%
31+ years: 4%
```

Formula:

```txt
Annual Savings = (Home Value × Age-Based Rate) - (Monthly Subscription × 12)
```

Rules:

- Do not present results as guaranteed savings.
- Include disclaimers.
- Validate all inputs.
- Keep calculation logic testable.
- Return assumptions in API response.

---

## 14. Security and Privacy

Do not expose secrets.

Use environment variables for:

- Database URL
- JWT secrets
- Stripe keys
- Sanity tokens
- API keys
- Email service credentials
- Google Places API
- 1build API

Never commit `.env` files.

Forms and lead capture must validate inputs server-side.

---

## 15. Performance and Accessibility

Target:

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- WCAG 2.1 AA

Backend work should not cause excessive frontend payloads. Keep API responses focused.

---

## 16. Testing and Verification

Before final handoff, provide:

- Commands run
- Files changed
- Build/test result
- Known issues
- Verification gaps
- Next recommended step
- If you deploy or push production changes, ping the live production URL and report the HTTP status before calling the release complete.

Do not claim tests passed unless they were actually run.

---

## 17. Final Response Format

When completing a coding task, respond with:

1. Summary
2. Files changed
3. Commands run
4. Verification result
5. Risks or `VERIFY BEFORE PUBLISHING` items
6. Next handoff instructions if needed

Be direct. Avoid filler.
