"use client";

import { api } from "~/trpc/react";
import EditUserForm from "./form";

export default function Page() {
  const { data: user, isPending } = api.user.byId.useQuery();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <EditUserForm user={user} />;
}
