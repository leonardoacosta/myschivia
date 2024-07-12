import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import {
  Burn,
  CreateBurnSchema,
  UpdateBurnSchema,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const burnRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Burn.findMany({
      orderBy: desc(Burn.startDate),
    }),
  ),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Burn.findFirst({
        where: eq(Burn.id, input.id),
      }),
    ),

  create: protectedProcedure
    .input(CreateBurnSchema)
    .mutation(({ ctx, input }) => ctx.db.insert(Burn).values({ ...input })),

  update: protectedProcedure
    .input(UpdateBurnSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(Burn)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(Burn.id, input.id!)),
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(Burn).where(eq(Burn.id, input)),
    ),
} satisfies TRPCRouterRecord;
