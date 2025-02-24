"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function PathSwitcherInvitation() {
  const router = useRouter();
  const path = usePathname().slice(13);

  return (
    <div className="bg-muted text-muted-foreground flex gap-2 rounded-md p-1">
      <Button
        className={cn(
          "h-8 w-20 p-2",
          path === "project" &&
            "bg-background text-foreground hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground"
        )}
        variant="ghost"
        onClick={() => router.push("/invitations/project")}
      >
        Project
      </Button>
      <Button
        className={cn(
          "h-8 w-20 p-2",
          path === "recieved" &&
            "bg-background text-foreground hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground"
        )}
        variant="ghost"
        onClick={() => router.push("/invitations/recieved")}
      >
        Recieved
      </Button>
      <Button
        className={cn(
          "h-8 w-20 p-2",
          path === "sent" &&
            "bg-background text-foreground hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground"
        )}
        variant="ghost"
        onClick={() => router.push("/invitations/sent")}
      >
        Sent
      </Button>
    </div>
  );
}
