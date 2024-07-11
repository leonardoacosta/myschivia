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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {camps.map((camp) => (
                <TableRow
                  onClick={() => {
                    if (auth?.user.id === camp.createdById)
                      router.push(`/camps/edit/${camp.id}`);
                    else router.push(`/camps/view/${camp.id}`);
                  }}
                >
                  <TableCell className="font-medium">{camp.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{camp.type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
