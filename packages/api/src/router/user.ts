import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const userRouter = {
  getBurners: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.db.query.User.findMany();
    return test.length;
  }),
} satisfies TRPCRouterRecord;
