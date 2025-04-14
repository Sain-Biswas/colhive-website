"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import LoadingSpinner from "@/components/general/loading-spinner";

import { api } from "@/trpc/trpc-react-provider";

interface ProjectMembersProps {
  projectId: string;
}

export default function ProjectMembers({ projectId }: ProjectMembersProps) {
  const { data: members } = api.projects.getProjectMembers.useQuery({
    projectId,
  });

  return (
    <Card>
      <CardHeader className="py-0">
        <div className="m-0 flex justify-between p-0">
          <CardTitle className="flex items-center justify-center text-lg">
            Members
          </CardTitle>
          <Badge>
            {members ? members.length : <LoadingSpinner isVisible />}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32 w-full">
          <div className="grid auto-rows-min grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            {!members && (
              <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-4">
                <LoadingSpinner isVisible className="size-6" />
                <p>Loading</p>
              </div>
            )}

            {members && members?.length === 0 && (
              <p className="col-span-2 py-4 text-center">No Members.</p>
            )}

            {members &&
              members?.map((member) => (
                <Card
                  className="flex flex-row gap-2 px-2 py-2"
                  key={member.email}
                >
                  <Avatar className="flex size-10 items-center justify-center rounded-md">
                    <AvatarImage src={member.image || undefined} />
                    <AvatarFallback className="size-10 rounded-md">
                      {member?.name
                        ?.split(" ")
                        .map((i) => i.charAt(0).toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="m-0 flex flex-col justify-center p-0">
                    <div className="flex flex-wrap justify-between">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>
                      <Badge variant="secondary" className="ml-1 capitalize">
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
