"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LoadingSpinner from "@/components/general/loading-spinner";

import { api } from "@/trpc/trpc-react-provider";

interface ProjectMembersProps {
  projectId: string;
}

export default function ProjectMembers({ projectId }: ProjectMembersProps) {
  const { data: members, isFetching } = api.projects.getProjectMembers.useQuery(
    { projectId }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching && (
          <div className="flex flex-col items-center justify-center gap-2">
            <LoadingSpinner isVisible />
            <p>Loading</p>
          </div>
        )}

        {!isFetching && members?.length === 0 && <p>No Members.</p>}

        {!isFetching &&
          members?.map((member) => (
            <Card key={member.email}>
              <p>{member.name}</p>
            </Card>
          ))}
      </CardContent>
    </Card>
  );
}
