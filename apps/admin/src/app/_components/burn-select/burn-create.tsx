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

import { BurnContext } from "~/context/burn-context";
import { api } from "~/trpc/react";

export default function BurnCreate() {
  const ref = useRef<HTMLButtonElement>(null);
  // const { setCreate } = useContext(BurnContext);
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

  const auth = api.auth.getSession.useQuery();
  console.log({ auth });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Start a Burn 🔥</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex-row justify-center space-y-4 p-5">
          {/* <h1 className="text-2xl font-semibold">Create your very own burn</h1>
          <p className="text-gray-500">
            Create a burn to host your own event. This will allow you to create
            events and invite others.
          </p>

          <sup className="text-gray-500">
            <span className="text-destructive">*</span> Subject to approval by
            the Tribal Cities team
          </sup> */}

          <DialogHeader>
            <DialogTitle>
              This feature is currently under development.
            </DialogTitle>
            <DialogDescription>
              If you would like to create a burn, please contact the Tribal
              Cities team.
            </DialogDescription>
            <DialogFooter>
              <a
                href={`
            mailto:leo@leonardoacosta.dev?
            subject=Create a Burn
            &body=Hello!%0D%0A%0D%0A I love the idea of creating a burn and would like to learn more about how I can get started!%0D%0A%0D%0A Thank you!%0D%0A%0D%0A- [Your Name should go here]
            `}
              >
                <Button>Contact us</Button>
              </a>
            </DialogFooter>
          </DialogHeader>

          {/* <Card>
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
                    This is the information is more for the specific year you
                    are creating the burn for.
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
                          This is typically the same as the name of the burn
                          it's self
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
          </Card> */}

          {/* <Dialog>
            <DialogTrigger ref={ref} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Your burn has been submitted for approval!
                </DialogTitle>
                <DialogDescription>
                  Once approved, you will get an email and then you will be able
                  to create events and invite others to your burn. For now, sit
                  tight and maybe join one of the other burns to see what it's
                  all about.
                </DialogDescription>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setCreate(false);
                    }}
                  >
                    Join a burn
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
