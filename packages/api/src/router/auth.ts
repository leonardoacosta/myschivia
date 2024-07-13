import type { TRPCRouterRecord } from "@trpc/server";

import { invalidateSessionToken } from "@tribal-cities/auth";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
  getBurners: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.db.query.User.findMany();
    return test.length;
  }),
} satisfies TRPCRouterRecord;
