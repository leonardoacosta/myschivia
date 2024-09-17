"use client";

import { useContext } from "react";

import { Button } from "@tribal-cities/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";
import { MapContext } from "../../../context/map-context";

export default function ZoneTable() {
  const { zones, setHoverZone } = useContext(MapContext);
  const utils = api.useUtils();
  const { mutateAsync, isPending } = api.cityPlanning.deleteZone.useMutation();

  return (
    <Table className="p-4">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Claimed By</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones?.map((zone) => (
          <TableRow
            key={zone.id}
            onMouseEnter={() => {
              console.log("hovering");
              setHoverZone(zone.id);
            }}
            onMouseLeave={() => {
              console.log("exit");
              setHoverZone("");
            }}
          >
            <TableCell className="text-left">
              <p>{zone.type}</p>
              <label className="text-gray-500">{zone.id.slice(0, 8)}</label>
            </TableCell>
            <TableCell className="text-left">
              {zone.camp?.name ?? "N/A"}
            </TableCell>
            <TableCell className="text-left">
              <form>
                <Button
                  size="lg"
                  variant="destructive"
                  disabled={isPending}
                  formAction={async () => {
                    await mutateAsync(zone.id, {
                      onSuccess: async () => {
                        await utils.cityPlanning.getZones.refetch();
                        toast.success("Zones Deleted");
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
