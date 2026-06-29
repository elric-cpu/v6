import { getAllPublicRoutes } from "@benson/shared";

export function GET() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Sitemap: https://bensonhomesolutions.com/sitemap.xml",
      `# Routes: ${getAllPublicRoutes().length}`,
    ].join("\n"),
    {
      headers: { "content-type": "text/plain; charset=utf-8" },
    },
  );
}
