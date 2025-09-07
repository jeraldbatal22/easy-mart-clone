import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  }
};

export default nextConfig;
