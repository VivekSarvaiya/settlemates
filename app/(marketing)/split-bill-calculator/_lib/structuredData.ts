import { ROUTES } from "@/config/routes";
import { SITE_LANGUAGE } from "@/config/site";
import { absoluteUrl, buildBreadcrumbList, getPublisherReference } from "@/lib/seo";
import { CALCULATOR_FAQS } from "../_components/CalculatorFaq/const";
import { CALCULATOR_PAGE } from "./const";

export const buildCalculatorStructuredData = () => {
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
        inLanguage: SITE_LANGUAGE,
        isAccessibleForFree: true,
        featureList: [
          "Equal split of what each person paid",
          "Who pays whom settlement",
          "Leftover paisa assigned to named people",
          "Shareable link that reopens the split",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        publisher: getPublisherReference(),
      },
      buildBreadcrumbList([
        { name: "Home", path: ROUTES.home },
        { name: CALCULATOR_PAGE.breadcrumb, path: ROUTES.splitBillCalculator },
      ]),
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
