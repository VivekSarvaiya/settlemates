import { ROUTES } from "@/config/routes";
import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "How it works", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Features", href: "/#features", sectionId: "features" },
  { label: "Coming soon", href: "/#coming-soon", sectionId: "coming-soon" },
  { label: "FAQ", href: "/#faq", sectionId: "faq" },
  { label: "Split bill calculator", href: ROUTES.splitBillCalculator },
];
