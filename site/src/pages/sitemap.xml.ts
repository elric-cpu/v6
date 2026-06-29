import { getAllPublicRoutes } from "@benson/shared";

export function GET() {
  const urls = getAllPublicRoutes()
    .filter((route) => !route.endsWith(".txt"))
    .map((route) => `<url><loc>https://bensonhomesolutions.com${route}</loc></url>`)
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { "content-type": "application/xml; charset=utf-8" },
    },
  );
}
