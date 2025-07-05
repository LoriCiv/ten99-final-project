import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // The landing page is public and accessible to everyone.
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
