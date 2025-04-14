"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/trpc/trpc-react-provider";

import ProjectMembers from "./project-members";

interface ProjectDetailsProps {
  organizationId: string;
  projectId: string;
}

export default function ProjectDetails({
  organizationId,
  projectId,
}: ProjectDetailsProps) {
  const [project] = api.projects.getProject.useSuspenseQuery({
    organizationId,
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
        </CardHeader>
      </Card>
      <ProjectMembers projectId={project?.id || ""} />
    </section>
  );
}
