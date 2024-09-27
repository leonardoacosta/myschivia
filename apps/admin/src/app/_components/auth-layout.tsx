import { auth } from "@tribal-cities/auth";

import BurnContext from "~/context/burn-context";
import Settings from "../(auth)/settings/page";
import { AuthShowcase } from "./auth-showcase";
import SideNav from "./side-nav";
import TopNav from "./top-nav";

export async function AuthLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) return <AuthShowcase />;
  if (!session.user.alias) return <Settings />;

  return (
    <BurnContext>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <SideNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <TopNav />
          {props.children}
        </div>
      </div>
    </BurnContext>
  );
}
