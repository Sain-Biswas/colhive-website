"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CircleSlashIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { RouterOutputs, api } from "@/trpc/trpc-react-provider";

export type TSentInvitations =
  RouterOutputs["members"]["getSentInvitations"][0];

export const columns: ColumnDef<TSentInvitations>[] = [
  {
    accessorKey: "sentName",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
        variant="ghost"
      >
        Sender
      </Button>
    ),
    cell: ({ row }) => {
      const logo = row.original.sentImage || undefined;
      const fallback = row.original.sentName
        ?.split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .join("");
      const email = row.original.sentEmail;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={logo} />
            <AvatarFallback className="size-8 rounded-md">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{row.getValue("sentName")}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
        variant="ghost"
      >
        Status
      </Button>
    ),
    cell: ({ row }) => <p className="capitalize">{row.getValue("status")}</p>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
        variant="ghost"
      >
        Role
      </Button>
    ),
    cell: ({ row }) => <p className="capitalize">{row.getValue("role")}</p>,
  },
  {
    accessorKey: "sentOn",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Sent On
      </button>
    ),
    cell: ({ row }) => {
      const date = row.original.sentOn;
      return <p>{format(new Date(date!), "PPPp")}</p>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <SentInvitationTableActions invitation={row.original} />,
  },
];

function SentInvitationTableActions({
  invitation,
}: {
  invitation: TSentInvitations;
}) {
  const utility = api.useUtils();

  const cancelInvitationMutation = api.members.cancelInvitation.useMutation({
    onSuccess: async () => {
      toast.success(`Invitation to ${invitation.sentName} in canceled`, {
        description: "It will be removed from the recipient's invitation list.",
      });
      await utility.members.getSentInvitations.invalidate();
    },
    onError: async () => {
      toast.error(`Something went wrong!`, {
        description: "Try again.",
      });
    },
  });

  const deleteInvitationMutation = api.members.deleteInvitations.useMutation({
    onSuccess: async () => {
      toast.success(`Invitation to ${invitation.sentName} is deleted`, {
        description: "It will be removed from your current invitation list.",
      });
      await utility.members.getSentInvitations.invalidate();
    },
    onError: async () => {
      toast.error(`Something went wrong!`, {
        description: "Try again.",
      });
    },
  });

  if (invitation.status === "pending") {
    return (
      <Button
        onClick={() => cancelInvitationMutation.mutate(invitation.id)}
        variant="outline"
      >
        <CircleSlashIcon />
        <p className="hidden lg:block">Cancel</p>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => deleteInvitationMutation.mutate(invitation.id)}
      variant="outline"
    >
      <Trash2Icon />
      <p className="hidden lg:block">Delete</p>
    </Button>
  );
}
