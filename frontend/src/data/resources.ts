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
      "A practical checklist for sending photos, the address, and the scope details Benson Home Solutions needs for a faster first review.",
    intro:
      "Most repair and maintenance requests go faster when the first message includes usable photos, the property address, and a short note about the condition or deadline.",
    sections: [
      {
        title: "Start with the condition, not the backstory",
        body: [
          "Lead with what is happening now: active water entry, an inspection list, a damaged window or door, a facility maintenance issue, or another practical condition that needs review.",
          "A concise description makes it easier to separate urgent items from work that can be scheduled normally.",
        ],
      },
      {
        title: "Send the basic field information",
        body: [
          "The most useful first-pass inputs are consistent across most service types.",
        ],
        bullets: [
          "Photos showing the issue clearly",
          "Property address",
          "Best callback number",
          "Any timing or access limits",
          "Inspection, mitigation, or facility notes if they already exist",
        ],
      },
      {
        title: "Match the message to the service type",
        body: [
          "Window and door replacement requests benefit from opening counts or dimensions when available. Inspection-repair requests benefit from the report or addendum. Emergency requests should describe what is active right now.",
          "That extra context usually produces a clearer first response and a more practical next-step recommendation.",
        ],
      },
    ],
    ctaTitle: "Need a scope reviewed?",
    ctaText:
      "Send the photos, the address, and a short note about what needs attention. We’ll review the practical next step.",
  },
  {
    slug: "service-areas-sweet-home-and-harney-county",
    title: "How Benson Home Solutions Handles Service Areas",
    description:
      "Understand the two active service-area silos: the Sweet Home 25-mile coverage area and the route-dependent Harney County footprint.",
    intro:
      "Benson Home Solutions is organized around two different kinds of service geography: a practical Sweet Home-centered coverage area and a planned Harney County route structure.",
    sections: [
      {
        title: "Sweet Home 25-mile coverage",
        body: [
          "Sweet Home, Lebanon, Albany, Brownsville, Cascadia, Foster, Holley, Crawfordsville, Scio, and Tangent are treated as the primary local operating footprint when scheduling makes sense.",
          "This local silo is where repair, inspection, maintenance, and weatherization requests are most straightforward to review and route.",
        ],
      },
      {
        title: "Harney County routing",
        body: [
          "Burns and Hines remain the primary Harney County anchors. Other communities such as Fields, Diamond, Crane, Frenchglen, Princeton, Riley, and Drewsey are treated as route-dependent.",
          "That means remote requests should not imply same-day or unrestricted availability unless it is explicitly confirmed for that scope.",
        ],
      },
      {
        title: "What helps route a request",
        body: [
          "Location details matter most when the request is remote, urgent, or access-sensitive.",
        ],
        bullets: [
          "Exact property address",
          "Photos of the condition",
          "Whether the issue is active now",
          "Any site-access or gate constraints",
          "Any time-sensitive deadline tied to weather, occupancy, or inspections",
        ],
      },
    ],
    ctaTitle: "Not sure if your location fits?",
    ctaText:
      "Send the address and photos first. We’ll review whether the request fits the current route and scheduling reality.",
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
          "One-off requests fit inspection lists, isolated moisture issues, a damaged opening, an urgent response event, or a clearly defined repair scope.",
          "The goal is to review the condition, define the scope clearly, complete the work, and document the result.",
        ],
      },
      {
        title: "When scheduled maintenance helps more",
        body: [
          "Maintenance plans fit properties where the bigger issue is consistency: recurring exterior exposure, multiple systems to keep an eye on, or owners and managers who want documented upkeep over time.",
          "The plan structure is educational and public-facing. Final fit still depends on the actual property and support needs.",
        ],
      },
      {
        title: "Use the recommendation tool carefully",
        body: [
          "The subscription recommendation tool is an educational estimator, not a guaranteed savings claim or a final pricing promise.",
          "Its value is in clarifying assumptions and helping a property owner think through support level, property size, age, and region.",
        ],
      },
    ],
    ctaTitle: "Want to compare support options?",
    ctaText:
      "Review the maintenance plans, then use the recommendation tool or contact form to talk through the practical fit.",
  },
];

export const resourceBySlug = Object.fromEntries(
  resources.map((resource) => [resource.slug, resource]),
) as Record<string, ResourceEntry>;
