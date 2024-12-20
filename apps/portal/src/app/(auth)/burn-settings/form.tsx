"use client";

import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";

import type { RouterOutputs } from "@tribal-cities/api";
import { UpdateBurnYearSchema } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import { Checkbox } from "@tribal-cities/ui/checkbox";
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
import { Separator } from "@tribal-cities/ui/separator";
import { Switch } from "@tribal-cities/ui/switch";
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

export default function EditBurnForm({
  burn,
}: {
  burn: RouterOutputs["burn"]["burnYearById"];
}) {
  const router = useRouter();
  const form = useForm({
    schema: UpdateBurnYearSchema,
    defaultValues: burn,
  });

  const { mutate, isPending } = api.burn.updateBurnYear.useMutation({
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
              mutate(data);
            })}
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Burn</CardTitle>
                <CardDescription>Edit the burn year details</CardDescription>
              </CardHeader>
              <CardContent className="mt-2 flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        A short description of the burn, typically the theme of
                        the year
                      </FormLabel>
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
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        The coordinates of the event, typically the center of
                        the event
                      </FormLabel>
                      <FormDescription>
                        Enter the coordinates in the format of
                        `latitude,longitude`
                      </FormDescription>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={format(field.value, "yyyy-MM-dd")}
                            onChange={(e) =>
                              field.onChange(
                                new Date(addDays(e.target.value, 1)),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={format(field.value, "yyyy-MM-dd")}
                            onChange={(e) =>
                              field.onChange(
                                new Date(addDays(e.target.value, 1)),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <CardTitle>Theme Camp Settings </CardTitle>
                <FormField
                  control={form.control}
                  name="campRegistration"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          // className="py-2"
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          Camp Registration Enabled (Optional)
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campRegistrationEditing"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          Camp Registration Editing Enabled (Optional)
                        </FormLabel>
                        <FormDescription>
                          Camp registration Editing allows camp leads to edit
                          their camp registration even after submission.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <CardTitle>Volunteer Settings </CardTitle>
                <FormField
                  control={form.control}
                  name="volunteerManagement"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          Volunteer Management Enabled (Optional)
                        </FormLabel>
                        <FormDescription>
                          Volunteer Management allows you to manage volunteers
                          for the event.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="volunteerManagementEditing"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          Volunteer Editing Enabled (Optional)
                        </FormLabel>
                        <FormDescription>
                          Volunteer Editing allows any volunteer to edit *only*
                          their Schedule.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <CardTitle>Event Registration Settings </CardTitle>
                <FormField
                  control={form.control}
                  name="eventRegistration"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>
                          Event Registration Enabled (Optional)
                        </FormLabel>
                        <FormDescription>
                          Event Registration allows participants to register for
                          the event.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventEditing"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 align-middle">
                      <FormControl>
                        <Switch
                          defaultChecked={field.value ?? false}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Event Editing Enabled (Optional)</FormLabel>
                        <FormDescription>
                          Event Editing allows participants to edit their events
                          information after they create it.
                        </FormDescription>
                        <FormMessage />
                      </div>
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
