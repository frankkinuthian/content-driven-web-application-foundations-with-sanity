import type { NextConfig } from "next";
import { fetchRedirects } from "@/sanity/lib/fetchRedirects";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  async redirects() {
    return await fetchRedirects();
  },
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactCompiler: true,
};

export default nextConfig;
