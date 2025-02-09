import { hashSync } from "bcryptjs";
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
