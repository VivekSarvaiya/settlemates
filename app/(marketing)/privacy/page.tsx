import type { Metadata } from "next";
import { LEGAL_MDX_COMPONENTS } from "@/components/mdx";
import { LegalPage } from "@/components/shared";
import { ROUTES } from "@/config/routes";
import PrivacyContent from "@/content/pages/privacy.mdx";
import { getLegalSections } from "@/lib/contentPages";
import { PRIVACY_HIGHLIGHTS, PRIVACY_PAGE } from "./_lib/const";

export const metadata: Metadata = {
  title: PRIVACY_PAGE.title,
  description: PRIVACY_PAGE.description,
  alternates: { canonical: ROUTES.privacy },
};

export default async function PrivacyPage() {
  const sections = await getLegalSections("privacy");

  return (
    <LegalPage
      title={PRIVACY_PAGE.title}
      breadcrumb="Privacy"
      summary={PRIVACY_PAGE.summary}
      updatedAt={PRIVACY_PAGE.updatedAt}
      highlights={PRIVACY_HIGHLIGHTS}
      sections={sections}
    >
      <PrivacyContent components={LEGAL_MDX_COMPONENTS} />
    </LegalPage>
  );
}
