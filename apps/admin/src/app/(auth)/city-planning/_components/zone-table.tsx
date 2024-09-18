"use client";

import { useContext } from "react";

import { ZoneClass } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import { Input } from "@tribal-cities/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tribal-cities/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";
import { toast } from "@tribal-cities/ui/toast";

import { MapContext } from "~/context/map-context";
import { api } from "~/trpc/react";

export default function ZoneTable() {
  const { zones, setHoverZone } = useContext(MapContext);
  const utils = api.useUtils();
  const { mutate, isPending } = api.cityPlanning.deleteZone.useMutation();

  const { data: camps } = api.camp.all.useQuery();
  const { mutate: link } = api.cityPlanning.update.useMutation({
    onSuccess: async () => {
      await utils.cityPlanning.getZones.refetch();
      toast.success("Zone Updated");
    },
  });

  return (
    <Table className="p-4">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Desc / Claimed By</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones?.map((zone) => (
          <TableRow
            key={zone.id}
            onMouseEnter={() => {
              zone.type === "Point" && setHoverZone(zone.id);
            }}
            onMouseLeave={() => {
              zone.type === "Point" && setHoverZone("");
            }}
          >
            <TableCell className="text-left">
              <p>{zone.type === "LineString" ? "Path" : "Camp"}</p>
              <Select
                onValueChange={(value) => {
                  toast.success("Zone Updating...");
                  link({ id: zone.id, class: value as any });
                }}
                value={zone.class ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No class" />
                </SelectTrigger>
                <SelectContent>
                  {zone.type === "Point" ? (
                    <>
                      <SelectItem value={"Camp"}>Camp</SelectItem>
                      <SelectItem value={"RV"}>RV</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value={"Road"}>Road</SelectItem>
                      <SelectItem value={"Path"}>Path</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-left">
              {zone.type === "Point" ? (
                <Select
                  onValueChange={(value) => {
                    link({ id: zone.id, campId: value });
                  }}
                  value={zone.campId ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unclaimed" />
                  </SelectTrigger>
                  <SelectContent>
                    {camps?.map((camp) => (
                      <SelectItem key={camp.id} value={camp.id}>
                        {camp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  defaultValue={zone.description ?? ""}
                  onChange={(e) => {
                    link({ id: zone.id, description: e.target.value });
                  }}
                />
              )}
            </TableCell>
            <TableCell className="text-left">
              <form>
                <Button
                  size="lg"
                  variant="destructive"
                  disabled={isPending}
                  formAction={() => {
                    mutate(zone.id, {
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
