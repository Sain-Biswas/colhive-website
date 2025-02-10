"use client";

import Link from "next/link";

import { ChevronsUpDown, CommandIcon, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { api } from "@/trpc/trpc-react-provider";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function TeamSwitcher({ userId }: { userId: string }) {
  const { isMobile } = useSidebar();
  const [data] = api.organizations.getOrganizationList.useSuspenseQuery({
    userId,
  });

  const { activeOrganization, listOrganization } = data;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={activeOrganization?.logo || undefined}
                    alt={activeOrganization?.name as string}
                  />
                  <AvatarFallback className="rounded-lg bg-transparent p-2">
                    <CommandIcon />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization?.name}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization?.category}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {listOrganization.length == 0 && (
              <DropdownMenuItem>No other organization</DropdownMenuItem>
            )}
            {listOrganization.map((team, index) => (
              <DropdownMenuItem key={team.id} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-xs border">
                  <Avatar className="size-4 rounded-lg">
                    <AvatarImage
                      src={team?.logo || undefined}
                      alt={team?.name as string}
                    />
                    <AvatarFallback className="rounded-lg">
                      <CommandIcon />
                    </AvatarFallback>
                  </Avatar>
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href="/new-organization">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add team
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
