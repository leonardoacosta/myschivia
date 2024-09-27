import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import {
  Burn,
  BurnYear,
  CreateBurnSchema,
  UpdateBurnSchema,
  UsersToBurnYear,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const burnRouter = {
  all: publicProcedure.query(({ ctx }) => ctx.db.query.Burn.findMany({})),

  allYears: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Burn.findMany({
      with: {
        years: {
          // where: gte(BurnYear.endDate, new Date()),
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

  join: protectedProcedure.input(z.string()).mutation(({ ctx, input }) =>
    ctx.db.query.UsersToBurnYear.findFirst({
      where: eq(UsersToBurnYear.burnYearId, input),
    }).then((res) => {
      console.log({ res });
      console.log(ctx.session.user.id);
      console.log({ input });
      if (!res)
        ctx.db
          .insert(UsersToBurnYear)
          .values({
            userId: ctx.session.user.id,
            burnYearId: input,
          })
          .then((res2) => {
            console.log({ res2 });
          });
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
} satisfies TRPCRouterRecord;
