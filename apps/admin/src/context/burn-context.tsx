"use client";

import { createContext, useEffect, useState } from "react";

import type { RouterOutputs } from "@tribal-cities/api";

import BurnCreate from "~/app/_components/burn-select/burn-create";
import BurnSelect from "~/app/_components/burn-select/burn-join";
import { api } from "~/trpc/react";

interface BurnContextType {
  burnYearsJoined: RouterOutputs["burn"]["joined"];
  burnYearId: string | null;
  setBurnYearId: (burnId: string | null) => void;
  join: boolean | null;
  setJoin: (create: boolean | null) => void;
  create: boolean | null;
  setCreate: (create: boolean | null) => void;
  announcements?: RouterOutputs["announcement"]["all"];
}

export const BurnContext = createContext<BurnContextType>({
  burnYearsJoined: [],
  burnYearId: null,
  setBurnYearId: () => {},
  join: false,
  setJoin: () => {},
  create: false,
  setCreate: () => {},
  announcements: [],
});

export default function Burn({ children }: { children: React.ReactNode }) {
  const [burnYearId, setBurnYearId] = useState<string | null>(null);
  const [join, setJoin] = useState<boolean | null>(false);
  const [create, setCreate] = useState<boolean | null>(false);
  const [burnYearsJoined] = api.burn.joined.useSuspenseQuery();
  const { data: announcements, refetch } = api.announcement.all.useQuery(
    burnYearId!,
    { enabled: !!burnYearId },
  );

  useEffect(() => {
    if (burnYearId) localStorage.setItem("burnYearId", burnYearId);
  }, [burnYearId]);

  useEffect(() => {
    const burnYearId = localStorage.getItem("burnYearId");
    if (burnYearId) {
      setBurnYearId(burnYearId);
      refetch();
    }
  }, []);

  return (
    <BurnContext.Provider
      value={{
        burnYearsJoined,
        burnYearId,
        setBurnYearId,
        join,
        setJoin,
        create,
        setCreate,
        announcements,
      }}
    >
      {create ? <BurnCreate /> : join ? <BurnSelect /> : children}
    </BurnContext.Provider>
  );
}
