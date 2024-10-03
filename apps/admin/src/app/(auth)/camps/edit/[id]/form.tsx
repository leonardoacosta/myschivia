"use client";

import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";

import type { RouterOutputs } from "@tribal-cities/api";
import { Tag, UpdateCampSchema } from "@tribal-cities/db/schema";
import { cn } from "@tribal-cities/ui";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@tribal-cities/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@tribal-cities/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  const { mutate: toggleTag, isPending: toggling } =
    api.camp.toggleTag.useMutation();
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // role="combobox"
                    // disabled={toggling}
                    className={cn(
                      "w-[200px] justify-between",
                      // camp?.tags.length === 0 && "text-muted-foreground",
                    )}
                  >
                    {toggling
                      ? "Updating..."
                      : camp?.tags
                        ? camp.tags.map((tag) => tag.tag).join(", ")
                        : "Select language"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Tags..."
                      // className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      {Tag.enumValues.map((tag) => (
                        <CommandItem
                          value={tag}
                          key={tag}
                          onSelect={() => {
                            console.log("tag", tag);
                            toggleTag(
                              {
                                campId: camp!.id,
                                tag,
                              },
                              {
                                onSuccess: () => {
                                  toast.success("Tag updated");
                                  utils.camp.byId.refetch();
                                },
                              },
                            );
                          }}
                        >
                          {tag}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              camp?.tags.find((field) => field.tag === tag)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

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
