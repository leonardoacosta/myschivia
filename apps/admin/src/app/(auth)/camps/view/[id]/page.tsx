"use client";

import { useParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { Separator } from "@tribal-cities/ui/separator";

import { api } from "~/trpc/react";

export default function ViewPost() {
  const { id } = useParams();
  const { data: ev } = api.camp.byId.useQuery({ id: id as string });

  if (!ev) return <p>Loading...</p>;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{ev.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{ev.description}</CardDescription>
          <Separator />
          <CardDescription>Managed by: {ev.createdBy?.email}</CardDescription>
        </CardContent>
      </Card>
    </main>
  );
}
