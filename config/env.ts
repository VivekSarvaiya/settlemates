import { z } from "zod";

const envSchema = z.object({
  SITE_URL: z.url(),
});

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

// Falls back to Vercel's production domain, then localhost in dev only, so a build with no URL fails.
export const env = envSchema.parse({
  SITE_URL:
    process.env.SITE_URL ??
    (vercelProductionUrl
      ? `https://${vercelProductionUrl}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : undefined),
});
