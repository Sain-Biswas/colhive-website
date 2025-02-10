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

  const user = await api.users.currentUser();

  if (!user?.activeOrganization) {
    redirect("/no-organizations");
  }

  void api.organizations.getOrganizationList.prefetch({
    activeOrganizationId: user.activeOrganization,
  });

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
