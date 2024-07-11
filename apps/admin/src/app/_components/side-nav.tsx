import Link from "next/link";
import { Calendar, ComponentIcon, Hand, Home, Settings } from "lucide-react";

import Logo from "@tribal-cities/ui/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tribal-cities/ui/tooltip";

export default function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Logo className="pt-2 transition-all group-hover:scale-110" />
          <span className="sr-only">Myschivia</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/camps"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <ComponentIcon className="h-5 w-5" />
              <span className="sr-only">Camps</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Camps</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/events"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Calendar className="h-5 w-5" />
              <span className="sr-only">Events</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Events</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/volunteer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Hand className="h-5 w-5" />
              <span className="sr-only">Volunteer</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Volunteer</TooltipContent>
        </Tooltip>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
