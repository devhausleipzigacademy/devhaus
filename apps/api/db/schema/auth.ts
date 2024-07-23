import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "instructor",
  "staff",
  "admin",
]);

export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  githubId: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const inviteStatusEnum = pgEnum("invite_status", [
  "requested",
  "pending",
  "approved",
]);

export const invitesTable = pgTable("invite", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  status: inviteStatusEnum("status").notNull().default("requested"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export type SelectInvite = typeof invitesTable.$inferSelect;
export type InsertInvite = typeof invitesTable.$inferInsert;
