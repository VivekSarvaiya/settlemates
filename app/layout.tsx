import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "SettleMates — Split expenses, not friendships",
    template: "%s — SettleMates",
  },
  description:
    "Type what everyone paid and see who pays whom in seconds. Free, no sign-up, nothing saved.",
  openGraph: {
    siteName: "SettleMates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={cn("h-full antialiased", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
