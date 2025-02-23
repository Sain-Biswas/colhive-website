"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CircleXIcon,
  EyeOffIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RouterOutputs, api } from "@/trpc/trpc-react-provider";

export type TRecievedInvitations =
  RouterOutputs["members"]["getPendingInvitations"][0];

export const columns: ColumnDef<TRecievedInvitations>[] = [
  {
    accessorKey: "organizationName",
    header: ({ column }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent h-8"
          >
            <span>Organization</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon />
            ) : (
              <ChevronsUpDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="text-muted-foreground/70 h-3.5 w-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    cell: ({ row }) => {
      const logo = row.original.organizationLogo || undefined;
      const fallback = row.original.organizationName
        ?.split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .join("");
      const status = row.original.organizationStatus;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={logo} />
            <AvatarFallback className="size-8 rounded-md">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{row.getValue("organizationName")}</p>
            <p className="text-sm text-gray-500">{status}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Role
      </button>
    ),
    cell: ({ row }) => <p className="capitalize">{row.getValue("role")}</p>,
  },
  {
    accessorKey: "senderName",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Sender
      </button>
    ),
    cell: ({ row }) => {
      const logo = row.original.senderLogo || undefined;
      const fallback = row.original.senderName
        ?.split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .join("");
      const email = row.original.senderEmail;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={logo} />
            <AvatarFallback className="size-8 rounded-md">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{row.getValue("senderName")}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </div>
      );
    },
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
    cell: ({ row }) => (
      <RecievedInvitationTableActions invitation={row.original} />
    ),
  },
];

function RecievedInvitationTableActions({
  invitation,
}: {
  invitation: TRecievedInvitations;
}) {
  const utility = api.useUtils();
  const acceptInvitationMutation = api.members.acceptInvitation.useMutation({
    onSuccess() {
      toast.success(`Invitation to ${invitation.organizationName} Accepted`, {
        description: "You can switch to new organization now.",
      });
      utility.members.getPendingInvitations.invalidate();
      utility.organizations.invalidate();
    },
    onError() {
      toast.error("Some thing went wrong!", {
        description: "Try again later.",
      });
    },
  });

  async function acceptInvitationFunction() {
    acceptInvitationMutation.mutate({ id: invitation.id });
  }

  const rejectedInvitationMutation = api.members.rejectInvitation.useMutation({
    onSuccess() {
      toast.success(`Invitation to ${invitation.organizationName} Rejected`, {
        description: "Sender will be notified of the same.",
      });
      utility.members.getPendingInvitations.invalidate();
    },
    onError() {
      toast.error("Some thing went wrong!", {
        description: "Try again later.",
      });
    },
  });

  async function rejectedInvitationFunction() {
    rejectedInvitationMutation.mutate({ id: invitation.id });
  }

  return (
    <div className="flex gap-1.5">
      <Button onClick={acceptInvitationFunction} variant="outline">
        <CircleCheckIcon />
        <p className="hidden lg:block">Accept</p>
      </Button>
      <Button onClick={rejectedInvitationFunction} variant="outline">
        <CircleXIcon />
        <p className="hidden lg:block">Reject</p>
      </Button>
    </div>
  );
}
