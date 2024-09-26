"use client";

import Link from "next/link";
import { Calendar, Hand } from "lucide-react";

import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tribal-cities/ui/dialog";

import { api } from "~/trpc/react";
import MainMap from "./map";

export default function Dashboard() {
  const { data: events } = api.event.count.useQuery();
  const { data: camps } = api.camp.all.useQuery();
  const { data: burners } = api.user.getBurners.useQuery();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Welcome to Tribal Cities</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                <Dialog>
                  <DialogTrigger className="underline">
                    What is tribal cities?
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>What is this</DialogTitle>
                      <DialogDescription>
                        Tribal Cities is a platform for organizing events and
                        camps for regional burns built by a burner for burners.
                      </DialogDescription>
                      <DialogDescription>
                        We have no affiliation with any specific burn, but I aim
                        to provide a platform that can be used by any burn.
                      </DialogDescription>
                      <DialogTitle>Who am I</DialogTitle>
                      <DialogDescription>
                        My burn name is Raptor, I currently reside in the DFW
                        area. My first and home burn is Myschievia.
                      </DialogDescription>
                      <DialogTitle>What do I want</DialogTitle>
                      <DialogDescription>
                        I want to be able to provide a platform as a gift to the
                        community. I want to keep building Tribal Cities with
                        feedback from the community while adhering to the 10
                        principles.
                      </DialogDescription>
                      <DialogTitle>What do I want in return</DialogTitle>
                      <DialogDescription>
                        I want to give Tribal Cities as is with no expectation
                        of anything in return. I do ask that if you use this
                        platform, please provide feedback. I want to make this
                        platform better for the community.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-center">Events</CardDescription>
              <CardTitle className="text-center text-4xl">{events}</CardTitle>
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
