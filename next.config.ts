import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    image_link: process.env.image_link || "",
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.72", "192.168.0.100","192.168.10.179"],
}

export default nextConfig

