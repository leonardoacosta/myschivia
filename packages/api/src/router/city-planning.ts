import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import { Coordinate, Zone } from "@tribal-cities/db/schema";

import { publicProcedure } from "../trpc";

export const cityPlanningRouter = {
  getGoogleMaps: publicProcedure.query(async ({ ctx }) => {
    const api = process.env.GOOGLE_MAPS_API_KEY;
    const res = await fetch(
      `https://tile.googleapis.com/v1/createSession?key=${api}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapType: "satellite",
          language: "en-US",
          region: "US",
        }),
      },
    );
    const json = await res.json();
    return `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${json.session}&key=${api}`;
  }),
  getZones: publicProcedure.query(async ({ ctx }) =>
    ctx.db.query.Zone.findMany({
      with: { camp: true, coordinates: true },
    }),
  ),
  // saveZones: publicProcedure.query(async ({ ctx }) =>
  //   ctx.db.query.Zone.findMany({
  //     with: { camp: true, coordinates: true },
  //   }),
  // ),
  createPoint: publicProcedure.query(async ({ ctx }) => {
    // * create zone
    const zone = await ctx.db.insert(Zone).values({}).returning();

    // * add point to zone
    const point = await ctx.db.insert(Coordinate).values({
      zoneId: zone.at(0)?.id!,
      lat: "32.973456",
      lng: "-94.597195",
    });
    return point;
  }),
  // all: publicProcedure.query(({ ctx }) =>
  //   ctx.db.query.Camp.findMany({
  //     orderBy: desc(Camp.id),
  //     with: { createdBy: true },
  //   }),
  // ),

  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) =>
  //     ctx.db.query.Camp.findFirst({
  //       where: eq(Camp.id, input.id),
  //     }),
  //   ),

  // create: protectedProcedure
  //   .input(CreateCampSchema)
  //   .mutation(({ ctx, input }) =>
  //     ctx.db
  //       .insert(Camp)
  //       .values({ ...input, createdById: ctx.session.user.id }),
  //   ),

  // update: protectedProcedure
  //   .input(UpdateCampSchema)
  //   .mutation(({ ctx, input }) =>
  //     ctx.db
  //       .update(Camp)
  //       .set({ ...input, updatedAt: new Date() })
  //       .where(eq(Camp.id, input.id!)),
  //   ),
  // delete: protectedProcedure
  //   .input(z.string())
  //   .mutation(({ ctx, input }) =>
  //     ctx.db.delete(Camp).where(eq(Camp.id, input)),
  //   ),
} satisfies TRPCRouterRecord;
