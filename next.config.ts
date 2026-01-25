import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Next.js
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend-url.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
