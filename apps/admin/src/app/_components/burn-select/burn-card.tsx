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
      <DialogTrigger
        // asChild
        disabled={old}
        onClick={() => {
          console.log(old);
          if (old) return;
          console.log(`Join Burn Year ${burn.name}`);
        }}
      >
        <div
          className={cn(
            "space-y-3",
            className,
            old ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
          {...props}
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
            {old && (
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
