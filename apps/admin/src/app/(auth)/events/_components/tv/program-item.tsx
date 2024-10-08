import Link from "next/link";
import { format } from "date-fns";
import {
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramImage,
  ProgramStack,
  ProgramText,
  ProgramTitle,
  useProgram,
} from "planby";

import { Label } from "@tribal-cities/ui/label";
import { Separator } from "@tribal-cities/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tribal-cities/ui/tooltip";

export const ProgramItem = ({ program, ...rest }: any) => {
  const { styles, formatTime, set12HoursTimeFormat, isLive, isMinWidth } =
    useProgram({
      program,
      ...rest,
    });

  const { data } = program;
  const { image, title, since, till, startDate, endDate, uuid, description } =
    data;

  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

  return (
    <Link href={`/events/${uuid}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ProgramBox width={styles.width} style={styles.position}>
            <ProgramContent width={styles.width} isLive={isLive}>
              <ProgramFlex>
                {/* {isLive && isMinWidth && <ProgramImage src={image} alt="Preview" />} */}
                <ProgramStack>
                  <ProgramTitle>{title}</ProgramTitle>
                  <ProgramText>
                    {startDate !== endDate ? format(startDate, "eee ") : ""}
                    {sinceTime} -{" "}
                    {startDate !== endDate ? format(endDate, "eee ") : ""}
                    {tillTime}
                  </ProgramText>
                </ProgramStack>
              </ProgramFlex>
            </ProgramContent>
          </ProgramBox>
        </TooltipTrigger>
        <TooltipContent align="start">
          <Label>{title}</Label>
          <Separator />
          <p className="max-w-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
};
