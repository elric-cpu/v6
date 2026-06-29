import { company, getStaticServices } from "@benson/shared";

export function GET() {
  const services = getStaticServices()
    .map((service) => `- ${service.title}: ${service.href}`)
    .join("\n");

  return new Response(`# ${company.brandName}\n\nHarney County repair and maintenance services.\n\n${services}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
