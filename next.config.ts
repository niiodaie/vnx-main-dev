import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
