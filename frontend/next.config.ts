import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore
  allowedDevOrigins: [
    'vrsideforge.local',
    'vrsideforge.localhost',
    '100.123.106.125',
    '192.168.1.102'
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
      {
        source: '/socket.io',
        destination: 'http://127.0.0.1:4000/socket.io',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://127.0.0.1:4000/socket.io/:path*',
      },
    ]
  },
};

export default nextConfig;
