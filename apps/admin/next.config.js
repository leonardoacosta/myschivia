import { fileURLToPath } from "url";
import createJiti from "jiti";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  // scope: "/",
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
      "www.ntxb.org",
    ],
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@tribal-cities/api",
    "@tribal-cities/auth",
    "@tribal-cities/db",
    "@tribal-cities/ui",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withPWA(config);
