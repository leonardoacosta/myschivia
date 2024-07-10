import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import { CreateEventSchema, Event } from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.Event.findMany({
      orderBy: desc(Event.id),
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));

      return ctx.db.query.Event.findFirst({
        where: eq(Event.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateEventSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Event)
        .values({ ...input, createdById: ctx.session.user.id });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Event).where(eq(Event.id, input));
  }),
} satisfies TRPCRouterRecord;
