import { useMemo } from "react";
import { Epg, Layout, useEpg } from "planby";

import { TabsContent } from "@tribal-cities/ui/tabs";

import { api } from "~/trpc/react";
import { ChannelItem } from "./channel-item";
import { ProgramItem } from "./program-item";
import { theme } from "./theme";
import { Timeline } from "./timeline";

export default function Tv() {
  const { data: schedule, isPending } = api.event.eventsForTv.useQuery();

  const channelsData = useMemo(
    () => schedule?.channels || [],
    [schedule?.channels],
  );
  const epgData = useMemo(
    () => schedule?.programming || [],
    [schedule?.programming],
  );
  const startDate = new Date("2024-10-10T00:00:00");

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: channelsData,
    epg: epgData,
    dayWidth: 12200,
    sidebarWidth: 100,
    itemHeight: 70,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: startDate,
    endDate: "2024-10-14T23:59:00",
    isBaseTimeFormat: true,
    theme,
    // overlap: true,
  });

  return (
    <TabsContent value="tv">
      <div style={{ height: "80vh", width: "85vw" }}>
        <Epg isLoading={isPending} {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            renderTimeline={(props) => (
              <Timeline {...props} startDate={startDate} />
            )}
            renderProgram={({ program, ...rest }) => (
              <ProgramItem key={program.data.id} program={program} {...rest} />
            )}
            renderChannel={({ channel }) => (
              <ChannelItem key={channel.uuid} channel={channel} />
            )}
          />
        </Epg>
      </div>
    </TabsContent>
  );
}
