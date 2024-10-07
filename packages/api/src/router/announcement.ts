import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, lte } from "@tribal-cities/db";
import {
  Announcement,
  CreateAnnouncementSchema,
} from "@tribal-cities/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const announcementRouter = {
  create: protectedProcedure
    .input(CreateAnnouncementSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.insert(Announcement).values(input).returning(),
    ),
  all: publicProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db.query.Announcement.findMany({
      where: and(
        eq(Announcement.burnYearId, input),
        lte(Announcement.releaseDate, new Date()),
      ),
    }),
  ),
} satisfies TRPCRouterRecord;
