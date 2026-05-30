import { buildLlmsText } from "@/lib/public-reference";

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
