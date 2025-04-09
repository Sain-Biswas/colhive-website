"use client";

import { api } from "@/trpc/trpc-react-provider";

import { ProjectsTableWithCards } from "./table";

export default function ProjectsPage() {
  const [projects] = api.projects.getProjectList.useSuspenseQuery();
  return <ProjectsTableWithCards data={projects} />;
}
