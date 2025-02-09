import { createCallerFactory, createTRPCRouter } from "@/server/trpc";

import { organizationsRouter } from "./routers/organizations";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  organizations: organizationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
