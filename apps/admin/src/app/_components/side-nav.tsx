"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Cog,
  ComponentIcon,
  Hand,
  Home,
  Map,
  Megaphone,
  Settings,
} from "lucide-react";

import { Separator } from "@tribal-cities/ui/separator";

import { api } from "~/trpc/react";
import { BurnSwitcher } from "./burn-select/burn-switcher";
import NavItem from "./nav-item";

export default function SideNav() {
  const { data: session } = api.auth.getSession.useQuery();
  return (
    <aside className="z-100 fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <BurnSwitcher />
        <NavItem href="/" Icon={Home} name="Home" />
        <NavItem href="/camps" Icon={ComponentIcon} name="Camps" />
        <NavItem href="/events" Icon={Calendar} name="Events" />
        <NavItem
          href="https://myschievia.playa.software/"
          Icon={Hand}
          name="Volunteer"
        />
        {/* <NavItem href="/volunteer" Icon={Hand} name="Volunteer" disabled /> */}
        <Separator />

        {session?.user.email?.includes("leo@leonardoacosta.dev") && (
          <>
            <NavItem href="/volunteer" Icon={Hand} name="Volunteer" />
            <NavItem href="/city-planning" Icon={Map} name="City Planning" />
            <NavItem href="/burn-settings" Icon={Cog} name="Settings" />
            <NavItem
              href="/announcement"
              Icon={Megaphone}
              name="Announcement"
            />
          </>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <NavItem href="/settings" Icon={Settings} name="Settings" />
      </nav>
    </aside>
  );
}
