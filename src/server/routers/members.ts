import { TRPCError } from "@trpc/server";
import { and, eq, ne } from "drizzle-orm";
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
      const { email, organizationId, role } = input;

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: {
          activeOrganization: true,
        },
      });

      if (!user?.activeOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not have an active organization.",
        });
      }

      const existingMember = await ctx.db.query.members.findFirst({
        where: and(
          eq(members.organizationId, organizationId),
          eq(users.email, email)
        ),
      });

      if (existingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this organization.",
        });
      }

      const existingInvitation = await ctx.db.query.invitations.findFirst({
        where: and(
          eq(invitations.organizationId, organizationId),
          eq(invitations.email, email),
          ne(invitations.status, "canceled")
        ),
      });

      if (existingInvitation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An invitation has already been sent to this email.",
        });
      }

      await ctx.db.insert(invitations).values({
        email,
        inviterId: ctx.session.user.id,
        organizationId,
        role,
        status: "pending",
      });

      return { success: true, message: "Invitation sent successfully." };
    }),

  getPendingInvitations: protectedProcedure.query(async ({ ctx }) => {
    const pendingInvitations = await ctx.db.query.invitations.findMany({
      where: and(
        eq(invitations.email, ctx.session.user.email || ""),
        eq(invitations.status, "pending")
      ),
      with: {
        sentFrom: true,
        organization: true,
      },
    });

    return pendingInvitations.map((invitation) => ({
      id: invitation.id,
      role: invitation.role,
      organizationName: invitation.organization?.name,
      organizationLogo: invitation.organization?.logo,
      organizationStatus: invitation.organization?.category,
      senderName: invitation.sentFrom?.name,
      senderLogo: invitation.sentFrom?.image,
      senderEmail: invitation.sentFrom?.email,
      sentOn: invitation.createdAt,
    }));
  }),

  getSentInvitations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        activeOrganization: true,
      },
    });

    if (!user?.activeOrganization) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have an active organization.",
      });
    }

    const sentInvitations = await ctx.db.query.invitations.findMany({
      where: and(
        eq(invitations.inviterId, ctx.session.user.id),
        eq(invitations.organizationId, user.activeOrganization)
      ),
      with: {
        sentTo: true,
      },
    });

    return sentInvitations.map((invitation) => ({
      id: invitation.id,
      role: invitation.role,
      status: invitation.status,
      sentName: invitation.sentTo.name,
      sentImage: invitation.sentTo.image,
      sentEmail: invitation.sentTo.email,
      sentOn: invitation.createdAt,
    }));
  }),

  acceptInvitation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await ctx.db.transaction(async (tx) => {
        const [invitation] = await tx
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.id, id))
          .returning();

        await tx.insert(members).values({
          organizationId: invitation.organizationId,
          userId: ctx.session.user.id,
          role: invitation.role,
        });
      });

      return { success: true, message: "Invitation accepted successfully." };
    }),

  rejectInvitation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invitations)
        .set({ status: "rejected" })
        .where(eq(invitations.id, input.id));

      return { success: true, message: "Invitation rejected successfully." };
    }),

  cancelInvitation: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invitations)
        .set({ status: "canceled" })
        .where(eq(invitations.id, input));

      return { success: true, message: "Invitation canceled successfully." };
    }),

  deleteInvitations: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(invitations).where(eq(invitations.id, input));

      return { success: true, message: "Invitation deleted successfully." };
    }),
});
