import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import {
  projectMembers,
  projectTasks,
  projects,
  users,
} from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const projectsRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is needed for creation."),
        organizationId: z.string().uuid(),
        description: z.string(),
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
          description: input.description,
        })
        .returning({ id: projects.id });

      await ctx.db.insert(projectMembers).values(
        input.members.map((i) => ({
          ...i,
          projectId: project[0].id,
        }))
      );
    }),

  getProjectList: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        activeOrganization: true,
      },
    });

    const projectsList = await ctx.db.query.projects.findMany({
      where: eq(projects.organizationId, user?.activeOrganization || ""),
      columns: {
        id: true,
        name: true,
        description: true,
        logo: true,
        identifier: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        members: {
          where: eq(projectMembers.role, "manager"),
          columns: {
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
        },
      },
    });

    const projectIdList = projectsList.map((project) => project.id);

    const memberOfProjects = await ctx.db
      .select()
      .from(projectMembers)
      .where(
        and(
          inArray(projectMembers.projectId, projectIdList),
          eq(projectMembers.userId, ctx.session.user.id)
        )
      );

    const memberOfProjectsList = memberOfProjects.map(
      (project) => project.projectId
    );

    return projectsList
      .filter((item) => memberOfProjectsList.includes(item.id))
      .map((project) => ({
        id: project.id,
        identifier: project.identifier,
        logo: project.logo,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        managers: project.members.map((manager) => ({
          role: manager.role,
          id: manager.user.id,
          email: manager.user.email,
          name: manager.user.name,
          image: manager.user.image,
        })),
      }));
  }),

  getProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().ulid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: {
          activeOrganization: true,
        },
      });
      return ctx.db.query.projects.findFirst({
        where: and(
          eq(projects.identifier, input.projectId),
          eq(projects.organizationId, user?.activeOrganization || "")
        ),
        columns: {
          createdAt: true,
          description: true,
          identifier: true,
          logo: true,
          name: true,
          updatedAt: true,
          id: true,
        },
        with: {
          members: {
            where: eq(projectMembers.role, "manager"),
            columns: {
              role: true,
            },
            with: {
              user: {
                columns: {
                  email: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  getProjectMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.db.query.projectMembers.findMany({
        where: eq(projectMembers.projectId, input.projectId),
        with: {
          user: true,
        },
      });

      return members.map((member) => ({
        name: member.user.name,
        role: member.role,
        image: member.user.image,
        email: member.user.email,
      }));
    }),

  createNewTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        userId: z.string().uuid(),
        tag: z.enum([
          "documentation",
          "bug",
          "fix",
          "feature",
          "chore",
          "refactor",
          "build",
          "test",
        ]),
        status: z.enum(["backlog", "todo", "in-progress", "done", "canceled"]),
        priority: z.enum(["low", "medium", "high"]),
        title: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [user, project] = await Promise.all([
        ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: {
            id: true,
            activeOrganization: true,
          },
        }),
        ctx.db.query.projects.findFirst({
          where: eq(projects.identifier, input.projectId),
          columns: {
            id: true,
          },
        }),
      ]);

      if (!user || !project) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No user found",
        });
      }

      await ctx.db.insert(projectTasks).values({
        projectId: project.id,
        assignedBy: user.id,
        organizationId: user?.activeOrganization || "",
        priority: input.priority,
        status: input.status,
        tag: input.tag,
        title: input.title,
        userId: input.userId,
      });
    }),

  getOrganizationTasks: protectedProcedure
    .input(
      z.object({
        projectId: z.string().ulid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [user, project] = await Promise.all([
        ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: {
            id: true,
            activeOrganization: true,
          },
        }),
        ctx.db.query.projects.findFirst({
          where: eq(projects.identifier, input.projectId),
          columns: {
            id: true,
          },
        }),
      ]);

      if (!user || !project) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User or Project not found.",
        });
      }

      return await ctx.db.query.projectTasks.findMany({
        where: and(
          eq(projectTasks.organizationId, user.activeOrganization || ""),
          eq(projectTasks.projectId, project.id)
        ),
        columns: {
          identifier: true,
          priority: true,
          status: true,
          title: true,
          tag: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          assignedBy: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }),
});
