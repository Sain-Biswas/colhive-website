import { createCallerFactory, createTRPCRouter } from "@/server/trpc";

import { membersRouter } from "./routers/members";
import { organizationsRouter } from "./routers/organizations";
import { projectsRouter } from "./routers/project";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  organizations: organizationsRouter,
  members: membersRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
