/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is a new configuration to help with Clerk's server-side packages
  serverComponentsExternalPackages: ["@clerk/backend"],
};

export default nextConfig;
