import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const S3_HOSTNAME = "cofalusados.s3.us-east-2.amazonaws.com";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  media-src 'self' https://${S3_HOSTNAME};
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: cspHeader.replace(/\n/g, ""),
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: S3_HOSTNAME,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  serverExternalPackages: ["bcrypt"],
  cacheComponents: true,
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
