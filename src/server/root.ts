import { createCallerFactory, createTRPCRouter } from "@/server/trpc";

import { membersRouter } from "./routers/members";
import { organizationsRouter } from "./routers/organizations";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  organizations: organizationsRouter,
  members: membersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
