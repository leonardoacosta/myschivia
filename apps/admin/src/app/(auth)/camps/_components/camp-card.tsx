"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as ics from "ics";
import {
  CloudDownloadIcon,
  Eye,
  Loader2,
  Pin,
  StarIcon,
  Tent,
  User,
} from "lucide-react";

import { RouterOutputs } from "@tribal-cities/api";
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

interface CampCardProps {
  camp: RouterOutputs["camp"]["all"][number];
}

export default function CampCard({ camp }: CampCardProps) {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();

  return (
    <Card
      onClick={() => {
        if (auth?.user.id === camp.createdById)
          router.push(`/camps/edit/${camp.id}`);
        else router.push(`/camps/view/${camp.id}`);
      }}
      className="hover:cursor-pointer hover:bg-muted/50"
    >
      <CardHeader className="grid grid-cols-[1fr_50px] items-start gap-4 space-y-0 sm:grid-cols-[1fr_150px]">
        <div className="space-y-1">
          <CardTitle>{camp.name}</CardTitle>
          <CardDescription>{camp.description}</CardDescription>
          <div className="hidden space-x-4 pt-4 text-sm text-muted-foreground md:flex">
            <div className="flex items-center">
              {/* <TypeBadge type={camp.type} /> */}
            </div>
            {/* <div className="flex items-center">
              <User className="mr-1 h-3 w-3" />
              {ev.hostName || ev.user.alias}
            </div>
            {ev.camp && (
              <div className="flex items-center">
                <Tent className="mr-1 h-3 w-3" />
                {ev.camp.name}
              </div>
            )}
            {ev.location && (
              <div className="flex items-center">
                <Pin className="mr-1 h-3 w-3" />
                {ev.location}
              </div>
            )} */}
          </div>
        </div>
      </CardHeader>
      {/* <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:hidden">
          <div className="flex items-center">
            <TypeBadge type={ev.type} />
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            {ev.hostName || ev.user.alias}
          </div>
          <div className="flex items-center">
            <Tent className="mr-1 h-3 w-3" />
            {ev.campName || "Self"}
          </div>
        </div>
        <div className="mt-2 flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              From:
              <span>
                {" "}
                {format(ev.startDate, "EEE")} @{" "}
                {format(startWithTime(), "h:mm a")}
              </span>
            </span>
            <span>
              To:
              <span>
                {" "}
                {format(ev.endDate, "EEE")} @ {format(endWithTime(), "h:mm a")}
              </span>
            </span>
          </div>
        </div>
      </CardContent> */}
    </Card>
  );
}
