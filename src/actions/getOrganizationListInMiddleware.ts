import { and, eq, ne } from "drizzle-orm";
import "server-only";

import { db } from "@/database";
import { members, users } from "@/database/schema";

export default async function getOrganizationListInMiddleware(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      activeOrganization: true,
    },
  });

  const [activeOrganization, listOrganization] = await Promise.all([
    db.query.members.findFirst({
      where: and(
        eq(members.userId, userId),
        eq(members.organizationId, user?.activeOrganization || "")
      ),
      with: {
        organization: true,
      },
    }),
    db.query.members.findMany({
      where: and(
        eq(members.userId, userId),
        ne(members.organizationId, user?.activeOrganization || "")
      ),
      with: {
        organization: true,
      },
    }),
  ]);

  return !!activeOrganization || listOrganization.length > 0;
}
