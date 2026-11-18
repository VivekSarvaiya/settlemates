"use client";

import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ErrorState } from "./_components";
import type { ErrorPageProps } from "./_components/ErrorState/types";
import "./globals.css";

export default function GlobalError({ retry }: ErrorPageProps) {
  return (
    <html lang="en-IN" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <title>Something went wrong — SettleMates</title>
        <ErrorState onRetry={retry} />
      </body>
    </html>
  );
}
