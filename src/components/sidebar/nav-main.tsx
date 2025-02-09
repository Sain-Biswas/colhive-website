"use client";

import Link from "next/link";

import { LayoutDashboardIcon, Settings2Icon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
      <SidebarMenu>
        <Link href="/dashboard">
          <SidebarMenuButton tooltip="Dashboard">
            <LayoutDashboardIcon />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </Link>
        <Link href="/settings">
          <SidebarMenuButton tooltip="Settings">
            <Settings2Icon />
            <span>Settings</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}
