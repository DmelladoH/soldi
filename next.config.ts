import dotenv from "dotenv";
dotenv.config();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  // Bundle optimizations
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  // experimental: {
  //   optimizePackageImports: ['lucide-react', 'recharts'],
  // },
  // webpack: (config, { isServer }) => {
  //   // Reduce bundle size by excluding unused locales
  //   if (!isServer) {
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //       '@formatjs/intl-localematcher': false,
  //     }
  //   }
  //   return config
  // },
  // turbo: {
  //   rules: {
  //     '*.svg': {
  //       loaders: ['@svgr/webpack'],
  //       as: '*.js',
  //     },
  //   },
  // },
};

export default nextConfig;
