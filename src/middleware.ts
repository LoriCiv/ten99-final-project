import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware({
  // The landing page is public and accessible to everyone.
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
