"use client";

import { useRouter } from "next/navigation";

import { RouterOutputs } from "@tribal-cities/api";
import { eventTypeEnum, UpdateEventSchema } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import { Calendar } from "@tribal-cities/ui/calendar";
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

export default function EditEventForm({
  ev,
}: {
  ev: RouterOutputs["event"]["byId"];
}) {
  const router = useRouter();
  const form = useForm({
    schema: UpdateEventSchema,
    defaultValues: ev,
  });

  const utils = api.useUtils();
  const { data: camps } = api.camp.all.useQuery();

  const updatePost = api.event.update.useMutation({
    onSuccess: async () => {
      await utils.event.invalidate();
      form.reset();
      router.push("/events");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to event"
          : "Failed to update event",
      );
    },
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          className="flex w-full max-w-2xl flex-col gap-4"
          onSubmit={form.handleSubmit((data) => {
            updatePost.mutate(data);
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
                      {eventTypeEnum.enumValues.map((type) => (
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
          {camps && camps.length > 0 && (
            <FormField
              control={form.control}
              name="campId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is this associated with a camp?</FormLabel>
                  <FormDescription>
                    * Your camp must be registered to associate it with an event
                  </FormDescription>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value ?? undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an existing camp" />
                      </SelectTrigger>
                      <SelectContent>
                        {camps.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormDescription>
                  Generally speaking, where is your event taking place?
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormDescription>When does it start?</FormDescription>
                    <Calendar
                      mode="single"
                      defaultMonth={new Date("10-03-2024")}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("10-03-2024") ||
                        date > new Date("10-07-2024")
                      }
                      initialFocus
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Input {...field} type="time" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormDescription>When does it end?</FormDescription>
                    <Calendar
                      mode="single"
                      defaultMonth={new Date("10-03-2024")}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("10-03-2024") ||
                        date > new Date("10-07-2024")
                      }
                      initialFocus
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <Input {...field} type="time" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={updatePost.isPending}>
            {updatePost.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
