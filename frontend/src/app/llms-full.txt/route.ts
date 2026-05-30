import { buildLlmsFullText } from "@/lib/public-reference";

export function GET() {
  return new Response(buildLlmsFullText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
