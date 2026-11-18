import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";
import { BRAND_LOGO_PATH, HOME_PAGE, SITE_NAME } from "./const";

const absoluteUrl = (path: string) => new URL(path, env.SITE_URL).toString();

// WebSite is what Google reads to show "SettleMates" as the site name above results.
export const buildHomeStructuredData = () => {
  const homeUrl = absoluteUrl(ROUTES.home);
  const organizationId = `${homeUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description: HOME_PAGE.description,
        inLanguage: "en-IN",
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
