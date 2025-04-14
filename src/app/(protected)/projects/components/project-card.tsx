import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { RouterOutputs } from "@/trpc/trpc-react-provider";

interface ProjectPageCardProps {
  data: Row<RouterOutputs["projects"]["getProjectList"][0]>;
}

export default function ProjectPageCard({ data }: ProjectPageCardProps) {
  const project = data.original;

  const fallback = project.name
    .split(" ")
    .map((c) => c.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex gap-3">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={project.logo || undefined} />
            <AvatarFallback className="size-8 rounded-lg text-xs font-bold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center">
            <Link href={`/projects/${project.identifier}`}>
              <CardTitle>{project.name}</CardTitle>
            </Link>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Something</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm">{project.description}</p>

        <div className="flex -space-x-1.5">
          {project.managers.map((manager) => (
            <HoverCard key={manager.id}>
              <HoverCardTrigger asChild>
                <Avatar className="border-foreground size-10 border hover:z-10">
                  <AvatarImage src={manager.image || undefined} />
                  <AvatarFallback className="size-10 text-xs font-bold">
                    {manager.name
                      .split(" ")
                      .map((c) => c.charAt(0).toUpperCase())
                      .join("")
                      .slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="flex gap-3 space-y-0.5">
                <Avatar className="border-foreground size-12 border hover:z-10">
                  <AvatarImage src={manager.image || undefined} />
                  <AvatarFallback className="size-12 text-sm font-bold">
                    {manager.name
                      .split(" ")
                      .map((c) => c.charAt(0).toUpperCase())
                      .join("")
                      .slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div className="grow justify-center">
                  <p className="m-0 p-0 text-lg font-bold">{manager.name}</p>
                  <p className="text-muted-foreground m-0 p-0 text-sm">
                    {manager.email}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
