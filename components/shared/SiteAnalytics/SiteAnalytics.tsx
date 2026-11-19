"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { stripUrlFragment } from "@/lib/analytics";

export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={stripUrlFragment} />
      <SpeedInsights beforeSend={stripUrlFragment} />
    </>
  );
}
