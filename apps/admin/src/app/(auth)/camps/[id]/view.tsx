"use client";

import type { RouterOutputs } from "@tribal-cities/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

import CampMap from "./_components";

export default function ViewPost({
  camp,
}: {
  camp: RouterOutputs["camp"]["byId"];
}) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{camp?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{camp?.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Managed by: {camp?.createdBy?.email}
          </CardDescription>
        </CardFooter>
      </Card>
      <CampMap />
    </main>
  );
}
