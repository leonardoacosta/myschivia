import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import { Camp, CreateCampSchema } from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const campRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Camp.findMany({
      orderBy: desc(Camp.id),
    }),
  ),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Camp.findFirst({
        where: eq(Camp.id, input.id),
      }),
    ),

  create: protectedProcedure
    .input(CreateCampSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(Camp)
        .values({ ...input, createdById: ctx.session.user.id }),
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(Camp).where(eq(Camp.id, input)),
    ),
} satisfies TRPCRouterRecord;
