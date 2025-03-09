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

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  email: z.string().email("Please enter an valid email address."),
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
          "They will be available in your Organizations member list once they accept it.",
      });

      form.reset();
    },
    onError: async (error, variables) => {
      if (
        error.shape?.message ===
        "SQLITE_CONSTRAINT_FOREIGNKEY: FOREIGN KEY constraint failed"
      ) {
        toast.error(`No user with email ${variables.email}`, {
          description: "Please check the data and try again.",
        });
      } else if (error.shape?.message === "MEMBER_ALREADY_PRESENT") {
        toast.error(`Member with email ${variables.email} already present`, {
          description: "Try searching memvers list or verify the email.",
        });
      } else if (error.shape?.message === "INVITATION_ALREADY_SENT") {
        toast.error(
          `Invitation to  ${variables.email} already sent from your organization`,
          {
            description: "Try verifing the email or check with other admins",
          }
        );
      } else {
        toast.error("Something went wrong.", {
          description: "Please try again.",
        });
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, role } = values;
    sendInvitation.mutate({
      email,
      role,
      organizationId: organization?.id as string,
    });
  }

  if (memberStatus && memberStatus.role === "member") {
    return <></>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon />
          <p>Add Member</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invitation to Other Users</DialogTitle>
          <DialogDescription>
            Enter details below of the new member
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members Email</FormLabel>
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
                  <FormLabel>Member&apos;s role on joining</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a relevant type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {memberStatus.role === "owner" && (
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
              <Button
                type="submit"
                className=""
                disabled={sendInvitation.isPending}
              >
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
