"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";

import { api } from "~/trpc/react";

export default function ViewPost() {
  const { id } = useParams();
  const { data: ev } = api.event.byId.useQuery({ id: id as string });

  if (!ev) return <p>Loading...</p>;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{ev?.name}</CardTitle>
          <CardDescription>
            {ev?.location} - {ev?.type}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>{ev?.description}</CardDescription>
        </CardContent>
        <CardContent>
          <CardDescription>
            From: {format(ev?.startDate, "EEE")} @ {ev?.startTime}
          </CardDescription>
          <CardDescription>
            To: {format(ev?.endDate, "EEE")} @ {ev?.endTime}
          </CardDescription>
          <CardDescription>By: {ev?.user.name}</CardDescription>
          {ev.camp && <CardDescription>With: {ev.camp.name}</CardDescription>}
        </CardContent>
      </Card>
      {/*  {camps && camps.length > 0 && (
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
          <Button disabled={updatePost.isPending}>Create</Button>
        </form>
      </Form> */}
    </main>
  );
}
