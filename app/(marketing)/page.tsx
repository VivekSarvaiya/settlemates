import type { Metadata } from "next";
import { ROUTES } from "@/config/routes";
import { Faq, Features, Hero, HowItWorks } from "./_components";

const TITLE = "SettleMates — Split expenses, not friendships";
const DESCRIPTION =
  "Track shared expenses, split bills equally, and settle up with the minimal number of payments. No spreadsheets, no mental math.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.home },
  openGraph: {
    type: "website",
    url: ROUTES.home,
    siteName: "SettleMates",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Faq />
    </>
  );
}
