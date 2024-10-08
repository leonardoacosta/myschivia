"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";

import { CreateAnnouncementSchema } from "@tribal-cities/db/schema";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@tribal-cities/ui/form";
import { Input } from "@tribal-cities/ui/input";
import { toast } from "@tribal-cities/ui/toast";

import { BurnContext } from "~/context/burn-context";
import { api } from "~/trpc/react";

export default function Announcement() {
  const { burnYearId } = useContext(BurnContext);
  const router = useRouter();
  const form = useForm({
    schema: CreateAnnouncementSchema,
    defaultValues: {
      message: "",
      title: "",
      releaseDate: new Date(),
      burnYearId: burnYearId,
    },
  });

  const { mutate, isPending } = api.announcement.create.useMutation({
    onMutate: () => {
      toast.info("Creating announcement....");
    },
    onSuccess: async () => {
      toast.success("Profile Updated");
      router.push("/");
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
              mutate(data);
            })}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>
                  Only burners in the event can see the announcement.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-2 flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={format(field.value!, "yyyy-MM-dd")}
                          onChange={(e) =>
                            field.onChange(new Date(addDays(e.target.value, 1)))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
