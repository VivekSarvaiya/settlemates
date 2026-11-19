import { OG_COLORS } from "@/components/shared/OgImage/const";
import { SiteAnalytics } from "@/components/shared/SiteAnalytics/SiteAnalytics";
import { env } from "@/config/env";
import { inter } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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
    "Type what everyone paid and see who pays whom in seconds. Free, no sign-up, and your split is never saved.",
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
