import { sql } from "drizzle-orm";
import {
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const modulesTable = pgTable("module", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  hours: numeric("hours", { precision: 4, scale: 2 }).notNull(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});
