# AGENTS.md — SettleMates

**Read this file first, completely, before writing or changing any code.** It is the source of truth for this project. Implementation details live in `agent_docs/` — consult the relevant file there before coding a feature, don't guess.

---

## Project Overview & Stack

**Product:** SettleMates — a collaborative shared-expense management platform for group trips, quick one-time bill splits, shared living, and group events. It replaces spreadsheets, chat-message tracking, and manual math with automatic balance calculation and a transparent, explainable settlement engine.

**Primary user story (from the PRD, verbatim):**
> As a trip organizer, I want to create a trip, invite my friends, and track all shared expenses in one place so that everyone always knows the group's financial status and the trip can be settled effortlessly at the end.

**Stack:**
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form + Zod, Framer Motion (used sparingly)
- **Backend:** Next.js Route Handlers + Server Actions, Prisma ORM. No separate Express/NestJS service.
- **Database & managed services:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Hosting/CI:** Vercel (git-push-to-deploy, preview environments per PR)
- **Email:** Resend (transactional) · **Analytics:** PostHog + Vercel Analytics · **Errors:** Sentry
- **Testing:** Vitest + React Testing Library

**Architecture:** Full-stack monolith. One repository, one deployment. Business logic is organized into domain modules — do not blur these boundaries:
`trips` · `expenses` · `members` · `settlement` · `notifications` · `auth`

**Constraints to keep in mind at all times:** solo developer, ~$47/month OPEX target, 12–14 week timeline, launch scale 1,000–10,000 users. Prefer boring, managed solutions over anything requiring custom infrastructure.

Full detail: `agent_docs/tech_stack.md`, `agent_docs/product_requirements.md`, `docs/TechDesign-SettleMates-MVP.md`.

---

## Setup & Commands

The repository is scaffolded (see Current State). Always use pnpm — never npm or yarn:

```bash
pnpm install                 # install dependencies
pnpm dev                     # local dev server
pnpm exec prisma migrate dev # apply schema migrations (once Prisma exists)
pnpm exec prisma studio      # inspect local DB
pnpm lint                    # lint
pnpm exec tsc --noEmit       # typecheck (no "typecheck" script defined)
pnpm test                    # Vitest domain + component tests
pnpm run test:coverage       # coverage report (thresholds on the split engine)
SITE_URL=http://localhost:3000 pnpm build  # production build (SITE_URL is required)
vercel --prod                # deploy (or via GitHub integration)
```

---

## How I Should Think

Follow **Plan → Execute → Verify** for every feature, every time. Do not skip straight to code.

1. **Plan.** Before writing code, state in a few sentences what you're about to build, which domain module(s) it touches, and which files you'll create or change. If the tool supports a Plan/Reflect mode, use it here. Wait for approval before proceeding on anything non-trivial — a new endpoint, a schema change, or anything touching the settlement engine.
2. **Execute.** Implement one feature at a time, scoped to a single domain module where possible. Don't bundle unrelated changes into one pass.
3. **Verify.** After each feature: run the linter, typecheck, and relevant tests. Fix failures before moving to the next feature — don't stack unverified work.

This project has one area that deserves extra rigor beyond the loop above: **the settlement engine and balance/split calculations are the product's core trust mechanism.** Treat any change here as higher-stakes than an equivalent UI change — write the test first or alongside the change, not after.

---

## What NOT To Do

- Don't delete files without explicit confirmation.
- Don't change the database schema (Prisma schema, migrations) without a backup/rollback plan stated first.
- Don't build features out of phase — check the Roadmap below before starting something not in the current phase.
- Don't skip or comment-out failing tests to "make it pass."
- Don't bypass configured pre-commit hooks, linters, or formatters.
- Don't introduce deprecated or unmaintained libraries — check `agent_docs/tech_stack.md` for the approved set first.
- **Project-specific:** don't add payment processing, multi-currency support, native mobile builds, or chat/messaging features — these are explicitly Out of Scope for MVP (see `agent_docs/product_requirements.md`). If a task seems to need one of these, stop and flag it rather than building around it.
- **Project-specific:** don't silently invent an answer to something the PRD/Tech Design left open (e.g., invite-link expiry length, edit/delete permissions, equal-split rounding rule). These are listed as Open Questions in `docs/TechDesign-SettleMates-MVP.md` — implement the stated default assumption, but flag it back to the user rather than treating it as settled.

---

## Engineering Constraints

*(Full rigor — this is a Level B / developer project.)*

- **Type safety:** strict TypeScript throughout. No `any` without a comment justifying why it's unavoidable. Zod schemas validate all external input (API request bodies, form submissions) at the boundary — don't trust client-submitted data, especially split amounts.
- **Architectural sovereignty:** respect the domain module boundaries (`trips`, `expenses`, `members`, `settlement`, `notifications`, `auth`). Cross-domain logic goes through each domain's public interface, not direct reaches into another domain's internals.
- **Library governance:** don't add a new dependency without checking it against `agent_docs/tech_stack.md` first. Don't swap Prisma, Supabase, or the realtime layer for an alternative without explicit sign-off — these were deliberate decisions in the Tech Design, not defaults to revisit casually.
- **Workflow discipline:** feature-branch workflow with Pull Requests even as a solo developer; Conventional Commits; tests passing before merge. The settlement engine and split-validation logic should carry the highest test coverage in the codebase.

---

## Rules

Before writing or changing any code, read every file in `rules/` — these are
binding and override general best practice. If the folder does not exist, continue.

### Code Quality

* No unused imports, variables, dead code, commented-out code, or debug statements.
* Use camelCase for all frontend-owned variables, state, props, and function names.
* Snake_case is allowed only at the API boundary for backend contract fields.
* Keep naming consistent with surrounding code.

### UI Consistency

* Avoid conflicting or duplicate Tailwind classes.
* Follow existing spacing, button, modal, badge, and form patterns.
* Do not introduce one-off styling patterns without a strong reason.
* All new pages, components, dialogs, sections, and UI features should be styled using Tailwind CSS.
* Prefer Tailwind utility classes over custom CSS, SCSS, CSS modules, styled-components, inline styles, or MUI `sx` props.
* Reuse existing Tailwind patterns and design tokens before introducing new styles.
* New stylesheet files should not be added unless there is a documented technical requirement that cannot reasonably be implemented with Tailwind.

### Shared UI Components (Design System)

* Always use the shared design-system components from `@src/ui/components/*` instead of raw HTML elements or one-off implementations.
* **Buttons:** Use the `Button` component (`@src/ui/components/Button`) for every button UI element — actions, submit/cancel, close (✕), and icon-only buttons (`variant="ghost" size="icon-*"`). Do **not** hand-roll `<button className="...">`. For icon-only buttons, render the icon (from `@src/ui/icons`, e.g. `HugeiconsIcon` + `Cancel01Icon`) as the child. Native `<button>` is acceptable only for large clickable surfaces (cards, media thumbnails) where the `Button` variants do not apply.
* **Modals/Dialogs:** Use the `Dialog` family (`@src/ui/components/Dialog`) — never a custom overlay `<div>`. It handles backdrop/Escape dismissal by default; use `<DialogClose asChild>` around the close `Button`.
* **Icons:** Import icons from `@src/ui/icons` (HugeIcons) rather than inline glyphs/emoji or raw SVG.
* Before hand-writing a primitive (button, input, dropdown, badge, tooltip, etc.), check `@src/ui/components` for an existing one and use it.

### Performance

* Avoid unnecessary re-renders.
* Avoid expensive computations inside render paths.
* Memoize derived values only when justified by actual render cost.

## Component Structure Convention

All new components must be created in their own folder.

### Required Structure

```txt
Feature/
├── Feature.tsx
├── useFeature.ts
├── types.ts
├── const.ts          (optional)
└── components/
```

### Responsibilities

#### `Feature.tsx`

* Contains presentation and JSX only.
* Consumes state, derived values, and handlers from `useFeature.ts`.
* Should not contain business logic, API calls, selectors, dispatches, or complex state management.

#### `useFeature.ts`

* Contains:

  * `useState`
  * `useEffect`
  * `useMemo`
  * `useCallback`
  * `useRef`
  * Redux selectors
  * Redux dispatches
  * API calls
  * Event handlers
  * Derived values
* Must return a named object.

Example:

```ts
return {
  data,
  isLoading,
  selectedItem,
  handleSave,
  handleClose,
};
```

#### `types.ts`

* All component-specific types, interfaces, enums, and prop definitions must live in this file.
* Do not declare component props inline inside `Feature.tsx`.

Example:

```ts
export interface FeatureProps {
  projectId: string;
  onClose: () => void;
}

export interface TableRow {
  id: string;
  name: string;
}
```

#### `const.ts` (Optional)

* Component-specific constants only.

Example:

```ts
export const MAX_UPLOAD_COUNT = 50;
export const DEFAULT_PAGE_SIZE = 25;
```

### Child Components

Every child component must also follow the same structure.

```txt
Feature/
├── Feature.tsx
├── useFeature.ts
├── types.ts
└── components/
    ├── Header/
    │   ├── Header.tsx
    │   ├── useHeader.ts
    │   ├── types.ts
    │   └── const.ts
    │
    └── Table/
        ├── Table.tsx
        ├── useTable.ts
        ├── types.ts
        └── const.ts
    components/index.ts

export { default as Header } from './Header/Header';
export { default as Table } from './Table/Table';
Usage

Prefer importing child components through the barrel file:

import { Header, Table } from './components';

instead of:

import Header from './components/Header/Header';
import Table from './components/Table/Table';
```

### TypeScript Requirement

* New React components MUST use `.tsx`.
* New hooks MUST use `.ts`.
* New utilities, services, constants, and helpers MUST use `.ts`.
* Do not create new `.js` or `.jsx` files.

## Current State

**Phase 1 — Foundation & Setup. Marketing landing page and Quick Split are built; app/auth/DB not started.**

What exists (the landing page and calculator are committed on `main`; settlement + contributions are the current uncommitted work):

- Next.js 16 App Router + Tailwind v4 + shadcn/ui primitives (Base UI) in `components/ui/` — `button`, `card`, `input`, `label`, `separator`, `avatar`, `badge`.
- Design tokens in `app/globals.css`: `--primary-text`, `--inverse`, plus a marketing-only display type scale (`text-display-md/lg`, `text-lead`) used by landing copy alone — app copy stays on `text-sm/base/lg`.
- `domains/expenses/split.ts` — the split engine: `computeSplit` for equal / exact / percentage / shares, integer minor units, explicit payer index, typed errors, deterministic remainder distribution. `summarizeEqualSplit` feeds the Quick Split UI. `lib/currency.ts` handles INR parse + format. Treat as settlement-adjacent: test before touching.
- `domains/expenses/schemas.ts` — `splitInputSchema` (Zod) mirrors the domain rules for API-boundary validation, ready for the expense route handlers.
- `domains/settlement/settle.ts` — the settlement engine: `computeSettlement(paidCents, sharesCents)` and `settleBalances(netBalancesCents)`. Integer minor units, BigInt totals, typed errors, deterministic greedy largest-creditor/largest-debtor matching with lowest-index tie-breaks (Tech Design F7). Returns the minimal practical payment list, at most n−1 transactions. Reuse this for the group settlement API — do not re-implement matching.
- `tests/` + `vitest.config.mts` / `vitest.setup.ts` — Vitest 5 + React Testing Library (jsdom); `test` / `test:coverage` scripts. 77 tests; split and settlement are 100% line covered.
- `app/(marketing)/` — `layout.tsx` (Header + Footer + MotionProvider + no-JS reveal fallback), `page.tsx` (Hero with the interactive `SplitCalculator`, HowItWorks, Features, FAQ), and `/split-bill-calculator` (search-focused landing page; `/calculator` 308-redirects to it), composing components from `app/(marketing)/_components/` and `app/(marketing)/split-bill-calculator/_components/`.
- Shared splits travel in the URL fragment (`components/shared/SplitCalculator/splitLink.ts`); nothing is stored server-side, and the copy (FAQ, Features) promises exactly that — keep them in sync.
- Analytics will be added before launch (owner, 2026-11-18). Site copy therefore claims only that *the split* is never stored, never "no cookies", "no tracking" or "nothing saved". The Privacy page already describes analytics and promises it never receives split data, so the analytics setup **must** drop the `#split=` fragment from every captured URL and event and must not record calculator inputs.
- Home `Hero` turns its headline into the live settlement answer ("Amit owes you ₹600.") by owning `useSplitCalculator` and rendering `SplitCalculatorCard`; `/split-bill-calculator` keeps the self-contained `SplitCalculator`. Behind it sits `DottedGlowBackground` (`components/ui/dotted-glow-background.tsx`, an Aceternity canvas component copied as-is): dots and glow read `--primary`, the layer is `opacity-20` in light and `opacity-100` in dark, it draws one still frame under `prefers-reduced-motion`, and `vitest.setup.ts` stubs canvas `getContext` to `null` because jsdom has no canvas.
- Dark mode (2026-11-19): `AnimatedThemeToggler` (Magic UI registry source, verbatim, `components/ui/animated-theme-toggler.tsx`) sits in the header bar from `sm` up and in the mobile menu's "Theme" row below `sm` (the bar overflows phones otherwise). It toggles `.dark` on `<html>` and saves `theme` (`dark`/`light`) in localStorage. `THEME_INIT_SCRIPT` (`lib/theme.ts`) runs inline in the root layout's `<head>`: saved choice, else the system setting, so there's no light flash; `<html>` has `suppressHydrationWarning`. If the CSP ever drops `'unsafe-inline'` from `script-src`, that script needs a hash. Dark `--primary-text` is teal-500 (`oklch(0.704 0.14 182.503)`) because the old dark teal failed contrast (2.6:1); `.dark` also sets `color-scheme: dark`. The view-transition CSS for the toggler is at the end of `globals.css`.
- `app/not-found.tsx` is the site-wide 404 (own Logo bar, no marketing Header/Footer since it renders outside `(marketing)`): animated "4₹4" mark plus a joke receipt, built from `app/_components/NotFound/`.
- Brand icons come from `components/shared/AppIcon` (the Logo's Split glyph): `app/icon.tsx` (192px), `app/apple-icon.tsx` (180px), and `app/favicon.ico` (16/32/48px PNGs packed from `/icon`; regenerate it the same way if the mark changes). The home preview image lives in `app/(marketing)/opengraph-image.tsx`, because a page's own `openGraph` metadata hides images from parent folders.
- `app/error.tsx` and `app/global-error.tsx` render the static `ErrorState` (retry + home). `config/env.ts` fails a Vercel production build whose `SITE_URL` is localhost.
- Home carries `WebSite` + `Organization` JSON-LD (`app/(marketing)/_lib/`, logo = `/icon`) so Google can show the site name; its title targets "split expenses with friends" while `/split-bill-calculator` owns "split bill calculator". `splitLink.ts` validates with `zod/mini` to keep full Zod out of the browser (page JS 352 → 279 KB gz); keep client-side Zod on `zod/mini`.
- `SplitCalculator` feature: one setup screen (people stepper, editable participant rows with name + amount paid) → result. Contributions are the only input: there is no separate bill total or split-method picker, so the total is the sum of what everyone paid and the bill is always split equally. The live summary shows the total and each person's equal share; the result shows shares, the "Who pays whom" settlement from `computeSettlement` when someone owes someone (or an "Everyone's square" note), and a copyable summary. Cap is 50 participants (`MAX_PARTICIPANTS`); the FAQ, About page and home Features copy read the constant. "Edit payments" returns to the same contributions. The domain split engine still supports equal/exact/percentage/shares for future group expenses — only the Quick Split UI is contributions-only.
- Deleted the committed `types/` folder (stale copy of Next's generated route types — it broke `tsc --noEmit`) and gitignored `/types/`; Next regenerates it under `.next/types/`.

- Home `Features` is a live bento grid (2026-11-18), `app/(marketing)/_components/Features/components/`: a settlement graph (2–8 people, "New receipts" shuffle, hover/tap tracing), a paisa receipt (bill presets, leftover paise), a share-link tile that rebuilds the real `#split=` link from the graph's group, and a dark "Ready for the group chat" tile that previews the exact message the calculator's "Copy for the group chat" produces (both use `buildShareMessage` in `components/shared/SplitCalculator/shareMessage.ts`), with a friend's reply that changes with the group. The share-link tile's browser window also previews who pays whom. All numbers come from `computeSettlement` / `summarizeEqualSplit`. `(marketing)/layout.tsx` imports Header and Footer directly, not via the `_components` barrel, so the grid's client code stays off the other pages.
- The marketing `Footer` ends in a giant faded "SettleMates" wordmark (`Footer/components/Wordmark`, client): it is sized in container units so the letters span the content width, rises letter by letter on first view, shows a teal spotlight under the mouse, and is `aria-hidden` because the logo and copyright already name the site.
- Blog and trust pages built (2026-11-18): file-based MDX via `@next/mdx` at `/blog/[slug]`, posts in `content/blog/<slug>/` (`meta.ts` + `index.mdx`), loader in `lib/blog/`, About as a component-built landing page (`app/(marketing)/about/_components/`), Privacy/Terms in the shared `LegalPage` layout with text in `content/pages/*.mdx` (numbered `## 1.` sections, enforced by a test). Three published example posts (rent, trips, asking to be paid back); production would hide `/blog` again if every post were a draft. Placeholders (author name/photo, `CONTACT_EMAIL`) and the publishing guide are in `docs/Blog-Plan.md` — read it before touching the blog.

- Launch prep (2026-11-19), tracked in `docs/Launch-Checklist.md`:
  - Security headers live in `config/securityHeaders.ts`, applied to every path from `next.config.ts`, with `poweredByHeader: false`. The CSP is still `Content-Security-Policy-Report-Only`: add the analytics domains, then rename the key and append `upgrade-insecure-requests`.
  - `app/manifest.ts` is the web app manifest. `.env.example` documents `SITE_URL`; `.gitignore` un-ignores only that file.
  - CI is `.github/workflows/ci.yml`, with Node 26 from `.nvmrc`. It must run `next typegen` before `tsc`, because a fresh checkout has no `.next` route types. Dependabot is in `.github/dependabot.yml`.
  - Analytics is Vercel Web Analytics + Speed Insights (`@vercel/analytics`, `@vercel/speed-insights`), rendered by `components/shared/SiteAnalytics` in the root layout. Both use `beforeSend: stripUrlFragment` (`lib/analytics.ts`), because the Privacy page promises analytics never receives the `#split=` fragment. Keep it on any new analytics or monitoring tool. Don't export `SiteAnalytics` from the shared barrel (client code would leak to every importer).
  - Bundle: taking the calculator out of `components/shared/index.ts` was measured and reverted, because Turbopack then duplicates shared code (home 293 → 312 KB gz). `next build --webpack` measured 268 KB on home and 273 KB elsewhere; switching bundlers is the owner's call.

Still missing: Supabase/Prisma/Auth wiring, any `(dashboard)` route, CI/CD, and a browser-based visual pass over the landing/calculator pages (including a 12-person contributions flow and the derived-total summary).

Last verification: `pnpm test`, `pnpm run test:coverage`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` all pass (142 tests). `pnpm build` needs `SITE_URL`; locally it comes from the gitignored `.env.production.local` (`SITE_URL=http://localhost:3000`), in production from the host's env.

Update this section every session: what's built, what's in progress, what broke last time. Keep `MEMORY.md` in sync with this.

---

## Roadmap

**Phase 1 — Foundation & Setup**
Repository scaffolding, Next.js App Router base, Supabase project (dev), Prisma schema for core entities, Supabase Auth wiring (Google OAuth + Magic Link), base layout/navigation, CI/CD pipeline (GitHub → Vercel).

**Phase 2 — MVP Must-Have Features** *(exact P0 list from the PRD)*
1. Trip / Group Creation
2. Member Invitations
3. Expense Management
4. Equal Split
5. Custom Split
6. Live Balance Calculation
7. Smart Settlement Engine
8. Quick Split Mode

**Phase 3 — Should-Have (P1)**
Shared Living mode, expense categories & activity timeline, basic notifications.

**Phase 4 — Could-Have (P2) / Post-MVP**
Receipt upload, QR code invitations, expense comments, dispute handling. Do not start these before Phase 2 and 3 are complete and tested.

Do not reorder phases without discussing it first — Phase 2's feature list matches the PRD's Definition of Done exactly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
