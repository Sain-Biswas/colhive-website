"use client";

import { useState } from "react";

import { Table } from "@tanstack/react-table";
import { useSelector } from "@xstate/store/react";
import { LayoutGridIcon, LogsIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import projectStyleStore from "@/store/project";

import NewProjectDialog from "./new-project-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  "use no memo";
  const [sortValue, setSortValue] = useState<string>("");

  const showState = useSelector(
    projectStyleStore,
    (state) => state.context.style
  );

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

      <div className="bg-muted text-muted-foreground flex gap-0.5 rounded-md p-0.5">
        <Button
          className={cn(
            "size-8",
            showState === "grid" &&
              "bg-background text-foreground hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground"
          )}
          variant="ghost"
          size="icon"
          onClick={() => projectStyleStore.trigger.showAsGrid()}
        >
          <LayoutGridIcon />
        </Button>
        <Button
          className={cn(
            "size-8",
            showState === "list" &&
              "bg-background text-foreground hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground"
          )}
          variant="ghost"
          size="icon"
          onClick={() => projectStyleStore.trigger.showAsList()}
        >
          <LogsIcon />
        </Button>
      </div>

      <NewProjectDialog />
    </div>
  );
}
