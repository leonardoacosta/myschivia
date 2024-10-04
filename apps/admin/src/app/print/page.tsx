"use client";

import { format, isEqual } from "date-fns";
import { Pin, Tent, User } from "lucide-react";

import { Card, CardHeader } from "@tribal-cities/ui/card";
import { EventTypeBadge } from "@tribal-cities/ui/event-type-badge";
import { Separator } from "@tribal-cities/ui/separator";

import { api } from "~/trpc/react";

export default function print() {
  const [events] = api.event.all.useSuspenseQuery({
    day: null,
    campId: null,
    type: null,
  });
  return (
    <div>
      {events.map((evs, index: number) => {
        const eventsOfDay = evs[1]!;

        return (
          <>
            <Separator />
            <div className={`my-1 text-center font-bold`}>
              {format((eventsOfDay[0] as any)?.startDate, "E LLL dd")}
            </div>

            <div
              className={`${index === 1 ? "break-after-page" : ""} grid grid-flow-row grid-cols-5 gap-1`}
            >
              {(eventsOfDay as any).map((ev: any) => {
                return <EventCard ev={ev} className={""} />;
              })}
            </div>
          </>
        );
      })}
    </div>
  );
}

const EventCard = ({ ev, className }: { ev: any; className: string }) => {
  const isMultiDay = !isEqual(ev.startDate, ev.endDate);
  // console.log(className);

  // Add time to the date
  const startDate = new Date(ev.startDate);
  const [startHours, startMinutes] = ev.startTime.split(":");
  startDate.setHours(parseInt(startHours ?? "0"));
  startDate.setMinutes(parseInt(startMinutes ?? "0"));

  const endDate = new Date(ev.endDate);
  const [endHours, endMinutes] = ev.endTime.split(":");
  endDate.setHours(parseInt(endHours ?? "0"));
  endDate.setMinutes(parseInt(endMinutes ?? "0"));

  return (
    <Card className={`${className} p-0 hover:cursor-pointer hover:bg-muted/50`}>
      <CardHeader className="relative items-start space-y-0 overflow-hidden p-2">
        <div className="space-y-1">
          {className}
          <EventTypeBadge className="text-xs" type={ev.type} />{" "}
          <span className="text-[13px] font-extrabold">{ev.name}</span>
          <Separator />
          <div className="mb-1 flex space-x-4">
            <div className="flex items-center gap-2 text-xs">
              <span>
                From:
                <span>
                  {isMultiDay ? format(ev.startDate, "EEE @ ") : ""}
                  {format(startDate, " h:mm a")}
                </span>
              </span>
              <span>
                To:
                <span>
                  {isMultiDay ? format(ev.endDate, "EEE @ ") : ""}
                  {format(endDate, " h:mm a")}
                </span>
              </span>
            </div>
          </div>
          <p className="text-xs font-medium">{ev.description}</p>
          <div className="hidden space-x-4 pt-1 text-xs text-muted-foreground md:flex">
            <div className="flex w-fit items-center">
              <User className="mr-1 h-3 w-3" />
              {ev.hostName || ev.user.alias}
            </div>
            <div className="flex items-center">
              <Tent className="mr-1 h-3 w-3" />
              {ev.camp?.name || ev.campName || "Self"}
            </div>
            <div className="flex max-w-[50%] items-center">
              <Pin className="mr-1 h-3 w-3" />
              {ev.location}
            </div>
          </div>
        </div>
        {isMultiDay && (
          <div className="z absolute -right-6 -top-5 h-10 w-10 rotate-45 bg-indigo-500" />
        )}
      </CardHeader>
    </Card>
  );
};
