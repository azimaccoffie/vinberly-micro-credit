import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, User } from "../drizzle/schema";
import { ENV } from './_core/env';

// In-memory fallback store for demo/development when database is not available
const inMemoryUsers = new Map<string, User>();

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Using in-memory user store (database not available)");
    
    // Use in-memory store when database is unavailable
    const existingUser = inMemoryUsers.get(user.openId);
    const now = new Date();
    
    const newUser: User = {
      id: existingUser?.id || Date.now(),
      openId: user.openId,
      name: user.name ?? existingUser?.name ?? null,
      email: user.email ?? existingUser?.email ?? null,
      loginMethod: user.loginMethod ?? existingUser?.loginMethod ?? null,
      role: user.role ?? existingUser?.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"),
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn ?? now,
    };
    
    inMemoryUsers.set(user.openId, newUser);
    console.log(`[Database] In-memory user stored: ${user.openId}`);
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Using in-memory user store (database not available)");
    const user = inMemoryUsers.get(openId);
    console.log(`[Database] In-memory user lookup: ${openId} -> ${user ? 'found' : 'not found'}`);
    return user;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Get all users for admin management
export async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Using in-memory user store for user listing");
    return Array.from(inMemoryUsers.values());
  }

  return await db.select().from(users);
}

// Update user role for admin management
export async function updateUserRole(openId: string, role: "user" | "admin") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Updating user role in in-memory store");
    const user = inMemoryUsers.get(openId);
    if (user) {
      const updatedUser = { ...user, role };
      inMemoryUsers.set(openId, updatedUser);
      return updatedUser;
    }
    return null;
  }

  const result = await db.update(users).set({ role }).where(eq(users.openId, openId)).returning();
  return result.length > 0 ? result[0] : null;
}

// Delete user for admin management
export async function deleteUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Deleting user from in-memory store");
    const user = inMemoryUsers.get(openId);
    if (user) {
      inMemoryUsers.delete(openId);
      return true;
    }
    return false;
  }

  const result = await db.delete(users).where(eq(users.openId, openId));
  return result.rowsAffected > 0;
}

// TODO: add feature queries here as your schema grows.
