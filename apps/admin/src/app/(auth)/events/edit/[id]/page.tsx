"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import { CreateEventSchema, eventTypeEnum } from "@tribal-cities/db/schema";
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
import EditEventForm from "./form";

export default function CreatePostForm() {
  const router = useRouter();
  const { id } = useParams();
  const { data: ev, isPending } = api.event.byId.useQuery({ id: id as string });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <EditEventForm ev={ev} />;
}
