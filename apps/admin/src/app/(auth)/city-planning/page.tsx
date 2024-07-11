"use client";

import type { Feature, FeatureCollection } from "geojson";
import * as React from "react";
import dynamic from "next/dynamic";

import { api } from "~/trpc/react";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function Page() {
  const [zones] = api.cityPlanning.getZones.useSuspenseQuery();
  const [geojson, setGeojson] = React.useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  React.useEffect(() => {
    const features: Feature[] = zones.map((zone) => {
      const feature: Feature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      };
      if (zone.coordinates.length === 1) {
        feature.geometry.type = "Point";

        (feature.geometry as any).coordinates = zone.coordinates
          .map((c) => [parseFloat(c.lng), parseFloat(c.lat)])
          .at(0);
      }

      if (zone.radius) (feature.properties as any).radius = zone.radius;

      if (zone.camp)
        feature.properties = {
          popupHTML: `<h3>${zone.camp.name}</h3>`,
        };

      return feature;
    });
    setGeojson({ type: "FeatureCollection", features });
  }, [zones]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <Map geojson={geojson} setGeojson={setGeojson} />
    </div>
  );
}
