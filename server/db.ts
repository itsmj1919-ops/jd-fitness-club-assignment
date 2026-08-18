import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, journalNotes, memberPreferences, type SessionDay, trainingSessions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

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
    console.warn("[Database] Cannot upsert user: database not available");
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
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Member data is temporarily unavailable.");
  return db;
}

export async function listJournalNotes(userId: number) {
  const db = await requireDb();
  return db.select().from(journalNotes).where(eq(journalNotes.userId, userId)).orderBy(desc(journalNotes.updatedAt));
}

export async function upsertJournalNote(userId: number, input: { articleSlug: string; articleTitle: string; body: string }) {
  const db = await requireDb();
  await db.insert(journalNotes).values({ userId, ...input }).onDuplicateKeyUpdate({
    set: { articleTitle: input.articleTitle, body: input.body, updatedAt: new Date() },
  });
  const result = await db.select().from(journalNotes).where(and(eq(journalNotes.userId, userId), eq(journalNotes.articleSlug, input.articleSlug))).limit(1);
  return result[0]!;
}

export async function removeJournalNote(userId: number, id: number) {
  const db = await requireDb();
  const result = await db.delete(journalNotes).where(and(eq(journalNotes.id, id), eq(journalNotes.userId, userId)));
  return result[0]?.affectedRows ?? 0;
}

export async function listTrainingSessions(userId: number) {
  const db = await requireDb();
  return db.select().from(trainingSessions).where(eq(trainingSessions.userId, userId)).orderBy(desc(trainingSessions.updatedAt));
}

export async function createTrainingSession(userId: number, input: { name: string; focus: string; scheduleJson: SessionDay[] }) {
  const db = await requireDb();
  const insert = await db.insert(trainingSessions).values({ userId, ...input, status: "planned" });
  const result = await db.select().from(trainingSessions).where(and(eq(trainingSessions.userId, userId), eq(trainingSessions.id, Number(insert[0].insertId)))).limit(1);
  return result[0]!;
}

export async function updateTrainingSessionStatus(userId: number, id: number, status: "planned" | "complete") {
  const db = await requireDb();
  await db.update(trainingSessions).set({ status, updatedAt: new Date() }).where(and(eq(trainingSessions.id, id), eq(trainingSessions.userId, userId)));
  const result = await db.select().from(trainingSessions).where(and(eq(trainingSessions.id, id), eq(trainingSessions.userId, userId))).limit(1);
  return result[0] ?? null;
}

export async function removeTrainingSession(userId: number, id: number) {
  const db = await requireDb();
  const result = await db.delete(trainingSessions).where(and(eq(trainingSessions.id, id), eq(trainingSessions.userId, userId)));
  return result[0]?.affectedRows ?? 0;
}

export async function getMemberPreferences(userId: number) {
  const db = await requireDb();
  const result = await db.select().from(memberPreferences).where(eq(memberPreferences.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function updateMemberPreferences(userId: number, input: { preferredFocus?: string | null; reducedMotionOverride?: "system" | "reduce" | "full" }) {
  const db = await requireDb();
  await db.insert(memberPreferences).values({ userId, preferredFocus: input.preferredFocus ?? null, reducedMotionOverride: input.reducedMotionOverride ?? "system" }).onDuplicateKeyUpdate({
    set: { ...input, updatedAt: new Date() },
  });
  return getMemberPreferences(userId);
}

export async function getMemberSummary(userId: number) {
  const [notes, sessions, preferences] = await Promise.all([listJournalNotes(userId), listTrainingSessions(userId), getMemberPreferences(userId)]);
  return { notes, sessions, preferences, noteCount: notes.length, sessionCount: sessions.length, completedSessionCount: sessions.filter((item) => item.status === "complete").length };
}
