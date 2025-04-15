"use client";

import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  tag: z.enum([
    "documentation",
    "bug",
    "fix",
    "feature",
    "chore",
    "refactor",
    "build",
    "test",
  ]),
  status: z.enum(["backlog", "todo", "in-progress", "done", "canceled"]),
  priority: z.enum(["high", "medium", "high"]),
  title: z.string().trim(),
});

interface NewProjectTaskDialogProps {
  projectId: string;
}

const PROJECT_TASK_TAGS = [
  "documentation",
  "bug",
  "fix",
  "feature",
  "chore",
  "refactor",
  "build",
  "test",
];

export default function NewProjectTaskDialog({
  projectId,
}: NewProjectTaskDialogProps) {
  const [members] = api.projects.getProjectMembers.useSuspenseQuery({
    projectId,
  });
  console.log(members);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon className="" />
          New Task
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
