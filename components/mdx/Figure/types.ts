import type { StaticImageData } from "next/image";

export interface FigureProps {
  src: StaticImageData;
  alt: string;
  caption?: string;
}
