import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Upload source maps for readable stack traces
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  // Route browser requests through Next.js to bypass ad-blockers
  tunnelRoute: "/monitoring",
  // Suppress noisy build logs
  silent: !process.env.CI,
});
