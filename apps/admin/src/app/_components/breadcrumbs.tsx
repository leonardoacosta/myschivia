"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@tribal-cities/ui/breadcrumb";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((part, index) => {
          if (part.toLowerCase() === "edit" || part.toLowerCase() === "view")
            return null;
          return (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={
                      index === 0
                        ? `/${part}`
                        : `/${parts.slice(0, index + 1).join("/")}`
                    }
                    className="capitalize"
                  >
                    {part}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
