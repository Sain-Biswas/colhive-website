"use client";

import { Card } from "@/components/ui/card";

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
    <>
      <Card></Card>
      <ProjectMembers projectId={project?.id || ""} />
    </>
  );
}
