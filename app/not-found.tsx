import type { Metadata } from "next";
import { MotionProvider } from "@/components/ui/motion-provider";
import { NotFound } from "./_components";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFoundPage() {
  return (
    <MotionProvider>
      <noscript>
        <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <NotFound />
    </MotionProvider>
  );
}
