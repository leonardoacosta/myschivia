"use client";

import { useRouter } from "next/navigation";

import type { RouterOutputs } from "@tribal-cities/api";
import { CampType, UpdateCampSchema } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
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
  FormLabel,
  FormMessage,
  useForm,
} from "@tribal-cities/ui/form";
import { Input } from "@tribal-cities/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tribal-cities/ui/select";
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

export default function EditCampForm({
  camp,
}: {
  camp: RouterOutputs["camp"]["byId"];
}) {
  const router = useRouter();
  const form = useForm({
    schema: UpdateCampSchema,
    defaultValues: camp,
  });

  const utils = api.useUtils();
  const deleteCamp = api.camp.delete.useMutation({
    onSuccess: async () => {
      toast.success("Camp deleted");
      await utils.camp.invalidate();
      form.reset();
      router.push("/camps");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to event"
          : "Failed to update event",
      );
    },
  });
  const updateCamp = api.camp.update.useMutation({
    onMutate: (data) => {
      toast.info("Updating Camp....");
    },
    onSuccess: async () => {
      toast.success("Camp Updated");
      await utils.camp.invalidate();
      form.reset();
      router.push("/camps");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to camp"
          : "Failed to update camp",
      );
    },
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Camp</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex w-full max-w-2xl flex-col gap-4"
              onSubmit={form.handleSubmit((data) => {
                updateCamp.mutate(data);
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                      What is the name of your event?
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormDescription>
                      Tell us about your event in a few words
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormDescription>
                      What type of event are you creating?
                    </FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CampType.enumValues.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={updateCamp.isPending}>
                {updateCamp.isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <CardFooter>
        <Button
          variant="destructive"
          onClick={() => {
            deleteCamp.mutate(camp!.id);
          }}
          disabled={deleteCamp.isPending}
        >
          {deleteCamp.isPending ? "Deleting..." : "Delete Camp"}
        </Button>
      </CardFooter>
    </main>
  );
}
