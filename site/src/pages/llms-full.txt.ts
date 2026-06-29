import { company, getStaticServiceAreas, getStaticServices } from "@benson/shared";

export function GET() {
  const services = getStaticServices()
    .map((service) => `- ${service.title}: ${service.summary}`)
    .join("\n");
  const areas = getStaticServiceAreas()
    .map((area) => `- ${area.city}: ${area.priority}, ZIP ${area.zipCodes.join(", ")}`)
    .join("\n");

  return new Response(
    `# ${company.brandName}\n\nLegal context: ${company.legalName}. Oregon CCB ${company.oregonCcb}.\n\n## Services\n${services}\n\n## Harney County Areas\n${areas}\n`,
    {
      headers: { "content-type": "text/plain; charset=utf-8" },
    },
  );
}
