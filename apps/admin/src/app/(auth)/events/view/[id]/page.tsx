"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { TypeBadge } from "@tribal-cities/ui/event-type-badge";

import MapContext, { MapContext as mapContext } from "~/context/map-context";
import { api } from "~/trpc/react";
import Map from "../_components/map";

export default function ViewPost() {
  const { id } = useParams();
  const { data: ev } = api.event.byId.useQuery({ id: id as string });

  if (!ev) return <p>Loading...</p>;

  const startWithTime = () => {
    const date = ev.startDate; // Example date
    const timeString = ev.startTime; // Time in "HH:MM" format

    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set the hours and minutes on the date object
    date.setHours(hours ?? 0);
    date.setMinutes(minutes ?? 0);
    return date;
  };

  const endWithTime = () => {
    const date = ev.endDate; // Example date
    const timeString = ev.endTime; // Time in "HH:MM" format

    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set the hours and minutes on the date object
    date.setHours(hours ?? 0);
    date.setMinutes(minutes ?? 0);
    return date;
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center">
            <Link href={`/events`} className="block">
              <ChevronLeft className="mr-2 inline-block h-6 w-6" />
            </Link>
            <div className="flex-row space-y-2">
              <div>
                <span>{ev.name}</span>
              </div>
              <div className="flex gap-2">
                <TypeBadge type={ev.type as any} className="flex-none" />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {ev.hostName || ev.user?.alias}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="flex gap-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>{ev.description}</CardDescription>
        </CardContent>
        <CardContent>
          <CardDescription>
            From: {format(ev.startDate, "EEE")} @{" "}
            {format(startWithTime(), "h:mm a")}
          </CardDescription>
          <CardDescription>
            To: {format(ev.endDate, "EEE")} @ {format(endWithTime(), "h:mm a")}
          </CardDescription>
          <CardDescription>By: {ev.hostName || ev.user?.alias}</CardDescription>
          <CardDescription>Part of Camp: {ev.campName}</CardDescription>
        </CardContent>
      </Card>
      <MapContext>
        <Map />
      </MapContext>
    </main>
  );
}
