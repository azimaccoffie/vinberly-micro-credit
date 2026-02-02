import { eq, and, desc } from "drizzle-orm";
import { loanApplications, customerData, InsertLoanApplication, InsertCustomerData } from "../drizzle/schema";
import { getDb } from "./db";

// In-memory fallback store for loan applications when database is not available
const inMemoryLoanApplications = new Map<number, any>();
let loanApplicationCounter = 1;

export async function createLoanApplication(data: InsertLoanApplication) {
  const db = await getDb();
  if (!db) {
    console.warn("[Loan Application] Using in-memory store (database not available)");
    
    // Create a new loan application in memory
    const newApplication = {
      id: loanApplicationCounter++, // Increment counter for unique ID
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    inMemoryLoanApplications.set(newApplication.id, newApplication);
    console.log(`[Loan Application] In-memory application stored: ${newApplication.id}`);
    
    // Return a result-like object that mimics the database insert result
    return { insertId: newApplication.id };
  }

  const result = await db.insert(loanApplications).values(data);
  return result;
}

export async function getLoanApplications() {
  const db = await getDb();
  if (!db) {
    console.warn("[Loan Application] Using in-memory store for listing");
    return Array.from(inMemoryLoanApplications.values());
  }

  const result = await db.select().from(loanApplications);
  return result;
}

export async function getLoanApplicationById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Loan Application] Using in-memory store for lookup");
    return inMemoryLoanApplications.get(id) || null;
  }

  const result = await db.select().from(loanApplications).where(eq(loanApplications.id, id)).limit(1);
  return result[0];
}

export async function updateLoanApplicationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Loan Application] Using in-memory store for status update");
    const existingApplication = inMemoryLoanApplications.get(id);
    if (existingApplication) {
      const updatedApplication = {
        ...existingApplication,
        status: status,
        updatedAt: new Date(),
      };
      inMemoryLoanApplications.set(id, updatedApplication);
      return { rowsAffected: 1 };
    }
    return { rowsAffected: 0 };
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
    console.warn("[Customer Data] Using in-memory store for customer data lookup");
    
    // Try to find the user's loan application in memory
    const userApplications = Array.from(inMemoryLoanApplications.values())
      .filter(app => app.email === openId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by descending date
    
    if (userApplications.length > 0) {
      const application = userApplications[0];
      const applicationId = application.id;
      
      // Try to find customer data for this application
      const customerData = inMemoryCustomerData.get(applicationId);
      
      if (customerData) {
        return customerData;
      }
      
      // If no specific customer data, return based on application
      return {
        customerId: openId,
        loanBalance: application.loanAmount,
        totalRepaid: "0",
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        nextPaymentAmount: (parseInt(application.loanAmount) / 12).toString(),
        interestRate: "2.5",
        loanTerm: 12,
        paymentsCompleted: 0,
        totalPayments: 12,
      };
    }
    
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
const inMemoryCustomerData = new Map<number, any>(); // Map applicationId to customer data

export async function upsertCustomerLoanData(applicationId: number, data: Partial<InsertCustomerData>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Customer Data] Using in-memory store for customer data");
    
    // Check if customer data already exists
    const existingData = inMemoryCustomerData.get(applicationId);
    
    if (existingData) {
      // Update existing record
      const updatedData = {
        ...existingData,
        ...data,
        updatedAt: new Date(),
      };
      inMemoryCustomerData.set(applicationId, updatedData);
      return { rowsAffected: 1 };
    } else {
      // Create new record
      const newData = {
        id: Date.now(), // Simple ID generation
        applicationId,
        customerId: `CUST-${applicationId}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryCustomerData.set(applicationId, newData);
      return { rowsAffected: 1 };
    }
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
