import { redirect } from "next/navigation";

import { GalleryVerticalEndIcon } from "lucide-react";

import ModeToggleButton from "@/components/mode-toggle-button";

import { auth } from "@/auth";

export default async function NoOrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-between p-5">
        <div className="flex items-center justify-center gap-2">
          <GalleryVerticalEndIcon />
          <p className="m-0 p-0">Colhive</p>
        </div>
        <div>
          <ModeToggleButton />
        </div>
      </header>
      <main className="flex grow items-center justify-center">
        <section className="w-full max-w-lg space-y-4 p-5">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
              You are not a part of any organization
            </h4>
            <div className="text-muted-foreground space-y-2 text-xs md:text-sm">
              <p>You can create a new organization and get started.</p>
              <p>
                If you are a part of a organization please ask your organization
                to send an invitation.
              </p>
            </div>
          </div>
          <div>{children}</div>
        </section>
      </main>
    </div>
  );
}
