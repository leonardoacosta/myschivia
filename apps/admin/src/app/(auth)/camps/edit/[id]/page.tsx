"use client";

import { useParams } from "next/navigation";

import { api } from "~/trpc/react";
import EditCampForm from "./form";

export default function CreateCampForm() {
  const { id } = useParams();
  const { data: camp, isPending } = api.camp.byId.useQuery({
    id: id as string,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <EditCampForm camp={camp} />;
}
