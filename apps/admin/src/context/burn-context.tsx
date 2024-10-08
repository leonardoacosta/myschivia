"use client";

import { createContext, useEffect, useState } from "react";

import type { RouterOutputs } from "@tribal-cities/api";
import { Label } from "@tribal-cities/ui/label";
import { toast } from "@tribal-cities/ui/toast";

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
  // const [dismissed, setDismissed] = useState<string[]>([]);
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

  useEffect(() => {
    if (burnYearId && announcements) {
      let dismissed = [] as string[];
      const dismissedJson = localStorage.getItem(
        `dismissedAnnouncements-${burnYearId}`,
      );

      if (dismissedJson) dismissed = JSON.parse(dismissedJson) as string[];

      for (const announcement of announcements) {
        if (!dismissed.includes(announcement.id)) {
          toast.info(
            announcement.message,
            // <div>
            //   <Label>{announcement.title}</Label>
            //   <p>{announcement.message}</p>
            // </div>,
            {
              duration: undefined,
              action: {
                label: "Dismiss",
                onClick: () => {
                  const dismissedJson = localStorage.getItem(
                    `dismissedAnnouncements-${burnYearId}`,
                  );
                  const dismissed = dismissedJson
                    ? JSON.parse(dismissedJson)
                    : [];
                  localStorage.setItem(
                    `dismissedAnnouncements-${burnYearId}`,
                    JSON.stringify([...dismissed, announcement.id]),
                  );
                },
              },
            },
          );
        }
      }
    }
  }, [announcements]);

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
