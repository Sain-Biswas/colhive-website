import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { invitations, members, users } from "@/database/schema";
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

  getPendingInvitations: protectedProcedure.query(async ({ ctx }) => {
    const list = await ctx.db.query.invitations.findMany({
      where: and(
        eq(invitations.email, ctx.session.user.email as string),
        eq(invitations.status, "pending")
      ),
      with: {
        sentFrom: true,
        organization: true,
      },
    });

    return list.map((item) => ({
      id: item.id,
      role: item.role,
      organizationName: item.organization?.name,
      organizationLogo: item.organization?.logo,
      organizationStatus: item.organization?.category,
      senderName: item.sentFrom?.name,
      senderLogo: item.sentFrom?.image,
      senderEmail: item.sentFrom?.email,
      sentOn: item.createdAt,
    }));
  }),

  getSentInvitations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        activeOrganization: true,
        id: true,
      },
    });

    const list = await ctx.db.query.invitations.findMany({
      where: and(
        eq(invitations.inviterId, user?.id as string),
        eq(invitations.organizationId, user?.activeOrganization as string)
      ),
      with: {
        sentTo: true,
      },
    });

    return list.map((item) => ({
      id: item.id,
      role: item.role,
      status: item.status,
      sentName: item.sentTo.image,
      sentImage: item.sentTo.image,
      sentEmail: item.sentTo.email,
      sentOn: item.createdAt,
    }));
  }),

  acceptInvitation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db
        .update(invitations)
        .set({
          status: "accepted",
        })
        .where(eq(invitations.id, input.id))
        .returning();

      await ctx.db.insert(members).values({
        organizationId: invitation[0].organizationId as string,
        userId: ctx.session.user.id,
        role: invitation[0].role,
      });
    }),

  rejectInvitation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invitations)
        .set({
          status: "rejected",
        })
        .where(eq(invitations.id, input.id));
    }),
});
