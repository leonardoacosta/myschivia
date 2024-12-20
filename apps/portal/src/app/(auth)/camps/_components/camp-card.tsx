"use client";

import Link from "next/link";

import type { RouterOutputs } from "@tribal-cities/api";
import { CampTypeBadge } from "@tribal-cities/ui/camp-type-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

interface CampCardProps {
  camp: RouterOutputs["camp"]["all"][0];
}

export default function CampCard({ camp }: CampCardProps) {
  return (
    <Link href={`/camps/${camp.id}`} className="block">
      <Card className="hover:cursor-pointer hover:bg-muted/50">
        <CardHeader className="grid grid-cols-[1fr_50px] items-start gap-4 space-y-0 sm:grid-cols-[1fr_150px]">
          <div className="space-y-1">
            <CardTitle>{camp.name}</CardTitle>
            <CardDescription>{camp.description}</CardDescription>
            <CardContent>{camp.slogan}</CardContent>
            <div className="hidden space-x-4 pt-4 text-sm text-muted-foreground md:flex">
              <div className="flex items-center">
                {camp.tags.map((tag) => (
                  <CampTypeBadge type={tag.tag} />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
