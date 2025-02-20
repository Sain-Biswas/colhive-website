import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Members | Colhive - Project Management Solution",
  description:
    "A Modern easy to use web service to help organize and streamline industrial workflow in new generation organiza",
};

export default function MembersLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
