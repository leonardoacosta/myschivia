"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

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
          <CardTitle>{ev.name}</CardTitle>
          <CardDescription>
            {ev.location} - {ev.type}
          </CardDescription>
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
          <CardDescription>By: {ev.user.alias}</CardDescription>
          <CardDescription>Part of Camp: {ev.campName}</CardDescription>
        </CardContent>
      </Card>
      <MapContext>
        <Map />
      </MapContext>
    </main>
  );
}
