import { eq } from "drizzle-orm";
import { blogArticles, InsertBlogArticle } from "../drizzle/schema";
import { getDb } from "./db";

export async function createBlogArticle(data: InsertBlogArticle) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(blogArticles).values(data);
  return result;
}

export async function getBlogArticles() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(blogArticles).where(eq(blogArticles.published, 1));
  return result;
}

export async function getBlogArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(blogArticles).where(eq(blogArticles.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogArticlesByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.category, category));
  return result;
}
