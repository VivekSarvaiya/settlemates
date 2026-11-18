import Image from "next/image";
import type { FigureProps } from "./types";

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={src}
        alt={alt}
        sizes="(min-width: 768px) 672px, 100vw"
        placeholder={src.blurDataURL ? "blur" : "empty"}
        className="h-auto w-full rounded border border-border"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
