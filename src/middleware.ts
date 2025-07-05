// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/"], // Add your public paths here
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
