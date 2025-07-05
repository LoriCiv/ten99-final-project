import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Add the routes that should be accessible to everyone,
  // logged in or not. In our case, just the landing page.
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
