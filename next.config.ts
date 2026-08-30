import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export": ["./lib/fonts/**/*"],
  },
};

export default nextConfig;