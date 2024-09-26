import type { TRPCRouterRecord } from "@trpc/server";
import { format } from "date-fns";
import { date, z } from "zod";

import { and, asc, between, eq, gt, gte, lte, or } from "@tribal-cities/db";
import {
  CreateEventSchema,
  Event,
  UpdateEventSchema,
  User,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = {
  all: publicProcedure
    .input(
      z.object({
        day: z.date().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("input", input.day);

      // grab just the date
      const day = input.day ? new Date(input.day) : new Date();
      console.log("day", day);

      const events = await ctx.db.query.Event.findMany({
        where: input.day
          ? and(lte(Event.startDate, day), gte(Event.endDate, day))
          : undefined,
        orderBy: [asc(Event.startDate), asc(Event.startTime)], // asc(Event.startTime),
        with: {
          user: true,
          // camp: true,
        },
      });
      const sql = ctx.db.query.Event.findMany({
        where: input.day
          ? and(gte(Event.startDate, day), lte(Event.endDate, day))
          : undefined,
        orderBy: [asc(Event.startTime), asc(Event.startTime)], // asc(Event.startTime),
        with: {
          user: true,
          // camp: true,
        },
      }).toSQL();
      console.log("sql", sql);
      // group by date
      const eventsByDayObject = events.reduce(
        (acc, event) => {
          const key = event.startDate.toISOString().split("T")[0]!;
          acc[key] = acc[key] || [];
          acc[key].push(event);
          return acc;
        },
        {} as Record<string, typeof events>,
      );
      let eventsByDay = Object.entries(eventsByDayObject).map(
        ([day, events]) => [day, events],
      );

      // sort by date
      eventsByDay = eventsByDay.sort(([a], [b]) => (a! < b! ? -1 : 1));
      return eventsByDay;
    }),
  count: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.Event.findMany().then((events) => events.length);
  }),
  allDates: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.Event.findMany();
    const dates = events
      .sort((a, b) => a.startDate.getDate() - b.startDate.getDate())
      .map((event) => event.startDate.toString());
    return Array.from(new Set(dates));
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Event.findFirst({
        where: eq(Event.id, input.id),
        with: {
          user: true,
          // camp: true,
        },
      }),
    ),

  create: protectedProcedure
    .input(CreateEventSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(Event)
        .values({ ...input, createdById: ctx.session.user.id }),
    ),

  update: protectedProcedure
    .input(UpdateEventSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(Event)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(Event.id, input.id!)),
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(Event).where(eq(Event.id, input)),
    ),
} satisfies TRPCRouterRecord;
