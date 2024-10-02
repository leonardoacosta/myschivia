"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Pin, Tent, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { Separator } from "@tribal-cities/ui/separator";
import { TypeBadge } from "@tribal-cities/ui/type-badge";

import { api } from "~/trpc/react";

export default function AuthShowcase() {
  const [events] = api.event.all.useSuspenseQuery({
    day: null,
    campId: null,
    type: null,
  });
  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex justify-center overflow-scroll py-8">
        <div className="mx-auto grid gap-6">
          <div className="grid text-center">
            <h1 className="text-3xl font-bold">Events Page</h1>
          </div>
          <label className="text-center">
            <Link href="/" className="underline">
              To get the most out of Tribal Cities, please sign in
            </Link>
          </label>

          <div className="text-center">
            {events.map((evs) => {
              const eventsOfDay = evs[1]!;

              return (
                <div className="mb-6">
                  <Separator />
                  <div className="mt-2 text-xl font-bold">
                    {format((eventsOfDay[0] as any)?.startDate, "E LLL dd")}
                  </div>

                  <div className="grid gap-2 p-6">
                    {(eventsOfDay as any).map((ev: any) => (
                      <EventCard ev={ev} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Purple background */}
      <div className="hidden bg-muted bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-secondary lg:block" />
    </div>
  );
}

const EventCard = ({ ev }: { ev: any }) => {
  return (
    <Card className="hover:cursor-pointer hover:bg-muted/50">
      <CardHeader className="items-start space-y-0">
        <div className="space-y-1">
          <CardTitle>{ev.name}</CardTitle>
          <CardDescription>{ev.description}</CardDescription>
          <div className="hidden space-x-4 pt-4 text-sm text-muted-foreground md:flex">
            <div className="flex items-center">
              <TypeBadge type={ev.type} />
            </div>
            <div className="flex items-center">
              <User className="mr-1 h-3 w-3" />
              {ev.hostName || ev.user.alias}
            </div>
            <div className="flex items-center">
              <Tent className="mr-1 h-3 w-3" />
              {ev.campName || "Self"}
            </div>
            <div className="flex items-center">
              <Pin className="mr-1 h-3 w-3" />
              {ev.location}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 text-sm text-muted-foreground md:hidden">
          <div className="flex items-center">
            <TypeBadge type={ev.type} />
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            {ev.hostName || ev.user.alias}
          </div>
          <div className="flex items-center">
            <Tent className="mr-1 h-3 w-3" />
            {ev.campName || "Self"}
          </div>
          <div className="flex items-center">
            <Pin className="mr-1 h-3 w-3" />
            {ev.location}
          </div>
        </div>
        <div className="mt-2 flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              From:
              <span>
                {" "}
                {format(ev.startDate, "EEE")} @ {ev.startTime}
              </span>
            </span>
            <span>
              To:
              <span>
                {" "}
                {format(ev.endDate, "EEE")} @ {ev.endTime}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
