"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import MapContext from "~/context/map-context";
import ZoneTable from "./zone-table";

const Map = dynamic(() => import("./map"), { ssr: false });

export default function Page() {
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
