# MEMORY.md — SettleMates

Session-to-session memory. Read this before starting work in a new chat/session. Update it before ending one — don't let a session close without leaving the next one a clear starting point.

---

## 🏗️ Active Phase & Goal

**Phase:** Phase 1 — Foundation & Setup (per `AGENTS.md` Roadmap)
**Goal:** Stand up the repo's foundation: Supabase (Auth + Postgres via Prisma), base app layout, CI/CD (GitHub → Vercel).

**Definition of done for this phase:** a signed-in user can land on an empty dashboard, the Prisma schema for the core entities (User, Group, GroupMember, Expense, ExpenseSplit, Invitation, SettlementTransaction, Notification) is migrated to a dev Supabase project, and a push to `main` deploys automatically.

**Where things actually stand:** the marketing landing page and Quick Split calculator are committed on `main` (through PR #1); Quick Split is now contributions-only (derived total, equal split, settlement) and the settlement engine plus its tests are the current uncommitted work. `pnpm build` (with `SITE_URL`), `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test`, and `pnpm run test:coverage` all pass. Auth, DB, dashboard, and CI/CD are untouched.

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
- **2026-11-13** — Added `domains/settlement/settle.ts` (`computeSettlement(paidCents, sharesCents)` + `settleBalances`) as the single settlement engine: integer minor units, BigInt totals, typed errors, deterministic greedy largest-creditor/largest-debtor matching with lowest-index tie-breaks, per `docs/TechDesign-MVP.md` F7. 18 domain tests lock the office-event output and the everyone-ends-at-zero invariant.
- **2026-11-13** — Quick Split gained a fourth **Paid** tab (contributions mode): row values are what each person contributed, blank means ₹0, the bill is split equally, and contributions must add up to the bill before Apply unlocks. The result screen shows a "Who pays whom" list from the settlement engine. The participant cap rose from 10 to 20 for the 12-person office case. Non-contribution modes assume participant 0 ("You") paid the whole bill.
- **2026-11-13** — Split-mode tab picker is `grid-cols-2 sm:grid-cols-4` now that there are four modes; settlement rows are only shown while the allocation is valid so a back-navigation with an unfinished custom split can't claim "all settled".
- **2026-11-13** — Merged Quick Split's entry and customize stages into one setup screen: bill total, people stepper, all four split-method tabs, and editable participant rows are visible immediately, with shares and validation updating live. The result's "Customise split" button became "Edit split" and returns to that same screen. "Who pays whom" renders only when at least one settlement transaction exists and the mode isn't a plain equal split; an empty list no longer renders an "all settled" message.
- **2026-11-14** — Quick Split is now contributions-only. Removed the Equal/Percentage/Amount method tabs and the separate bill-total input; participants enter only what they paid, the total is the sum of those payments, and the bill is split equally. Deleted `CustomizeView`, `EntryView`, mode state, and the marketing `SplitMethods` section; rewrote calculator/home copy, FAQ, and metadata around "enter who paid what". The domain split engine still supports equal/exact/percentage/shares for future group expenses — only the Quick Split UI narrowed.

---

## Decisions

Binding product decisions, not assumptions to revisit in passing. Each resolves an item that is still listed as open in `docs/TechDesign-MVP.md`'s Open Questions table — update that table when the docs are next revised.

- **Soft delete for groups and expenses.** `Group` and `Expense` carry a `deletedAt` timestamp; delete sets it rather than removing the row, so ledger history survives an accidental delete. Every balance and settlement query must filter `deletedAt: null`.
- **Money is integer minor units.** Amounts are stored and calculated as paise/cents (integer), never floats. Parsing and formatting live in `lib/currency.ts`; split math lives in `domains/expenses/split.ts` — extend those modules instead of re-implementing money handling.
- **Equal-split remainder goes to the payer's share.** The payer is an explicit `payerIndex` (defaults to 0); leftover paise go to the payer first, then in participant order. Never drop or spread remainder arbitrarily.
- **Quick Split is guest-first.** Creating and viewing a Quick Split requires no authentication; auth is required only to convert a Quick Split into a persistent group.
- **Settlement is greedy, not exhaustively optimal.** The engine matches largest creditor to largest debtor until balances clear (at most n−1 payments, usually far fewer). It is deterministic and explainable; don't replace it with a combinatorial solver for the MVP, and don't claim "fewest possible" in UI copy.

---

## Known Open Questions / Blockers

Carried from `docs/TechDesign-MVP.md` — these need a product decision, not a code decision, so don't resolve them unilaterally in code without flagging it:

- Group edit/delete permission model (currently assumed: admin-only)
- Invite link expiry/revocation policy (currently assumed: 7-day default, admin-revocable)
- Notification channels beyond in-app/email — is push in scope for MVP or later?
- Budget (~$47/mo) and 12–14 week timeline — carried from early project context, not reconfirmed recently


---

## Next Session Starting Point

1. **Current work is uncommitted.** The settlement engine (`domains/settlement/`), its tests, and the Quick Split contributions/settlement UI are in the working tree on `main`. Review `git status`, make a feature branch, and land it as Conventional Commits — don't sweep unrelated files into the commit.
2. **Visual QA of the calculators is unverified** — `pnpm dev` and click through both `/` and `/calculator`: setup (people stepper + paid inputs, including 12-person contributions) → split → edit payments → copy → start over, plus mobile viewport and keyboard-only navigation. Confirm the derived total and equal share update live, "Who pays whom" appears when someone owes someone, and the "Everyone's square" note appears when contributions match shares. Check the `#how-to-split` / `#how-it-works` / `#features` / `#faq` anchors against the sticky header offset (`scroll-mt-20`).
3. **Tests now exist.** `pnpm test` runs Vitest (domain split, settlement, schemas, and Quick Split RTL flows); `pnpm run test:coverage` enforces thresholds on `domains/expenses/split.ts` and `domains/settlement/settle.ts`. Keep this suite green as the expense API starts consuming the domain.
4. Then move into the real Phase 1 work: Supabase project, Prisma schema, auth wiring, CI/CD.
