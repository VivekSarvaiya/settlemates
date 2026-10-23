import { ROUTES } from "@/config/routes";
import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "How it works", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Features", href: "/#features", sectionId: "features" },
  { label: "FAQ", href: "/#faq", sectionId: "faq" },
  { label: "Bill calculator", href: ROUTES.splitBillCalculator },
];
