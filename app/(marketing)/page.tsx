import type { Metadata } from "next";
import { ROUTES } from "@/config/routes";
import { ComingSoon, Faq, Features, Hero, HowItWorks } from "./_components";

const TITLE = "SettleMates — Split expenses, not friendships";
const DESCRIPTION =
  "Type what everyone paid and see who pays whom in seconds. Free, no sign-up, nothing saved. Trips and shared flats coming soon.";

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
    card: "summary_large_image",
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
      <ComingSoon />
      <Faq />
    </>
  );
}
