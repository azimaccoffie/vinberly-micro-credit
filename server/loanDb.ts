import { eq } from "drizzle-orm";
import { loanApplications, InsertLoanApplication } from "../drizzle/schema";
import { getDb } from "./db";

export async function createLoanApplication(data: InsertLoanApplication) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(loanApplications).values(data);
  return result;
}

export async function getLoanApplications() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(loanApplications);
  return result;
}

export async function getLoanApplicationById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(loanApplications).where(eq(loanApplications.id, id)).limit(1);
  return result[0];
}

export async function updateLoanApplicationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .update(loanApplications)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(loanApplications.id, id));
  return result;
}
