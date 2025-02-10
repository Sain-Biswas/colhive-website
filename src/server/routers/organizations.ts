import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { members, organizations, users } from "@/database/schema";
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

      return {
        activeOrganization: activeOrganization?.organization,
        listOrganization: listOrganization.map((item) => item.organization),
      };
    }),
});
