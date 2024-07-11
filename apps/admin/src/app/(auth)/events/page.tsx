"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import type { RouterOutputs } from "@tribal-cities/api";
import { cn } from "@tribal-cities/ui";
import { Badge } from "@tribal-cities/ui/badge";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tribal-cities/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tribal-cities/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tribal-cities/ui/tabs";
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();
  const [events] = api.event.all.useSuspenseQuery();

  // if (events.length === 0) {
  //   return (
  //     <div className="relative flex w-full flex-col gap-4">
  //       <EventCardSkeleton pulse={false} />
  //       <EventCardSkeleton pulse={true} />
  //       <EventCardSkeleton pulse={false} />

  //       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
  //         <p className="text-2xl font-bold text-white">No Events yet</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mine">Mine</TabsTrigger>
          </TabsList>
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
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
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
                        {event.user.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {event.camp?.name ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {/* <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function EventCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-primary text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}

function EventCard(props: { event: RouterOutputs["event"]["all"][number] }) {
  const utils = api.useUtils();
  const deleteEvent = api.event.delete.useMutation({
    onSuccess: async () => {
      await utils.event.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a event"
          : "Failed to delete event",
      );
    },
  });

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.event.name}</h2>
        <p className="mt-2 text-sm">{props.event.description}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deleteEvent.mutate(props.event.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
