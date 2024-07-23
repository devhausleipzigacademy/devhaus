import { app } from "./app";
export type { ApiRoutes } from "./app";

const port = process.env.PORT || 3000;

Bun.serve({
  fetch: app.fetch,
});
console.log(`🏃 Server running at port ${port}`);
