"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ComponentIcon,
  Hand,
  Home,
  LineChart,
  Map,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";

export default function SheetNavItem({
  href,
  name,
}: {
  href: string;
  name: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={isActive ? "#" : href}
      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
    >
      {name === "Home" ? (
        <Home className="h-5 w-5" />
      ) : name === "Camps" ? (
        <ComponentIcon className="h-5 w-5" />
      ) : name === "Events" ? (
        <Calendar className="h-5 w-5" />
      ) : name === "Volunteer" ? (
        <Hand className="h-5 w-5" />
      ) : name === "City Planning" ? (
        <Map className="h-5 w-5" />
      ) : (
        <Package2 className="h-5 w-5" />
      )}
      {name}
    </Link>
  );
}
