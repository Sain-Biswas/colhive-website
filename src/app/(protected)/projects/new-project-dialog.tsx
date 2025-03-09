"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, CirclePlusIcon, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/trpc/trpc-react-provider";

export type TMember = {
  id: string;
  role: "member" | "owner" | "admin" | null;
  joiningDate: Date | null;
  lastChangesDone: Date | null;
  memberId: string;
  name: string;
  image: string | null;
  email: string | null;
};

const formSchema = z.object({
  name: z.string().min(1, "Project name is needed for creation."),
  description: z.string(),
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
    .min(1, "A project needs at least one member to be created."),
});

const PROJECT_ROLES = [
  "manager",
  "team-lead",
  "designer",
  "developer",
  "tester",
  "member",
  "sub-lead",
] as const;

export default function NewProjectDialog() {
  "use no memo";
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberStatus] = api.organizations.getMemberStatus.useSuspenseQuery();

  if (memberStatus.role === "member") {
    return <></>;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      members: [],
      description: "",
    },
  });

  const [organization] =
    api.organizations.getActiveOrganization.useSuspenseQuery();

  const { data: members, isFetching } = api.members.getAllMembers.useQuery({
    organizationId: organization?.id || "",
  });

  const selectedMembers = form.watch("members");

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members?.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const handleToggleMember = (member: TMember) => {
    const isSelected = selectedMembers.some(
      (m) => m.userId === member.memberId
    );

    if (isSelected) {
      const updatedMembers = selectedMembers.filter(
        (m) => m.userId !== member.memberId
      );
      form.setValue("members", updatedMembers);
    } else {
      const newMember = {
        userId: member.memberId,
        role: "member" as const,
      };
      form.setValue("members", [...selectedMembers, newMember]);
    }
  };

  const handleUpdateRole = (
    memberId: string,
    newRole: (typeof PROJECT_ROLES)[number]
  ) => {
    const updatedMembers = selectedMembers.map((member) =>
      member.userId === memberId ? { ...member, role: newRole } : member
    );
    form.setValue("members", updatedMembers);
  };

  const utility = api.useUtils();

  const createProjectMutation = api.projects.createProject.useMutation({
    onSuccess: (_data, variables) => {
      toast.success(`Project created with name ${variables.name}`, {
        description: "You can access it now.",
      });
      form.reset();
      utility.projects.invalidate();
    },
    onError: () => {
      toast.error(`Project creation failed`, {
        description: "Please try again",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProjectMutation.mutate({
      ...values,
      organizationId: organization?.id || "",
    });
  }

  if (isFetching) {
    return (
      <Button>
        <div className="size-4 animate-spin rounded-full border-t-2 text-transparent">
          .
        </div>
        <p>Loading</p>
      </Button>
    );
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
            Create a new Project in {organization?.name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-input w-full rounded-md border px-3 py-2"
                      placeholder="Enter project name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-input w-full rounded-md border px-3 py-2"
                      placeholder="About project in brief"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Select Project Members</FormLabel>

                  <div className="flex w-full flex-col space-y-4">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          <span className="truncate">
                            {selectedMembers.length === 0
                              ? "Select members"
                              : `${selectedMembers.length} member${selectedMembers.length === 1 ? "" : "s"} selected`}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="center">
                        <div className="border-border flex items-center border-b p-2">
                          <Search className="text-muted-foreground mr-2 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="placeholder:text-muted-foreground flex-1 border-none bg-transparent text-sm outline-none"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="text-muted hover:text-muted-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredMembers?.length === 0 ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">
                              No members found
                            </div>
                          ) : (
                            filteredMembers?.map((member) => {
                              const isSelected = selectedMembers.some(
                                (m) => m.userId === member.memberId
                              );
                              return (
                                <div
                                  key={member.memberId}
                                  className="hover:bg-accent flex cursor-pointer items-center space-x-2 p-2"
                                  onClick={() => handleToggleMember(member)}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      handleToggleMember(member)
                                    }
                                  />
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={member.image || ""}
                                      alt={member.name}
                                    />
                                    <AvatarFallback>
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                      {member.name}
                                    </p>
                                    <p className="text-muted-foreground truncate text-sm">
                                      {member.email || "No email"}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <Check className="text-primary h-4 w-4" />
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="border-border flex min-h-10 flex-col gap-2 rounded-md border p-2">
                      {selectedMembers.length === 0 ? (
                        <span className="text-muted-foreground">
                          No members selected
                        </span>
                      ) : (
                        selectedMembers.map((selectedMember) => {
                          const memberDetails = members?.find(
                            (m) => m.memberId === selectedMember.userId
                          );
                          if (!memberDetails) return null;

                          return (
                            <div
                              key={selectedMember.userId}
                              className="bg-card flex items-center gap-3 rounded-md p-2"
                            >
                              <Avatar className="size-8 rounded-md">
                                <AvatarImage
                                  src={memberDetails.image || ""}
                                  alt={memberDetails.name}
                                />
                                <AvatarFallback className="size-8 rounded-md">
                                  {memberDetails.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {memberDetails.name}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                  {memberDetails.email || "No email"}
                                </p>
                              </div>

                              <Select
                                value={selectedMember.role}
                                onValueChange={(value) =>
                                  handleUpdateRole(
                                    selectedMember.userId,
                                    value as (typeof PROJECT_ROLES)[number]
                                  )
                                }
                              >
                                <SelectTrigger className="h-7 w-32 px-2 py-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROJECT_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role.charAt(0).toUpperCase() +
                                        role.slice(1).replace("-", " ")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <button
                                type="button"
                                disabled={createProjectMutation.isPending}
                                onClick={() =>
                                  handleToggleMember(memberDetails)
                                }
                                className="text-gray-500 hover:text-gray-700"
                                aria-label={`Remove ${memberDetails.name}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
