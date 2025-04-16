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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
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
  priority: z.enum(["high", "medium", "low"]),
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
  "use no memo";
  const [members] = api.projects.getProjectMembers.useSuspenseQuery({
    projectId,
  });

  const [project] = api.projects.getProject.useSuspenseQuery({
    projectId,
  });

  const utility = api.useUtils();

  const createProjectTaskMutation = api.projects.createNewTask.useMutation({
    onError() {
      toast.error("Failed to assign the task", {
        description: "Please try again after some time.",
      });
    },
    onSuccess() {
      toast.success("Task assigned successfully.", {
        description: "Changes will be visible soon.",
      });
      form.reset();
      utility.projects.getOrganizationTasks.invalidate();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "low",
      status: "todo",
      tag: "chore",
      title: "",
      userId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createProjectTaskMutation.mutate({
      ...values,
      projectId: projectId,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon className="" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a new task within {project?.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-input w-full rounded-md border px-3 py-2"
                      placeholder="Enter task title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button>hello</Button>
                      </FormControl>
                    </PopoverTrigger>
                  </Popover>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
