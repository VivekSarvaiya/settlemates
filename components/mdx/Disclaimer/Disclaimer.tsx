import { Scale } from "lucide-react";
import { DISCLAIMER_TEXT } from "./const";

export function Disclaimer() {
  return (
    <aside
      aria-label="Disclaimer"
      className="flex gap-3 rounded border border-border p-5 text-sm text-muted-foreground"
    >
      <Scale aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{DISCLAIMER_TEXT}</p>
    </aside>
  );
}
