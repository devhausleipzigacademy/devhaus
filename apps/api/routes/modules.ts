import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { modulesTable } from "../db/schema/modules";
import { createModuleSchema, updateModuleSchema } from "@repo/schemas/modules";
import { authenticated } from "../lib/lucia";
import { usersTable } from "../db/schema/auth";

export const modulesRoute = new Hono()
  .get("/", async (c) => {
    const result = await db
      .select()
      .from(modulesTable)
      .innerJoin(usersTable, eq(modulesTable.creatorId, usersTable.id));

    const modules = result.map(({ module, user }) => ({
      ...module,
      creator: user,
    }));
    console.log(modules);

    return c.json({ modules });
  })
  .post(
    "/",
    authenticated,
    zValidator("json", createModuleSchema),
    async (c) => {
      const { user } = c.var;
      const module = c.req.valid("json");
      const newModule = await db
        .insert(modulesTable)
        .values({
          ...module,
          creatorId: user.id,
        })
        .returning({ id: modulesTable.id })
        .then((res) => res[0]);

      const result = await db
        .select()
        .from(modulesTable)
        .where(eq(modulesTable.id, newModule.id))
        .innerJoin(usersTable, eq(modulesTable.creatorId, usersTable.id))
        .then((res) => res[0]);

      const newModuleWithuser = {
        ...result.module,
        creator: result.user,
      };
      return c.json(newModuleWithuser);
    }
  )
  .get("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));

    const module = await db
      .select()
      .from(modulesTable)
      .where(eq(modulesTable.id, id))
      .then((res) => res[0]);

    if (!module) {
      return c.notFound();
    }
    return c.json({ module });
  })
  .patch("/:id", zValidator("json", updateModuleSchema), async (c) => {
    const id = parseInt(c.req.param("id"));
    const partialModule = c.req.valid("json");

    const updatedModule = await db
      .update(modulesTable)
      .set(partialModule)
      .where(eq(modulesTable.id, id))
      .returning()
      .then((res) => res[0]);

    if (!updatedModule) {
      return c.notFound();
    }

    return c.json({ updatedModule });
  });
