# MEMORY.md — SettleMates

Session-to-session memory. Read this before starting work in a new chat/session. Update it before ending one — don't let a session close without leaving the next one a clear starting point.

---

## 🏗️ Active Phase & Goal

**Phase:** Phase 1 — Foundation & Setup (per `AGENTS.md` Roadmap)
**Goal:** Stand up the repo's foundation: Supabase (Auth + Postgres via Prisma), base app layout, CI/CD (GitHub → Vercel).

**Definition of done for this phase:** a signed-in user can land on an empty dashboard, the Prisma schema for the core entities (User, Group, GroupMember, Expense, ExpenseSplit, Invitation, SettlementTransaction, Notification) is migrated to a dev Supabase project, and a push to `main` deploys automatically.

**Where things actually stand:** the marketing landing page is built and green (`pnpm build`, `npx tsc --noEmit`, `npx eslint .` all pass), but nothing is committed — the entire landing page, split engine, and UI primitives live only in the working tree. Auth, DB, dashboard, and CI/CD are untouched.

---

## Recent Decisions

- **2026-09-13** — Repo scaffolded with Next.js 16 (App Router, Turbopack, Tailwind v4) + shadcn/ui (Base UI flavor, not Radix). `components/ui/*` files are CLI-generated; don't hand-edit wholesale.
- **2026-10-06** — Deleted the committed `types/` folder (a stale copy of Next's generated route types whose `../../app/…` imports resolved outside the repo, breaking `tsc --noEmit`) and added `/types/` to `.gitignore`. Next regenerates these under `.next/types/`. User approved the deletion.
- **2026-10-06** — Replaced the hello-world `app/page.tsx` with the `app/(marketing)/` route group (`layout.tsx` + `page.tsx`). User approved removing the placeholder page.
- **2026-10-06** — Landing page sections are static presentational components under `app/(marketing)/_components/` (Hero, HowItWorks, Features, Faq, Footer); FAQ is a plain definition list, no accordion primitive was added.
- **2026-10-06** — Reveal (Framer) elements are SSR'd with `opacity:0`, so `(marketing)/layout.tsx` ships a `<noscript>` style that forces `[data-reveal]` visible when JS never runs.
- **2026-10-06** — `formatCents` uses `minimumFractionDigits: 0`, so half-rupee amounts render as `₹612.5`, not `₹612.50`. Deliberate (whole rupees stay clean), but revisit if paise-heavy displays look wrong.

---

## Known Open Questions / Blockers

Carried from `docs/TechDesign-Settlemates-MVP.md` — these need a product decision, not a code decision, so don't resolve them unilaterally in code without flagging it:

- Group edit/delete permission model (currently assumed: admin-only)
- Invite link expiry/revocation policy (currently assumed: 7-day default, admin-revocable)
- Equal-split rounding rule (currently assumed: remainder to payer)
- Quick Split authentication (currently assumed: unauthenticated create/view, auth required to persist)
- Hard-delete vs. soft-delete/archive for groups and expenses (not yet decided)
- Notification channels beyond in-app/email — is push in scope for MVP or later?
- Budget (~$47/mo) and 12–14 week timeline — carried from early project context, not reconfirmed recently

---

## Next Session Starting Point

1. **Nothing is committed.** First job: review the working tree (`git status`), split it into sensible Conventional Commits on a feature branch, and push a PR — the tree currently holds shadcn primitives, `domains/expenses/split.ts`, `lib/currency.ts`, and the whole `app/(marketing)/` page.
2. **Visual QA of the landing page is unverified** — `pnpm dev` and click through: entry → result → customize → apply → copy → start over, plus mobile viewport and keyboard-only navigation. Check the `#split-amount` / `#how-it-works` / `#features` / `#faq` anchors against the sticky header offset (`scroll-mt-20`).
3. **No test runner yet.** `package.json` has no test script and no Vitest dependency. The split engine was verified this session with an ad-hoc `node --experimental-strip-types` assertion script (all passed). Setting up Vitest + the first `domains/expenses/split` tests is the natural next task — confirm against `agent_docs/tech_stack.md` before adding the dependency.
4. Then move into the real Phase 1 work: Supabase project, Prisma schema, auth wiring, CI/CD.
