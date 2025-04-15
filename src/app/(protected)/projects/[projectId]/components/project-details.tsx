"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/trpc/trpc-react-provider";

import ProjectMembers from "./project-members";

interface ProjectDetailsProps {
  projectId: string;
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project] = api.projects.getProject.useSuspenseQuery({
    projectId,
  });

  return (
    <section className="grid auto-rows-min gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="font-gilroy size-10 rounded-full font-bold">
              <AvatarImage src={project?.logo || undefined} />
              <AvatarFallback className="font-gilroy size-10 rounded-full text-xs font-bold">
                {project?.name
                  ?.split(" ")
                  .map((i) => i.charAt(0).toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{project?.name}</CardTitle>
          </div>
          <CardDescription className="line-clamp-2">
            {project?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="scroll-m-20 text-xl font-semibold tracking-tight">
            Managers
          </p>

          <div className="flex flex-wrap gap-2">
            {project?.members && project?.members?.length === 0 && (
              <p className="col-span-2 py-4 text-center">No Managers.</p>
            )}

            {project?.members &&
              project?.members?.map((member) => (
                <Card
                  className="flex flex-row gap-2 px-2 py-2"
                  key={member.user.email}
                >
                  <Avatar className="flex size-10 items-center justify-center rounded-md">
                    <AvatarImage src={member.user.image || undefined} />
                    <AvatarFallback className="size-10 rounded-md">
                      {member?.user.name
                        ?.split(" ")
                        .map((i) => i.charAt(0).toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="m-0 flex flex-col justify-center p-0">
                    <div className="flex flex-wrap justify-between">
                      <p className="truncate text-sm font-medium">
                        {member.user.name}
                      </p>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.user.email}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
      <ProjectMembers projectId={project?.id || ""} />
    </section>
  );
}
