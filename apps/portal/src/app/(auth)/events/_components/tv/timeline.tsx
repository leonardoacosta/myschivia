import { addDays, format } from "date-fns";
import {
  TimelineBox,
  TimelineDivider,
  TimelineDividers,
  TimelineTime,
  TimelineWrapper,
  useTimeline,
} from "planby";

export function Timeline({
  isBaseTimeFormat,
  isSidebar,
  dayWidth,
  hourWidth,
  numberOfHoursInDay,
  offsetStartHoursRange,
  sidebarWidth,
  startDate,
  ...rest
}: any) {
  const { time, dividers, formatTime } = useTimeline(
    numberOfHoursInDay,
    isBaseTimeFormat,
  );

  const renderTime = (index: number) => {
    let time = index + offsetStartHoursRange;
    const mod = time % 24;
    const isMidnight = mod === 0;
    const days = Math.floor(time / 24);
    if (mod) time = mod;

    if (isMidnight) {
      return (
        <TimelineBox key={index} width={hourWidth}>
          <TimelineTime className="w-full text-center font-bold text-primary">
            {format(addDays(startDate, days), "eee")}
          </TimelineTime>
          <TimelineDividers>{renderDividers()}</TimelineDividers>
        </TimelineBox>
      );
    }

    return (
      <TimelineBox key={index} width={hourWidth}>
        <TimelineTime className="w-full text-center text-xs text-secondary-foreground">
          {formatTime(time).toLowerCase()}
        </TimelineTime>
        <TimelineDividers>{renderDividers()}</TimelineDividers>
      </TimelineBox>
    );
  };

  const renderDividers = () =>
    dividers.map((_, index) => (
      <TimelineDivider key={index} width={hourWidth} />
    ));

  return (
    <TimelineWrapper
      dayWidth={dayWidth}
      sidebarWidth={sidebarWidth}
      isSidebar={isSidebar}
    >
      {time.map((_, index) => renderTime(index))}
    </TimelineWrapper>
  );
}
