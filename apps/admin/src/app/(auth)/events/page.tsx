/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

import { EventType } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tribal-cities/ui/dropdown-menu";
import { Label } from "@tribal-cities/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tribal-cities/ui/tabs";

import { api } from "~/trpc/react";
import EventCard from "./_components/event-card";
import { FilterByCamp } from "./_components/filter-by-camp";
import Tv from "./_components/tv";

export default function Page() {
  const [date, setDate] = useState<Date | null>(null);
  const [campId, setCampId] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const [camps] = api.camp.all.useSuspenseQuery();
  const [favorites] = api.event.getFavorites.useSuspenseQuery();
  const { data: events, isPending } = api.event.all.useQuery({
    type: type,
    campId: campId,
    day: date,
  });

  const [dates] = api.event.allDates.useSuspenseQuery();

  const exportSchedule = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const inFavorites =
      ref.current?.attributes.getNamedItem("data-state")?.value === "active";

    // export as csv
    const csv = events
      ?.filter((eventsDays) => {
        // if we're filtering by favorites, only include days that have events in favorites
        if (inFavorites) {
          return (eventsDays[1] as any).find((e: any) =>
            favorites.find((f) => f.eventId === e.id),
          );
        }
        return eventsDays;
      })
      ?.reduce((acc, evs) => {
        const eventsOfDay = evs[1]!;
        const day = (eventsOfDay as any)?.map((ev: any) => {
          // if we're filtering by favorites, only include events that are in favorites
          if (inFavorites && !favorites.find((f) => f.eventId === ev.id)) {
            return;
          }

          return [
            ev.name.replaceAll(",", "") ?? "",
            ev.description.replaceAll(",", "") ?? "",
            ev.location.replaceAll(",", "") ?? "",
            ev.startDate ? format(ev.startDate, "E LLL dd") : "",
            ev.startTime ?? "",
            ev.endDate ? format(ev.endDate, "E LLL dd") : "",
            ev.endTime ?? "",
            ev.type.replaceAll(",", "") ?? "",
            ev.user?.alias.replaceAll(",", "") ??
              ev.hostName?.replaceAll(",", "") ??
              "",
            ev.campName?.replaceAll(",", "") ?? "",
          ];
        });

        return [...acc, ...day];
      }, [])
      .filter((e) => !!e);

    const csvContent =
      `data:text/csv;charset=utf-8,Event Name,Description,Location,Start Date,Start Time,End Date,End Time,Type,Host,Camp Name\n` +
      csv?.map((e) => (e as any).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Myschievia  ${inFavorites ? "My Schedule " : ""}${date ? format(date, "E LLL dd ") : ""}Events.csv`,
    );
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Link href="/events/create">
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Register Event
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle>📅 Events</CardTitle>
            <CardDescription>
              All events in the system, so far 👀
            </CardDescription>
          </CardHeader>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Label>Filter by</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-3 shadow-none">
                    {date ? format(date, "E LLL dd") : "Day"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setDate(null)}
                    className="hover:bg-muted/50"
                  >
                    All
                  </DropdownMenuItem>
                  {dates.map((d) => (
                    <DropdownMenuItem
                      onClick={() => setDate(new Date(d))}
                      className="hover:bg-muted/50"
                    >
                      {format(d, "E LLL dd")}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-3 shadow-none">
                    {campId
                      ? camps.find((c) => c.id === campId)?.name ?? "???"
                      : "Camp"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setCampId(null)}
                    className="hover:bg-muted/50"
                  >
                    All
                  </DropdownMenuItem>
                  {camps.map((d) => {
                    return (
                      <DropdownMenuItem
                        onClick={() => setCampId(d.id)}
                        className="hover:bg-muted/50"
                      >
                        {d.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <FilterByCamp camps={camps} setValue={setCampId} value={campId} /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-3 shadow-none">
                    {type ?? "Type"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setType(null)}
                    className="hover:bg-muted/50"
                  >
                    All
                  </DropdownMenuItem>
                  {Object.values(EventType.enumValues).map((d) => {
                    return (
                      <DropdownMenuItem
                        onClick={() => setType(d)}
                        className="hover:bg-muted/50"
                      >
                        {d}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <Button
              variant="secondary"
              className="px-3 shadow-none"
              onClick={exportSchedule}
            >
              Export this schedule
            </Button>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="schedule">My Schedule</TabsTrigger>
              <TabsTrigger value="tv">TV</TabsTrigger>
            </TabsList>
            <div>
              {isPending && (
                <div className="flex justify-center pt-2">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-200"></div>
                </div>
              )}
            </div>
            <TabsContent value="schedule" ref={ref}>
              {events?.map((evs) => {
                const eventsOfDay = evs[1]!;

                if (
                  !(eventsOfDay as any).find((e: any) =>
                    favorites.find((f) => f.eventId === e.id),
                  )
                ) {
                  return null;
                }

                return (
                  <div className="mb-4">
                    <div className="mb-4 ml-2">
                      {format((eventsOfDay[0] as any)?.startDate, "E LLL dd")}
                    </div>

                    <div className="grid gap-2">
                      {(eventsOfDay as any)
                        ?.filter(
                          (e: any) =>
                            !!favorites.find((f) => f.eventId === e.id),
                        )
                        .map((ev: any) => <EventCard ev={ev} />)}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="all">
              {events?.map((evs) => {
                const eventsOfDay = evs[1]!;
                return (
                  <div className="mb-4">
                    <div className="mb-4 ml-2">
                      {format((eventsOfDay[0] as any)?.startDate, "E LLL dd")}
                    </div>

                    <div className="grid gap-2">
                      {(eventsOfDay as any)?.map((ev: any) => (
                        <EventCard ev={ev} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <Tv />
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
