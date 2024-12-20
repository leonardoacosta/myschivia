"use client";

import * as React from "react";

import MapContext from "~/context/map-context";
import Map from "./map";

export default function CampMap() {
  return (
    <MapContext>
      <Map />
    </MapContext>
  );
}
