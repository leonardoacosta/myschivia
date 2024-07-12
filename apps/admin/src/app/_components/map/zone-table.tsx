"use client";

import type { RouterOutputs } from "@tribal-cities/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";

export default function ZoneTable({
  zones,
}: {
  zones?: RouterOutputs["cityPlanning"]["getZones"];
}) {
  return (
    <Table className="h-fit overflow-scroll p-4">
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones?.map((zone) => (
          <TableRow key={zone.id}>
            <TableCell className="text-left">
              {zone.camp?.name ?? "Nothing yet"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
