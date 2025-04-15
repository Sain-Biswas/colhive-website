import { HydrateClient, api } from "@/trpc/server";

import ProjectDetails from "./components/project-details";
import ProjectHeader from "./components/project-header";
import NewProjectTaskDialog from "./components/tasks/new-task-dialog";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  void api.projects.getProject.prefetch({
    projectId,
  });

  void api.projects.getProjectMembers.prefetch({
    projectId,
  });

  return (
    <HydrateClient>
      <ProjectHeader projectId={projectId} />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProjectDetails projectId={projectId} />
        <NewProjectTaskDialog projectId={projectId} />
      </main>
    </HydrateClient>
  );
}
