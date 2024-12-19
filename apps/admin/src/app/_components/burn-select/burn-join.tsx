import Link from "next/link";

import { Button } from "@tribal-cities/ui/button";
import { ScrollArea, ScrollBar } from "@tribal-cities/ui/scroll-area";

import { api } from "~/trpc/react";
import { BurnCard } from "./burn-card";

export default function BurnSelect() {
  const { data: burns } = api.burn.allYears.useQuery();
  if (!burns) return null;

  return (
    <div className="flex-row justify-center space-y-4 p-5 sm:gap-4 sm:py-4 sm:pl-14">
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
      <Link href="/create">
        <Button className="w-full">Start a Burn 🔥</Button>
      </Link>
    </div>
  );
}
