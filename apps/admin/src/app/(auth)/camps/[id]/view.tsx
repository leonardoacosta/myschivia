"use client";

import type { RouterOutputs } from "@tribal-cities/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { Separator } from "@tribal-cities/ui/separator";

export default function ViewPost({
  camp,
}: {
  camp: RouterOutputs["camp"]["byId"];
}) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{camp?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{camp?.description}</CardDescription>
          <Separator />
          <CardDescription>
            Managed by: {camp?.createdBy?.email}
          </CardDescription>
        </CardContent>
      </Card>
    </main>
  );
}
