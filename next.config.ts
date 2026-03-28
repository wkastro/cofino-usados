import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcrypt"],
  cacheComponents: true,
  // bundle-barrel-imports: auto-transform barrel imports to direct imports at build time
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "date-fns",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-switch",
      "@radix-ui/react-label",
    ],
  },
};

export default nextConfig;
