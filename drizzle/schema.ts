import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Loan Applications Table
export const loanApplications = mysqlTable("loan_applications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessType: varchar("businessType", { length: 100 }).notNull(),
  businessDescription: text("businessDescription"),
  loanAmount: decimal("loanAmount", { precision: 12, scale: 2 }).notNull(),
  loanPurpose: varchar("loanPurpose", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "processing"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = typeof loanApplications.$inferInsert;

// Blog Articles Table
export const blogArticles = mysqlTable("blog_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

// Referral Program Table
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referralEmail: varchar("referralEmail", { length: 320 }).notNull(),
  referralName: varchar("referralName", { length: 255 }).notNull(),
  referralCode: varchar("referralCode", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "completed", "expired"]).default("pending").notNull(),
  rewardAmount: decimal("rewardAmount", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Documents Table
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  documentType: varchar("documentType", { length: 100 }).notNull(),
  documentUrl: varchar("documentUrl", { length: 500 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize").notNull(),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected"]).default("pending").notNull(),
  verificationNotes: text("verificationNotes"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  verifiedAt: timestamp("verifiedAt"),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Customer Dashboard Data Table
export const customerData = mysqlTable("customer_data", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  customerId: varchar("customerId", { length: 50 }).notNull().unique(),
  loanBalance: decimal("loanBalance", { precision: 12, scale: 2 }).default("0"),
  totalRepaid: decimal("totalRepaid", { precision: 12, scale: 2 }).default("0"),
  nextPaymentDate: timestamp("nextPaymentDate"),
  nextPaymentAmount: decimal("nextPaymentAmount", { precision: 12, scale: 2 }),
  interestRate: decimal("interestRate", { precision: 5, scale: 2 }).default("0"),
  loanTerm: int("loanTerm"),
  paymentsCompleted: int("paymentsCompleted").default(0),
  totalPayments: int("totalPayments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerData = typeof customerData.$inferSelect;
export type InsertCustomerData = typeof customerData.$inferInsert;