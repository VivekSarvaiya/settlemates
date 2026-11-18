import type { PointerEvent } from "react";

export const useBentoTile = () => {
  // Writes CSS variables straight to the element so following the cursor never re-renders the tile.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const tile = event.currentTarget;
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    tile.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return { handlePointerMove };
};
