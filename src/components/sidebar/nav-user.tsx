"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

import userSignOut from "@/actions/signOut";

import ModeToggleSwitch from "../mode-toggle-switch";

interface NavUserProps {
  user:
    | {
        image: string | null;
        name: string;
        id: string;
        email: string | null;
        emailVerified: Date | null;
        createdAt: Date | null;
        updatedAt: Date | null;
      }
    | undefined;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || undefined} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name
                    .split(" ")
                    .map((item) => item.charAt(0).toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name
                      .split(" ")
                      .map((item) => item.charAt(0).toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <ModeToggleSwitch />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await userSignOut();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// if(isPending){
//   return(
//     <SidebarMenuButton
//             size="lg"
//             className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//           >
//             <Skeleton className="h-8 w-8 rounded-lg"/>
//             <div className="grid flex-1 text-left text-sm leading-tight gap-1">
//               <Skeleton className="h-4"/>
//               <Skeleton className="h-2"/>
//             </div>
//             <Skeleton className="ml-auto size-4" />
//           </SidebarMenuButton>
//   )
// }

// if(isError){
//   return(
//     <SidebarMenuButton
//             size="lg"
//             className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//           >
//             <Avatar className="h-8 w-8 rounded-lg">
//               <AvatarFallback className="rounded-lg">
//                 <CircleXIcon/>
//               </AvatarFallback>
//             </Avatar>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-semibold">User fetch failed</span>
//               <span className="truncate text-xs">Try refreshing page</span>
//             </div>
//             <Skeleton className="ml-auto size-4" />
//           </SidebarMenuButton>
//   )
// }
