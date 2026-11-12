# SettleMates — UI/UX Design Document

This document defines the visual language and interaction rules for the SettleMates web app. It supersedes the earlier exploratory palette (teal + coral + emerald + rose) from initial design conversation — the direction below reflects the current brief: a single primary color, white background, black text, strict 2-weight/3-size typography, and a calculator-simple feel rather than a data-entry-software feel. Built for the existing stack: Next.js, Tailwind CSS, shadcn/ui.

---

## 1. Design Philosophy

The category already has established players with the same feature set — group expenses, splitting, settlement. SettleMates doesn't win on features; it wins on **how little thinking it requires to use.**

The benchmark isn't other expense apps. It's a calculator, or a clean spreadsheet with room to breathe. Both are tools people trust *because* they're simple: you know exactly where to look, exactly what to enter, and exactly what the number means. That's the standard every screen in this app is held to — not "does it look modern," but "could someone use this correctly without reading anything."

## 2. Core UX Principles

1. **Never make the user guess.** Every screen has one obvious next action. Every action gives immediate, visible confirmation. If a first-time user has to pause and think "wait, where do I—," the screen has failed, regardless of how it looks.
2. **Whitespace is a feature, not empty space.** Density signals "data entry." Space signals "this is easy." When in doubt, remove a border or a line before adding one — let spacing do the separating.
3. **Numbers are the product.** Amounts and balances are the most important thing on almost every screen. They get the largest type, the most contrast, and the most visual priority — everything else (labels, metadata, icons) is quieter by design.
4. **One primary action per screen.** Exactly one filled, teal button visible at a time. Every competing action is secondary (outline/ghost/text), so the eye is never asked to choose between two loud things.
5. **Consistency over novelty.** Two font weights, three font sizes, one primary color, one radius scale — used identically everywhere. The system's restraint is what makes it feel calm rather than the opposite.

## 3. Visual Design System

### 3.1 Color System

**The one functional exception — reused, not new:**

| Token | Hex | Usage |
|---|---|---|
| Destructive | text-destructive | shadcn's standard destructive variant — delete expense, remove member, revoke invite — **and** reused for "you owe" balance amounts |

This is the one deliberate compromise on "single primary color": shadcn ships a destructive red regardless, because delete actions need one. Rather than adding a second brand hue for the "you owe" state, SettleMates reuses that same red. "You're owed" reuses the primary teal itself. Net result: **two colors do all the work, and neither exists solely for decoration.**

**If you'd rather go fully monochrome:** drop color from balance amounts entirely and rely on a `+`/`−` prefix plus weight (e.g., medium weight for owed-to-you, same weight but a "you owe" label above it) instead of color. It's more restrained but asks slightly more of the eye at a glance. Worth testing both with a few real users before locking it in — flagging this as a genuine open choice, not a settled one.

**Color usage rules:**
- Primary teal is *never* decorative — no teal backgrounds on cards, no teal illustrations. It only ever means "this is the button to press" or "this number is positive."
- Never introduce a third hue for a new feature later without revisiting this document first — that's how single-primary systems quietly become five-color systems.

### 3.2 Typography System

**Typeface: Inter.** Excellent legibility at small sizes, true tabular figures for currency alignment, and it's the de facto default for shadcn/Tailwind projects — nothing to fight with in setup.

**Exactly two weights, everywhere:**

| Weight | Value | Usage |
|---|---|---|
| Regular | 400 | Body text, labels, list items, secondary content — the default for almost everything |
| Medium | 500 | Anything that needs to stand out: headings, active nav/tab state, primary numbers, button labels |

No bold (700). If something needs *more* emphasis than Medium can give it, that's a signal to use the Large size or better spacing — not a heavier weight.

**Exactly three sizes, everywhere:**

| Token | Size | Line height | Usage |
|---|---|---|---|
| Small | 13px / 0.8125rem | 1.4 | Timestamps, captions, helper text, badges, metadata under a list item |
| Medium | 15px / 0.9375rem | 1.5 | The workhorse: body copy, buttons, inputs, nav items, list item titles |
| Large | 24px / 1.5rem | 1.25 | Page/section titles **and** primary numeric displays (balances, expense totals) |

Hierarchy beyond these three comes from **weight, color, and position** — not a fourth size. A page title and a balance amount are both "Large" — what differentiates them is that the balance is also teal or red, and sits in a more prominent position on the screen.

### 3.3 Spacing & Layout

Use Tailwind's default spacing scale, but bias deliberately toward the larger steps:
- **4–8px** — inside tight clusters only (icon-to-label gap)
- **16px** — default padding inside cards/list rows
- **24–32px** — between distinct sections on a screen
- **48px+** — above/below a hero number (e.g., the balance summary) to let it breathe

Max content width on desktop: ~640–720px for anything reading like a form or a list — this is a mobile-first tool, and letting content stretch edge-to-edge on a wide screen recreates the "spreadsheet" feeling this system is designed to avoid.

### 3.4 Iconography

Use `lucide-react` (shadcn's default icon set) exclusively — don't mix icon libraries. Single stroke weight, no filled icon variants. Icons are always paired with a text label except in genuinely universal cases (back arrow, close/×, add/+) — an icon-only interface is exactly the kind of "make the user guess" pattern this product is trying to avoid.

### 3.5 Elevation, Borders & Radius

- **No drop shadows.** Separation comes from whitespace and the occasional `1px` border in `--border`, not elevation. This is a deliberate part of the "flat, calculator" feel — shadows read as "app chrome," flat reads as "tool."
- **Single radius token:** `0.625rem` (10px) on cards, inputs, and buttons. Fully rounded (`9999px`) only for avatars and any floating action button. One scale, no exceptions.

### 3.6 Motion

Short and purposeful only: a 150–200ms ease-out on state changes (tab switch, list item appearing, sheet opening). No looping animation, no decorative motion. Every animated element must respect `prefers-reduced-motion`. (Landing-page marketing motion — scroll reveals, product video — is a separate, more expressive system; see the earlier design discussion for that. This section governs the authenticated app only.)

---

## 4. Component Library — shadcn/ui Mapping

| App need | shadcn component | Notes |
|---|---|---|
| Primary/secondary actions | `Button` | Variants: `default` (teal, one per screen), `outline`/`ghost` for everything else, `destructive` only for delete/remove |
| Balance summary, singular highlight blocks | `Card` | Reserve for *singular* summary blocks only |
| Expense list, activity feed | **Not** `Table` | See Section 8 — build list rows from flex/div, not a data table |
| Add-expense flow | `Sheet` | Slide up from the bottom on mobile — keeps context, feels like a lightweight overlay rather than a full page navigation |
| Confirmations (delete, revoke) | `Dialog` | Reserved for genuinely destructive or hard-to-undo actions only |
| Group/Expenses/Balances/Settle switch | `Tabs` | Exactly one active state styling, per Section 3.2 |
| Payer/member avatars | `Avatar` | Initials fallback, tinted background per person (see the earlier mockup pattern) |
| Split-type or category tags | `Badge` | Sparingly — a badge on every row is noise |
| Action feedback ("Expense added," "Settled up") | `Sonner` (toast) | Every mutation gets one — reinforces Principle 1 (never make the user guess what just happened) |
| Split-type picker | `Select` | |
| Loading states | `Skeleton` | Matches the shape of the content it's replacing — prevents layout shift |
| List dividers | `Separator` | Use whitespace first; reach for this only when items would otherwise blur together |
| Icon-only button explanation | `Tooltip` | Pairs with the iconography rule in 3.4 |

---

## 5. Navigation & Information Architecture

- **Persistent, minimal bottom navigation on mobile** — Dashboard, Quick Split, Profile. Three destinations, never more, so there's never a moment of "which tab am I even looking for."
- **One consistent back pattern.** Every non-root screen has a back control in the same position (top-left). No relying on the browser back button as the only way out of a flow.
- **Empty states always carry a next action.** A group with no expenses yet doesn't just say "no expenses" — it shows the same primary "Add expense" action a populated group would show, in the same position. The user is never looking at a dead end.
- **Depth limit: two levels from the dashboard.** Dashboard → Group → (Add Expense / Settlement) is the deepest any flow goes. If a future feature would need a third level, it needs a design review, not just an implementation.

## 6. Interaction & Mobile-First Accessibility Rules

- **Touch targets:** minimum 44×44px for anything tappable, per WCAG/Apple HIG — this is non-negotiable on a mobile-first product.
- **Thumb zone:** primary actions (Add Expense, Settle Up) anchor to the bottom third of the screen on mobile, not the top — where a thumb actually reaches on a one-handed phone grip.
- **Focus states:** every interactive element gets a visible focus ring in the primary teal at sufficient contrast — this matters as much as color choice for the "no guessing" principle to hold for keyboard and screen-reader users too.
- **Screen reader labels:** every icon-only control (back, close, add) gets an `aria-label` — see Section 3.4.
- **Optimistic UI:** actions like adding an expense should reflect in the UI immediately (with the toast confirming success right after), not leave the user staring at a spinner wondering if the tap registered.

## 7. Key Screen Specifications

**Dashboard (Groups list)**
List of group cards (name, type icon, current net balance at Large size, colored teal/red per Section 3.1). One primary button: "Create group." Empty state (no groups yet): centered illustration-free message + the same primary button, front and center.

**Group Detail**
Balance summary at the top — the single largest, most prominent element on the screen (Large size, teal or red). Tabs below it: Expenses / Balances / Settle Up / Activity. Expense list as spacious rows, not a table (see Section 8). One floating primary action: Add Expense.

**Add Expense (Sheet, not a full page)**
Two lightweight steps, not one dense form: **(1)** amount + description — the calculator-like entry moment, big numeric input, nothing else competing for attention; **(2)** payer + participants + split type, presented only after step 1, so the user is never facing more than a handful of fields at once.

**Settlement**
A short, explainable list: "You pay Arjun ₹600," each line with a Mark Complete action. No settlement math shown as a wall of numbers — just the minimal set of payments, per the PRD's Smart Settlement Engine.

**Quick Split**
The single fastest flow in the product — no group context, no navigation chrome beyond a close button. Amount in, participants in, result out. This screen is the clearest test of the "calculator, not software" principle — if it takes more than a few taps, it's failed its own brief.

---

## 8. Anti-Patterns — What This Product Must Never Do

- **Never use a dense, multi-column data table for the expense or activity list.** This is the single fastest way to make the product feel like data-entry software. Build list rows from spacious flex layouts — a receipt, not a spreadsheet.
- **Never show more than one filled/teal button on a screen at once.** Every other action is outline, ghost, or text-only.
- **Never introduce a new accent color for a future feature without revisiting Section 3.1 first.**
- **Never leave an empty state without an obvious next action.**
- **Never require more than two taps to start adding an expense from a group screen.**
- **Never use a font size or weight outside the three-size, two-weight system defined in 3.2** — if something needs more emphasis, change color, spacing, or position instead.
- **Never let a flow go more than two levels deep from the dashboard** without a deliberate design review.

---

## 9. Accessibility Checklist

*(Cross-reference with `REVIEW-CHECKLIST.md` — this is the design-specific subset.)*

- [ ] All text/background pairs measured against WCAG 2.1 AA, not assumed from the palette above
- [ ] All touch targets ≥44×44px
- [ ] All icon-only buttons have `aria-label`s
- [ ] Focus rings visible and consistent across every interactive element
- [ ] Color is never the *only* signal (balance sign also uses `+`/`−` prefix, not color alone)
- [ ] All motion respects `prefers-reduced-motion`
- [ ] Tested with keyboard-only navigation, start to finish, on the core flow (create group → add expense → view settlement)
