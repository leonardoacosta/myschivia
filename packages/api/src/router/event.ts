import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import type { Camp } from "@tribal-cities/db/schema";
import { and, asc, desc, eq, gt, gte, lt, lte } from "@tribal-cities/db";
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
        mature: z.enum(["21+", "18+", "all"]).nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const day = input.day ? new Date(input.day) : new Date();

      const whereFilter = and(
        input.day
          ? and(lte(Event.startDate, day), gte(Event.endDate, day))
          : undefined,
        input.campId ? eq(Event.campId, input.campId) : undefined,
        input.type ? eq(Event.type, input.type as any) : undefined,
        input.mature
          ? input.mature === "all"
            ? and(eq(Event.mature, false), eq(Event.alcohol, false))
            : input.mature === "18+"
              ? and(eq(Event.mature, true), eq(Event.alcohol, false))
              : input.mature === "21+"
                ? and(eq(Event.mature, true), eq(Event.alcohol, true))
                : undefined
          : undefined,
        // lt(Event.createdAt, new Date("2024-10-03 06:00:00 ")), // * This was for exporting data for the banner
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

  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.Event.findMany().then((events) => events.length);
  }),

  allDates: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.Event.findMany();
    const dates = events
      .sort((a, b) => a.startDate.getDate() - b.startDate.getDate())
      .map((event) => event.startDate.toString());
    return Array.from(new Set(dates));
  }),

  byId: protectedProcedure
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
      ctx.db.insert(Event).values({
        ...input,
        createdById: input.hostName ? undefined : ctx.session.user.id,
      }),
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

  eventsForTv: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.Event.findMany({
      with: {
        camp: true,
        user: true,
      },
    });
    const programming = events.map((event) => {
      // Add time to the date
      const startDate = new Date(event.startDate);
      const [startHours, startMinutes] = event.startTime.split(":");
      startDate.setHours(parseInt(startHours ?? "0"));
      startDate.setMinutes(parseInt(startMinutes ?? "0"));

      const endDate = new Date(event.endDate);
      const [endHours, endMinutes] = event.endTime.split(":");
      endDate.setHours(parseInt(endHours ?? "0"));
      endDate.setMinutes(parseInt(endMinutes ?? "0"));

      return {
        title: event.name,
        description: event.description,
        uuid: event.id,
        logo: "https://www.themoviedb.org/t/p/w1066_and_h600_bestv2/6Ys6koNajP5ld9EIMfOSQrRquki.jpg", //event.image ?? "",
        channelUuid:
          event.campId || event.hostName.trim() || event.user?.alias?.trim(),
        since: startDate.toISOString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        till: endDate.toISOString(),
      };
    });

    const hosts = events
      .reduce((acc: any, event: any) => {
        if (event.campId) return acc;

        const hostName =
          event.hostName !== ""
            ? event.hostName
            : event.user?.alias ?? "Unknown";

        // return only distinct hosts
        if (
          acc.find(
            (h: any) => h.hostName === hostName || h.user?.alias === hostName,
          )
        ) {
          return acc;
        }

        return [...acc, event];
      }, [])
      .map((event: any) => event.hostName || event.user?.alias) as string[];

    const camps = events
      .reduce((acc: any, event: any) => {
        // return only distinct camps
        if (acc.find((c: any) => c.campId === event.campId)) {
          return acc;
        }
        return [...acc, event];
      }, [])
      .map((event: any) => event.camp) as (typeof Camp)[];

    const campChannels = camps
      .map((channel) => {
        return {
          uuid: channel ? channel.id : "self",
          title: channel ? channel.name : "self",
          type: "camp",
          logo: channel ? channel.image : "",
        };
      })
      .filter((channel) => channel.title !== "self")
      .sort((a, b) => (a.title < b.title ? -1 : 1));

    const hostChannels = hosts
      .map((channel) => {
        return {
          uuid: channel.trim(),
          title: channel.trim(),
          type: "self",
          logo: "",
        };
      })
      .sort((a, b) => (a.title < b.title ? -1 : 1));

    const channels = [...campChannels, ...hostChannels];

    const result = {
      channels,
      programming,
    };

    return result;
  }),
} satisfies TRPCRouterRecord;
