"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { RouterOutputs } from "@/trpc/trpc-react-provider";

export type TMembers = RouterOutputs["members"]["getAllMembers"][0];

export const columns: ColumnDef<TMembers>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 flex items-center gap-2"
        variant="ghost"
      >
        Name
      </Button>
    ),
    cell: ({ row }) => {
      const logo = row.original.image || undefined;
      const fallback = row.original.name
        ?.split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .join("");
      const email = row.original.email;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={logo} />
            <AvatarFallback className="size-8 rounded-md">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{row.getValue("name")}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 flex items-center gap-2"
        variant="ghost"
      >
        Role
      </Button>
    ),
    cell: ({ row }) => <p className="capitalize">{row.getValue("role")}</p>,
  },
  {
    accessorKey: "joiningDate",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 flex items-center gap-2"
        variant="ghost"
      >
        Joining Date
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.joiningDate;
      return <p>{format(new Date(date!), "PPPp")}</p>;
    },
  },
  {
    accessorKey: "lastChangesDone",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 flex items-center gap-2"
        variant="ghost"
      >
        Last Changes
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.lastChangesDone;
      return <p>{format(new Date(date!), "PPPp")}</p>;
    },
  },
];
