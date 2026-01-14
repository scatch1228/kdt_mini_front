import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: 'http://10.125.121.185:8080/api/login',
      },
      {
        source: '/api/:path*',
        destination: 'http://10.125.121.185:8080/:path*',
      },
    ];
  },
};
export default nextConfig;