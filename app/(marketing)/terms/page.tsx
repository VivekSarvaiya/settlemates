import type { Metadata } from "next";
import { LEGAL_MDX_COMPONENTS } from "@/components/mdx";
import { LegalPage } from "@/components/shared";
import { ROUTES } from "@/config/routes";
import TermsContent from "@/content/pages/terms.mdx";
import { getLegalSections } from "@/lib/contentPages";
import { TERMS_HIGHLIGHTS, TERMS_PAGE } from "./_lib/const";

export const metadata: Metadata = {
  title: TERMS_PAGE.title,
  description: TERMS_PAGE.description,
  alternates: { canonical: ROUTES.terms },
};

export default async function TermsPage() {
  const sections = await getLegalSections("terms");

  return (
    <LegalPage
      title={TERMS_PAGE.title}
      breadcrumb="Terms"
      summary={TERMS_PAGE.summary}
      updatedAt={TERMS_PAGE.updatedAt}
      highlights={TERMS_HIGHLIGHTS}
      sections={sections}
    >
      <TermsContent components={LEGAL_MDX_COMPONENTS} />
    </LegalPage>
  );
}
