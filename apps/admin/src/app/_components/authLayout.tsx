import * as React from "react";

import SideNav from "./side-nav";
import TopNav from "./top-nav";

export function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <TopNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          {props.children}
        </main>
      </div>
    </div>
  );
}
