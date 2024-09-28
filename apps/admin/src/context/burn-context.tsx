"use client";

import { createContext, useState } from "react";

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
}

export const BurnContext = createContext<BurnContextType>({
  burnYearsJoined: [],
  burnYearId: null,
  setBurnYearId: () => {},
  join: false,
  setJoin: () => {},
  create: false,
  setCreate: () => {},
});

export default function Burn({ children }: { children: React.ReactNode }) {
  const [burnYearsJoined] = api.burn.joined.useSuspenseQuery();
  const [burnYearId, setBurnYearId] = useState<string | null>(null);
  const [join, setJoin] = useState<boolean | null>(false);
  const [create, setCreate] = useState<boolean | null>(false);

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
      }}
    >
      {true ? <BurnCreate /> : join ? <BurnSelect /> : children}
    </BurnContext.Provider>
  );
}
