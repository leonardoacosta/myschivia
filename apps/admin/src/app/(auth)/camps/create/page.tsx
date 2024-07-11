"use client";

import { useRouter } from "next/navigation";

import {
  CampType,
  CreateCampSchema,
  CreateEventSchema,
  EventType,
} from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import { Calendar } from "@tribal-cities/ui/calendar";
import {
  Card,
  CardContent,
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

export default function CreateCampForm() {
  const router = useRouter();
  const form = useForm({
    schema: CreateCampSchema,
    defaultValues: {
      description: "",
      name: "",
      type: "Misc",
    },
  });

  const utils = api.useUtils();
  const createCamp = api.camp.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.camp.invalidate();
      router.push("/camps");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to camp"
          : "Failed to register camp",
      );
    },
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Camp</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex w-full max-w-2xl flex-col gap-4"
              onSubmit={form.handleSubmit((data) => {
                createCamp.mutate(data);
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                      What is the name of your camp?
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
                    <FormLabel>Camp Type</FormLabel>
                    <FormDescription>
                      What type of camp are you creating?
                    </FormDescription>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an camp type" />
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
              <Button disabled={createCamp.isPending}>
                {createCamp.isPending ? "Creating..." : "Create"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
