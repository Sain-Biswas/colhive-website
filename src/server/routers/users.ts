import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcryptjs";
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
        name: z.string().min(1, "User name is required."),
        email: z
          .string()
          .min(1, "Email is required.")
          .email("Please provide a valid Email"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long.")
          .max(16, "Password must be at most 16 characters long."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // Check if the email is already registered
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already registered.",
        });
      }

      // Hash the password
      const hashedPassword = await hash(input.password, 10);

      // Insert the new user
      await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        emailVerified: new Date(),
      });

      return { success: true, message: "User registered successfully" };
    }),

  currentUser: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    const user = await db.query.users.findFirst({
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

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  deleteUser: protectedProcedure
    .input(
      z.object({
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      // Fetch the user to verify the password
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          password: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify the password
      const isPasswordValid = await compare(input.password, user.password);

      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      // Delete the user
      await db.delete(users).where(eq(users.id, userId));

      return { success: true, message: "User deleted successfully" };
    }),
});
