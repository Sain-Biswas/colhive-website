"use client";

import { api } from "@/trpc/trpc-react-provider";

import { ProjectsTableWithCards } from "./table";

export default function ProjectsPage() {
  const [projects] = api.projects.getProjectList.useSuspenseQuery();
  return (
    // <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    //   {projects.map((project) => (
    //     <ProjectPageCard data={project} key={project.id} />
    //   ))}
    // </div>
    <ProjectsTableWithCards data={projects} />
  );
}
