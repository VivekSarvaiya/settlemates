import type { ReactNode } from "react";
import { MotionProvider } from "@/components/ui/motion-provider";
import { Footer, Header } from "./_components";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <noscript>
        <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </MotionProvider>
  );
}
