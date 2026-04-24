import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow hot module reloading and connections from local network addresses
  serverExternalPackages: [],
  // @ts-ignore - Next.js config schema error but required for network HMR
  allowedDevOrigins: ['192.168.1.5', 'localhost'],
};

export default nextConfig;
