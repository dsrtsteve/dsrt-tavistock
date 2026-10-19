import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  async redirects() {
    return [
      {
        source: "/the-meavy-book-by-peter-swaine",
        destination: "/books",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
