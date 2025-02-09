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

  getOrganizationList: protectedProcedure
    .input(
      z.object({
        activeOrganizationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [] = await Promise.all([]);
    }),
});
