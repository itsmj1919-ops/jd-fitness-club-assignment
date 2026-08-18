import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const db = vi.hoisted(() => ({
  listJournalNotes: vi.fn(async (userId: number) => [{ id: 1, userId, articleSlug: "rest-is-work", articleTitle: "Rest", body: "A private note", createdAt: new Date(), updatedAt: new Date() }]),
  createTrainingSession: vi.fn(async (userId: number, input: unknown) => ({ id: 2, userId, ...input, status: "planned", createdAt: new Date(), updatedAt: new Date() })),
  getMemberPreferences: vi.fn(async () => null),
  getMemberSummary: vi.fn(async () => ({ notes: [], sessions: [], preferences: null, noteCount: 0, sessionCount: 0, completedSessionCount: 0 })),
  listTrainingSessions: vi.fn(async () => []),
  removeJournalNote: vi.fn(async () => 0),
  removeTrainingSession: vi.fn(async () => 0),
  updateMemberPreferences: vi.fn(async () => null),
  updateTrainingSessionStatus: vi.fn(async () => null),
  upsertJournalNote: vi.fn(async () => ({ id: 1 })),
}));

vi.mock("./db", () => db);
import { appRouter } from "./routers";

function context(userId: number | null): TrpcContext {
  return {
    user: userId === null ? null : { id: userId, openId: `member-${userId}`, name: "Atlas Member", email: "member@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("member procedures", () => {
  it("rejects unauthenticated note access before any data helper is called", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.member.notes.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(db.listJournalNotes).not.toHaveBeenCalled();
  });

  it("uses the authenticated member identifier rather than accepting one from the client", async () => {
    const caller = appRouter.createCaller(context(42));
    await caller.member.notes.list();
    expect(db.listJournalNotes).toHaveBeenCalledWith(42);
  });

  it("does not allow a second member to target another member while removing a note", async () => {
    db.removeJournalNote.mockResolvedValueOnce(0);
    const secondMember = appRouter.createCaller(context(99));
    const result = await secondMember.member.notes.remove({ id: 1 });
    expect(db.removeJournalNote).toHaveBeenLastCalledWith(99, 1);
    expect(result).toEqual({ removed: false });
  });

  it("scopes saved-session status changes to the authenticated member", async () => {
    db.updateTrainingSessionStatus.mockResolvedValueOnce(null);
    const secondMember = appRouter.createCaller(context(99));
    const result = await secondMember.member.sessions.setStatus({ id: 2, status: "complete" });
    expect(db.updateTrainingSessionStatus).toHaveBeenLastCalledWith(99, 2, "complete");
    expect(result).toBeNull();
  });

  it("validates a session plan before it reaches the data layer", async () => {
    const caller = appRouter.createCaller(context(7));
    await expect(caller.member.sessions.create({ name: "", focus: "Strength", scheduleJson: [] })).rejects.toBeDefined();
    expect(db.createTrainingSession).not.toHaveBeenCalled();
  });
});
