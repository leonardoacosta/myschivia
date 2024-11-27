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

interface BurnSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  burn: RouterOutputs["burn"]["allYears"][0]["years"][0];
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function BurnCard({
  burn,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: BurnSelectProps) {
  const old = burn.endDate < new Date();
  const { setJoin } = useContext(BurnContext);
  const { mutate, isPending } = api.burn.join.useMutation();
  const utils = api.useUtils();

  return (
    <Dialog>
      <DialogTrigger asChild disabled={old}>
        <div
          className={cn(
            "space-y-3",
            className,
            old ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
          {...props}
          onClick={() => {
            if (old) return;
            console.log(`Join Burn Year ${burn.name}`);
          }}
        >
          <div className={`relative overflow-hidden rounded-md`}>
            <Image
              src={burn.image ?? ""}
              alt={burn.name ?? ""}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
              )}
            />
            {burn.endDate < new Date() && (
              <div className="absolute bottom-0 left-0 right-0 top-0 w-full flex-row content-center self-center bg-secondary/50 py-3 text-center text-xs font-semibold">
                <div className="text-accent-background bg-accent-background w-full">
                  Completed
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="font-medium leading-none">
              {burn?.name} - {format(burn.startDate, "yy")}
            </h3>
            <p className="text-xs text-muted-foreground">{burn.description}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Join {burn.name} - {burn.description}?
          </DialogTitle>
          <DialogDescription>
            By joining this burn, you will be able to see and create events,
            register camps (if within the deadline), and view the map!
          </DialogDescription>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => {
                mutate(burn.id, {
                  onSuccess: () => {
                    utils.burn.joined.refetch().then(() => {
                      setJoin(null);
                    });
                  },
                });
              }}
            >
              {isPending ? "Joining..." : "Join Burn"}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

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
          <Button className="w-full">Start a Burn 🔥</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              This feature is currently under development.
            </DialogTitle>
            <DialogDescription>
              If you would like to create a burn, please contact the Tribal
              Cities team.
            </DialogDescription>
            <DialogFooter>
              <a
                href={`
                mailto:leo@leonardoacosta.dev?
                subject=Create a Burn
                &body=Hello!%0D%0A%0D%0A I love the idea of creating a burn and would like to learn more about how I can get started!%0D%0A%0D%0A Thank you!%0D%0A%0D%0A- [Your Name should go here]
                `}
              >
                <Button>Contact us</Button>
              </a>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
