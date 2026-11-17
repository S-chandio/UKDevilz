import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The local preview uses this loopback address instead of localhost.
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["ffmpeg-static", "undici"],
};


export default nextConfig;
