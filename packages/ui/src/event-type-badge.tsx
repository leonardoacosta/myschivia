import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@tribal-cities/ui";

const typeBadgeVariants = cva(
  "inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      type: {
        Misc: "bg-[#d82bff] text-white hover:bg-opacity-80",
        Class: "bg-[#5B85AA] text-white hover:bg-opacity-80",
        Inclusion: "bg-[#414770] text-white hover:bg-opacity-80",
        Fire: "bg-[#ff752b] text-white hover:bg-opacity-80",
        Food: "bg-[#831D2F] text-white hover:bg-opacity-80",
        "Kid Friendly": "bg-[#C242c0] text-white hover:bg-opacity-80",
        Games: "bg-[#3924f9] text-white hover:bg-opacity-80",
        Gathering: "bg-[#fff15c] text-white hover:bg-opacity-80",
        Music: "bg-[#586340] text-white hover:bg-opacity-80",
        "Mature Audiences": "bg-[#475029] text-white hover:bg-opacity-80",
        Workshop: "bg-[#9E9DAB] text-white hover:bg-opacity-80",
        Parade: "bg-[#421AF0] text-white hover:bg-opacity-80",
        Ritual: "bg-[#B2662B] text-white hover:bg-opacity-80",
        "Self Care": "bg-[#2d9829] text-white hover:bg-opacity-80",
        Sustainability: "bg-[#564f15] text-white hover:bg-opacity-80",
        Yoga: "bg-[#5f5aba] text-white hover:bg-opacity-80",
      },
    },
    defaultVariants: {
      type: "Misc",
    },
  },
);

export interface EventTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typeBadgeVariants> {}

function EventTypeBadge({ className, type, ...props }: EventTypeBadgeProps) {
  return (
    <div className={cn(typeBadgeVariants({ type }), className)} {...props}>
      {type}
    </div>
  );
}

export { EventTypeBadge, typeBadgeVariants };
