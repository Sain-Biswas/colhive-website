import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { invitations, members, organizations, users } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const organizationsRouter = createTRPCRouter({
  createOrganization: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.enum(["Enterprise", "Startup", "Free"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db
        .insert(organizations)
        .values({ name: input.name, category: input.category })
        .returning({ id: users.id });

      await ctx.db.insert(members).values({
        userId: ctx.session.user.id,
        organizationId: org[0].id,
        role: "owner",
      });

      await ctx.db.update(users).set({
        activeOrganization: org[0].id,
      });
    }),

  addOrganization: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.enum(["Enterprise", "Startup", "Free"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const org = await ctx.db
        .insert(organizations)
        .values({
          name: input.name,
          category: input.category,
        })
        .returning({ id: organizations.id });

      await Promise.all([
        ctx.db.insert(members).values({
          userId,
          organizationId: org[0].id,
          role: "owner",
        }),
        ctx.db
          .update(users)
          .set({ activeOrganization: org[0].id })
          .where(eq(users.id, userId)),
      ]);
    }),

  getOrganizationList: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
        columns: {
          activeOrganization: true,
        },
      });

      const [activeOrganization, listOrganization] = await Promise.all([
        ctx.db.query.members.findFirst({
          where: and(
            eq(members.userId, ctx.session.user.id),
            eq(members.organizationId, user?.activeOrganization as string)
          ),
          with: {
            organization: true,
          },
        }),
        ctx.db.query.members.findMany({
          where: and(
            eq(members.userId, ctx.session.user.id),
            ne(members.organizationId, user?.activeOrganization as string)
          ),
          with: {
            organization: true,
          },
        }),
      ]);

      console.log(activeOrganization, listOrganization);

      return {
        activeOrganization: activeOrganization?.organization,
        listOrganization: listOrganization.map((item) => item.organization),
      };
    }),

  changeActiveOrganizations: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ activeOrganization: input.organizationId })
        .where(eq(users.id, ctx.session.user.id));
    }),

  getMemberStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        activeOrganization: true,
        id: true,
      },
    });

    const data = await ctx.db
      .select()
      .from(members)
      .where(
        and(
          eq(members.userId, user?.id as string),
          eq(members.organizationId, user?.activeOrganization as string)
        )
      );

    return data[0] || null;
  }),

  getActiveOrganization: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        activeOrganization: true,
      },
    });

    const organization = await ctx.db.query.organizations.findFirst({
      where: eq(organizations.id, user?.activeOrganization as string),
    });

    return organization;
  }),

  getAllMembers: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allMembers = await ctx.db.query.members.findMany({
        where: eq(members.organizationId, input.organizationId),
        columns: {
          createdAt: true,
          id: true,
          updatedAt: true,
          role: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              image: true,
              name: true,
            },
          },
        },
      });

      return allMembers.map((member) => ({
        id: member.id,
        role: member.role,
        joiningDate: member.createdAt,
        lastChangesDone: member.updatedAt,
        memberId: member.user.id,
        name: member.user.name,
        image: member.user.image,
        email: member.user.email,
      }));
    }),

  sendInvitation: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        organizationId: z.string(),
        role: z.enum(["owner", "admin", "member"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invitations).values({
        email: input.email,
        inviterId: ctx.session.user.id,
        organizationId: input.organizationId,
        role: input.role,
        status: "pending",
      });
    }),
});
