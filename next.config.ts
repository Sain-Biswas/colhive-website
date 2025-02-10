import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
