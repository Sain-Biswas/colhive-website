import { hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { users } from "@/database/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";

export const usersRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashed = hashSync(input.password, 10);

      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashed,
        emailVerified: new Date(),
      });
    }),

  currentUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        activeOrganization: true,
        password: false,
      },
    });

    return user;
  }),

  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(users).where(eq(users.id, ctx.session.user.id));
  }),
});
