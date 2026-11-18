import { ROUTES } from "@/config/routes";
import { SITE_LANGUAGE, SITE_NAME } from "@/config/site";
import { absoluteUrl, getOrganizationId } from "@/lib/seo";
import { BRAND_LOGO_PATH, HOME_PAGE } from "./const";

// WebSite is what Google reads to show "SettleMates" as the site name above results.
export const buildHomeStructuredData = () => {
  const homeUrl = absoluteUrl(ROUTES.home);
  const organizationId = getOrganizationId();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description: HOME_PAGE.description,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: homeUrl,
        logo: absoluteUrl(BRAND_LOGO_PATH),
      },
    ],
  };
};
