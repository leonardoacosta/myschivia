"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

import { Badge } from "@tribal-cities/ui/badge";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead className="hidden md:table-cell">By</TableHead>
                    <TableHead className="hidden md:table-cell">With</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      onClick={() => {
                        if (auth?.user.id === event.user.id)
                          router.push(`/events/edit/${event.id}`);
                        else router.push(`/events/view/${event.id}`);
                      }}
                    >
                      <TableCell className="font-medium">
                        {event.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(event.startDate, "EEE")} @ {event.startTime}
                      </TableCell>
                      <TableCell>
                        {format(event.endDate, "EEE")} @ {event.endTime}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {event.user.alias}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {event.campName || "Self"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
