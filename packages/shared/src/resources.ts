export interface ResourceEntry {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string[];
    bullets?: string[];
  }>;
  ctaTitle: string;
  ctaText: string;
}

export const resources: ResourceEntry[] = [
  {
    slug: "send-photos-address-and-scope",
    title: "What To Send Before Requesting Repair Work",
    metaTitle: "What To Send Before Repair",
    description:
      "A practical checklist for sending photos, dimensions, location, access, priority, and timing details Benson Home Solutions needs for Harney County route review.",
    intro:
      "Most Harney County repair and maintenance requests are easier to review when the first message includes usable photos, dimensions, the address or location, access notes, priority level, and timing constraints.",
    sections: [
      {
        title: "Send the basic field information",
        body: [
          "The most useful first-pass inputs are photos, property location, measurements where useful, best callback number, priority level, access limits, and existing inspection or mitigation notes.",
        ],
      },
    ],
    ctaTitle: "Need a scope reviewed?",
    ctaText:
      "Send photos, dimensions, the address or location, access notes, priority level, and timing constraints. We will review the practical next step.",
  },
  {
    slug: "harney-county-routes-and-south-county-planning",
    title: "Harney County Routes and South County Planning",
    metaTitle: "Harney County Routing",
    description:
      "Understand Benson Home Solutions Harney County routing, including Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond, Princeton, Riley, Lawen, and monthly South County routes.",
    intro:
      "Benson Home Solutions is publicly positioned around Harney County route planning. Burns and Hines are central anchors, and remote South County work is reviewed for monthly route grouping.",
    sections: [
      {
        title: "Harney County is the public geography",
        body: [
          "Remote requests are reviewed around route fit, property access, weather, materials, and timing constraints.",
        ],
      },
    ],
    ctaTitle: "Not sure if your location fits?",
    ctaText:
      "Send the address or location, photos, dimensions, access notes, priority level, and timing constraints first.",
  },
  {
    slug: "maintenance-plans-vs-one-off-repairs",
    title: "Maintenance Plans vs. One-Off Repair Requests",
    metaTitle: "Maintenance Plans vs Repairs",
    description:
      "A practical guide to when scheduled maintenance fits better than one-off repair requests for Benson Home Solutions customers.",
    intro:
      "Some properties need a single repair scope. Others benefit from repeat inspections, documented upkeep, and predictable follow-through.",
    sections: [
      {
        title: "When one-off work makes sense",
        body: [
          "One-off requests fit inspection lists, isolated moisture issues, a damaged opening, a priority condition, or a clearly defined repair scope.",
          "The goal is to review the condition, define the scope clearly, complete the work, and document the result.",
        ],
      },
      {
        title: "When scheduled maintenance helps more",
        body: [
          "Maintenance plans fit Harney County properties where the bigger issue is consistency: recurring exterior exposure, multiple systems to keep an eye on, or owners and managers who want documented upkeep over time.",
          "The plan structure is educational and public-facing. Final fit still depends on the actual property and support needs.",
        ],
      },
      {
        title: "Use the recommendation tool carefully",
        body: [
          "The recommendation tool is educational, not a financial-benefit claim, route promise, or final pricing promise.",
          "Its value is in clarifying assumptions and helping a property owner think through support level, property size, age, priority, and Harney County route fit.",
        ],
      },
    ],
    ctaTitle: "Want to compare support options?",
    ctaText:
      "Review the maintenance plans, then use the recommendation tool or contact form to talk through route fit, access, priority, and timing.",
  },
];
