import { useContext, useRef } from "react";
import { useRouter } from "next/navigation";

import { CreateBurnWithYearSchema } from "@tribal-cities/db/schema";
import { Button } from "@tribal-cities/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tribal-cities/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tribal-cities/ui/dialog";
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
import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

export default function BurnCreate() {
  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const form = useForm({
    schema: CreateBurnWithYearSchema,
    defaultValues: {
      burn: {
        name: "",
        description: "",
        image: "",
      },
      burnYear: {
        name: "",
        description: "",

        coordinates: "",

        startDate: new Date(),
        startTime: "",
        endDate: new Date(),
        endTime: "",
      },
    },
  });

  const utils = api.useUtils();
  // const { mutate: presign } = api.camp.presign.useMutation({
  //   onMutate: async (data) => {},
  //   onSuccess: async (data) => {
  //     toast.info("Uploading image...");
  //   },
  // });

  const createBurn = api.burn.create.useMutation({
    // onMutate: async (data) => {
    //   const image = data.image;
    //   console.log("image", image);
    //   if (image) {
    //     // presign({
    //     //   filename: image,
    //     //   year: "2024",
    //     //   burnName: "myschievia",
    //     // });
    //   }
    // },
    onSuccess: async () => {
      form.reset();
      toast.success("Burn created successfully");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to camp"
          : "Failed to register camp",
      );
    },
  });

  const onComplete = () => {
    router.push("/");
  };

  return (
    <Card className="sm:gap-4 sm:py-4 sm:pl-14">
      <CardContent>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
              createBurn.mutate(data, {
                onSuccess: () => {
                  ref.current?.click();
                },
                onError: (err) => {
                  toast.error("Failed to create burn");
                },
              });
            })}
          >
            <CardTitle>Create a New Burn</CardTitle>
            <p className="text-secondary-foreground">
              This will allow you to create events and invite others.
            </p>

            <sup className="text-muted-foreground">
              <span className="text-destructive">*</span> Subject to approval by
              the Tribal Cities team
            </sup>
            <FormField
              control={form.control}
              name="burn.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormDescription>
                    What is the name of your burn?
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
              name="burn.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Tell us about your burn in a few words
                  </FormDescription>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <CardTitle>This Years Info</CardTitle>
            <p className="text-secondary-foreground">
              This is the information is more for the specific year you are
              creating the burn for.
            </p>
            <FormField
              control={form.control}
              name="burnYear.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title of this years event</FormLabel>
                  <FormDescription>
                    This is typically the same as the name of the burn it's self
                  </FormDescription>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="burnYear.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe this year</FormLabel>
                  <FormDescription>
                    This is typically the theme of the burn
                  </FormDescription>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="burnYear.coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinates</FormLabel>
                  <FormDescription>
                    If you have the coordinates of the event, please enter them
                    in the format of "lat, long"
                  </FormDescription>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={createBurn.isPending}>
              {createBurn.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
        <Dialog>
          <DialogTrigger ref={ref} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Your burn has been submitted for approval!
              </DialogTitle>
              <DialogDescription>
                Once approved, you will get an email and then you will be able
                to create events and invite others to your burn. For now, sit
                tight and maybe join one of the other burns to see what it's all
                about.
              </DialogDescription>
              <DialogFooter>
                <Button onClick={onComplete}>Join a burn</Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
