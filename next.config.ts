import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lets the dev server serve HMR/dev assets when you open it from a phone
  // on the same network (via the "Network: http://<lan-ip>:3000" URL next
  // dev prints) instead of localhost. Dev-only — production builds don't
  // have this origin check at all.
  allowedDevOrigins: ["192.168.50.49"],
};

export default nextConfig;
