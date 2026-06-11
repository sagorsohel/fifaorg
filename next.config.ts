import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.72", "192.168.0.100","192.168.10.179"],
}

export default nextConfig

