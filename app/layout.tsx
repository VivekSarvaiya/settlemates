import { OG_COLORS } from "@/components/shared/OgImage/const";
import { env } from "@/config/env";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: OG_COLORS.background,
};

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
