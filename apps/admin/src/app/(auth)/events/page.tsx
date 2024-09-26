/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as ics from "ics";
import {
  CircleIcon,
  CloudDownloadIcon,
  Eye,
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
  const [events] = api.event.all.useSuspenseQuery({
    day: date ?? null,
  });
  const [dates] = api.event.allDates.useSuspenseQuery();

  const donwloadIcal = (e: any, event: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { error, value } = ics.createEvent({
      start: [
        event.startDate.getFullYear(),
        event.startDate.getMonth() + 1,
        event.startDate.getDate(),
        event.startDate.getHours(),
        event.startDate.getMinutes(),
      ],
      end: [
        event.endDate.getFullYear(),
        event.endDate.getMonth() + 1,
        event.endDate.getDate(),
        event.endDate.getHours(),
        event.endDate.getMinutes(),
      ],
      title: event.name,
      description: event.description,
      location: event.location,
      url: `https://tribal.cities/events/view/${event.id}`,
    });

    if (error) {
      console.error(error);
      return;
    }
    if (value) {
      const blob = new Blob([value], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.name}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const save = (e: any, event: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const exportSchedule = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // export as csv
    const csv = events.reduce((acc, evs, test) => {
      const eventsOfDay = evs[1]!;
      const day = (eventsOfDay as any)?.map((ev: any) => {
        // export as array of strings
        return [
          ev.name.replaceAll(",", "") ?? "",
          ev.description.replaceAll(",", "") ?? "",
          ev.location.replaceAll(",", "") ?? "",
          ev.startDate ? format(ev.startDate, "E LLL dd") : "",
          ev.startTime ?? "",
          ev.endDate ? format(ev.endDate, "E LLL dd") : "",
          ev.endTime ?? "",
          ev.type.replaceAll(",", "") ?? "",
          ev.user.alias.replaceAll(",", "") ?? "",
          ev.campName.replaceAll(",", "") ?? "",
        ];
      });

      return [...acc, ...day];
    }, []);
    console.log(csv);
    const csvContent =
      `data:text/csv;charset=utf-8,Event Name,Description,Location,Start Date,Start Time,End Date,End Time,Type,Host,Camp Name\n` +
      csv.map((e) => (e as any).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Myschievia ${date ? format(date, "E LLL dd ") : ""}Events.csv`,
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
                    <div className="mb-4 ml-2">
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
                          <CardHeader className="grid grid-cols-[1fr_50px] items-start gap-4 space-y-0 sm:grid-cols-[1fr_150px]">
                            <div className="space-y-1">
                              <CardTitle>{ev.name}</CardTitle>
                              <CardDescription>
                                {ev.description}
                              </CardDescription>
                              <div className="hidden space-x-4 pt-4 text-sm text-muted-foreground md:flex">
                                <div className="flex items-center">
                                  <TypeBadge type={ev.type} />
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
                            </div>

                            <div className="grid gap-1">
                              <Button
                                variant="secondary"
                                className="px-3 shadow-none"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span className="hidden sm:block">View</span>
                              </Button>
                              <Button
                                variant="secondary"
                                className="px-3 shadow-none"
                                onClick={(e) => save(e, ev)}
                              >
                                <StarIcon className="mr-2 h-4 w-4" />
                                <span className="hidden sm:block">Save</span>
                              </Button>
                              <Button
                                variant="secondary"
                                className="px-3 shadow-none"
                                onClick={(e) => donwloadIcal(e, ev)}
                              >
                                <CloudDownloadIcon className="mr-2 h-4 w-4" />
                                <span className="hidden sm:block">
                                  Download .ics
                                </span>
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 text-sm text-muted-foreground md:hidden">
                              <div className="flex items-center">
                                <TypeBadge type={ev.type} />
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

                        // <Card
                        //   onClick={() => {
                        //     if (auth?.user.id === ev.createdById)
                        //       router.push(`/events/edit/${ev.id}`);
                        //     else router.push(`/events/view/${ev.id}`);
                        //   }}
                        //   className="hover:cursor-pointer hover:bg-muted/50"
                        // >
                        //   <CardHeader>
                        //     <div className="grid grid-cols-[1fr_50px] items-start gap-4 space-y-0 space-y-1 sm:grid-cols-[1fr_150px]">
                        //       <div className="col-start-1">
                        //         <CardTitle>{ev.name}</CardTitle>
                        //         <CardDescription>
                        //           {ev.description}
                        //         </CardDescription>
                        //         <CardContent className="col-start-1 hidden md:col-span-1 md:block">
                        //           <div className="grid w-full grid-cols-2 gap-2 text-sm text-muted-foreground md:w-fit lg:grid-cols-2">
                        //             <div className="flex items-center">
                        //               <TypeBadge type={ev.type} />
                        //             </div>
                        //             <div className="flex items-center">
                        //               <User className="mr-1 h-3 w-3" />
                        //               {ev.user.alias}
                        //             </div>
                        //             <div className="flex items-center">
                        //               <Tent className="mr-1 h-3 w-3" />
                        //               {ev.campName || "Self"}
                        //             </div>
                        //             <div className="flex items-center">
                        //               <Pin className="mr-1 h-3 w-3" />
                        //               {ev.location}
                        //             </div>
                        //           </div>
                        //         </CardContent>
                        //       </div>
                        //       <CardContent className="col-span-2 col-start-1 md:col-span-1 md:hidden">
                        //         <div className="grid w-full grid-cols-2 gap-2 text-sm text-muted-foreground md:w-fit lg:grid-cols-2">
                        //           <div className="flex items-center">
                        //             <TypeBadge type={ev.type} />
                        //           </div>
                        //           <div className="flex items-center">
                        //             <User className="mr-1 h-3 w-3" />
                        //             {ev.user.alias}
                        //           </div>
                        //           <div className="flex items-center">
                        //             <Tent className="mr-1 h-3 w-3" />
                        //             {ev.campName || "Self"}
                        //           </div>
                        //           <div className="flex items-center">
                        //             <Pin className="mr-1 h-3 w-3" />
                        //             {ev.location}
                        //           </div>
                        //         </div>
                        //       </CardContent>
                        //       <div className="col-start-2 row-start-1 grid gap-1">
                        // <Button
                        //   variant="secondary"
                        //   className="px-3 shadow-none"
                        // >
                        //   <Eye className="mr-2 h-4 w-4" />
                        //   <span className="hidden sm:block">View</span>
                        // </Button>
                        // <Button
                        //   variant="secondary"
                        //   className="px-3 shadow-none"
                        //   onClick={(e) => save(e, ev)}
                        // >
                        //   <StarIcon className="mr-2 h-4 w-4" />
                        //   <span className="hidden sm:block">Save</span>
                        // </Button>
                        //         <Button
                        //           variant="secondary"
                        //           className="px-3 shadow-none"
                        //           onClick={(e) => donwloadIcal(e, ev)}
                        //         >
                        //           <CloudDownloadIcon className="mr-2 h-4 w-4" />
                        //           <span className="hidden sm:block">
                        //             Download .ics
                        //           </span>
                        //         </Button>
                        //       </div>
                        //     </div>

                        //     <div className="mt-2 flex space-x-4 text-sm text-muted-foreground">
                        //       <div className="flex items-center gap-2">
                        //         <span>
                        //           From:
                        //           <span>
                        //             {" "}
                        //             {format(ev.startDate, "EEE")} @{" "}
                        //             {ev.startTime}
                        //           </span>
                        //         </span>
                        //         <span>
                        //           To:
                        //           <span>
                        //             {" "}
                        //             {format(ev.endDate, "EEE")} @ {ev.endTime}
                        //           </span>
                        //         </span>
                        //       </div>
                        //     </div>
                        //   </CardHeader>
                        // </Card>
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
