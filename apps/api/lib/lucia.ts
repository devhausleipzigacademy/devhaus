import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionsTable, usersTable, type SelectUser } from "../db/schema/auth";
import { db } from "../db";
import { Lucia, type Session, type User } from "lucia";
import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { GitHub } from "arctic";

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionsTable,
  usersTable
);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    email: attributes.email,
    username: attributes.username,
    name: attributes.name,
    githubId: attributes.githubId,
    role: attributes.role,
    avatarUrl: attributes.avatarUrl,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: SelectUser;
  }
}

type Env = {
  Variables: {
    user: User;
    session: Session;
  };
};

export const validateRequest = async (c: Context) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  return { user, session };
};

export const authenticated = createMiddleware<Env>(async (c, next) => {
  const { user, session } = await validateRequest(c);
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", user);
  c.set("session", session);
  return next();
});

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);
