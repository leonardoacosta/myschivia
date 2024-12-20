"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { cn } from "@tribal-cities/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tribal-cities/ui/select";

import { BurnContext } from "~/context/burn-context";

export function BurnSwitcher() {
  const { burnYearsJoined, burnYearId, setBurnYearId, setJoin } =
    React.useContext(BurnContext);

  return (
    <Select
      defaultValue={burnYearId ?? ""}
      onValueChange={(e) => {
        if (e === "create") setJoin(true);
        else setBurnYearId(e);
      }}
    >
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select burn"
      >
        <SelectValue placeholder="">
          {/* {burns.find((burn) => burn.id === burnId)?.icon} */}
          <span className={cn("ml-2", "hidden")}>
            {
              burnYearsJoined.find((burn) => burn.burnYearId === burnYearId)
                ?.burnYear.name
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {burnYearsJoined.map((membership) => (
          <SelectItem key={membership.burnYearId} value={membership.burnYearId}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {membership.burnYear.name} -{" "}
              {format(membership.burnYear.startDate, "yy")}
            </div>
          </SelectItem>
        ))}
        <SelectItem value="create">
          <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
            <Plus />
            Join a Burn
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
