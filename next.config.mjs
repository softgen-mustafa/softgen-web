// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import path from "path";

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            titleProp: true,
            ref: true,
          },
        },
      ],
    });

    // Rule for handling video files
    config.module.rules.push({
      test: /\.(mp4|avi|mov|wmv|flv)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
          outputPath: "static/videos",
          publicPath: "/_next/static/videos",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
