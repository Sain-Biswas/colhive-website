import { eq } from "drizzle-orm";
import "server-only";

import { db } from "@/database";
import { members, users } from "@/database/schema";

export default async function getOrganizationListInMiddleware(userId: string) {
  const [user, organizationsList] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        activeOrganization: true,
      },
    }),
    db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        organization: true,
      },
    }),
  ]);

  const activeOrganization = organizationsList.find(
    (item) => item.organizationId === user?.activeOrganization
  )?.organization;

  const listOrganization = organizationsList
    .filter((item) => item.organizationId !== user?.activeOrganization)
    .map((item) => item.organization);

  return !!activeOrganization || listOrganization.length > 0;
}
