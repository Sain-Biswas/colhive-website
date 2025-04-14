"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { RouterOutputs } from "@/trpc/trpc-react-provider";

export type TProjects = RouterOutputs["projects"]["getProjectList"][0];

export const columns: ColumnDef<TProjects>[] = [
  {
    accessorKey: "name",
    header: () => (
      <Button className="-ml-3 flex items-center gap-2" variant="ghost">
        Name
      </Button>
    ),
    cell: ({ row }) => {
      const logo = row.original.logo || undefined;
      const fallback = row.original.name
        ?.split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .join("");
      const identifier = row.original.identifier || "";

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={logo} />
            <AvatarFallback className="size-8 rounded-md">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link href={`/projects/${identifier}`}>
              <span>{row.getValue("name")}</span>
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => (
      <Button className="-ml-3 flex items-center gap-2" variant="ghost">
        Description
      </Button>
    ),
    cell: ({ row }) => (
      <p className="line-clamp-2 text-xs">{row.getValue("description")}</p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: () => (
      <Button className="-ml-3 flex items-center gap-2" variant="ghost">
        Last Changes
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <p>{format(new Date(date!), "PPPp")}</p>;
    },
  },
];
