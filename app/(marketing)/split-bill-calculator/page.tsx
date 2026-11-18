import type { Metadata } from "next";
import { JsonLd } from "@/components/shared";
import { ROUTES } from "@/config/routes";
import { SITE_NAME, SITE_OG_LOCALE } from "@/config/site";
import { LATEST_POST_LIMIT } from "@/lib/blog/const";
import { getAllPosts } from "@/lib/blog/posts";
import {
  CalculatorFaq,
  CalculatorHero,
  HowToSplit,
  KeepTrack,
  LatestGuides,
} from "./_components";
import { CALCULATOR_PAGE } from "./_lib/const";
import { buildCalculatorStructuredData } from "./_lib/structuredData";

const SOCIAL_TITLE = `${CALCULATOR_PAGE.title} — ${SITE_NAME}`;

export const metadata: Metadata = {
  title: CALCULATOR_PAGE.title,
  description: CALCULATOR_PAGE.description,
  alternates: { canonical: ROUTES.splitBillCalculator },
  openGraph: {
    type: "website",
    url: ROUTES.splitBillCalculator,
    siteName: SITE_NAME,
    locale: SITE_OG_LOCALE,
    title: SOCIAL_TITLE,
    description: CALCULATOR_PAGE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: CALCULATOR_PAGE.description,
  },
};

export default async function SplitBillCalculatorPage() {
  const latestPosts = (await getAllPosts()).slice(0, LATEST_POST_LIMIT);

  return (
    <>
      <JsonLd data={buildCalculatorStructuredData()} />
      <CalculatorHero />
      <HowToSplit />
      <CalculatorFaq />
      <LatestGuides posts={latestPosts} />
      <KeepTrack />
    </>
  );
}
