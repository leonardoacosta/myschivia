import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { asc, eq } from "@tribal-cities/db";
import {
  Camp,
  CreateCampSchema,
  UpdateCampSchema,
} from "@tribal-cities/db/schema";

import { BlobType, PresignedUrl } from "../service/blob";
import { protectedProcedure, publicProcedure } from "../trpc";

export const campRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Camp.findMany({
      orderBy: asc(Camp.name),
      with: { createdBy: true },
    }),
  ),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Camp.findFirst({
        where: eq(Camp.id, input.id),
        with: { createdBy: true },
      }),
    ),

  create: protectedProcedure
    .input(CreateCampSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(Camp)
        .values({ ...input, createdById: ctx.session.user.id }),
    ),

  update: protectedProcedure
    .input(UpdateCampSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(Camp)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(Camp.id, input.id!)),
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(Camp).where(eq(Camp.id, input)),
    ),
  presign: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        year: z.string(),
        burnName: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      PresignedUrl(input.year, input.burnName, input.filename, BlobType.camp),
    ),
} satisfies TRPCRouterRecord;
