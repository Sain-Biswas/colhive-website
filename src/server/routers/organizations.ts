import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { members, organizations, users } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const organizationsRouter = createTRPCRouter({
  addOrganization: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Organization name is required."),
        category: z.enum(["Enterprise", "Startup", "Free"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const org = await ctx.db.transaction(async (tx) => {
        const [org] = await tx
          .insert(organizations)
          .values({
            name: input.name,
            category: input.category,
          })
          .returning({ id: organizations.id });

        await tx.insert(members).values({
          userId,
          organizationId: org.id,
          role: "owner",
        });

        await tx
          .update(users)
          .set({ activeOrganization: org.id })
          .where(eq(users.id, userId));

        return org;
      });

      return { success: true, organizationId: org.id };
    }),

  getOrganizationList: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [user, organizationsList] = await Promise.all([
      ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          activeOrganization: true,
        },
      }),
      ctx.db.query.members.findMany({
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

    return {
      activeOrganization,
      listOrganization,
    };
  }),

  changeActiveOrganization: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().min(1, "Organization ID is required."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const isMember = await ctx.db.query.members.findFirst({
        where: and(
          eq(members.userId, userId),
          eq(members.organizationId, input.organizationId)
        ),
      });

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this organization.",
        });
      }

      await ctx.db
        .update(users)
        .set({ activeOrganization: input.organizationId })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  getMemberStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        activeOrganization: true,
      },
    });

    if (!user?.activeOrganization) {
      return null;
    }

    const memberStatus = await ctx.db.query.members.findFirst({
      where: and(
        eq(members.userId, userId),
        eq(members.organizationId, user.activeOrganization)
      ),
    });

    return memberStatus || null;
  }),

  getActiveOrganization: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        activeOrganization: true,
      },
    });

    if (!user?.activeOrganization) {
      return null;
    }

    const organization = await ctx.db.query.organizations.findFirst({
      where: eq(organizations.id, user.activeOrganization),
    });

    return organization || null;
  }),
});
