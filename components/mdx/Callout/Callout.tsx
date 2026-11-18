import { cn } from "cn";
import { CALLOUT_VARIANTS } from "./const";
import type { CalloutProps } from "./types";

export function Callout({ variant = "note", title, children }: CalloutProps) {
  const { icon: Icon, label, iconClassName } = CALLOUT_VARIANTS[variant];

  return (
    <aside className="flex gap-3 rounded border border-border bg-muted/40 p-5">
      <Icon aria-hidden="true" className={cn("mt-1 size-5 shrink-0", iconClassName)} />
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-base font-medium">{title ?? label}</p>
        {children}
      </div>
    </aside>
  );
}
