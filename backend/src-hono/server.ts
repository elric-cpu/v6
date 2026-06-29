import { serve } from "@hono/node-server";

import app from "./app";

const port = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Benson Hono API listening on http://0.0.0.0:${info.port}`);
});
