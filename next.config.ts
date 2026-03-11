import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  // Some versions of Next.js 15+ have different behaviors for the dev indicator
  // Ensuring it stays off.
};

export default nextConfig;
