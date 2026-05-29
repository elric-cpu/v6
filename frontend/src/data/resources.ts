export interface ResourceEntry {
  slug: string;
  title: string;
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
    description:
      "A practical checklist for sending photos, dimensions, location, access, priority, and timing details Benson Home Solutions needs for Harney County route review.",
    intro:
      "Most Harney County repair and maintenance requests are easier to review when the first message includes usable photos, dimensions, the address or location, access notes, priority level, and timing constraints.",
    sections: [
      {
        title: "Start with the condition, not the backstory",
        body: [
          "Lead with what is happening now: active water entry, an inspection list, a damaged window or door, a facility maintenance issue, or another practical condition that needs review.",
          "A concise description makes it easier to separate priority conditions from work that can be grouped into a monthly South County route or another planned Harney County schedule.",
        ],
      },
      {
        title: "Send the basic field information",
        body: [
          "The most useful first-pass inputs are consistent across most service types.",
        ],
        bullets: [
          "Photos showing the issue clearly",
          "Property address or precise location",
          "Dimensions, counts, or measurements when the work involves openings, screens, doors, materials, or repeat items",
          "Best callback number",
          "Priority level and whether the condition is active now",
          "Any timing, gate, road, animal, tenant, or access limits",
          "Inspection, mitigation, or facility notes if they already exist",
        ],
      },
      {
        title: "Match the message to the service type",
        body: [
          "Window and door replacement requests benefit from opening counts or dimensions when available. Inspection-repair requests benefit from the report or addendum. Priority-condition requests should describe what is active right now.",
          "That extra context usually produces a clearer route review and a more practical next-step recommendation.",
        ],
      },
    ],
    ctaTitle: "Need a scope reviewed?",
    ctaText:
      "Send photos, dimensions, the address or location, access notes, priority level, and timing constraints. We’ll review the practical next step.",
  },
  {
    slug: "harney-county-routes-and-south-county-planning",
    title: "Harney County Routes and South County Planning",
    description:
      "Understand Benson Home Solutions Harney County routing, including Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond, Princeton, Riley, Lawen, and monthly South County routes.",
    intro:
      "Benson Home Solutions is publicly positioned around Harney County route planning. Burns and Hines are central anchors, and remote South County work is reviewed for monthly route grouping.",
    sections: [
      {
        title: "Harney County is the public geography",
        body: [
          "Public service-area copy should center on Burns, Hines, Crane, Drewsey, Frenchglen, Fields, Diamond, Princeton, Riley, Lawen, and remote South County communities.",
          "Remote requests are reviewed around route fit, property access, weather, materials, and the timing constraints that matter on long drives.",
        ],
      },
      {
        title: "Monthly South County routes",
        body: [
          "South County requests are planned in monthly route batches when the scope, access, materials, weather, and timing fit together.",
          "That means remote requests should not imply unrestricted availability. The first step is a documented intake review.",
        ],
      },
      {
        title: "What helps route a request",
        body: [
          "Location details matter most when the request is remote, priority-sensitive, or access-sensitive.",
        ],
        bullets: [
          "Exact property address or location",
          "Photos of the condition",
          "Dimensions, counts, or measurements where relevant",
          "Priority level and whether the issue is active now",
          "Any site-access or gate constraints",
          "Any time-sensitive deadline tied to weather, occupancy, or inspections",
        ],
      },
    ],
    ctaTitle: "Not sure if your location fits?",
    ctaText:
      "Send the address or location, photos, dimensions, access notes, priority level, and timing constraints first. We’ll review whether the request fits the current route and scheduling reality.",
  },
  {
    slug: "maintenance-plans-vs-one-off-repairs",
    title: "Maintenance Plans vs. One-Off Repair Requests",
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

export const resourceBySlug = Object.fromEntries(
  resources.map((resource) => [resource.slug, resource]),
) as Record<string, ResourceEntry>;
