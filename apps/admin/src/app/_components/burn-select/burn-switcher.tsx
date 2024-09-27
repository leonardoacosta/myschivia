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
  const { burns, burnId, setBurnId, setJoin } = React.useContext(BurnContext);

  return (
    <Select
      defaultValue={burnId ?? ""}
      onValueChange={(e) => {
        if (e === "create") setJoin(true);
        else setBurnId(e);
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
            {burns.find((burn) => burn.id === burnId)?.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {burns.map((burn) => (
          <SelectItem key={burn.id} value={burn.id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {/* {account.icon} */}
              {/* {burn.name} - {format(burn.startDate, "YY")} */}
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
