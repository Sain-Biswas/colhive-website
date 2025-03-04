import { z } from "zod";

import { projectMembers, projects } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const projectsRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is needed for creation."),
        organizationId: z.string().uuid(),
        members: z
          .array(
            z.object({
              userId: z.string().uuid(),
              role: z.enum([
                "manager",
                "team-lead",
                "designer",
                "developer",
                "tester",
                "member",
                "sub-lead",
              ]),
            })
          )
          .min(1, "A project need atleast one member to be created."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db
        .insert(projects)
        .values({
          name: input.name,
          organizationId: input.organizationId,
        })
        .returning({ id: projects.id });

      await ctx.db.insert(projectMembers).values(
        input.members.map((i) => ({
          ...i,
          projectId: project[0].id,
        }))
      );
    }),
});
