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
  Loader2,
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
import { TypeBadge } from "@tribal-cities/ui/type-badge";

import { api } from "~/trpc/react";

interface EventCardProps {
  ev: any;
}

export default function EventCard({ ev }: EventCardProps) {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();

  const {
    data: favorites,
    refetch,
    isPending: fetching,
  } = api.event.getFavorites.useQuery({ day: null });
  const { mutate, isPending: favoritesPending } =
    api.event.toggleFavorite.useMutation();

  const donwloadIcal = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { error, value } = ics.createEvent({
      start: [
        ev.startDate.getFullYear(),
        ev.startDate.getMonth() + 1,
        ev.startDate.getDate(),
        ev.startDate.getHours(),
        ev.startDate.getMinutes(),
      ],
      end: [
        ev.endDate.getFullYear(),
        ev.endDate.getMonth() + 1,
        ev.endDate.getDate(),
        ev.endDate.getHours(),
        ev.endDate.getMinutes(),
      ],
      title: ev.name,
      description: ev.description,
      location: ev.location,
      url: `https://tribal.cities/events/view/${ev.id}`,
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
      a.download = `${ev.name}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const save = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    mutate(ev.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const favorite = !!favorites?.find((f) => f.eventId === ev.id);

  return (
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
          <CardDescription>{ev.description}</CardDescription>
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
          <Button variant="secondary" className="px-3 shadow-none">
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">View</span>
          </Button>
          <Button
            variant="secondary"
            className="px-3 shadow-none"
            disabled={favoritesPending}
            onClick={(e) => save(e)}
          >
            {fetching || favoritesPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <StarIcon
                className={`${favorite ? "fill-white" : ""} mr-2 h-4 w-4`}
              />
            )}
            {fetching ? "" : favorite ? "Unsave" : "Save"}
          </Button>
          <Button
            variant="secondary"
            className="px-3 shadow-none"
            onClick={(e) => donwloadIcal(e)}
          >
            <CloudDownloadIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">Download .ics</span>
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
}
