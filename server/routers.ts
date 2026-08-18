import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { createTrainingSession, getMemberPreferences, getMemberSummary, listJournalNotes, listTrainingSessions, removeJournalNote, removeTrainingSession, updateMemberPreferences, updateTrainingSessionStatus, upsertJournalNote } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const sessionDaySchema = z.object({ day: z.string().min(1).max(60), focus: z.string().min(1).max(100), room: z.string().min(1).max(100), detail: z.string().min(1).max(500) });

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  member: router({
    getSummary: protectedProcedure.query(({ ctx }) => getMemberSummary(ctx.user.id)),
    notes: router({
      list: protectedProcedure.query(({ ctx }) => listJournalNotes(ctx.user.id)),
      save: protectedProcedure.input(z.object({ articleSlug: z.string().min(1).max(160), articleTitle: z.string().min(1).max(420), body: z.string().trim().min(1).max(10000) })).mutation(({ ctx, input }) => upsertJournalNote(ctx.user.id, input)),
      remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => ({ removed: (await removeJournalNote(ctx.user.id, input.id)) > 0 })),
    }),
    sessions: router({
      list: protectedProcedure.query(({ ctx }) => listTrainingSessions(ctx.user.id)),
      create: protectedProcedure.input(z.object({ name: z.string().trim().min(1).max(160), focus: z.string().trim().min(1).max(80), scheduleJson: z.array(sessionDaySchema).min(1).max(7) })).mutation(({ ctx, input }) => createTrainingSession(ctx.user.id, input)),
      setStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["planned", "complete"]) })).mutation(({ ctx, input }) => updateTrainingSessionStatus(ctx.user.id, input.id, input.status)),
      remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => ({ removed: (await removeTrainingSession(ctx.user.id, input.id)) > 0 })),
    }),
    preferences: router({
      get: protectedProcedure.query(({ ctx }) => getMemberPreferences(ctx.user.id)),
      update: protectedProcedure.input(z.object({ preferredFocus: z.string().trim().max(80).nullable().optional(), reducedMotionOverride: z.enum(["system", "reduce", "full"]).optional() })).mutation(({ ctx, input }) => updateMemberPreferences(ctx.user.id, input)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
