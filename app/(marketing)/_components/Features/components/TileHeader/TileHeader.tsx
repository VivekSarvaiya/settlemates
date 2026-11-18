import { cn } from "cn";
import { HEADER_TONE_CLASSES } from "./const";
import type { TileHeaderProps } from "./types";

export function TileHeader({ id, feature, tone = "default" }: TileHeaderProps) {
  const toneClasses = HEADER_TONE_CLASSES[tone];

  return (
    <div className="flex flex-col gap-3">
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded",
          toneClasses.badge,
        )}
      >
        <feature.icon
          aria-hidden="true"
          className={cn("size-5", toneClasses.icon)}
        />
      </span>
      <h3 id={id} className="text-lg font-medium">
        {feature.title}
      </h3>
      <p className={cn("max-w-md text-base", toneClasses.description)}>
        {feature.description}
      </p>
    </div>
  );
}
