"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tribal-cities/ui/tooltip";

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

  // Detect if the link is external
  const isExternalLink =
    href.startsWith("http://") || href.startsWith("https://");

  // Determine if the current route matches the link's href
  let isActive = false;
  if (!isExternalLink) {
    if (href === "/") {
      isActive = pathname === "/";
    } else {
      isActive = pathname.startsWith(href);
    }
  }

  // Define classes for styling
  const baseClass =
    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8";
  const activeClass = "bg-accent text-accent-foreground hover:text-foreground";
  const inactiveClass = "text-muted-foreground hover:text-foreground";
  const disabledClass = "cursor-not-allowed opacity-50";

  // Combine classes based on state
  const className = `${baseClass} ${isActive ? activeClass : inactiveClass} ${
    disabled ? disabledClass : ""
  }`;

  // Content of the link/button
  const linkContent = (
    <>
      <Icon className="h-5 w-5" />
      <span className="sr-only">{name}</span>
    </>
  );

  // Handle disabled state
  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className} aria-disabled="true">
            {linkContent}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{name} - Coming Soon...</TooltipContent>
      </Tooltip>
    );
  }

  // Render external links with <a>
  if (isExternalLink) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {linkContent}
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    );
  }

  // Render internal links with Next.js Link
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className={className}>
          {linkContent}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{name}</TooltipContent>
    </Tooltip>
  );
}

export default NavItem;
