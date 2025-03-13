"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["owner", "admin", "member"]),
});

export default function NewMemberDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const [memberStatus] = api.organizations.getMemberStatus.useSuspenseQuery();

  const [organization] =
    api.organizations.getActiveOrganization.useSuspenseQuery();

  const sendInvitation = api.members.sendInvitation.useMutation({
    onSuccess: async (_data, variables) => {
      toast.success(`Invitation has been sent to ${variables.email}`, {
        description:
          "They will be available in your organization's member list once they accept it.",
      });

      form.reset();
    },
    onError: async (error) => {
      if (error.data?.code === "NOT_FOUND") {
        toast.error(error.message, {
          description: "Please check the email and try again.",
        });
      } else if (error.data?.code === "BAD_REQUEST") {
        toast.error("User does not have an active organization.", {
          description:
            "You must be a part of an organization to sent invitations",
        });
      } else if (error.data?.code === "CONFLICT") {
        toast.error(error.message, {
          description: "Try searching the members list or verify the email.",
        });
      } else if (error.data?.code === "PRECONDITION_FAILED") {
        toast.error(error.message, {
          description: "Verify the email or check with other admins.",
        });
      } else {
        toast.error("Something went wrong.", {
          description: "Please try again.",
        });
      }
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!organization?.id) {
      toast.error("No active organization found.", {
        description: "Please select an active organization.",
      });
      return;
    }

    sendInvitation.mutate({
      email: values.email,
      role: values.role,
      organizationId: organization.id,
    });
  };

  if (memberStatus?.role === "member") {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invitation to Other Users</DialogTitle>
          <DialogDescription>
            Enter details below to invite a new member to your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member&apos;s Email</FormLabel>
                  <FormControl>
                    <Input placeholder="something@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member&apos;s Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Only show "Admin" option if the current user is an owner */}
                      {memberStatus?.role === "owner" && (
                        <SelectItem value="admin">Admin</SelectItem>
                      )}
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={sendInvitation.isPending}>
                <LoadingSpinner isVisible={sendInvitation.isPending} />
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
