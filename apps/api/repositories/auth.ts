import { eq } from "drizzle-orm";
import { db } from "../db";
import { invitesTable, type InsertInvite } from "../db/schema/auth";

export async function getInviteByEmail(email: string) {
  return db
    .select()
    .from(invitesTable)
    .where(eq(invitesTable.email, email))
    .then((res) => res[0]);
}

export async function getInviteById(id: string) {
  return db
    .select()
    .from(invitesTable)
    .where(eq(invitesTable.id, id))
    .then((res) => res[0]);
}

export async function createInvite(input: InsertInvite) {
  return db
    .insert(invitesTable)
    .values(input)
    .returning()
    .then((res) => res[0]);
}
