import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    // config/env.ts requires SITE_URL outside dev; pinned so SEO helpers build stable URLs.
    env: { SITE_URL: "https://settlemates.test" },
    coverage: {
      provider: "v8",
      include: ["domains/expenses/split.ts", "domains/settlement/settle.ts"],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 90,
      },
    },
  },
});
