import { Metadata } from "next";
import { ReactNode } from "react";

import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Projects | Colhive - Project Management Solution",
  description:
    "A Modern easy to use web service to help organize and streamline industrial workflow in new generation organiza",
};

export default async function ProjectsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  void api.projects.getProjectList.prefetch();
  void api.members.getAllMembers();

  return children;
}
