import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { auth } from "@/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  void api.users.currentUser.prefetch();
  void api.organizations.getOrganizationList.prefetch();
  void api.organizations.getMemberStatus.prefetch();
  void api.organizations.getActiveOrganization.prefetch();

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
