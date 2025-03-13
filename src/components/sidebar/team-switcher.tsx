"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ChevronsUpDown, CommandIcon, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  const [data] = api.organizations.getOrganizationList.useSuspenseQuery();

  const path = usePathname();

  const utility = api.useUtils();

  const changeActiveOrganization =
    api.organizations.changeActiveOrganization.useMutation({
      onSuccess: async () => {
        toast.success("Active Organization changed.");
        await utility.organizations.invalidate();
        await utility.members.invalidate();
      },
    });

  const { activeOrganization, listOrganization } = data;

  console.log(listOrganization);

  useEffect(() => {
    if (!path.includes("/new-organization") && !path.includes("/invitations")) {
      if (!!!activeOrganization) {
        changeActiveOrganization.mutate({
          organizationId: listOrganization[0].id,
        });
      }
    }
  }, [path, activeOrganization, listOrganization, changeActiveOrganization]);

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
                {activeOrganization ? (
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={activeOrganization?.logo || undefined}
                      alt={activeOrganization?.name as string}
                    />
                    <AvatarFallback className="rounded-lg bg-transparent p-2">
                      <CommandIcon />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={undefined} alt={""} />
                    <AvatarFallback className="rounded-lg bg-transparent p-2">
                      <CommandIcon />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization?.name || "No Active organization"}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization?.category || ""}
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
              Other Organizations
            </DropdownMenuLabel>
            {listOrganization.length == 0 && (
              <DropdownMenuItem>No other organization</DropdownMenuItem>
            )}
            {listOrganization.map((team) => (
              <DropdownMenuItem
                key={team.id}
                className="gap-2 p-2"
                onClick={(event) => {
                  event.preventDefault();
                  changeActiveOrganization.mutate({ organizationId: team.id });
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      src={team?.logo || undefined}
                      alt={team?.name as string}
                    />
                    <AvatarFallback className="rounded-md">
                      <CommandIcon />
                    </AvatarFallback>
                  </Avatar>
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href="/new-organization">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Organization
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
