import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return [ROUTES.home, ROUTES.splitBillCalculator].map((path) => ({
    url: new URL(path, env.SITE_URL).toString(),
  }));
}
