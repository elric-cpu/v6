# Benson Home Solutions Website System: Final Master Prompt

Version: 2026-05-03  
Project: Benson Home Solutions / Benson Enterprises, LLC  
Use case: Contract-first website, frontend, backend, content, SEO, service-area, image, and agent workflow instructions

---

## 1. Role and Operating Model

You are working on the Benson Home Solutions website and related digital systems.

Benson Home Solutions is an Oregon contractor brand operated by Benson Enterprises, LLC. The site must read like it is coming from Elric Benson: direct, practical, contractor-led, and specific. Avoid generic AI marketing language, fake urgency, unsupported claims, fake stock imagery, and inflated positioning.

Use contract-first development:

1. The frontend agent designs the frontend and defines the data contracts.
2. Codex/GPT builds the backend to match those contracts exactly.
3. The frontend agent wires the frontend to the backend.
4. Any mismatch is documented before changing interfaces or API routes.

You are not building generic SaaS. You are building a local Oregon construction, repair, restoration, maintenance, and service platform with real service-area constraints, real license information, and real project photos.

---

## 2. Source of Truth

Use these sources in priority order:

1. The existing repository at:

   ```bash
   ~/Projects/v6
   ```

2. Real image assets located at:

   ```bash
   See `AGENTS.md` canonical external image source.
   ```

3. The Master Specification: Benson Home Solutions Integrated Service & Digital Framework 2026.

4. User instructions in the active conversation.

5. Existing live-site facts, only if verified.

If sources conflict, do not guess. Flag the conflict and continue with the safest practical assumption.

`AGENTS.md` is the canonical repo-local instruction file. Keep this master prompt aligned with it instead of creating conflicting rules.

Existing repo structure wins unless the user explicitly asks for migration.

---

## 3. Business Identity

Use the following business facts consistently:

- Brand: Benson Home Solutions
- Legal/company context: Benson Enterprises, LLC where appropriate
- Oregon CCB: #258533
- Primary phone: 541-321-5115
- Emergency phone where appropriate: 541-413-0480
- Email: office@bensonhomesolutions.com
- Website: bensonhomesolutions.com

Do not invent:
- Years in business
- Awards
- Ratings
- Reviews
- Certifications
- Insurance partnerships
- Guaranteed response times
- Staff count
- Completed project counts
- Revenue numbers
- Utility savings numbers
- Customer names
- Before/after job outcomes

If useful but unverified, mark:

```txt
VERIFY BEFORE PUBLISHING
```

---

## 4. Brand Voice

The voice must sound like the owner, not a template.

Use:
- Direct language
- Short practical sentences
- Clear scopes
- Workmanlike confidence
- Specific customer situations
- Documentation-focused wording
- Service-area realism

Good positioning:
- Repairs that clear the list.
- Maintenance that keeps it that way.
- Send the list, send the photos, text the address.
- Maintenance is cheaper than surprise repair.
- Clear scopes, clean documentation, completed work.
- Practical repair, restoration, and maintenance work for Oregon properties.

Avoid:
- Transform your space
- Dream home
- Premier provider
- Top-rated unless verified
- Unmatched quality
- Your trusted partner
- One-stop solution
- Generic contractor fluff
- Luxury remodeling language unless the page is specifically about remodeling
- Unsupported emergency-response promises

---

## 5. Visual Brand Standards

Use the 2026 Master Specification palette:

| Token | Color | Hex | Use |
|---|---|---:|---|
| `benson-maroon` | Deep Maroon | `#722F37` | Primary buttons, headers, key CTAs |
| `benson-maroon-dark` | Dark Maroon | `#5C252C` | Hover states, footer backgrounds |
| `benson-burgundy` | Burgundy | `#8B454D` | Secondary accents and icons |
| `benson-wine` | Rich Wine | `#4A1F24` | Text emphasis and borders |
| `benson-cream` | Warm Cream | `#F5F1E8` | Section backgrounds and card elements |
| `benson-offwhite` | Off-White | `#FAF8F3` | Primary page backgrounds |
| `benson-charcoal` | Charcoal | `#2D2D2D` | Primary text and headings |
| `benson-slate` | Slate Grey | `#4A4A4A` | Secondary text and body copy |
| `benson-pale` | Pale Grey | `#E5E5E5` | Dividers and subtle backgrounds |

Preferred visual feel:
- Oregon contractor
- Serious and capable
- Real work
- Clean documentation
- Practical maintenance
- Restoration readiness
- No cartoonish icons
- No stock-photo polish

Use real photos from the project image folder wherever possible.

---

## 6. Image Rules

All real website imagery must be sourced from:

```bash
~/Projects/benson-website-v5/images
```

Before using images, inspect and inventory the folder.

Produce an image inventory with:

- File name
- Apparent subject
- Recommended page or section
- Best use case
- Alt text
- Before/during/after classification
- Whether cropping or enhancement is needed
- Whether the image needs human review

Do not:
- Use fake stock images
- Invent project descriptions
- Mislabel images as Benson work if uncertain
- Use AI-generated remodel photos as real jobs
- Load massive original files directly into pages

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

## 7. Service Architecture

Use a hub-spoke architecture.

### Residential Hub

Spoke pages:

- Kitchen Remodeling
- Bathroom Remodeling
- Appliance Replacement
- Emergency Repairs
- Seasonal Maintenance
- Roof/Gutter Care
- Window & Door Replacements
- Water, Mold & Moisture
- Inspection Repairs

### Commercial Hub

Spoke pages:

- Small Business Maintenance
- Office Buildouts
- Retail Maintenance
- ADA Compliance
- Commercial Property Health Score
- Emergency Repairs
- Window & Door Replacements

### Church / Non-Profit Hub

Spoke pages:

- Sanctuary Care
- Fellowship Hall Maintenance
- School/Daycare Facility Support
- Church Facility Assessment
- Seasonal Maintenance
- Safety and Compliance
- Emergency Repairs

---

## 8. Core Service Groups

The site should emphasize these core services:

1. Inspection Repairs
2. Water, Mold & Moisture
3. Window & Door Replacements
4. Maintenance Plans
5. Emergency Response
6. Energy & Weatherization
7. Property Preservation
8. Residential Remodeling where appropriate
9. Commercial and church facility maintenance where appropriate

### Inspection Repairs

Use for:

- FHA repair lists
- VA repair lists
- Appraisal-required repairs
- Buyer repair lists
- Seller pre-listing corrections
- Punch-list repairs
- Documentation-heavy work

Primary CTAs:

- Start a Repair Request
- Send the Repair List
- Upload Inspection Notes

### Water, Mold & Moisture

Use for:

- Water damage mitigation
- Dry-out
- Moisture mapping
- Mold mitigation
- Leak-source repairs
- Insurance-adjacent documentation
- Equipment-backed response

Primary CTAs:

- Get Emergency Help
- Request Moisture Inspection
- Call Now

### Window & Door Replacements

Use for:

- Window replacement
- Exterior door replacement
- Entry doors
- Patio doors
- Sliding glass doors
- Weather-damaged openings
- Drafty or failing units
- Energy-efficiency upgrades
- Water intrusion around openings
- Trim, flashing, sealing, and finish repairs
- Inspection/appraisal-related corrections

Primary CTAs:

- Request Window or Door Replacement
- Send Photos for Review
- Get a Replacement Estimate

Messaging rule:

Position window and door replacements as practical envelope work: fit, seal, flashing, function, weather protection, energy performance, and clean installation. Avoid luxury-remodel fluff and exact energy-savings promises.

### Maintenance Plans

Use for:

- Seasonal maintenance
- Property checks
- Drainage, gutters, crawlspace, attic
- Residential plans
- Commercial plans
- Church/non-profit facility care

Primary CTAs:

- See Maintenance Plans
- Get a Recommendation
- See My Savings

### Emergency Response

Use for:

- Stop active damage
- Shut off source where practical
- Stabilize the property
- Board-up
- Dry-out
- Temporary repairs
- Documentation

Primary CTAs:

- Call Now
- Emergency Call & Text
- Get Emergency Help

### Energy & Weatherization

Use for:

- Air sealing
- Attic insulation
- Weatherization
- Comfort and utility improvements
- Preventative envelope work

### Property Preservation

Use for:

- Lock changes
- Board-ups
- Trash-outs
- Occupancy/security repairs
- Documentation for owners, lenders, or managers

---

## 9. Service-Area Silos

Use two operational silos.

### Willamette Valley Silo

The Willamette Valley service silo is limited to a practical 25-mile radius around Sweet Home, Oregon.

Primary focus communities:

- Sweet Home
- Lebanon
- Albany
- Brownsville
- Cascadia
- Foster
- Holley
- Crawfordsville
- Scio, where practical
- Tangent, where practical

Rules:

- Do not use the prior 75-mile radius.
- Do not position Salem, Keizer, Wilsonville, Eugene, or Corvallis as primary service-area targets unless explicitly approved for a campaign or expansion page.
- Emphasize fast, practical coverage near the Sweet Home/Lebanon/Albany base.
- Use moisture, rain, moss, crawlspace, drainage, roof/gutter, and water-intrusion messaging.

Suggested public language:

```txt
Serving Sweet Home, Lebanon, Albany, and nearby communities within roughly 25 miles of Sweet Home.
```

Do not imply equal response time across every town.

### Harney County Silo

The Harney County service silo should include all practical Harney County ZIP-code targets, including:

- Burns — 97720
- Hines — 97738
- Fields — 97710
- Diamond — 97722
- Riley — 97758
- Drewsey — 97904
- Princeton — 97721
- Frenchglen — 97736
- Crane — 97732
- Lawen — generally associated with the Burns 97720 ZIP area

Harney County ZIP-code target list:

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
- Remove duplicate Diamond references.
- Include Crane because it is a practical Harney County ZIP target.
- Treat remote Harney County work as planned, routed, and logistics-dependent unless emergency response has been confirmed.
- Do not imply same-day response across remote communities unless explicitly approved.
- Use high-desert messaging: freeze risk, burst pipes, winterization, wind exposure, remote-property maintenance, water intrusion, and weather-damaged exterior openings.

---

## 10. Local SEO Rules

Use two focused SEO clusters.

### Cluster 1: 25-Mile Sweet Home / Mid-Valley Cluster

Primary terms:

- Sweet Home contractor
- Lebanon home repair
- Albany home repair
- Sweet Home water damage repair
- Lebanon inspection repairs
- Albany window replacement
- Sweet Home maintenance plans

### Cluster 2: Harney County Cluster

Primary terms:

- Burns Oregon contractor
- Hines home repair
- Harney County property maintenance
- Burns water damage repair
- Hines window replacement
- Harney County winterization
- Fields Oregon property maintenance
- Drewsey Oregon contractor
- Frenchglen property maintenance
- Riley Oregon repair services

Avoid thin city pages.

Each city or ZIP page must include:

- Localized risks
- Realistic service availability
- Services available there
- Internal links to related service pages
- Contact CTA
- CCB #258533
- Region-specific language

Do not keyword stuff.

---

## 11. Internal Linking Rules

Every spoke page must include:

1. Breadcrumb back to the parent hub.
2. At least two contextual links to related spokes.
3. Balanced anchor text:
   - 40% exact match
   - 35% partial match
   - 25% branded or generic

Human readability wins over mechanical ratio if the page becomes awkward. Flag conflicts.

---

## 12. Subscription Framework

### Residential Subscription Tiers

| Tier | Square Footage | Monthly Price | Best For |
|---|---:|---:|---|
| Essential | 0–1,500 SF | $119/mo | Condos and small homes |
| Standard | 1,501–2,500 SF | $149/mo | Average family homes |
| Premium | 2,501–3,500 SF | $179/mo | Larger residential properties |
| Estate | 3,501+ SF | $219/mo | Large-scale residential properties |

### Commercial Subscription Tiers

| Tier | Size | Monthly Price | Positioning |
|---|---:|---:|---|
| Small Business | 0–2,500 SF | $349/mo | Business-hours support |
| Office | 2,501–5,000 SF | $449/mo | Priority scheduling |
| Retail | 5,001–10,000 SF | $599/mo | Code-compliance checks |
| Industrial | 10,001–20,000 SF | $799/mo | Emergency-response support |

### Church / Non-Profit Program

Use:

- 20% discount language only if approved for publication
- Sacred Space care philosophy
- Scheduling around worship times, events, and liturgical seasons

Keep the tone practical and respectful, not sentimental.

---

## 13. Maintenance Zone Framework

Use five maintenance zones for commercial, church, and facility assessments:

1. Sanctuary/Worship
2. Fellowship/Education
3. Systems/Infrastructure
4. Grounds/Exterior
5. Safety/Compliance

For residential, adapt into:

- Exterior envelope
- Roof/gutters/drainage
- Plumbing/moisture
- Interior repairs
- Safety/accessibility

---

## 14. Pricing and Rates

The 2026 Master Specification includes Q1 2026 pricing and construction rates.

Treat detailed rate data as internal reference unless explicitly approved for public use.

Rules:

- Do not publish full internal rate tables by default.
- If used in calculators, label outputs as preliminary estimates.
- Include assumptions: standard conditions, access, site review, material availability, travel radius, and scope confirmation.
- Mark exact public-facing prices as `VERIFY BEFORE PUBLISHING`.
- Do not let pricing override signed estimates, contracts, or actual job costing.

---

## 15. Preferred Website Architecture

Recommended route structure:

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

Do not create thin city pages. Use fewer, stronger pages if there is not enough localized content.

---

## 16. Required Page Sections

For service pages, use:

1. Hero
   - Direct promise
   - License/contact trust strip
   - Primary CTA
   - Secondary CTA
   - Real image where available

2. Situation Section
   - What the customer is dealing with
   - Why it matters
   - What they should send next

3. Service Scope Cards
   - Concrete services
   - No vague claims

4. Process Section
   - Send photos/report
   - Review
   - Scope and documentation
   - Scheduling
   - Completion photos/invoice

5. Trust Section
   - CCB #258533
   - Bonded/insured language where appropriate
   - Documentation-focused process
   - Real images

6. Service Area Section
   - City/silo context
   - Region risks

7. FAQ Section
   - Practical answers

8. Final CTA
   - Call
   - Text
   - Send repair list
   - Request estimate

---

## 17. Technical Stack

The 2026 target stack is:

- Next.js 14
- React
- Tailwind CSS
- Three.js
- WebXR API
- Sanity.io
- PostgreSQL
- Stripe
- 1build API
- Google Places

However:

```txt
Existing working repo structure wins unless the user explicitly requests migration.
```

If the project is currently Vite/React, do not migrate to Next.js unless asked.

If migration is proposed, produce:

1. Migration plan
2. Risk list
3. File-by-file impact
4. Backout plan
5. Backend handoff

---

## 18. Performance, Accessibility, and Security Targets

Target:

- LCP under 2.5s
- FID under 100ms
- CLS under 0.1
- WCAG 2.1 AA
- TLS 1.3
- HSTS
- Secure form handling
- No exposed secrets

Frontend responsibilities:

- Optimize images
- Lazy-load below-fold media
- Use semantic HTML
- Preserve contrast
- Make forms keyboard-accessible
- Avoid heavy JS where unnecessary
- Use responsive images

Backend/security concerns should be handed to Codex/GPT unless already part of the frontend stack.

---

## 19. Interactive Tools Roadmap

### Subscription Recommendation Engine

Inputs:

- Property type
- Square footage
- Property age
- Region
- Risk factors
- Desired support level

Educational formula:

```txt
Annual Savings = (Home Value × Age-Based Rate) - (Monthly Subscription × 12)
```

Age-based assumptions:

- Under 5 years: 1%
- 6–15 years: 2%
- 16–30 years: 3%
- 31+ years: 4%

Important:

- Do not present as guaranteed savings.
- Label as an educational estimate.
- Include disclaimers.
- Avoid inflated promises.

### 3D Estimate Builder

Roadmap feature unless implemented:

- Three.js
- WebXR
- Mobile AR preview

### AI Space Visualizer

Roadmap feature unless implemented:

- User-uploaded photo analysis
- Dimension detection
- Material overlay

### Predictive Maintenance ML

Roadmap feature unless implemented:

- Willamette Valley moisture/moss risk
- Harney County freeze/burst risk

---

## 20. Specialized Facility Assessments

### Church Facility Assessment

Support a 12-page board-ready report structure:

1. Cover with Stewardship Score and Ministry Risk Level
2. Executive Summary
3. Sanctuary category
4. Fellowship category
5. Systems category
6. Grounds category
7. Volunteer vs. Professional Maintenance Guide
8. Three-year Budget Planning Framework
9. Board Presentation Summary
10. Church Year Maintenance Calendar
11. Compliance & Safety Checklist
12. Recommended Next Steps and CCB Credentials

Do not claim this tool exists unless implemented.

### Commercial Property Health Score

Assessment factors may include:

- Winter freeze risk
- Plumbing insulation
- Seismic risk
- Pre-1990 URM risk
- Exterior envelope condition
- Safety/accessibility issues

---

## 21. Conversion Rules

Each page should answer:

1. What problem does this solve?
2. Who is this for?
3. What should the customer send?
4. What happens next?
5. How quickly can Benson realistically respond?
6. What documentation will they receive?
7. How do they call, text, or request help?

CTA patterns:

| Page Location | CTA Type | Copy | Destination |
|---|---|---|---|
| Hero | Button | See My Savings | `/tools/subscription-recommender/` |
| Hero/Service | Button | Request Estimate | `/contact/` |
| Emergency | Button | Call Now | `tel:5414130480` or approved number |
| Inspection Repair | Button | Send the Repair List | `/contact/` |
| Mid-page | Button | See What We Do | `/services/` |
| Blog/sidebar | Contextual | Get Expert Maintenance | `/contact/` |

Use caution with discounts. Do not publish “10% off first service” unless approved.

---

## 22. SEO, AEO, and Schema

Use accurate schema:

- LocalBusiness
- Contractor
- Service
- FAQPage
- Speakable where appropriate
- BreadcrumbList
- WebApplication for tools

Do not create fake Review schema or aggregate ratings unless actual review data exists.

Every important page should have:

- Unique title
- Unique meta description
- Clear H1
- Proper H2/H3 hierarchy
- Local service terms where natural
- Internal links
- Descriptive image alt text
- CCB #258533 where appropriate

---

## 23. TypeScript Data Contracts

Use clear data contracts before backend work.

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
  attachments?: SiteImage[];
}
```

---

## 24. Backend Contract Requirements

When creating a backend handoff, define:

- Required endpoints
- Request bodies
- Response shapes
- Public vs. admin-only data
- Validation rules
- Error responses
- Authentication assumptions
- CORS requirements
- Example JSON

Possible modules:

- Services
- Service areas
- Images
- Subscription tiers
- Subscription recommendation calculator
- Contact/lead capture
- Emergency requests
- Church assessment
- Commercial property health score
- Pricing assumptions
- SEO metadata
- Blog/resource articles
- Testimonials/reviews only if verified
- Stripe subscriptions if implemented
- Sanity CMS content if implemented

---

## 25. Codex/GPT Backend Handoff Template

Use this when passing Claude contracts to Codex/GPT:

```md
You are building the backend for the Benson Home Solutions website.

The frontend was designed contract-first by Claude. Your job is to build API routes that match Claude’s TypeScript interfaces exactly.

Requirements:
- Use the existing backend stack if present.
- If no backend exists, use Node.js + Express + TypeScript.
- Enable CORS for the frontend dev port, likely 5173.
- Add `/health`.
- Add validation.
- Add error handling.
- Do not rename fields from the frontend contract.
- Do not invent business data.
- Use real image metadata only if provided from the canonical external image source defined in `AGENTS.md`.
- Keep public website data separate from internal pricing/specification data.
- Do not expose detailed Q1 2026 construction rates publicly unless explicitly requested.
- Mark advanced AI/AR features as roadmap unless implemented.
- Do not create fake testimonials, fake ratings, fake reviews, or unverifiable claims.

Frontend TypeScript interfaces:

[PASTE CLAUDE INTERFACES HERE]

Required endpoints:

[PASTE ENDPOINT CONTRACTS HERE]

Return:
1. File structure
2. Schema/model files
3. API route files
4. Middleware
5. Validation
6. Error handling
7. CORS configuration
8. Example `.env`
9. Local run instructions
```

---

## 26. First Task for Any Agent

Start with inspection, not rewriting.

```bash
cd ~/Projects/v6
pwd
find . -maxdepth 3 -type f | sed 's#^\./##' | sort | head -200
find ./images -maxdepth 2 -type f | sort
```

Then produce:

1. Current project structure summary
2. Image inventory
3. Recommended image/page mapping
4. Frontend architecture plan
5. Any missing files or unclear assumptions
6. First proposed UI improvement target

Do not rewrite the whole site until the repo and image folder are understood.

---

## 27. Launch QA Checklist

Before launch, produce a QA checklist.

### Functionality

- Forms submit correctly
- CTA links work
- Calculators produce expected outputs
- Stripe checkout works if enabled
- Emergency call links work on mobile
- Image paths resolve

### Technical

- Core Web Vitals checked
- No broken internal links
- SSL/HSTS verified
- No console errors
- No missing environment variables
- No secrets exposed

### Content

- CCB #258533 present
- Service areas accurate
- No unsupported claims
- No fake reviews
- No stock images mislabeled as real work
- Contact information correct

### SEO

- Metadata exists
- Schema validates
- H1/H2 structure clean
- Local pages internally linked
- XML sitemap present
- Robots.txt correct

---

## 28. Post-Launch Monitoring

Treat these as internal goals, not public claims:

- 4–6% conversion rate target
- 150% session growth target
- Review quality tracking target

Do not publish these as achieved unless verified by analytics and review data.
