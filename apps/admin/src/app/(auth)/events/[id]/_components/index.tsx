"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

import MapContext from "~/context/map-context";
import Map from "./map";
import ZoneTable from "./zone-table";

export default function MainMap() {
  return (
    <MapContext>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>Map</CardTitle>
          <CardDescription>Click on any camp to find it.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[50vh] md:flex">
            <div className="hidden h-0 w-0 overflow-scroll md:block md:h-[100%] md:w-1/3">
              <ZoneTable />
            </div>
            <div className="h-[100%] w-[100%] md:w-2/3">
              <Map />
            </div>
          </div>
        </CardContent>
      </Card>
    </MapContext>
  );
}
