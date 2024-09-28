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
  api.burn.joined.prefetch();
  api.user.getBurners.prefetch();
  api.event.getFavorites.prefetch({ day: null });
  api.event.count.prefetch();
  api.event.all.prefetch({ day: null });
  api.camp.all.prefetch();
  api.cityPlanning.getGoogleMaps.prefetch();
  api.cityPlanning.getZones.prefetch();

  return (
    <HydrateClient>
      <AuthLayout>
        <Dashboard />
      </AuthLayout>
    </HydrateClient>
  );
}
