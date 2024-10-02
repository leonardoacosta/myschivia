import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, asc, eq, gte, lte } from "@tribal-cities/db";
import {
  CreateEventSchema,
  Event,
  Favorite,
  UpdateEventSchema,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = {
  all: publicProcedure
    .input(
      z.object({
        day: z.date().nullable(),
        campId: z.string().nullable(),
        type: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // grab just the date
      const day = input.day ? new Date(input.day) : new Date();

      const whereFilter = and(
        input.day
          ? and(lte(Event.startDate, day), gte(Event.endDate, day))
          : undefined,
        input.campId ? eq(Event.campId, input.campId) : undefined,
        input.type ? eq(Event.type, input.type as any) : undefined,
      );

      const events = await ctx.db.query.Event.findMany({
        where: whereFilter,
        orderBy: [asc(Event.startDate), asc(Event.startTime)], // asc(Event.startTime),
        with: {
          user: true,
          camp: true,
        },
      });
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

  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.db.query.Favorite.findMany({
      where: eq(Favorite.userId, userId),
    });
  }),

  toggleFavorite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.db.query.Favorite.findFirst({
        where: and(eq(Favorite.userId, userId), eq(Favorite.eventId, input)),
      }).then((favorite) => {
        if (favorite) {
          return ctx.db.delete(Favorite).where(eq(Favorite.id, favorite.id));
        } else {
          return ctx.db.insert(Favorite).values({ userId, eventId: input });
        }
      });
    }),
} satisfies TRPCRouterRecord;
