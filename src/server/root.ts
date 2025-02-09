import { createCallerFactory, createTRPCRouter } from "@/server/trpc";

import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  // post: postRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
