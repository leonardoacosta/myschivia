"use client";

import type { Feature, FeatureCollection } from "geojson";
import * as React from "react";
import dynamic from "next/dynamic";

import { api } from "~/trpc/react";
import ZoneTable from "./zone-table";

const Map = dynamic(() => import("./planning"), { ssr: false });

export default function Page() {
  const { data: zones } = api.cityPlanning.getZones.useQuery();
  const [geojson, setGeojson] = React.useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  // * Convert zones to geojson
  React.useEffect(() => {
    if (!zones) return;
    const features: Feature[] = zones.map((zone) => {
      const feature: Feature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      };
      if (zone.type === "Point") {
        feature.geometry.type = "Point";
        (feature.geometry as any).coordinates = zone.coordinates
          .map((c) => [parseFloat(c.lng), parseFloat(c.lat)])
          .at(0);
      }

      if (zone.type === "Polygon") {
        feature.geometry.type = "Polygon";
        (feature.geometry as any).coordinates[0] = zone.coordinates.map((c) => [
          parseFloat(c.lng),
          parseFloat(c.lat),
        ]);
      }

      if (zone.type === "LineString") {
        feature.geometry.type = "LineString";
        (feature.geometry as any).coordinates = zone.coordinates.map((c) => [
          parseFloat(c.lng),
          parseFloat(c.lat),
        ]);
      }

      if (zone.radius) (feature.properties as any).radius = zone.radius;
      if (zone.camp)
        feature.properties = {
          popupHTML: `<h3>${zone.camp.name}</h3>`,
        };
      feature.id = zone.id;

      return feature;
    });
    setGeojson({ type: "FeatureCollection", features });
  }, [zones]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <div
        className="h-[100%]"
        style={{ width: "33%", textAlign: "center", overflow: "auto" }}
      >
        <ZoneTable zones={zones} />
      </div>
      <div className="h-[100%]" style={{ width: "67%" }}>
        <Map geojson={geojson} />
      </div>
    </div>
  );
}
