import { db } from "../db";
import { usersTable, type InsertUser } from "../db/schema/auth";
import { eq } from "drizzle-orm";

export async function getUserByGithubId(githubId: string) {
  return db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.githubId, githubId))
    .then((res) => res[0]);
}

export async function getUserByEmail(email: string) {
  return db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .then((res) => res[0]);
}

export async function createUser(user: InsertUser) {
  return db
    .insert(usersTable)
    .values(user)
    .returning()
    .then((res) => res[0]);
}
