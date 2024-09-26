/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CircleIcon,
  Pin,
  PlusCircle,
  PlusIcon,
  StarIcon,
  Tent,
  User,
} from "lucide-react";

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
import { TypeBadge } from "@tribal-cities/ui/type-badge";

import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();
  const [date, setDate] = useState<Date | null>(null);
  const [events] = api.event.all.useSuspenseQuery({ day: date });
  const [dates] = api.event.allDates.useSuspenseQuery();

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
              <Label>Filter by date</Label>
              <CardDescription>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-3 shadow-none">
                      {date ? format(date, "E LLL dd") : "All"}
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
              </CardDescription>
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              <CardHeader>Coming soon</CardHeader>
            </TabsContent>
            <TabsContent value="all">
              {events.map((evs) => {
                const eventsOfDay = evs[1]!;
                return (
                  <div className="mb-4">
                    <div>
                      {format((eventsOfDay[0] as any)?.startDate, "E LLL dd")}
                    </div>

                    <div className="grid gap-2">
                      {(eventsOfDay as any)?.map((ev: any) => (
                        <Card
                          onClick={() => {
                            if (auth?.user.id === ev.createdById)
                              router.push(`/events/edit/${ev.id}`);
                            else router.push(`/events/view/${ev.id}`);
                          }}
                          className="hover:cursor-pointer hover:bg-muted/50"
                        >
                          <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                            <div className="space-y-1">
                              <CardTitle>{ev.name}</CardTitle>
                              <CardDescription>
                                {ev.description}
                              </CardDescription>
                            </div>
                            <Button
                              variant="secondary"
                              className="px-3 shadow-none"
                            >
                              <StarIcon className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                          </CardHeader>
                          <CardContent>
                            {/* <div className="text-xs font-medium">{item.subject}</div> */}
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <TypeBadge type={ev.type} />
                                {/* <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                                {ev.type} */}
                              </div>
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                {ev.user.alias}
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
                                    {format(ev.startDate, "EEE")} @{" "}
                                    {ev.startTime}
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
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
