"use client";

import Link from "next/link";

import {
  BadgePlusIcon,
  BoxesIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  Users2Icon,
} from "lucide-react";

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
        <Link href="/projects">
          <SidebarMenuButton tooltip="Projects">
            <BoxesIcon />
            <span>Projects</span>
          </SidebarMenuButton>
        </Link>
        <Link href="/invitations/recieved">
          <SidebarMenuButton tooltip="Invitations">
            <BadgePlusIcon />
            <span>Invitations</span>
          </SidebarMenuButton>
        </Link>
        <Link href="/members">
          <SidebarMenuButton tooltip="Members">
            <Users2Icon />
            <span>Members</span>
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
