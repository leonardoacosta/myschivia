import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import type { BurnType } from "@tribal-cities/db/schema";
import { cn } from "@tribal-cities/ui";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@tribal-cities/ui/context-menu";

// import { Album } from "../data/albums"
// import { playlists } from "../data/playlists"

interface BurnSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  album: BurnType;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function BurnCard({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: BurnSelectProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        {/* <Image
              src={album.cover}
              alt={album.name}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
              )}
            /> */}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{album.name}</h3>
        {/* <p className="text-xs text-muted-foreground">{album.endTime}</p>Burn.startDate */}
      </div>
    </div>
  );
}

export default function BurnSelect() {
  return <></>;
}
