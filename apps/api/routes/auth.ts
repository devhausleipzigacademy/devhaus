import { Hono } from "hono";
import { kindeClient, sessionManager } from "../lib/kinde";
import { authenticated, github, lucia } from "../lib/lucia";
import { OAuth2RequestError, generateState } from "arctic";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../db";
import { usersTable } from "../db/schema/auth";
import { eq } from "drizzle-orm";
import { generateId, generateIdFromEntropySize } from "lucia";
import {
  createUser,
  getUserByEmail,
  getUserByGithubId,
} from "../repositories/user";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { userRoleEnum } from "../db/schema/auth";
import {
  createInvite,
  getInviteByEmail,
  getInviteById,
} from "../repositories/auth";

interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

const inviteInputSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  firstName: z.string().min(1, "First name is required"),
  role: z.enum(userRoleEnum.enumValues),
});

export const authRoute = new Hono()
  .get("/login/github", async (c) => {
    const state = generateState();

    const url = await github.createAuthorizationURL(state);

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
    return c.redirect(url.toString());
  })
  .get("/login/github/callback", async (c) => {
    const state = c.req.query("state")?.toString() ?? null;
    const code = c.req.query("code")?.toString() ?? null;
    const storedState = getCookie(c, "github_oauth_state") ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return c.json({ error: "Invalid state" }, 400);
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: GitHubUser = await githubUserResponse.json();

      const existingUser = await getUserByGithubId(githubUser.id);

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );
        return c.redirect("http://localhost:5173/");
      }

      const userId = generateIdFromEntropySize(10);

      await createUser({
        id: userId,
        email: githubUser.email,
        name: githubUser.name,
        githubId: githubUser.id,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });

      const session = await lucia.createSession(userId, {});
      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true }
      );
      return c.redirect("http://localhost:5173/");
    } catch (err) {
      if (
        err instanceof OAuth2RequestError &&
        err.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  })
  .get("/logout", authenticated, async (c) => {
    const session = c.var.session;

    if (!session) {
      return c.body(null, 401);
    }
    await lucia.invalidateSession(session.id);
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
    return c.redirect("http://localhost:5173/");
  })
  .get("/me", authenticated, async (c) => {
    const user = c.var.user;

    return c.json({ user });
  })
  .post("/invite", zValidator("json", inviteInputSchema), async (c) => {
    const input = c.req.valid("json");

    const existingInvite = await getInviteByEmail(input.email);
    if (existingInvite) {
      return c.json({ error: "Invite already exists" }, 400);
    }

    const existingUser = await getUserByEmail(input.email);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const newInvite = await createInvite({ ...input, status: "pending" });

    return c.json({
      email: input.email,
      firstName: input.firstName,
      url: `http://localhost:5173/invite/accept?token=${newInvite.id}`,
    });
  })
  .get("invite/accept", async (c) => {
    const code = c.req.query("token")?.toString() ?? null;
    if (!code) {
      return c.json({ error: "No code provided" }, 401);
    }

    const existingInvite = await getInviteById(code);
    if (!existingInvite) {
      return c.json({ error: "Invite not found" }, 404);
    }

    const existingUser = await getUserByEmail(existingInvite.email);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // TODO: create user
    // const newUser = createUser({
    //   email: existingInvite.email,

    // })
  })
  .post("/invite/request", zValidator("json", inviteInputSchema), async (c) => {
    const input = c.req.valid("json");

    const existingUser = await getUserByEmail(input.email);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const existingInvite = await getInviteByEmail(input.email);
    if (existingInvite) {
      return c.json({ error: "Invite already exists" }, 400);
    }

    await createInvite(input);
    return c.redirect("http://localhost:5173/invite-pending");
  });
