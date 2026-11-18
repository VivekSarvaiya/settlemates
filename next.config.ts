import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/calculator",
        destination: "/split-bill-calculator",
        permanent: true,
      },
    ];
  },
};

// Plugins are named as strings because Turbopack can't receive JavaScript functions.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
