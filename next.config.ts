import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.137.1",
    "192.168.100.70",
    "localhost",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jewwyqibqseunzipxdcj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;