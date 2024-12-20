"use client";

import { useParams } from "next/navigation";

import { api } from "~/trpc/react";
import EditEventForm from "./form";
import ViewPost from "./view";

export default function CreatePostForm() {
  const { id } = useParams();
  const { data: user, isPending: isPendingUser } =
    api.auth.getSession.useQuery();
  const { data: ev, isPending: isPendingEvent } = api.event.byId.useQuery({
    id: id as string,
  });

  if (isPendingEvent || isPendingUser) return <div>Loading...</div>;

  if (user?.user.id === ev?.createdById) return <EditEventForm ev={ev} />;
  if (user?.user.id !== ev?.createdById) return <ViewPost ev={ev} />;
}
