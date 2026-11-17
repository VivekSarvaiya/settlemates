import { House, Plane } from "lucide-react";
import type { UpcomingMode } from "./types";

export const UPCOMING_MODES: UpcomingMode[] = [
  {
    icon: Plane,
    title: "Trip groups",
    description:
      "One running tab for the whole trip. Add expenses as they happen, then settle once at the end.",
  },
  {
    icon: House,
    title: "Shared living",
    description:
      "Rent, groceries and bills that repeat every month, with a monthly report of who's ahead and who's behind.",
  },
];
