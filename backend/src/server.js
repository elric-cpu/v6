import { createServer } from "./app.js";

const port = Number(process.env.PORT ?? 4000);
const server = createServer();

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
