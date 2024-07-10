import { Suspense } from "react";

import { auth } from "@tribal-cities/auth";

import { api, HydrateClient } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import { AuthLayout } from "./_components/authLayout";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

export const runtime = "edge";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to Myschivia
          </h1>
          <AuthShowcase />
        </div>
      </main>
    );
  }

  // You can await this here if you don't want to show Suspense fallback below
  void api.event.all.prefetch();
  void api.camp.all.prefetch();

  return (
    <HydrateClient>
      <AuthLayout>
        <CreatePostForm />
      </AuthLayout>
    </HydrateClient>
  );
}
