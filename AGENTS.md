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

The repository hasn't been scaffolded yet (see Current State). Once it exists, expect the standard Next.js + Prisma conventions below — **treat these as the intended baseline, and update this section with the real scripts the moment `package.json` exists**, rather than assuming they're already accurate:

```bash
npm install                # install dependencies
npm run dev                 # local dev server
npx prisma migrate dev      # apply schema migrations locally
npx prisma studio            # inspect local DB
npm run lint                 # lint
npm run typecheck            # tsc --noEmit
npm test                     # Vitest unit/integration tests
npm run test:coverage        # coverage report
npm run build                 # production build
vercel --prod                 # deploy (or via GitHub integration)
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

## Current State

**Project setup — nothing built yet.**

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
