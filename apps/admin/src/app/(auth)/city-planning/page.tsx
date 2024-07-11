"use client";

import type { FeatureCollection } from "geojson";
import * as React from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function Page() {
  const [geojson, setGeojson] = React.useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.976344, 40.767867],
              [-73.984754, 40.774237],
              [-73.96742, 40.783206],
              [-73.966733, 40.773067],
              [-73.976344, 40.767867],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.966304, 40.773782],
              [-73.965789, 40.790679],
              [-73.953861, 40.792109],
              [-73.953861, 40.778007],
              [-73.966304, 40.773782],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { popupHTML: "<h1>Hello World</h1>" },
        geometry: { type: "Point", coordinates: [-73.962357, 40.796658] },
      },
      // {
      //   type: "Feature",
      //   properties: { radius: 100 },
      //   geometry: { type: "Point", coordinates: [-73.962357, 40.796658] },
      // },
      // {
      //   type: "Feature",
      //   properties: { radius: 200 },
      //   geometry: { type: "Point", coordinates: [-73.950858, 40.78691] },
      // },
      {
        type: "Feature",
        properties: { popupHTML: "<h1>Hello World</h1>", color: "red" },
        geometry: {
          type: "LineString",
          coordinates: [
            [-73.972912, 40.78639],
            [-73.984496, 40.780151],
            [-73.984496, 40.776122],
            [-73.970595, 40.781776],
          ],
        },
      },
    ],
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "33%", textAlign: "center", overflow: "auto" }}>
        <p>{JSON.stringify(geojson, null, 2)}</p>
      </div>
      <div style={{ width: "67%" }}>
        <Map geojson={geojson} setGeojson={setGeojson} />
      </div>
    </div>
  );
}
