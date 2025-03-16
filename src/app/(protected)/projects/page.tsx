"use client";

import { api } from "@/trpc/trpc-react-provider";

export default function ProjectsPage() {
  const [projects] = api.projects.getProjectList.useSuspenseQuery();
  return (
    <div>
      {projects.map((project) => (
        <p key={project.id}>{project.name}</p>
      ))}
    </div>
  );
}
