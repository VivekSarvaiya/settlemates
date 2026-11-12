# MEMORY.md — SettleMates

Session-to-session memory. Read this before starting work in a new chat/session. Update it before ending one — don't let a session close without leaving the next one a clear starting point.

---

## 🏗️ Active Phase & Goal

**Phase:** Phase 1 — Foundation & Setup (per `AGENTS.md` Roadmap)
**Goal:** Stand up the repo's foundation: Supabase (Auth + Postgres via Prisma), base app layout, CI/CD (GitHub → Vercel).

**Definition of done for this phase:** a signed-in user can land on an empty dashboard, the Prisma schema for the core entities (User, Group, GroupMember, Expense, ExpenseSplit, Invitation, SettlementTransaction, Notification) is migrated to a dev Supabase project, and a push to `main` deploys automatically.

**Where things actually stand:** the marketing landing page is built and green (`pnpm build` with `SITE_URL` set, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test` all pass), but nothing is committed — the entire landing page, split engine, schemas, and tests live only in the working tree. Auth, DB, dashboard, and CI/CD are untouched.

---

## Recent Decisions

- **2026-09-13** — Repo scaffolded with Next.js 16 (App Router, Turbopack, Tailwind v4) + shadcn/ui (Base UI flavor, not Radix). `components/ui/*` files are CLI-generated; don't hand-edit wholesale.
- **2026-10-06** — Deleted the committed `types/` folder (a stale copy of Next's generated route types whose `../../app/…` imports resolved outside the repo, breaking `tsc --noEmit`) and added `/types/` to `.gitignore`. Next regenerates these under `.next/types/`. User approved the deletion.
- **2026-10-06** — Replaced the hello-world `app/page.tsx` with the `app/(marketing)/` route group (`layout.tsx` + `page.tsx`). User approved removing the placeholder page.
- **2026-10-06** — Landing page sections are static presentational components under `app/(marketing)/_components/` (Hero, HowItWorks, Features, Faq, Footer); FAQ is a plain definition list, no accordion primitive was added.
- **2026-10-06** — Reveal (Framer) elements are SSR'd with `opacity:0`, so `(marketing)/layout.tsx` ships a `<noscript>` style that forces `[data-reveal]` visible when JS never runs.
- **2026-10-06** — `formatCents` uses `minimumFractionDigits: 0`, so half-rupee amounts render as `₹612.5`, not `₹612.50`. Deliberate (whole rupees stay clean), but revisit if paise-heavy displays look wrong.
- **2026-11-12** — Replaced the last mis-branded product-name references with `SettleMates` (`docs/UIUX-Design.md`, `rules/tailwind.md`) and pointed the styling rules at the real `docs/UIUX-Design.md` path instead of a filename that never existed. `agent_docs/tech_stack.md` now documents pnpm and the root-level layout (there is no `src/` folder).
- **2026-11-12** — Rewrote `domains/expenses/split.ts` around one `computeSplit(input)` entry point: equal/exact/percentage/shares, integer minor units, BigInt internals, typed errors (`invalid-total`, `amount-mismatch`, etc.), and a display-only `previewSharesCents` for in-progress input. Equal-split remainder goes to an explicit `payerIndex` (default 0) then in participant order; percentage/shares use largest-remainder with index tie-break. Added `summarizeEqualSplit` so the Quick Split hook holds no arithmetic.
- **2026-11-12** — Added `domains/expenses/schemas.ts` (`splitInputSchema`) to validate split payloads at the API boundary, mirroring the domain rules. Installed Vitest 5 + React Testing Library (jsdom), added `test` / `test:coverage` scripts, `vitest.config.mts`, and `vitest.setup.ts`; domain split coverage is 100% lines / 98% statements.
- **2026-11-12** — Quick Split UI stays on equal/percentage/exact (`CalculatorSplitMode` excludes `"shares"`); shares is domain/API-only until the group expense form lands.

---

## Decisions

Binding product decisions, not assumptions to revisit in passing. Each resolves an item that is still listed as open in `docs/TechDesign-MVP.md`'s Open Questions table — update that table when the docs are next revised.

- **Soft delete for groups and expenses.** `Group` and `Expense` carry a `deletedAt` timestamp; delete sets it rather than removing the row, so ledger history survives an accidental delete. Every balance and settlement query must filter `deletedAt: null`.
- **Money is integer minor units.** Amounts are stored and calculated as paise/cents (integer), never floats. Parsing and formatting live in `lib/currency.ts`; split math lives in `domains/expenses/split.ts` — extend those modules instead of re-implementing money handling.
- **Equal-split remainder goes to the payer's share.** The payer is an explicit `payerIndex` (defaults to 0); leftover paise go to the payer first, then in participant order. Never drop or spread remainder arbitrarily.
- **Quick Split is guest-first.** Creating and viewing a Quick Split requires no authentication; auth is required only to convert a Quick Split into a persistent group.

---

## Known Open Questions / Blockers

Carried from `docs/TechDesign-MVP.md` — these need a product decision, not a code decision, so don't resolve them unilaterally in code without flagging it:

- Group edit/delete permission model (currently assumed: admin-only)
- Invite link expiry/revocation policy (currently assumed: 7-day default, admin-revocable)
- Notification channels beyond in-app/email — is push in scope for MVP or later?
- Budget (~$47/mo) and 12–14 week timeline — carried from early project context, not reconfirmed recently


---

## Next Session Starting Point

1. **Nothing is committed.** First job: review the working tree (`git status`), split it into sensible Conventional Commits on a feature branch, and push a PR — the tree currently holds shadcn primitives, `domains/expenses/split.ts`, `lib/currency.ts`, and the whole `app/(marketing)/` page.
2. **Visual QA of the landing page is unverified** — `pnpm dev` and click through: entry → result → customize → apply → copy → start over, plus mobile viewport and keyboard-only navigation. Check the `#split-amount` / `#how-it-works` / `#features` / `#faq` anchors against the sticky header offset (`scroll-mt-20`).
3. **Tests now exist.** `pnpm test` runs Vitest (domain split, schemas, and a Quick Split RTL flow); `pnpm run test:coverage` enforces thresholds on `domains/expenses/split.ts`. Keep this suite green as the expense API starts consuming the domain.
4. Then move into the real Phase 1 work: Supabase project, Prisma schema, auth wiring, CI/CD.
