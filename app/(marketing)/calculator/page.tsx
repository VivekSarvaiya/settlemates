import type { Metadata } from "next";
import { JsonLd } from "@/components/shared";
import { ROUTES } from "@/config/routes";
import {
  CalculatorFaq,
  CalculatorHero,
  HowToSplit,
  KeepTrack,
} from "./_components";
import { CALCULATOR_PAGE } from "./_lib/const";
import { buildCalculatorStructuredData } from "./_lib/structuredData";

const SOCIAL_TITLE = `${CALCULATOR_PAGE.title} — SettleMates`;

export const metadata: Metadata = {
  title: CALCULATOR_PAGE.title,
  description: CALCULATOR_PAGE.description,
  alternates: { canonical: ROUTES.splitBillCalculator },
  openGraph: {
    type: "website",
    url: ROUTES.splitBillCalculator,
    siteName: "SettleMates",
    locale: "en_IN",
    title: SOCIAL_TITLE,
    description: CALCULATOR_PAGE.description,
  },
  twitter: {
    card: "summary",
    title: SOCIAL_TITLE,
    description: CALCULATOR_PAGE.description,
  },
};

export default function SplitBillCalculatorPage() {
  return (
    <>
      <JsonLd data={buildCalculatorStructuredData()} />
      <CalculatorHero />
      <HowToSplit />
      <CalculatorFaq />
      <KeepTrack />
    </>
  );
}
