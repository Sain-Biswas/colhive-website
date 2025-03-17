"use client";

import { useState } from "react";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import NewProjectDialog from "./new-project-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  "use no memo";
  const [sortValue, setSortValue] = useState<string>("");

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-center gap-2">
      <Input
        placeholder="Filter tasks..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] grow lg:w-[250px]"
      />

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X />
        </Button>
      )}

      <Select
        value={sortValue}
        onValueChange={(value) => {
          table.setSorting([
            {
              id: value,
              desc: true,
            },
          ]);
          setSortValue(value);
        }}
      >
        <SelectTrigger className="max-w-56">
          <SelectValue placeholder="Sort by ..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Sort by Name</SelectItem>
          <SelectItem value="updatedAt">Sort by Last Updated</SelectItem>
        </SelectContent>
      </Select>

      <NewProjectDialog />
    </div>
  );
}
