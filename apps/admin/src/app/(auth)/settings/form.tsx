"use client";

import { usePathname, useRouter } from "next/navigation";

import type { RouterOutputs } from "@tribal-cities/api";
import { UpdateUserSchema } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@tribal-cities/ui/form";
import { Input } from "@tribal-cities/ui/input";
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

export default function EditUserForm({
  user,
}: {
  user: RouterOutputs["user"]["byId"];
}) {
  const pathname = usePathname();
  const returningUser = pathname.includes("/settings");
  const router = useRouter();
  const form = useForm({
    schema: UpdateUserSchema,
    defaultValues: user,
  });

  const updateUser = api.user.update.useMutation({
    onMutate: () => {
      toast.info("Updating Profile....");
    },
    onSuccess: async () => {
      toast.success("Profile Updated");
      router.refresh();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to event"
          : "Failed to update profile",
      );
    },
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
      <div className="grid gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              updateUser.mutate(data);
            })}
          >
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Burn Name</CardTitle>
                <CardDescription>
                  The name you want us to address you by.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="alias"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {!returningUser && (
                        <FormDescription className="underline">
                          You must fill enter a burn name or your preferred name
                          to continue.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving..." : "Save"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
