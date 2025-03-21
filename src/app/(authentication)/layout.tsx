import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!!session) {
    redirect("/dashboard");
  }

  return children;
}
