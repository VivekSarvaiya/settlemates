import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { CTA_DEFAULTS } from "./const";
import type { CtaCardProps } from "./types";

export function CtaCard({
  title = CTA_DEFAULTS.title,
  description = CTA_DEFAULTS.description,
}: CtaCardProps) {
  return (
    <aside className="flex flex-col items-start gap-4 rounded border border-border bg-muted/40 p-6 md:p-8">
      <p className="text-lg font-medium text-balance">{title}</p>
      <p className="text-base text-muted-foreground">{description}</p>
      <Button
        className="h-11 px-4"
        nativeButton={false}
        render={<Link href={ROUTES.splitBillCalculator} />}
      >
        {CTA_DEFAULTS.action}
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </aside>
  );
}
