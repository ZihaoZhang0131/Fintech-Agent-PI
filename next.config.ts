import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vinext runs route handlers inside a local Worker, which does not inherit
  // arbitrary shell variables. The launcher creates these values per process;
  // embedding them lets server-only routes reach the loopback Runtime.
  env: {
    LOCAL_RUNTIME_URL: process.env.LOCAL_RUNTIME_URL ?? "",
    LOCAL_RUNTIME_TOKEN: process.env.LOCAL_RUNTIME_TOKEN ?? "",
  },
};

export default nextConfig;
