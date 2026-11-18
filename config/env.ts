import { z } from "zod";

const isVercelProduction = process.env.VERCEL_ENV === "production";

const envSchema = z.object({
  SITE_URL: z
    .url()
    .refine(
      (url) => !isVercelProduction || new URL(url).hostname !== "localhost",
      "SITE_URL points to localhost in a production deploy. Set it to the real domain.",
    ),
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
