import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@tribal-cities/db";
import {
  Burn,
  BurnYear,
  CreateBurnWithYearSchema,
  UpdateBurnSchema,
  UpdateBurnYearSchema,
  UserBurnYearRoles,
  UsersToBurnYear,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const burnRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Burn.findMany({
      where: eq(Burn.approved, true),
    }),
  ),

  allYears: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Burn.findMany({
      where: eq(Burn.approved, true),
      with: {
        years: {
          orderBy: desc(BurnYear.startDate),
        },
      },
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
    .input(CreateBurnWithYearSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(Burn)
        .values({ ...input.burn })
        .returning()
        .then(async (burn) => {
          if (!burn[0]) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

          const year = await ctx.db
            .insert(BurnYear)
            .values({
              ...input.burnYear,
              burnId: burn[0].id,
            })
            .returning();

          if (!year[0]) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

          const burnYear = await ctx.db
            .insert(UsersToBurnYear)
            .values({
              userId: ctx.session.user.id,
              burnYearId: year[0].id,
              // role: "God",
            })
            .returning();

          if (!burnYear[0])
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

          await ctx.db
            .insert(UserBurnYearRoles)
            .values({
              userBurnYear: year[0].id,
              role: "God",
            })
            .returning();
        });
    }),

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

  join: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) =>
    ctx.db.query.UsersToBurnYear.findFirst({
      where: and(
        eq(UsersToBurnYear.burnYearId, input),
        eq(UsersToBurnYear.userId, ctx.session.user.id),
      ),
    }).then(async (res) => {
      if (!res)
        await ctx.db
          .insert(UsersToBurnYear)
          .values({
            userId: ctx.session.user.id,
            burnYearId: input,
          })
          .then((res2) => {
            console.log({ res2 });
          })
          .catch(console.error);
    }),
  ),

  joined: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.UsersToBurnYear.findMany({
      where: eq(UsersToBurnYear.userId, ctx.session.user.id),
      with: {
        burnYear: {
          with: {
            burn: true,
          },
        },
      },
    }),
  ),

  burnYearById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.BurnYear.findFirst({
        where: eq(BurnYear.id, input.id),
      }),
    ),

  updateBurnYear: publicProcedure
    .input(UpdateBurnYearSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(BurnYear)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(BurnYear.id, input.id!)),
    ),
} satisfies TRPCRouterRecord;
