import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, asc, eq } from "@tribal-cities/db";
import {
  Camp,
  Camp_Tag,
  CreateCampSchema,
  Tag,
  UpdateCampSchema,
  Zone,
} from "@tribal-cities/db/schema";

import { BlobType, PresignedUrl } from "../service/blob";
import { protectedProcedure, publicProcedure } from "../trpc";

export const campRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Camp.findMany({
      orderBy: asc(Camp.name),
      with: { createdBy: true, tags: true },
    }),
  ),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Camp.findFirst({
        where: eq(Camp.id, input.id),
        with: { createdBy: true, tags: true },
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
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(Zone).where(eq(Zone.campId, input));
      await ctx.db.delete(Camp).where(eq(Camp.id, input));
    }),
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
  toggleTag: protectedProcedure
    .input(z.object({ campId: z.string(), tag: z.enum([...Tag.enumValues]) }))
    .mutation(({ ctx, input }) => {
      ctx.db.query.Camp_Tag.findFirst({
        where: and(
          eq(Camp_Tag.campId, input.campId),
          eq(Camp_Tag.tag, input.tag),
        ),
      }).then(async (tag) => {
        if (tag) {
          await ctx.db.delete(Camp_Tag).where(eq(Camp_Tag.id, tag.id));
        } else {
          await ctx.db.insert(Camp_Tag).values({
            campId: input.campId,
            tag: input.tag,
          });
        }
      });
    }),
} satisfies TRPCRouterRecord;
