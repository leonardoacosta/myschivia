"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import type { RouterOutputs } from "@tribal-cities/api";
import { cn } from "@tribal-cities/ui";
import { Button } from "@tribal-cities/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@tribal-cities/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@tribal-cities/ui/popover";

export function FilterByCamp({
  camps,
  value,
  setValue,
}: {
  camps: RouterOutputs["camp"]["all"];
  value: string | null;
  setValue: (value: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? camps.find((framework) => framework.id === value)?.name
            : "Camp"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No Camps Found</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => setValue(null)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === null ? "opacity-100" : "opacity-0",
                  )}
                />
                All Camps
              </CommandItem>
              {camps.map((camp) => (
                <CommandItem
                  key={camp.id}
                  value={camp.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === camp.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {camp.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
