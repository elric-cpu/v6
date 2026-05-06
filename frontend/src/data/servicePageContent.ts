import type { ServiceType } from "@/types";

export interface ServicePageSection {
  title: string;
  items: string[];
}

export interface ServicePageContent {
  slug: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  heroSummary: string;
  situation: string[];
  whatToSend: string[];
  scopeSections: ServicePageSection[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  finalCtaTitle: string;
  finalCtaText: string;
}

export const serviceSlugByType: Record<ServiceType, string> = {
  "inspection-repairs": "inspection-repairs",
  "water-mold-moisture": "water-damage",
  "window-door-replacements": "window-door-replacement",
  "maintenance-plans": "plans",
  "emergency-response": "emergency-response",
  "energy-weatherization": "energy-weatherization",
  "property-preservation": "property-preservation",
  "residential-remodeling": "residential-remodeling",
  "commercial-maintenance": "commercial-maintenance",
  "church-nonprofit-maintenance": "church-nonprofit-maintenance",
};

export const servicePageContentBySlug: Record<string, ServicePageContent> = {
  "inspection-repairs": {
    slug: "inspection-repairs",
    serviceType: "inspection-repairs",
    title: "Inspection Repairs",
    description:
      "Clear inspection flags with practical repairs. We address the list, document the work, and provide completion photos.",
    heroSummary:
      "Inspection lists can hold up closings, insurance sign-off, or financing. We review the report, scope the work clearly, and document the repair path.",
    situation: [
      "Inspection reports often mix simple corrections with items that affect closing, occupancy, or lender confidence.",
      "We sort the list into practical repair scopes, explain what needs attention first, and keep the documentation clear for your next step.",
    ],
    whatToSend: [
      "Complete inspection report or repair addendum",
      "Photos of flagged items",
      "Property address",
      "Closing or deadline timeline",
      "Any lender, insurer, or agent notes that affect scope",
    ],
    scopeSections: [
      {
        title: "Safety and code items",
        items: ["Handrails and guard issues", "Electrical corrections", "Plumbing leaks and fixture issues", "Basic life-safety corrections"],
      },
      {
        title: "Exterior and envelope work",
        items: ["Siding and trim repairs", "Window and door corrections", "Drainage and gutter issues", "Weather-exposed exterior fixes"],
      },
      {
        title: "Documentation support",
        items: ["Before and after photo sets", "Clear scope notes", "Line-item invoicing", "Repair completion records"],
      },
    ],
    faqs: [
      {
        question: "What kinds of inspection repairs do you handle?",
        answer:
          "We focus on practical correction work tied to inspection findings, including safety, water-entry, exterior, and basic systems issues that need documented follow-through.",
      },
      {
        question: "Can you work from a report and photos first?",
        answer:
          "Yes. Start by sending the report, photos, and the address. If the scope is still unclear after review, we can recommend the next inspection or site step.",
      },
      {
        question: "Will you document the completed repairs?",
        answer:
          "Yes. We aim to provide clear documentation, including completion photos and invoicing that helps the next reviewer understand what was addressed.",
      },
    ],
    finalCtaTitle: "Need the list cleared?",
    finalCtaText:
      "Send the report, photos, and timeline. We’ll review the scope and respond with a practical next step.",
  },
  "water-damage": {
    slug: "water-damage",
    serviceType: "water-mold-moisture",
    title: "Water, Mold & Moisture",
    description:
      "Water intrusion investigation, dry-out, and moisture control with practical documentation and repair scoping.",
    heroSummary:
      "Water problems spread when the source stays unclear. We help document active conditions, identify likely entry points, and define the next repair step.",
    situation: [
      "Moisture issues often show up as staining, musty air, damaged trim, or repeated wet areas around windows, doors, roofs, and crawlspaces.",
      "The first job is to understand whether you’re dealing with active water entry, lingering moisture, or damage that still needs repair follow-through.",
    ],
    whatToSend: [
      "Photos of active staining, swelling, or visible moisture damage",
      "Address and area of the property affected",
      "When the issue was first noticed",
      "Any inspection, mitigation, or insurance notes already on hand",
      "Whether the issue is active now or already dried",
    ],
    scopeSections: [
      {
        title: "Source review",
        items: ["Window and door leak points", "Roof and flashing review", "Drainage and exterior water path checks", "Crawlspace and attic moisture context"],
      },
      {
        title: "Damage follow-through",
        items: ["Wet-material removal planning", "Trim and finish repair scopes", "Exterior opening corrections", "Documentation for next repair steps"],
      },
      {
        title: "Moisture control",
        items: ["Practical containment steps", "Ventilation and drying guidance", "Recurring-risk identification", "Weather-exposure notes by region"],
      },
    ],
    faqs: [
      {
        question: "Do you handle active water intrusion?",
        answer:
          "Yes, when practical. Send photos and note whether the issue is active now. Emergency conditions should be marked as emergency when you contact us.",
      },
      {
        question: "Do you provide mold lab testing?",
        answer:
          "This site currently focuses on practical repair and moisture-response scope. Any specialized testing requirement should be verified before scheduling.",
      },
      {
        question: "What helps you quote faster?",
        answer:
          "Clear photos, the address, where the moisture is showing up, and whether the area has already been opened or dried out make the first review much faster.",
      },
    ],
    finalCtaTitle: "Need a moisture-related scope reviewed?",
    finalCtaText:
      "Send the photos, the address, and what you’re seeing now. We’ll review the likely repair path and next step.",
  },
  "window-door-replacement": {
    slug: "window-door-replacement",
    serviceType: "window-door-replacements",
    title: "Window & Door Replacements",
    description:
      "Practical replacement work for drafty, damaged, leaking, or inspection-flagged windows and doors.",
    heroSummary:
      "Openings that leak air or water need more than cosmetic fixes. We help scope replacements that improve weather protection and fit the condition of the property.",
    situation: [
      "Old or damaged windows and doors can drive drafts, water entry, trim damage, and repeated maintenance work.",
      "We focus on practical replacement scopes that address the opening, the surrounding condition, and the documentation you need after installation.",
    ],
    whatToSend: [
      "Photos of the window or door from inside and outside",
      "Approximate dimensions or count of affected openings",
      "Address and service area",
      "Notes about drafts, leaks, sticking, or visible damage",
      "Any inspection notes tied to the opening",
    ],
    scopeSections: [
      {
        title: "Replacement scopes",
        items: ["Window replacement planning", "Door replacement planning", "Trim and exterior finish coordination", "Weather-ready detailing"],
      },
      {
        title: "Condition review",
        items: ["Leak or draft symptoms", "Trim and siding tie-in points", "Visible framing or threshold concerns", "Inspection-flagged opening issues"],
      },
      {
        title: "Documentation",
        items: ["Photo-based review", "Opening count and grouping", "Scope notes for materials and access", "Completion-photo follow-through"],
      },
    ],
    faqs: [
      {
        question: "Do you handle both windows and doors?",
        answer:
          "Yes. This service category covers both, especially where the issue is weather protection, damage, poor function, or inspection-related replacement work.",
      },
      {
        question: "Can you review photos before a site visit?",
        answer:
          "Yes. Start with photos, approximate dimensions, and the address. That usually lets us give a clearer next-step recommendation.",
      },
      {
        question: "Do you only replace, or do you repair too?",
        answer:
          "This page is focused on replacement work. If the issue looks repairable instead, we can direct you toward the more practical scope during review.",
      },
    ],
    finalCtaTitle: "Need a window or door scope reviewed?",
    finalCtaText:
      "Send the opening photos, dimensions if you have them, and the address. We’ll review the replacement path.",
  },
  "emergency-response": {
    slug: "emergency-response",
    serviceType: "emergency-response",
    title: "Emergency Response",
    description:
      "Urgent repairs for water intrusion, storm damage, and other conditions that need immediate practical response.",
    heroSummary:
      "When damage is active, the first priority is stabilization, documentation, and deciding what needs to happen now versus next.",
    situation: [
      "Emergency work often starts with water entry, weather damage, failed openings, or sudden conditions that make the property unsafe or exposed.",
      "The goal is practical response, clear communication, and documented next steps without overpromising unsupported timelines.",
    ],
    whatToSend: [
      "Photos of the active condition",
      "Property address",
      "Best callback number",
      "What is happening right now",
      "Any immediate access or safety limits we should know",
    ],
    scopeSections: [
      {
        title: "Immediate response",
        items: ["Water-intrusion response", "Storm-damage stabilization", "Temporary weather protection", "Urgent condition review"],
      },
      {
        title: "Documentation",
        items: ["Current-condition photos", "Damage notes for follow-up", "Scope separation between urgent and non-urgent work", "Practical next-step planning"],
      },
      {
        title: "Regional context",
        items: ["Sweet Home moisture exposure", "Harney County weather exposure", "Route-dependent scheduling for remote communities", "Property-preservation coordination when needed"],
      },
    ],
    faqs: [
      {
        question: "How should I request emergency help?",
        answer:
          "Use the contact form or call, and mark the urgency as emergency. Include photos and a short note about what is active right now.",
      },
      {
        question: "Do you guarantee same-day service everywhere?",
        answer:
          "No. Response depends on location, conditions, and current logistics. Remote Harney County work is especially route-dependent.",
      },
      {
        question: "What helps most during an emergency intake?",
        answer:
          "Clear photos, the exact address, and a short note about active conditions help us review the situation faster and give a practical next step.",
      },
    ],
    finalCtaTitle: "Need urgent help reviewed now?",
    finalCtaText:
      "Call or send the photos and address, then mark the request as emergency so we can review the active condition.",
  },
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
      "Address and service area",
      "Notes about comfort, moisture, or seasonal trouble spots",
      "Any inspection notes tied to efficiency or envelope condition",
    ],
    scopeSections: [
      {
        title: "Envelope-focused work",
        items: ["Window and door replacement scopes", "Exterior trim and seal detail review", "Weather-exposed opening corrections", "Draft-prone condition review"],
      },
      {
        title: "Regional conditions",
        items: ["Moisture exposure around Sweet Home", "High-desert wind exposure in Harney County", "Freeze-season weather prep", "Protection of vulnerable openings"],
      },
      {
        title: "Planning and follow-through",
        items: ["Photo-based initial review", "Scope grouping by priority", "Documentation for next repair steps", "Completion-photo follow-through"],
      },
    ],
    faqs: [
      {
        question: "Do you guarantee utility savings?",
        answer:
          "No. This work is presented as practical weatherization and building-envelope improvement, not guaranteed savings.",
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
      "Send the photos, the address, and the trouble spots you want addressed. We’ll review the practical envelope work first.",
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
      "Occupancy or vacancy status",
      "Access notes or gate information",
      "Any preservation or transition deadline",
    ],
    scopeSections: [
      {
        title: "Exterior condition and security",
        items: ["Exterior condition review", "Opening and access issues", "Weather exposure notes", "Basic stabilization planning"],
      },
      {
        title: "Preservation documentation",
        items: ["Current-condition photo sets", "Property status notes", "Recommended next-step repairs", "Serviceability-focused reporting"],
      },
      {
        title: "Regional risk context",
        items: ["Moisture and drainage issues", "Remote-property planning for Harney County", "Seasonal weather exposure", "Preservation timing and access notes"],
      },
    ],
    faqs: [
      {
        question: "Do you handle remote or seasonal properties?",
        answer:
          "Yes, within logistics limits. Remote Harney County work remains route-dependent and should not be assumed to have immediate turnaround.",
      },
      {
        question: "Is this only for foreclosures?",
        answer:
          "No. Property preservation can apply to vacant homes, transition-stage properties, inherited properties, and facilities that need practical oversight.",
      },
      {
        question: "What helps first review the most?",
        answer:
          "Address, current photos, occupancy status, and any access constraints make the first review much clearer.",
      },
    ],
    finalCtaTitle: "Need a property-preservation review?",
    finalCtaText:
      "Send the address, the current photos, and the property status. We’ll review the preservation priorities first.",
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
      "Address and service area",
      "A short description of what needs to change",
      "Any known damage or existing repair context",
      "Timeline or occupancy constraints",
    ],
    scopeSections: [
      {
        title: "Interior and exterior updates",
        items: ["Targeted room updates", "Exterior rebuild details", "Finish and trim follow-through", "Repair-linked remodeling scopes"],
      },
      {
        title: "Scope definition",
        items: ["Photo-based initial review", "Clear work grouping", "Material and access notes", "Documentation tied to progress"],
      },
      {
        title: "Practical project delivery",
        items: ["Communication about what changes", "Completion-photo follow-through", "Line-item invoicing", "Maintenance-minded finish decisions"],
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
          "Photos, the address, what you want changed, and any related damage or repair context are the most useful first items.",
      },
    ],
    finalCtaTitle: "Need a practical remodel scope reviewed?",
    finalCtaText:
      "Send the space photos, the address, and what needs to change. We’ll review the practical path first.",
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
      "Business-hour or access limits",
      "Any recurring issue notes",
      "Priority concerns for tenants, staff, or customers",
    ],
    scopeSections: [
      {
        title: "Facility maintenance scopes",
        items: ["Exterior and envelope issues", "Interior utility and service-space work", "Occupied-area coordination", "Routine maintenance follow-through"],
      },
      {
        title: "Documentation and planning",
        items: ["Current-condition review", "Scope grouping by priority", "Access and scheduling notes", "Completion-photo follow-through"],
      },
      {
        title: "Operational considerations",
        items: ["Business-hour planning", "Tenant or occupant impact notes", "Practical risk prioritization", "Repair-path clarity for managers"],
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
          "The address, photos, access limits, and a short note about occupant impact or urgency make the initial review more useful.",
      },
    ],
    finalCtaTitle: "Need a commercial maintenance review?",
    finalCtaText:
      "Send the facility photos, address, and access notes. We’ll review the practical maintenance path first.",
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
      "Notes about how the space is used",
      "Scheduling limits or event windows",
      "Any existing maintenance or inspection notes",
    ],
    scopeSections: [
      {
        title: "Facility-care scopes",
        items: ["Exterior upkeep and envelope issues", "Shared-space maintenance needs", "Occupied-facility coordination", "Condition documentation for leadership review"],
      },
      {
        title: "Planning and prioritization",
        items: ["Urgent versus deferrable work grouping", "Volunteer-safe versus contractor-led task notes", "Scheduling around use of space", "Clear next-step documentation"],
      },
      {
        title: "Documentation support",
        items: ["Current-condition photo review", "Scope notes for approval", "Completion-photo follow-through", "Budget-minded repair-path clarity"],
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
          "Facility photos, address, how the space is used, and any timing constraints make the first pass more useful.",
      },
    ],
    finalCtaTitle: "Need a facility-maintenance review?",
    finalCtaText:
      "Send the facility photos, address, and scheduling notes. We’ll review the practical maintenance priorities first.",
  },
};

export function getServiceContentBySlug(slug: string): ServicePageContent | undefined {
  return servicePageContentBySlug[slug];
}

export function getServiceSlugFromHref(href: string): string | null {
  const match = href.match(/^\/services\/(.+)$/);
  return match ? match[1] : null;
}
