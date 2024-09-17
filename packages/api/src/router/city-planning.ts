import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@tribal-cities/db";
import { Coordinate, Zone } from "@tribal-cities/db/schema";

import { publicProcedure } from "../trpc";

const coordinatesSchema = z.array(z.number()).min(2).max(3);
const featureSchema = z.object({
  type: z.literal("Feature"),
  id: z.union([z.string(), z.number()]).optional(),
  properties: z
    .object({
      radius: z.number().optional(),
      popupHTML: z.string().optional(),
    })
    .nullable(),
  geometry: z.object({
    type: z.union([
      z.literal("Polygon"),
      z.literal("Point"),
      z.literal("LineString"),
      z.literal("MultiPoint"),
      z.literal("MultiLineString"),
      z.literal("MultiPolygon"),
      z.literal("GeometryCollection"),
    ]),
    coordinates: z
      .union([
        coordinatesSchema,
        z.array(coordinatesSchema),
        z.array(z.array(coordinatesSchema)),
        z.array(z.array(z.array(coordinatesSchema))),
      ])
      .optional(),
  }),
});
const featureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(featureSchema),
});

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
      with: {
        camp: true,
        coordinates: {
          orderBy: desc(Coordinate.index),
        },
      },
    }),
  ),
  addZone: publicProcedure
    .input(featureSchema)
    .mutation(async ({ ctx, input }) => {
      // * create zone
      const zone = await ctx.db
        .insert(Zone)
        .values({
          type: input.geometry.type,
          radius: input.properties?.radius
            ? input.properties.radius.toString()
            : null,
        })
        .returning();

      // * add point to zone
      if (input.geometry.type === "Point" && input.geometry.coordinates) {
        await ctx.db.insert(Coordinate).values({
          zoneId: zone.at(0)?.id!,
          lat: input.geometry.coordinates[1]!.toString(),
          lng: input.geometry.coordinates[0]!.toString(),
        });
      }
      if (input.geometry.type === "Polygon" && input.geometry.coordinates) {
        const baseCoordinates = input.geometry.coordinates[0] as number[][];
        for (const coordinates of baseCoordinates) {
          const lat = coordinates[1];
          const lng = coordinates[0];
          await ctx.db.insert(Coordinate).values({
            zoneId: zone.at(0)?.id!,
            lat: lat!.toString(),
            lng: lng!.toString(),
          });
        }
      }
      if (input.geometry.type === "LineString" && input.geometry.coordinates) {
        const baseCoordinates = input.geometry.coordinates as number[][];
        for (let index = 0; index < baseCoordinates.length; index++) {
          const coordinates = baseCoordinates[index]!;
          const lat = coordinates[1];
          const lng = coordinates[0];
          await ctx.db.insert(Coordinate).values({
            zoneId: zone.at(0)?.id!,
            lat: lat!.toString(),
            lng: lng!.toString(),
            index,
          });
        }
      }
    }),
  saveZones: publicProcedure
    .input(featureCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const promises: Promise<any>[] = [];
      for (const feature of input.features) {
        promises.push(update(ctx, feature));
      }

      await Promise.all(promises).then((values) => {
        console.log(values);
      });
    }),
  deleteZone: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // * get zone
      const zone = await ctx.db.query.Zone.findFirst({
        where: eq(Zone.id, input),
        with: { camp: true },
      });
      if (zone?.camp)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cannot delete a zone that is associated with a camp",
        });
      await ctx.db.delete(Coordinate).where(eq(Coordinate.zoneId, input));
      await ctx.db.delete(Zone).where(eq(Zone.id, input));
    }),

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
} satisfies TRPCRouterRecord;

const update = async (ctx: any, feature: any) => {
  let zoneId = feature.id;

  if (!zoneId) {
    // * create zone if needed
    const zone = await ctx.db
      .insert(Zone)
      .values({
        radius: feature.properties?.radius
          ? feature.properties.radius.toString()
          : null,
        type: feature.geometry.type,
      })
      .returning();
    zoneId = zone.at(0)?.id;
  }

  // * Delete all coordinates for the zone
  await ctx.db
    .delete(Coordinate)
    .where(eq(Coordinate.zoneId, zoneId as string));

  if (feature.geometry.coordinates) {
    const baseCoordinates = feature.geometry.coordinates as number[][];
    for (let index = 0; index < baseCoordinates.length; index++) {
      const lat = baseCoordinates[index]![0]
        ? baseCoordinates[index]![1]
        : baseCoordinates[1];
      const lng = baseCoordinates[index]![0]
        ? baseCoordinates[index]![0]
        : baseCoordinates[0];

      // const lat = coordinates[1];
      // const lng = coordinates[0];

      await ctx.db.insert(Coordinate).values({
        zoneId: zoneId as string,
        lat: lat!.toString(),
        lng: lng!.toString(),
        index,
      });
    }
  }
};
