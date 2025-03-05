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
import { Form } from "@/components/ui/form";

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  name: z.string().min(1, "Project name is needed for creation."),
  members: z
    .array(
      z.object({
        userId: z.string().uuid(),
        role: z.enum([
          "manager",
          "team-lead",
          "designer",
          "developer",
          "tester",
          "member",
          "sub-lead",
        ]),
      })
    )
    .min(1, "A project need atleast one member to be created."),
});

export default function NewProjectDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const [memberStatus] = api.organizations.getMemberStatus.useSuspenseQuery();

  const [organization] =
    api.organizations.getActiveOrganization.useSuspenseQuery();

  const utility = api.useUtils();

  const createProjectMutation = api.projects.createProject.useMutation({
    onSuccess: (_data, variables) => {
      toast.success(`${variables.name} created`, {
        description: "It will be visible in a few seconds.",
      });
      utility.projects.invalidate();
      form.reset();
    },
    onError: () => {
      toast.error("Project creation failed.", {
        description: "Please try again after some time.",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createProjectMutation.mutate({
      ...values,
      organizationId: organization?.id || "",
    });
  }

  if (memberStatus.role === "member") {
    return <></>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon />
          <p>Add Project</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new project within {organization?.name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          ></form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
