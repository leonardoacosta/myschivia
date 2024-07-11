"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ComponentIcon, Hand, Map, Settings } from "lucide-react";
import { JsxElement } from "typescript";

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
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Logo className="pt-2 transition-all group-hover:scale-110" />
          <span className="sr-only">Myschivia</span>
        </Link>
        <NavItem href="/camps" Icon={ComponentIcon} name="Camps" />
        <NavItem href="/events" Icon={Calendar} name="Events" />
        <NavItem href="/volunteer" Icon={Hand} name="Volunteer" />
        <NavItem href="/city-planning" Icon={Map} name="City Planning" />
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
}: {
  href: string;
  Icon: any;
  name: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
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
      <TooltipContent side="right">{name}</TooltipContent>
    </Tooltip>
  );
}
