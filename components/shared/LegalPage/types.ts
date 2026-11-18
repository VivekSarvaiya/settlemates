import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { LegalSection } from "@/lib/contentPages";

export interface LegalHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LegalPageProps {
  title: string;
  breadcrumb: string;
  summary: string;
  updatedAt: string;
  highlights: LegalHighlight[];
  sections: LegalSection[];
  children: ReactNode;
}
