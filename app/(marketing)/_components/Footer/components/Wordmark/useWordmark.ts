import type { PointerEvent } from "react";
import type { UseWordmarkParams } from "./types";

export const useWordmark = ({ text }: UseWordmarkParams) => {
  // Writes CSS variables straight to the element so the spotlight never re-renders the letters.
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    const wordmark = event.currentTarget;
    const rect = wordmark.getBoundingClientRect();
    wordmark.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    wordmark.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return { letters: Array.from(text), handlePointerMove };
};
