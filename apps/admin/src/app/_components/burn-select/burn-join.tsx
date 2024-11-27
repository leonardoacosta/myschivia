import { useContext } from "react";
import Image from "next/image";
import { format } from "date-fns";

import type { RouterOutputs } from "@tribal-cities/api";
import { cn } from "@tribal-cities/ui";
import { Button } from "@tribal-cities/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tribal-cities/ui/dialog";
import { ScrollArea, ScrollBar } from "@tribal-cities/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tribal-cities/ui/tooltip";

import { BurnContext } from "~/context/burn-context";
import { api } from "~/trpc/react";
import { BurnCard } from "./burn-card";
import BurnCreate from "./burn-create";

export default function BurnSelect() {
  const { setCreate } = useContext(BurnContext);
  const { data: burns } = api.burn.allYears.useQuery();
  if (!burns) return null;

  return (
    <div className="flex-row justify-center space-y-4 p-5">
      <h1 className="text-2xl font-semibold">Click on a Burn Year to Join</h1>
      {burns.map((burn) => (
        <div>
          <h2 className="text-lg font-semibold">{burn.name}</h2>
          <ScrollArea className="w-[90vw] whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {burn.years.map((burnYear) => (
                <BurnCard
                  key={burnYear.id}
                  burn={burnYear}
                  width={150}
                  height={150}
                  aspectRatio="portrait"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
      <h1 className="pt-6 text-2xl font-semibold">
        Don't see what you're looking for?
      </h1>

      <Dialog>
        <DialogTrigger>
          <Button
            className="w-full"
            onClick={() => {
              setCreate(true);
            }}
          >
            Start a Burn 🔥
          </Button>
        </DialogTrigger>
        <DialogContent>
          <BurnCreate />
        </DialogContent>
      </Dialog>
    </div>
  );
}
