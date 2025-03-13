"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import LoadingSpinner from "@/components/general/loading-spinner";

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  name: z.string().min(1, "Organization name is required."),
  category: z.enum(["Enterprise", "Startup", "Free"]),
});

export default function NewOrganizationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "Free",
    },
  });

  const utility = api.useUtils();
  const addOrganization = api.organizations.addOrganization.useMutation({
    onSuccess: async () => {
      toast.success("New organization created successfully.", {
        description: "Changing active organization to the new one.",
      });

      await utility.organizations.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong.", {
        description:
          "Organization could not be created. Please try again later.",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addOrganization.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a relevant type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your payment depends on the organization type you choose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={addOrganization.isPending}
        >
          <LoadingSpinner isVisible={addOrganization.isPending} />
          Create New Organization
        </Button>
      </form>
    </Form>
  );
}
