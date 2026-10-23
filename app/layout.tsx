import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "SettleMates — Split expenses, not friendships",
    template: "%s — SettleMates",
  },
  description:
    "Track shared expenses, split bills any way you like, and settle up with the minimal number of payments. No spreadsheets, no mental math.",
  openGraph: {
    siteName: "SettleMates",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
