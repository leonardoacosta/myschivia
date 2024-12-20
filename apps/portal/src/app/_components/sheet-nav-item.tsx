"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Cog, ComponentIcon, Hand, Home, Map } from "lucide-react";

export default function SheetNavItem({
  href,
  name,
}: {
  href: string;
  name: string;
}) {
  const pathname = usePathname();

  // Function to check if the link is external
  const isExternalLink =
    href.startsWith("http://") || href.startsWith("https://");

  // Determine if the current route matches the link's href
  const isActive = !isExternalLink && pathname === href;

  // Choose the appropriate icon based on the name
  const IconComponent =
    name === "Home"
      ? Home
      : name === "Camps"
        ? ComponentIcon
        : name === "Events"
          ? Calendar
          : name === "Volunteer"
            ? Hand
            : name === "City Planning"
              ? Map
              : Cog;

  const className = `flex items-center gap-4 px-2.5 ${
    isActive ? "text-foreground" : "text-muted-foreground"
  } hover:text-foreground`;

  // If it's an external link, use <a> tag
  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <IconComponent className="h-5 w-5" />
        {name}
      </a>
    );
  }

  // For internal links, use Next.js Link component
  return (
    <Link href={href} className={className}>
      <IconComponent className="h-5 w-5" />
      {name}
    </Link>
  );
}
