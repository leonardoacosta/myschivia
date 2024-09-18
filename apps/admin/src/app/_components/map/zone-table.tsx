"use client";

import { useContext } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";

import { MapContext } from "~/context/map-context";

export default function ZoneTable() {
  const { zones, setHoverZone, panTo } = useContext(MapContext);
  return (
    <Table className="h-full overflow-scroll p-4">
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones
          ?.filter((z) => z.camp)
          .sort((a, b) => a.camp!.name.localeCompare(b.camp!.name))
          .map((zone) => (
            <TableRow
              key={zone.id}
              onClick={() => {
                const lat = zone.coordinates[0]!.lat;
                const lng = zone.coordinates[0]!.lng;

                panTo(parseFloat(lat), parseFloat(lng));
              }}
              onMouseEnter={() => {
                setHoverZone(zone.id);
              }}
              onMouseLeave={() => {
                setHoverZone("");
              }}
            >
              <TableCell className="text-left">{zone.camp!.name}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
