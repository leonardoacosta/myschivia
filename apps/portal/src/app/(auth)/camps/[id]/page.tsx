"use client";

import { useParams } from "next/navigation";

import { api } from "~/trpc/react";
import EditCampForm from "./form";
import ViewPost from "./view";

export default function CreateCampForm() {
  const { id } = useParams();
  const { data: user, isPending: isPendingUser } =
    api.auth.getSession.useQuery();
  const { data: camp, isPending: isPendingCamp } = api.camp.byId.useQuery({
    id: id as string,
  });

  if (isPendingCamp || isPendingUser) return <div>Loading...</div>;

  if (user?.user.id === camp?.createdById) return <EditCampForm camp={camp} />;
  if (user?.user.id !== camp?.createdById) return <ViewPost camp={camp} />;
}
