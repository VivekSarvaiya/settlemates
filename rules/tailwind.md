# Tailwind & Design System

Assumes `react.md` and `nextjs.md` in this same folder. This file governs styling only. The values referenced below (colors, type scale, radius) are defined in `docs/UIUX-Design.md` — this file is about *enforcing* them in code, not re-deriving them.

## General

- Tailwind CSS + shadcn/ui only. No CSS-in-JS, no `.module.css` files, no inline `style={{}}` for anything expressible as a utility class.
- shadcn primitives (`components/ui/`) are generated, not hand-styled from scratch — customize via `tailwind.config` tokens so the change applies everywhere the primitive is used, not by editing individual instances.

## Hard rule: no arbitrary values

**Never** use Tailwind's arbitrary-value syntax: `w-[123px]`, `mt-[17px]`, `text-[15px]`, `bg-[#0D9488]`. Every value comes from the scale defined in `tailwind.config`. If a value you need doesn't exist in the scale, that's a signal to add it to the config once — not to reach for an arbitrary value inline. An arbitrary value is a design-system leak: it can't be found with a search for the token name, and it won't move when the token changes.

```tsx
// Bad — arbitrary values, invisible to the design system.
<div className="mt-[17px] text-[15px] bg-[#0D9488] rounded-[10px]">

// Good — every value is a named token.
<div className="mt-4 text-md bg-primary rounded">
```

## Hard rule: no raw color literals

**Never** `text-[#171717]`, `bg-[#0D9488]`, or `style={{ color: '#DC2626' }}`. Always the semantic class: `text-foreground`, `bg-primary`, `text-destructive`. This is not just cleanliness — it's why a full background-color change (an actual change made on this project, from pure white to a cool off-white) was a one-line edit in `globals.css` and touched zero component files. A raw hex anywhere in a component is a value that edit would have missed.

## Color Tokens

Map directly to `docs/UIUX-Design.md` Section 9 — don't introduce a class or a token that isn't listed there.

| Design token | Tailwind class | Use for |
|---|---|---|
| `--background` | `bg-background` | Page/app background |
| `--foreground` | `text-foreground` | Primary text |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | Subtle section fill / secondary text |
| `--border` | `border-border` | Dividers, input borders |
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` | Primary button fill / text on that fill |
| `--primary-text` | `text-primary-text` | Teal used as text or an icon color (not a button fill) — a non-default shadcn token, must be added to `tailwind.config` explicitly, see below |
| `--destructive` / `--destructive-foreground` | `bg-destructive` / `text-destructive-foreground` | Dangerous actions and "you owe" amounts, both reuse this one token per the design doc |
| `--ring` | `ring-ring` (shadcn default wiring) | Focus rings |

`tailwind.config.ts`:

```ts
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
  border: "var(--border)",
  primary: {
    DEFAULT: "var(--primary)",
    foreground: "var(--primary-foreground)",
    text: "var(--primary-text)",
  },
  destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
  ring: "var(--ring)",
},
```

## Spacing — fixed scale only

Same rule as colors: Tailwind's default spacing scale (`p-4`, `m-2`, `gap-6`, `space-y-8`), never an arbitrary value. Bias toward the larger steps for anything resembling a section boundary — `gap-6`/`gap-8`/`p-8`, not `gap-1`/`p-2` — per the design doc's "whitespace is a feature" principle. A tightly-packed `p-2` on a list row is usually a sign the layout is drifting back toward the "data entry" density the product is explicitly avoiding.

## Typography — exactly 3 sizes, 2 weights

This is the one place a default Tailwind setup will actively fight the design doc if left unconfigured: Tailwind ships its own `text-lg` (1.125rem/18px), which is not our `Large` token (24px). Don't create a second, differently-named scale (`text-caption`/`text-display`) alongside the untouched defaults — that leaves both scales usable and gives a coding agent room to pick the wrong one. Instead, **replace** `theme.fontSize` entirely (not `theme.extend.fontSize`) and reuse Tailwind's own `sm`/`base`/`lg` keys for our three sizes. This does two things at once: shadcn's generated components (which already use `text-sm`/`text-base` internally) inherit the correct values with zero edits, and every other size utility (`text-xs`, `text-xl`, `text-2xl`, …) simply stops existing — a coding agent reaching for one gets a build-time failure, not a silent style bug.

```ts
// tailwind.config.ts — replaces the scale, does not extend it
theme: {
  fontSize: {
    sm: ["0.8125rem", { lineHeight: "1.4" }],   // 13px — Small: captions, metadata, timestamps
    base: ["0.9375rem", { lineHeight: "1.5" }], // 15px — Medium: the default, body/buttons/inputs/nav
    lg: ["1.5rem", { lineHeight: "1.25" }],     // 24px — Large: titles and primary numeric displays
  },
  fontWeight: {
    normal: "400",
    medium: "500",
  },
},
```

Replacing `fontWeight` the same way removes `font-bold`, `font-semibold`, and `font-light` from the available classes entirely — the two-weight rule becomes a build-time guarantee, not a convention someone has to remember.

```tsx
// Bad — reaches for a Tailwind default that no longer represents the design system's intent.
<p className="text-xl font-semibold">₹2,450</p>

// Good — one of the three configured sizes, one of the two configured weights.
<p className="text-lg font-medium">₹2,450</p>
```

## Radius

One token, everywhere:

```ts
borderRadius: {
  DEFAULT: "var(--radius)", // 0.625rem, per the design doc
  full: "9999px",           // avatars, the floating action button only
},
```

`rounded` (the default) or `rounded-full` — nothing else. No `rounded-md`/`rounded-xl`/`rounded-[10px]` scattered around implying there's a choice to make.

## Component Variants

shadcn ships `class-variance-authority` (cva) for `Button` and similar primitives. Extend that pattern for any new variant-driven component rather than hand-rolling a ternary or template-string className — keeps variant logic declarative and colocated with the component, consistent with the rest of the primitives already in the codebase.

## Icons

`lucide-react` only — no second icon library, ever, even for "just one icon we need." Single stroke weight, no filled variants. Pair every icon with a visible text label except the universal cases already listed in the design doc (back, close, add). An icon-only control still needs an `aria-label` — that's a `react.md`/accessibility concern, not a styling one, but it's easy to lose track of it here.

## Responsive

Mobile-first, unprefixed utilities are the base case; `sm:`/`md:`/`lg:` only override for larger screens. Never write a desktop-first class and prefix the mobile override — the product is mobile-first per the PRD, and the class order should read that way too.

## Dark Mode

Not committed to shipping yet — the design doc leaves this open. If/when it ships: drive it with Tailwind's `dark:` variant swapping the same CSS variables inside a `.dark` scope in `globals.css`, not a second parallel set of utility classes. The semantic-token rule above is what makes this cheap later — don't undermine it now by hardcoding a color anywhere "because dark mode isn't built yet."

## Anti-Patterns

- Never an arbitrary value: `w-[123px]`, `text-[15px]`, `bg-[#hex]`, `mt-[17px]`.
- Never a raw hex, `rgb()`, or `hsl()` literal in a component — only semantic classes.
- Never a text-size utility outside the configured `text-sm`/`text-base`/`text-lg` trio.
- Never `font-bold`/`font-semibold`/`font-light` — only `font-normal`/`font-medium`.
- Never an inline `style` prop for color, spacing, or typography. Reserve it for genuinely dynamic runtime values Tailwind can't express (a computed width from JS state) — and even then, prefer setting a CSS variable via `style` and reading it from a Tailwind class over setting the property directly.
