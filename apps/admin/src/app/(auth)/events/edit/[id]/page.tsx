"use client";

import { useParams } from "next/navigation";

import { api } from "~/trpc/react";
import EditEventForm from "./form";

export default function CreatePostForm() {
  const { id } = useParams();
  const { data: ev, isPending } = api.event.byId.useQuery({ id: id as string });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <EditEventForm ev={ev} />;
}
