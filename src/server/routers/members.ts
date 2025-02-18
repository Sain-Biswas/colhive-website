import { eq } from "drizzle-orm";
import { z } from "zod";

import { invitations, members } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const membersRouter = createTRPCRouter({
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
