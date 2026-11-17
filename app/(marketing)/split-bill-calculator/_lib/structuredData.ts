import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";
import { CALCULATOR_FAQS } from "../_components/CalculatorFaq/const";
import { CALCULATOR_PAGE } from "./const";

const absoluteUrl = (path: string) => new URL(path, env.SITE_URL).toString();

export const buildCalculatorStructuredData = () => {
  const homeUrl = absoluteUrl(ROUTES.home);
  const pageUrl = absoluteUrl(ROUTES.splitBillCalculator);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: CALCULATOR_PAGE.appName,
        url: pageUrl,
        description: CALCULATOR_PAGE.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: "en-IN",
        isAccessibleForFree: true,
        featureList: [
          "Equal split of what each person paid",
          "Who pays whom settlement",
          "Leftover paisa assigned to named people",
          "Shareable link that reopens the split",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        publisher: { "@type": "Organization", name: "SettleMates", url: homeUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: CALCULATOR_PAGE.breadcrumb,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: CALCULATOR_FAQS.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      },
    ],
  };
};
