"use client";

import { createContext, useState } from "react";

import type { RouterOutputs } from "@tribal-cities/api";

import BurnSelect from "~/app/_components/burn-select/burn-join";
import { api } from "~/trpc/react";

interface BurnContextType {
  burns: RouterOutputs["burn"]["allYears"];
  burnId: string | null;
  setBurnId: (burnId: string | null) => void;
  join: boolean | null;
  setJoin: (create: boolean | null) => void;
}

export const BurnContext = createContext<BurnContextType>({
  burns: [],
  burnId: null,
  setBurnId: () => {},
  join: false,
  setJoin: () => {},
});

export default function Burn({ children }: { children: React.ReactNode }) {
  const [burns] = api.burn.allYears.useSuspenseQuery();
  const [burnId, setBurnId] = useState<string | null>(null);
  const [join, setJoin] = useState<boolean | null>(false);

  return (
    <BurnContext.Provider
      value={{
        burns,
        burnId,
        setBurnId,
        join,
        setJoin,
      }}
    >
      {join ? <BurnSelect /> : children}
    </BurnContext.Provider>
  );
}
