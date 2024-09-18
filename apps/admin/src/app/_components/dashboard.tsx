"use client";

import Link from "next/link";
import { Calendar, Component, Hand, Map } from "lucide-react";

import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

import { api } from "~/trpc/react";
import MainMap from "./map";

export default function Dashboard() {
  const { data: events } = api.event.all.useQuery();
  const { data: camps } = api.camp.all.useQuery();
  const { data: burners } = api.user.getBurners.useQuery();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Welcome to Myschievia</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Myschievia is a regional burn event in the North Texas area.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
              <Link href="/events">
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Events
                </Button>
              </Link>
              <Link href="https://myschievia.playa.software/">
                <Button>
                  <Hand className="mr-2 h-4 w-4" />
                  Volunteer
                </Button>
              </Link>

              {/* <Button disabled>
                <Map className="mr-2 h-4 w-4" />
                Edit Map
              </Button> */}
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-center">Events</CardDescription>
              <CardTitle className="text-center text-4xl">
                {events?.length}
              </CardTitle>
            </CardHeader>
            <CardDescription className="text-center">
              <span className="ml-2 text-xs text-muted-foreground">
                Organized
              </span>
            </CardDescription>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2 text-center">
              <CardDescription className="text-center">Burners</CardDescription>
              <CardTitle className="text-center text-4xl">
                {burners ?? 0}
              </CardTitle>
            </CardHeader>
            <CardDescription className="text-center text-xs text-muted-foreground">
              <span className="ml-2 text-xs text-muted-foreground">
                In the system
              </span>
            </CardDescription>
            {/* <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter> */}
          </Card>
        </div>
        <MainMap />
      </div>
    </main>
  );
}
