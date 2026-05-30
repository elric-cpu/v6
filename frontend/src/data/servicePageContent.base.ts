import type { ServicePageContent } from "@/data/servicePageContent";

export const baseServicePageContentBySlug: Record<string, ServicePageContent> = {
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
      "Property address or location",
      "Dimensions, counts, or measurements for affected items when available",
      "Closing or deadline timeline and priority level",
      "Access notes plus any lender, insurer, or agent notes that affect scope",
    ],
    scopeSections: [
      {
        title: "Safety and code items",
        items: [
          "Handrails and guard issues",
          "Electrical corrections",
          "Plumbing leaks and fixture issues",
          "Basic life-safety corrections",
        ],
      },
      {
        title: "Exterior and envelope work",
        items: [
          "Siding and trim repairs",
          "Window and door corrections",
          "Drainage and gutter issues",
          "Weather-exposed exterior fixes",
        ],
      },
      {
        title: "Documentation support",
        items: [
          "Before and after photo sets",
          "Clear scope notes",
          "Line-item invoicing",
          "Repair completion records",
        ],
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
          "Yes. Start by sending the report, photos, address or location, dimensions where relevant, access notes, priority level, and timing constraints. If the scope is still unclear after review, we can recommend the next inspection or site step.",
      },
      {
        question: "Will you document the completed repairs?",
        answer:
          "Yes. We aim to provide clear documentation, including completion photos and invoicing that helps the next reviewer understand what was addressed.",
      },
    ],
    finalCtaTitle: "Need the list cleared?",
    finalCtaText:
      "Send the report, photos, dimensions where relevant, address or location, access notes, priority level, and timeline. We’ll review the scope and practical next step.",
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
      "Address or location and area of the property affected",
      "Approximate dimensions of affected areas when available",
      "When the issue was first noticed",
      "Access notes, priority level, and timing constraints",
      "Any inspection, mitigation, or insurance notes already on hand",
      "Whether the issue is active now or already dried",
    ],
    scopeSections: [
      {
        title: "Source review",
        items: [
          "Window and door leak points",
          "Roof and flashing review",
          "Drainage and exterior water path checks",
          "Crawlspace and attic moisture context",
        ],
      },
      {
        title: "Damage follow-through",
        items: [
          "Wet-material removal planning",
          "Trim and finish repair scopes",
          "Exterior opening corrections",
          "Documentation for next repair steps",
        ],
      },
      {
        title: "Moisture control",
        items: [
          "Practical containment steps",
          "Ventilation and drying guidance",
          "Recurring-risk identification",
          "Weather-exposure notes by region",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you handle active water intrusion?",
        answer:
          "Yes, when practical. Send photos, location, access notes, priority level, and whether the issue is active now so it can be reviewed against the current Harney County route schedule.",
      },
      {
        question: "Do you provide mold lab testing?",
        answer:
          "This site currently focuses on practical repair and moisture-response scope. Any specialized testing requirement should be verified before scheduling.",
      },
      {
        question: "What helps you quote faster?",
        answer:
          "Clear photos, dimensions or affected-area notes, the address or location, access notes, priority level, timing constraints, and whether the area has already been opened or dried out make the first review clearer.",
      },
    ],
    finalCtaTitle: "Need a moisture-related scope reviewed?",
    finalCtaText:
      "Send photos, dimensions or affected-area notes, the address or location, access notes, priority level, and what you’re seeing now. We’ll review the likely repair path and next step.",
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
      "Address or location in Harney County",
      "Access notes, priority level, and timing constraints",
      "Notes about drafts, leaks, sticking, or visible damage",
      "Any inspection notes tied to the opening",
    ],
    scopeSections: [
      {
        title: "Replacement scopes",
        items: [
          "Window replacement planning",
          "Door replacement planning",
          "Trim and exterior finish coordination",
          "Weather-ready detailing",
        ],
      },
      {
        title: "Condition review",
        items: [
          "Leak or draft symptoms",
          "Trim and siding tie-in points",
          "Visible framing or threshold concerns",
          "Inspection-flagged opening issues",
        ],
      },
      {
        title: "Documentation",
        items: [
          "Photo-based review",
          "Opening count and grouping",
          "Scope notes for materials and access",
          "Completion-photo follow-through",
        ],
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
          "Yes. Start with photos, approximate dimensions, the address or location, access notes, priority level, and timing constraints. That usually supports a clearer route review.",
      },
      {
        question: "Do you only replace, or do you repair too?",
        answer:
          "This page is focused on replacement work. If the issue looks repairable instead, we can direct you toward the more practical scope during review.",
      },
    ],
    finalCtaTitle: "Need a window or door scope reviewed?",
    finalCtaText:
      "Send the opening photos, dimensions if you have them, the address or location, access notes, priority level, and timing constraints. We’ll review the replacement path.",
  },
  "emergency-response": {
    slug: "emergency-response",
    serviceType: "emergency-response",
    title: "Emergency Response",
    description:
      "Priority-condition review for water intrusion, storm damage, and other active issues that need practical stabilization planning.",
    heroSummary:
      "When damage is active, the first priority is stabilization, documentation, and deciding what needs to happen now versus next.",
    situation: [
      "Priority work often starts with water entry, weather damage, failed openings, or sudden conditions that make the property unsafe or exposed.",
      "The goal is practical review, clear communication, and documented next steps without overpromising unsupported timelines.",
    ],
    whatToSend: [
      "Photos of the active condition",
      "Property address or location",
      "Dimensions or affected-area notes when available",
      "Best callback number",
      "What is happening right now",
      "Priority level, timing constraints, and any access or safety limits we should know",
    ],
    scopeSections: [
      {
        title: "Priority response review",
        items: [
          "Water-intrusion review",
          "Storm-damage stabilization planning",
          "Temporary weather protection planning",
          "Priority condition review",
        ],
      },
      {
        title: "Documentation",
        items: [
          "Current-condition photos",
          "Damage notes for follow-up",
          "Scope separation between priority and scheduled work",
          "Practical next-step planning",
        ],
      },
      {
        title: "Regional context",
        items: [
          "Harney County weather exposure",
          "Monthly South County route planning",
          "Route-dependent scheduling for remote communities",
          "Property-preservation coordination when needed",
        ],
      },
    ],
    faqs: [
      {
        question: "How should I request priority help?",
        answer:
          "Use the contact form or call, and mark the request as a priority condition. Include photos, address or location, access notes, timing constraints, and a short note about what is active right now.",
      },
      {
        question: "Is priority work available everywhere on the same timeline?",
        answer:
          "No. Response depends on location, conditions, and current logistics. Remote Harney County work is especially route-dependent.",
      },
      {
        question: "What helps most during an emergency intake?",
        answer:
          "Clear photos, dimensions or affected-area notes, the exact address or location, access notes, priority level, and a short note about active conditions help us review the situation and give a practical next step.",
      },
    ],
    finalCtaTitle: "Need a priority condition reviewed?",
    finalCtaText:
      "Call or send photos, address or location, access notes, priority level, and timing constraints so we can review the active condition.",
  },
};
