import { Hono } from "hono";
import { logger } from "hono/logger";
import { modulesRoute } from "./routes/modules";
import { authRoute } from "./routes/auth";
import { csrf } from "hono/csrf";
import { serveStatic } from "hono/bun";

export const app = new Hono();

app.use(csrf());
app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/modules", modulesRoute)
  .route("/auth", authRoute);

app.get("*", serveStatic({ root: "../learning/dist" }));
app.get("*", serveStatic({ path: "../learning/dist/index.html" }));

export type ApiRoutes = typeof apiRoutes;
