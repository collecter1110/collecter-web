import type { NextConfig } from "next";

const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "https://image.collecter.kr";
const imageHost = new URL(imageBase).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: imageHost },
    ],
  },
};

export default nextConfig;
