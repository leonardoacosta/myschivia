import Image from "next/image";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { auth, signOut } from "@tribal-cities/auth";
import { Button } from "@tribal-cities/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tribal-cities/ui/dropdown-menu";
import Logo from "@tribal-cities/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@tribal-cities/ui/sheet";

import Breadcrumbs from "./breadcrumbs";
import SheetNavItem from "./sheet-nav-item";

export default async function TopNav() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Logo className="pt-2 transition-all group-hover:scale-110" />
              {/* <Package2 className="h-5 w-5 transition-all group-hover:scale-110" /> */}
              <span className="sr-only">Acme Inc</span>
            </Link>
            <SheetNavItem href="/" name="Home" />
            {/* <SheetNavItem href="/camps" name="Camps" /> */}
            <SheetNavItem href="/events" name="Events" />
            <SheetNavItem
              href="https://myschievia.playa.software/"
              name="Volunteer"
            />
            {/* <SheetNavItem href="/city-planning" name="City Planning" /> */}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumbs />
      <div className="relative ml-auto flex-1 md:grow-0"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={session?.user.image ?? ""}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form>
              <Button
                size="lg"
                variant="ghost"
                formAction={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
