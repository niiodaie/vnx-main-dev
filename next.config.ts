import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled via CLI flag (--turbopack)
  // PostCSS config is automatically detected from root postcss.config.js
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
