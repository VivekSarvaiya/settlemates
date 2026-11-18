import { ROUTES } from "@/config/routes";
import type { FooterLinkGroup } from "./types";

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    label: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Coming soon", href: "/#coming-soon" },
      { label: "FAQ", href: "/#faq" },
      { label: "Split bill calculator", href: ROUTES.splitBillCalculator },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Blog", href: ROUTES.blog, isBlogLink: true },
      { label: "About", href: ROUTES.about },
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Terms", href: ROUTES.terms },
    ],
  },
];
