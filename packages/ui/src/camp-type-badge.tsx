import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@tribal-cities/ui";

const typeBadgeVariants = cva(
  "inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      type: {
        Food: "bg-[#831D2F] text-white hover:bg-opacity-80",
        Games: "bg-[#3924f9] text-white hover:bg-opacity-80",
        Bar: "bg-[#f9f924] text-black hover:bg-opacity-80",
        "Tea or Coffee (non-alcoholic)":
          "bg-[#f9f924] text-black hover:bg-opacity-80",
        Sound: "bg-[#564f15] text-white hover:bg-opacity-80",
        Dance: "bg-[#09f0f0] text-white hover:bg-opacity-80",
        Chill: "bg-[#2d9829] text-white hover:bg-opacity-80",
        Lounge: "bg-[#f92424] text-white hover:bg-opacity-80",
        Interactive: "bg-[#f9f4f4] text-white hover:bg-opacity-80",
        Performance: "bg-[#09f0f0] text-white hover:bg-opacity-80",
        Screening: "bg-[#f9f924] text-black hover:bg-opacity-80",
        Transport: "bg-[#f924f9] text-white hover:bg-opacity-80",
        Storytelling: "bg-[#B2662B] text-white hover:bg-opacity-80",
        Service: "bg-[#421AF0] text-white hover:bg-opacity-80",
        "Self Expression": "bg-[#f9f4f4] text-white hover:bg-opacity-80",
        Art: "bg-[#f92424] text-white hover:bg-opacity-80",
        Yoga: "bg-[#d82bff] text-white hover:bg-opacity-80",
        Healing: "bg-[#5B85AA] text-white hover:bg-opacity-80",
        Fitness: "bg-[#414770] text-white hover:bg-opacity-80",
        Workshop: "bg-[#fff15c] text-white hover:bg-opacity-80",
        Misc: "bg-[#d82bff] text-white hover:bg-opacity-80",
        Networking: "bg-[#fff15c] text-white hover:bg-opacity-80",
        Gifting: "bg-[#586340] text-white hover:bg-opacity-80",
        "First Aid": "bg-[#475029] text-white hover:bg-opacity-80",
        Kink: "bg-[#9E9DAB] text-white hover:bg-opacity-80",
      },
    },
    defaultVariants: {
      type: "Misc",
    },
  },
);

export interface CampTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typeBadgeVariants> {}

function CampTypeBadge({ className, type, ...props }: CampTypeBadgeProps) {
  return (
    <div className={cn(typeBadgeVariants({ type }), className)} {...props}>
      {type}
    </div>
  );
}

export { CampTypeBadge, typeBadgeVariants };
