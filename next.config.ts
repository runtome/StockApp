import type { NextConfig } from "next";

const HF_SPACE_URL = process.env.HF_SPACE_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!HF_SPACE_URL) return [];
    return [
      {
        source: "/hf/:path*",
        destination: `${HF_SPACE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
