"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { api } from "@/trpc/trpc-react-provider";

import NewMemberDialog from "./new-member-dialog";
import { MembersTable } from "./table";

export default function MembersPage() {
  // const [user] = api.users.currentUser.useSuspenseQuery();
  const [organization] =
    api.organizations.getActiveOrganization.useSuspenseQuery();

  if (!organization?.id) {
    return null;
  }

  const {
    data: members,
    isLoading,
    // isError,
  } = api.members.getAllMembers.useQuery({
    organizationId: organization?.id as string,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Members</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex grow items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="border-foreground size-8 animate-spin rounded-full border-t-2 text-transparent">
              .
            </div>
            <p>Loading</p>
          </div>
        </div>
      </main>
    );
  }

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
                <BreadcrumbPage>Members</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <NewMemberDialog />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MembersTable data={members!} />
      </div>
    </>
  );
}
