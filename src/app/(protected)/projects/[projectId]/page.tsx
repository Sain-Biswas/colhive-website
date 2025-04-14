import { api } from "@/trpc/server";

import ProjectDetails from "./components/project-details";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const organization = await api.organizations.getActiveOrganization.call({});

  void api.projects.getProject.prefetch({
    projectId,
    organizationId: organization?.id || "",
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ProjectDetails
        organizationId={organization?.id || ""}
        projectId={projectId}
      />
    </main>
  );
}
