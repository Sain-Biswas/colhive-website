import { Metadata } from "next";
import { ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)] p-4 pt-0">{children}</main>
    </>
  );
}
