"use client";

import * as React from "react";

import MapContext from "~/context/map-context";
import Map from "./map";
import ZoneTable from "./zone-table";

export default function Index() {
  return (
    <MapContext>
      <div style={{ display: "flex", height: "90vh" }}>
        <div
          className="h-[100%]"
          style={{ width: "33%", textAlign: "center", overflow: "auto" }}
        >
          <ZoneTable />
        </div>
        <div className="h-[100%]" style={{ width: "67%" }}>
          <Map />
        </div>
      </div>
    </MapContext>
  );
}
