import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configure allowed image domains
  images: {
    domains: ['arweave.net', 'gateway.irys.xyz', 'devnet.irys.xyz', 'via.placeholder.com'],
  },
};

export default nextConfig;
