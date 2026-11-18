import type { Metadata } from "next";
import { JsonLd } from "@/components/shared";
import { ROUTES } from "@/config/routes";
import { ComingSoon, Faq, Features, Hero, HowItWorks } from "./_components";
import { HOME_PAGE, SITE_NAME } from "./_lib/const";
import { buildHomeStructuredData } from "./_lib/structuredData";

export const metadata: Metadata = {
  title: { absolute: HOME_PAGE.title },
  description: HOME_PAGE.description,
  alternates: { canonical: ROUTES.home },
  openGraph: {
    type: "website",
    url: ROUTES.home,
    siteName: SITE_NAME,
    locale: "en_IN",
    title: HOME_PAGE.title,
    description: HOME_PAGE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE.title,
    description: HOME_PAGE.description,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={buildHomeStructuredData()} />
      <Hero />
      <HowItWorks />
      <Features />
      <ComingSoon />
      <Faq />
    </>
  );
}
