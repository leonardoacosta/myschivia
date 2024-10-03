"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { api } from "~/trpc/react";
import CampCard from "./_components/camp-card";

export default function Page() {
  const router = useRouter();
  const { data: auth } = api.auth.getSession.useQuery();
  const [camps] = api.camp.all.useSuspenseQuery();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Link href="/camps/create">
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Register Camp
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Camps</CardTitle>
          <CardDescription>All the camps that are registered</CardDescription>
        </CardHeader>
        <CardContent className="flex-row space-y-4">
          {camps.map((camp) => (
            <CampCard camp={camp} />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
