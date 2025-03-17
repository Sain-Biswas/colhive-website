import { LogsIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RouterOutputs } from "@/trpc/trpc-react-provider";

interface ProjectPageCardProps {
  data: RouterOutputs["projects"]["getProjectList"][0];
}

export default function ProjectPageCard({ data }: ProjectPageCardProps) {
  const fallback = data.name
    .split(" ")
    .map((c) => c.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex gap-3">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={data.logo || undefined} />
            <AvatarFallback className="size-8 rounded-lg text-xs font-bold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center">
            <CardTitle>{data.name}</CardTitle>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <LogsIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Something</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{data.description}</p>
        <div>
          <p>Managers</p>
          <div></div>
        </div>
      </CardContent>
    </Card>
  );
}
