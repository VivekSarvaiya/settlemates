import Link from "next/link";
import { Split } from "lucide-react";
import { cn } from "cn";
import type { LogoProps } from "./types";

export function Logo({ inverse = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label="SettleMates home"
    >
      <span
        className={cn(
          "grid size-8 place-items-center rounded",
          inverse ? "bg-background text-foreground" : "bg-foreground text-background",
        )}
      >
        <Split aria-hidden="true" className="size-4" />
      </span>
      <span className="text-base font-medium tracking-tight">SettleMates</span>
    </Link>
  );
}
