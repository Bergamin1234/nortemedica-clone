import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "d5gag3xtge2og.cloudfront.net" },
      { protocol: "https", hostname: "dw0jruhdg6fis.cloudfront.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" }
    ]
  }
};

export default nextConfig;
