"use client";

import { useContext } from "react";

import { BurnContext } from "~/context/burn-context";
import { api } from "~/trpc/react";
import EditBurnForm from "./form";

export default function BurnSettings() {
  const { burnYearId } = useContext(BurnContext);
  const { data: burnYear, isPending } = api.burn.burnYearById.useQuery(
    { id: burnYearId! },
    { enabled: !!burnYearId },
  );

  if (isPending) return <div>Loading...</div>;

  return <EditBurnForm burn={burnYear} />;
}
