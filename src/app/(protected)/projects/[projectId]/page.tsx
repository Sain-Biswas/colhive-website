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
    <main>
      <ProjectDetails
        organizationId={organization?.id || ""}
        projectId={projectId}
      />
    </main>
  );
}
