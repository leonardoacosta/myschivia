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
    <div className="flex-row justify-center space-y-4 p-5">
      <h1 className="text-2xl font-semibold">Create your very own burn</h1>
      <p className="text-gray-500">
        Create a burn to host your own event. This will allow you to create
        events and invite others.
      </p>

      <sup className="text-gray-500">
        <span className="text-destructive">*</span> Subject to approval by the
        Tribal Cities team
      </sup>

      <Card>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
              createBurn.mutate(data);
            })}
          >
            <CardHeader>
              <CardTitle>Create a New Burn</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>This years info</CardTitle>
              <CardDescription>
                This is the information is more for the specific year you are
                creating the burn for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="burnYear.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title of this years event</FormLabel>
                    <FormDescription>
                      This is typically the same as the name of the burn it's
                      self
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
                      If you have the coordinates of the event, please enter
                      them in the format of "lat, long"
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
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
