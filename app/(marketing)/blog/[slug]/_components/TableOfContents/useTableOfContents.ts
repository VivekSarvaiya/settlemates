import { useEffect, useState } from "react";
import type { PostHeading } from "@/lib/blog/types";
import { ACTIVE_HEADING_ROOT_MARGIN } from "./const";

export const useTableOfContents = (headings: PostHeading[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topmost) setActiveId(topmost.target.id);
      },
      { rootMargin: ACTIVE_HEADING_ROOT_MARGIN },
    );
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  return { activeId };
};
