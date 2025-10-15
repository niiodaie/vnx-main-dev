import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // 👇 This forces all nested CSS to use the root PostCSS config
        "postcss.config.js": path.resolve("./postcss.config.js"),
      },
      rules: {
        "*.css": {
          loaders: [
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  config: path.resolve("./postcss.config.js"),
                },
              },
            },
          ],
        },
      },
    },
  },
};

export default nextConfig;
