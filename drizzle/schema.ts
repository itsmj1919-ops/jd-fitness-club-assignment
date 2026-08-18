import { index, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export type SessionDay = { day: string; focus: string; room: string; detail: string };

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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

export const journalNotes = mysqlTable("journal_notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleSlug: varchar("articleSlug", { length: 160 }).notNull(),
  articleTitle: varchar("articleTitle", { length: 420 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  memberIndex: index("journal_notes_member_idx").on(table.userId),
  memberArticleUnique: uniqueIndex("journal_notes_member_article_unique").on(table.userId, table.articleSlug),
}));

export const trainingSessions = mysqlTable("training_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  focus: varchar("focus", { length: 80 }).notNull(),
  scheduleJson: json("scheduleJson").$type<SessionDay[]>().notNull(),
  status: mysqlEnum("status", ["planned", "complete"]).default("planned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ memberIndex: index("training_sessions_member_idx").on(table.userId) }));

export const memberPreferences = mysqlTable("member_preferences", {
  userId: int("userId").primaryKey(),
  preferredFocus: varchar("preferredFocus", { length: 80 }),
  reducedMotionOverride: mysqlEnum("reducedMotionOverride", ["system", "reduce", "full"]).default("system").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalNote = typeof journalNotes.$inferSelect;
export type TrainingSession = typeof trainingSessions.$inferSelect;
