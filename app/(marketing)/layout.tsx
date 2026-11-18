import type { ReactNode } from "react";
import { MotionProvider } from "@/components/ui/motion-provider";
import { getAllPosts } from "@/lib/blog/posts";
import { Footer, Header } from "./_components";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const isBlogVisible = (await getAllPosts()).length > 0;

  return (
    <MotionProvider>
      <noscript>
        <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <Header isBlogVisible={isBlogVisible} />
      <main className="flex-1">{children}</main>
      <Footer isBlogVisible={isBlogVisible} />
    </MotionProvider>
  );
}
