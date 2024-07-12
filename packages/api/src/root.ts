import { authRouter } from "./router/auth";
import { burnRouter } from "./router/burn";
import { campRouter } from "./router/camp";
import { cityPlanningRouter } from "./router/city-planning";
import { eventRouter } from "./router/event";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  burn: burnRouter,
  camp: campRouter,
  cityPlanning: cityPlanningRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
