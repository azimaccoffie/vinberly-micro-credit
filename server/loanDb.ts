import { eq, and, desc } from "drizzle-orm";
import { loanApplications, customerData, InsertLoanApplication, InsertCustomerData } from "../drizzle/schema";
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

// Get customer-specific loan data
export async function getCustomerLoanData(openId: string) {
  const db = await getDb();
  if (!db) {
    // Fallback to in-memory data for demo purposes
    return {
      customerId: openId,
      loanBalance: "7500",
      totalRepaid: "2500",
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      nextPaymentAmount: "875",
      interestRate: "2.5",
      loanTerm: 12,
      paymentsCompleted: 3,
      totalPayments: 12,
    };
  }

  // First, get the user's loan application to find the application ID
  const userApplications = await db
    .select()
    .from(loanApplications)
    .where(eq(loanApplications.email, openId))
    .orderBy(desc(loanApplications.createdAt))
    .limit(1);

  if (userApplications.length === 0) {
    // No loan application found, return default values
    return {
      customerId: openId,
      loanBalance: "0",
      totalRepaid: "0",
      nextPaymentDate: null,
      nextPaymentAmount: "0",
      interestRate: "0",
      loanTerm: 0,
      paymentsCompleted: 0,
      totalPayments: 0,
    };
  }

  const applicationId = userApplications[0].id;

  // Now get the customer data based on the application ID
  const customerRecords = await db
    .select()
    .from(customerData)
    .where(eq(customerData.applicationId, applicationId))
    .limit(1);

  if (customerRecords.length === 0) {
    // No customer data found, return default values
    return {
      customerId: openId,
      loanBalance: "0",
      totalRepaid: "0",
      nextPaymentDate: null,
      nextPaymentAmount: "0",
      interestRate: "0",
      loanTerm: 0,
      paymentsCompleted: 0,
      totalPayments: 0,
    };
  }

  return customerRecords[0];
}

// Create or update customer loan data
export async function upsertCustomerLoanData(applicationId: number, data: Partial<InsertCustomerData>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if customer data already exists
  const existingData = await db
    .select()
    .from(customerData)
    .where(eq(customerData.applicationId, applicationId))
    .limit(1);

  if (existingData.length > 0) {
    // Update existing record
    const result = await db
      .update(customerData)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customerData.applicationId, applicationId));
    return result;
  } else {
    // Create new record
    const result = await db.insert(customerData).values({
      applicationId,
      customerId: `CUST-${applicationId}`,
      ...data,
    });
    return result;
  }
}
