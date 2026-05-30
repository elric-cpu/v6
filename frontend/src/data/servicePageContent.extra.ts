import type { ServicePageContent } from "@/data/servicePageContent";

export const extraServicePageContentBySlug: Record<string, ServicePageContent> = {
  "energy-weatherization": {
    slug: "energy-weatherization",
    serviceType: "energy-weatherization",
    title: "Energy & Weatherization",
    description:
      "Practical weatherization work that improves comfort and helps tighten the building envelope against Oregon weather.",
    heroSummary:
      "Weatherization work is most useful when it follows the actual leak, draft, and exposure points of the property instead of generic upgrades.",
    situation: [
      "Drafts, air leaks, failing openings, and exposed trim details can make the property harder to heat, harder to cool, and more vulnerable to moisture.",
      "We focus on practical building-envelope improvements that match the property’s condition and region.",
    ],
    whatToSend: [
      "Photos of the openings or areas with draft or weather exposure",
      "Address or location in Harney County",
      "Approximate dimensions, counts, or measurements where relevant",
      "Access notes, priority level, and timing constraints",
      "Notes about comfort, moisture, or seasonal trouble spots",
      "Any inspection notes tied to efficiency or envelope condition",
    ],
    scopeSections: [
      {
        title: "Envelope-focused work",
        items: [
          "Window and door replacement scopes",
          "Exterior trim and seal detail review",
          "Weather-exposed opening corrections",
          "Draft-prone condition review",
        ],
      },
      {
        title: "Regional conditions",
        items: [
          "High-desert wind exposure in Harney County",
          "Monthly South County route planning",
          "Freeze-season weather prep",
          "Protection of vulnerable openings",
        ],
      },
      {
        title: "Planning and follow-through",
        items: [
          "Photo-based initial review",
          "Scope grouping by priority",
          "Documentation for next repair steps",
          "Completion-photo follow-through",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this presented as a utility-cost promise?",
        answer:
          "No. This work is presented as practical weatherization and building-envelope improvement, not as a utility-cost promise.",
      },
      {
        question: "What kinds of issues are most relevant?",
        answer:
          "Drafty openings, failed exterior details, weather-exposed trim, and recurring moisture or cold-weather trouble spots are usually the first things to review.",
      },
      {
        question: "Can this tie into window and door replacements?",
        answer:
          "Yes. Window and door work is one of the main ways weatherization scopes show up on this site.",
      },
    ],
    finalCtaTitle: "Need a weatherization scope reviewed?",
    finalCtaText:
      "Send photos, dimensions where relevant, the address or location, access notes, priority level, timing constraints, and the trouble spots you want addressed. We’ll review the practical envelope work first.",
  },
  "property-preservation": {
    slug: "property-preservation",
    serviceType: "property-preservation",
    title: "Property Preservation",
    description:
      "Vacant-property maintenance and preservation work focused on securing, documenting, and keeping the property serviceable.",
    heroSummary:
      "Vacant or transition-stage properties need practical oversight, especially when weather exposure or delayed maintenance can compound damage.",
    situation: [
      "A vacant or lightly occupied property can deteriorate quickly when drainage, openings, moisture, or access issues are left unchecked.",
      "We focus on preserving serviceability, documenting condition, and identifying what needs to be secured or repaired next.",
    ],
    whatToSend: [
      "Property address",
      "Photos of the current exterior and any problem areas",
      "Dimensions or counts for openings, access issues, or damaged areas where relevant",
      "Occupancy or vacancy status",
      "Access notes or gate information",
      "Priority level and any preservation or transition deadline",
    ],
    scopeSections: [
      {
        title: "Exterior condition and security",
        items: [
          "Exterior condition review",
          "Opening and access issues",
          "Weather exposure notes",
          "Basic stabilization planning",
        ],
      },
      {
        title: "Preservation documentation",
        items: [
          "Current-condition photo sets",
          "Property status notes",
          "Recommended next-step repairs",
          "Serviceability-focused reporting",
        ],
      },
      {
        title: "Regional risk context",
        items: [
          "Moisture and drainage issues",
          "Remote-property planning for Harney County",
          "Seasonal weather exposure",
          "Preservation timing and access notes",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you handle remote or seasonal properties?",
        answer:
          "Yes, within logistics limits. Remote Harney County work remains route-dependent and should be reviewed for route timing before any schedule is assumed.",
      },
      {
        question: "Is this only for foreclosures?",
        answer:
          "No. Property preservation can apply to vacant homes, transition-stage properties, inherited properties, and facilities that need practical oversight.",
      },
      {
        question: "What helps first review the most?",
        answer:
          "Address or location, current photos, dimensions or counts where relevant, occupancy status, priority level, timing constraints, and access notes make the first review much clearer.",
      },
    ],
    finalCtaTitle: "Need a property-preservation review?",
    finalCtaText:
      "Send the address or location, current photos, dimensions or counts where relevant, access notes, priority level, timing constraints, and property status. We’ll review the preservation priorities first.",
  },
  "residential-remodeling": {
    slug: "residential-remodeling",
    serviceType: "residential-remodeling",
    title: "Residential Remodeling",
    description:
      "Practical remodeling work for homes where the priority is a clear scope, documented progress, and durable follow-through.",
    heroSummary:
      "This site treats remodeling as practical work tied to real property needs, not generic showroom marketing. Clear scope and documented progress come first.",
    situation: [
      "Some remodeling work starts because of wear, damage, access issues, or a need to bring a space back into practical service.",
      "We focus on defined scopes, realistic next steps, and documentation that shows what changed during the work.",
    ],
    whatToSend: [
      "Photos of the space",
      "Address or location in Harney County",
      "Dimensions or rough measurements where relevant",
      "A short description of what needs to change",
      "Any known damage or existing repair context",
      "Access notes, priority level, timeline, or occupancy constraints",
    ],
    scopeSections: [
      {
        title: "Interior and exterior updates",
        items: [
          "Targeted room updates",
          "Exterior rebuild details",
          "Finish and trim follow-through",
          "Repair-linked remodeling scopes",
        ],
      },
      {
        title: "Scope definition",
        items: ["Photo-based initial review", "Clear work grouping", "Material and access notes", "Documentation tied to progress"],
      },
      {
        title: "Practical project delivery",
        items: [
          "Communication about what changes",
          "Completion-photo follow-through",
          "Line-item invoicing",
          "Maintenance-minded finish decisions",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you handle large custom remodels?",
        answer:
          "This site is positioned around practical repair, restoration, and maintenance-led work. Large custom projects should be scoped carefully before assuming fit.",
      },
      {
        question: "Can remodeling tie into repair work?",
        answer:
          "Yes. Remodeling here often overlaps with repairs, rebuilds, or condition-driven updates where the practical scope is the starting point.",
      },
      {
        question: "What should I send first?",
        answer:
          "Photos, dimensions, the address or location, access notes, priority level, timing constraints, what you want changed, and any related damage or repair context are the most useful first items.",
      },
    ],
    finalCtaTitle: "Need a practical remodel scope reviewed?",
    finalCtaText:
      "Send the space photos, dimensions, address or location, access notes, priority level, timing constraints, and what needs to change. We’ll review the practical path first.",
  },
  "commercial-maintenance": {
    slug: "commercial-maintenance",
    serviceType: "commercial-maintenance",
    title: "Commercial Maintenance",
    description:
      "Planned maintenance and repair support for working commercial properties with clear documentation and practical scheduling.",
    heroSummary:
      "Commercial sites need maintenance that respects occupancy, access, and operational risk. We focus on scopes that keep facilities serviceable and documented.",
    situation: [
      "Commercial maintenance often requires balancing repair needs with occupied space, tenant use, or business-hour constraints.",
      "We focus on practical scopes, clear communication, and documentation that helps owners or managers track what was addressed.",
    ],
    whatToSend: [
      "Facility address",
      "Photos of the issue or maintenance area",
      "Dimensions, counts, or affected-area notes where relevant",
      "Business-hour or access limits",
      "Any recurring issue notes",
      "Priority level, timing constraints, and concerns for tenants, staff, or customers",
    ],
    scopeSections: [
      {
        title: "Facility maintenance scopes",
        items: [
          "Exterior and envelope issues",
          "Interior utility and service-space work",
          "Occupied-area coordination",
          "Routine maintenance follow-through",
        ],
      },
      {
        title: "Documentation and planning",
        items: ["Current-condition review", "Scope grouping by priority", "Access and scheduling notes", "Completion-photo follow-through"],
      },
      {
        title: "Operational considerations",
        items: [
          "Business-hour planning",
          "Tenant or occupant impact notes",
          "Practical risk prioritization",
          "Repair-path clarity for managers",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you work around occupancy or business hours?",
        answer:
          "Yes, when practical. Include any access windows or business constraints in the initial request so they can be considered in the scope.",
      },
      {
        question: "Can you help with recurring facility issues?",
        answer:
          "Yes. Repeating water entry, weather exposure, and maintenance trouble spots are good candidates for a documented review.",
      },
      {
        question: "What helps with the first review?",
        answer:
          "The address or location, photos, dimensions or affected-area notes, access limits, priority level, timing constraints, and a short note about occupant impact make the initial review more useful.",
      },
    ],
    finalCtaTitle: "Need a commercial maintenance review?",
    finalCtaText:
      "Send the facility photos, dimensions or affected-area notes, address or location, access notes, priority level, and timing constraints. We’ll review the practical maintenance path first.",
  },
  "church-nonprofit-maintenance": {
    slug: "church-nonprofit-maintenance",
    serviceType: "church-nonprofit-maintenance",
    title: "Church / Non-Profit Facility Maintenance",
    description:
      "Facility maintenance support for churches and non-profits with practical scheduling, clear documentation, and serviceable repair scopes.",
    heroSummary:
      "Church and non-profit facilities often need careful scheduling, practical prioritization, and documentation that helps leadership plan the next step.",
    situation: [
      "Facilities with shared or seasonal use need maintenance that respects how the space is actually used, not just a generic checklist.",
      "We focus on practical repair and maintenance scopes that help leadership understand condition, urgency, and follow-through.",
    ],
    whatToSend: [
      "Facility address",
      "Photos of the issue or priority areas",
      "Dimensions, counts, or affected-area notes where relevant",
      "Notes about how the space is used",
      "Access notes, priority level, scheduling limits, or event windows",
      "Any existing maintenance or inspection notes",
    ],
    scopeSections: [
      {
        title: "Facility-care scopes",
        items: [
          "Exterior upkeep and envelope issues",
          "Shared-space maintenance needs",
          "Occupied-facility coordination",
          "Condition documentation for leadership review",
        ],
      },
      {
        title: "Planning and prioritization",
        items: [
          "Priority versus deferrable work grouping",
          "Volunteer-safe versus contractor-led task notes",
          "Scheduling around use of space",
          "Clear next-step documentation",
        ],
      },
      {
        title: "Documentation support",
        items: [
          "Current-condition photo review",
          "Scope notes for approval",
          "Completion-photo follow-through",
          "Budget-minded repair-path clarity",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you publish church or non-profit discounts?",
        answer:
          "Any discount or special pricing language should be verified before publishing. This page focuses on facility-maintenance scope, not promotional pricing.",
      },
      {
        question: "Can you work around ministry or event schedules?",
        answer:
          "Yes, when practical. Include event or scheduling limits in the initial request so they can be considered during scope review.",
      },
      {
        question: "What helps the first review?",
        answer:
          "Facility photos, dimensions or affected-area notes, address or location, access notes, priority level, how the space is used, and any timing constraints make the first pass more useful.",
      },
    ],
    finalCtaTitle: "Need a facility-maintenance review?",
    finalCtaText:
      "Send the facility photos, dimensions or affected-area notes, address or location, access notes, priority level, and scheduling notes. We’ll review the practical maintenance priorities first.",
  },
};
