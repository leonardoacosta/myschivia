"use client";

import { createContext, useState } from "react";

import type { RouterOutputs } from "@tribal-cities/api";

import BurnSelect from "~/app/_components/burn-select/burn-join";
import { api } from "~/trpc/react";

interface BurnContextType {
  burnYearsJoined: RouterOutputs["burn"]["joined"];
  burnYearId: string | null;
  setBurnYearId: (burnId: string | null) => void;
  join: boolean | null;
  setJoin: (create: boolean | null) => void;
}

export const BurnContext = createContext<BurnContextType>({
  burnYearsJoined: [],
  burnYearId: null,
  setBurnYearId: () => {},
  join: false,
  setJoin: () => {},
});

export default function Burn({ children }: { children: React.ReactNode }) {
  const [burnYearsJoined] = api.burn.joined.useSuspenseQuery();
  const [burnYearId, setBurnYearId] = useState<string | null>(null);
  const [join, setJoin] = useState<boolean | null>(false);

  return (
    <BurnContext.Provider
      value={{
        burnYearsJoined,
        burnYearId,
        setBurnYearId,
        join,
        setJoin,
      }}
    >
      {join ? <BurnSelect /> : children}
    </BurnContext.Provider>
  );
}
