"use client";

import { useRouter } from "next/navigation";

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

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  category: z.enum(["Enterprise", "Startup", "Free"]),
});

function NoOrganizationPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "Free",
    },
  });

  const utility = api.useUtils();

  const createOrganization = api.organizations.createOrganization.useMutation({
    onSuccess: async () => {
      utility.organizations.invalidate();
      utility.users.invalidate();
      router.push("/dashboard");
    },
    onError(error) {
      console.log(error);
      toast.success("Organization creation failed", {
        description: "Please try again",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { category, name } = values;

    createOrganization.mutate({ name, category });
  }

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
                <Input placeholder="First Middle Last" {...field} />
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
                Your payment depends on which organization type you choose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create first Organization
        </Button>
      </form>
    </Form>
  );
}

export default NoOrganizationPage;
