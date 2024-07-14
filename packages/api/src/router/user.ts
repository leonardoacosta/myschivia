import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@tribal-cities/db";
import { User } from "@tribal-cities/db/schema";

import { publicProcedure } from "../trpc";

export const userRouter = {
  getBurners: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.db.query.User.findMany();
    return test.length;
  }),
  byId: publicProcedure.query(({ ctx }) =>
    ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.session?.user.id!),
    }),
  ),

  update: publicProcedure
    .input(
      z.object({
        alias: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .update(User)
        .set({ alias: input.alias })
        .where(eq(User.id, ctx.session?.user.id!)),
    ),
} satisfies TRPCRouterRecord;
