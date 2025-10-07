// next.config.ts
import type { NextConfig } from "next";

// Centralized CSP so you can tweak per env if needed
const csp = [
  "default-src 'self'",
  // Next.js needs inline/eval in dev; keep relaxed. In prod you can tighten if you want.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // App Router by default; keep Node runtime for server code (pg/drizzle)
  experimental: {
    typedRoutes: true,
    // Speed up react-icons bundle size by auto-optimizing imports
    optimizePackageImports: ["react-icons"],
    // If you ever use PPR or other features, toggle here.
    // ppr: "incremental",
  },

  images: {
    // Add remote patterns if you fetch avatars/logos from CDN
    remotePatterns: [
      // { protocol: "https", hostname: "images.example.com" },
    ],
  },

  // Keep builds portable for Node hosting (e.g. Railway/Fly/Render)
  output: "standalone",

  // Only lint src/ and do not fail production builds on lint warnings
  eslint: {
    dirs: ["src"],
  },

  // Make TS errors block the build (recommended). Flip to true if you need to ship fast.
  typescript: {
    // ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security hardening
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Keep CSP relaxed enough for Next dev; you can tighten in prod if needed.
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },

  // If some native deps cause optional peer issues (e.g., pg-native), silence them here.
  webpack: (config) => {
    // Example: prevent bundling optional native modules on the client
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
