import { auth } from "@tribal-cities/auth";

import { api, HydrateClient } from "~/trpc/server";
import { AuthLayout } from "./_components/auth-layout";
import { AuthShowcase } from "./_components/auth-showcase";
import Dashboard from "./_components/dashboard";

export const runtime = "edge";

export default async function HomePage() {
  const session = await auth();

  if (!session) return <AuthShowcase />;

  // You can await this here if you don't want to show Suspense fallback below
  void api.burn.all.prefetch();
  void api.event.all.prefetch();
  void api.camp.all.prefetch();

  return (
    <HydrateClient>
      <AuthLayout>
        <Dashboard />
      </AuthLayout>
    </HydrateClient>
  );
}
