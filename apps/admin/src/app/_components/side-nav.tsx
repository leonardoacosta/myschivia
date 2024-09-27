"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Map, Settings } from "lucide-react";

import Logo from "@tribal-cities/ui/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tribal-cities/ui/tooltip";

import { api } from "~/trpc/react";
import { BurnSwitcher } from "./burn-select/burn-switcher";

export default function SideNav() {
  const { data: session } = api.auth.getSession.useQuery();
  return (
    <aside className="z-100 fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <BurnSwitcher />
        {/* <NavItem href="/camps" Icon={ComponentIcon} name="Camps" /> */}
        <NavItem href="/events" Icon={Calendar} name="Events" />
        {/* <NavItem href="/volunteer" Icon={Hand} name="Volunteer" disabled /> */}
        {session?.user.email?.includes("leo") && (
          <NavItem href="/city-planning" Icon={Map} name="City Planning" />
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <NavItem href="/settings" Icon={Settings} name="Settings" />
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  Icon,
  name,
  disabled,
}: {
  href: string;
  Icon: any;
  name: string;
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={disabled ? "#" : href}
          className={
            isActive
              ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              : "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          }
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        {name}
        {disabled && "- Coming Soon..."}
      </TooltipContent>
    </Tooltip>
  );
}
