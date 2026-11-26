import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone only for Docker self-host; Vercel uses its own output pipeline
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
