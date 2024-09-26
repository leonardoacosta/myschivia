"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CircleIcon,
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
import { Tabs, TabsContent } from "@tribal-cities/ui/tabs";

import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();
  const [events] = api.event.all.useSuspenseQuery();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
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
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <div className="flex justify-between">
              <CardHeader>
                <CardTitle>📅 Events</CardTitle>
                <CardDescription>
                  All events in the system, so far 👀
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent>
              <div className="grid gap-2">
                {events.map((event) => (
                  <Card
                    onClick={() => {
                      if (auth?.user.id === event.user.id)
                        router.push(`/events/edit/${event.id}`);
                      else router.push(`/events/view/${event.id}`);
                    }}
                    className="hover:cursor-pointer hover:bg-muted/50"
                  >
                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                      <div className="space-y-1">
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      {/* <Button variant="secondary" className="px-3 shadow-none">
                        <StarIcon className="mr-2 h-4 w-4" />
                        Save
                      </Button> */}
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                          {event.type}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {event.user.alias}
                        </div>
                        <div className="flex items-center">
                          <Tent className="mr-1 h-3 w-3" />
                          {event.campName || "Self"}
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>
                            From:
                            <span>
                              {" "}
                              {format(event.startDate, "EEE")} @{" "}
                              {event.startTime}
                            </span>
                          </span>
                          <span>
                            To:
                            <span>
                              {" "}
                              {format(event.endDate, "EEE")} @ {event.endTime}
                            </span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
