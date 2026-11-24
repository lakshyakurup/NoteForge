import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone only for Docker self-host; Vercel uses its own output pipeline
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
