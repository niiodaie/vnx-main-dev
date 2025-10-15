import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {
      rules: {
        "*.css": ["postcss-loader"], // Force Turbopack to use PostCSS
      },
    },
    optimizeCss: false, // Disable LightningCSS to avoid conflict
  },
};

export default nextConfig;
