# MEMORY.md — SettleMates

Session-to-session memory. Read this before starting work in a new chat/session. Update it before ending one — don't let a session close without leaving the next one a clear starting point.

---

## 🏗️ Active Phase & Goal

**Phase:** Phase 1 — Foundation & Setup (per `AGENTS.md` Roadmap)
**Goal:** Scaffold the repository, wire up Supabase (Auth + Postgres via Prisma), stand up the base Next.js App Router layout, and get CI/CD (GitHub → Vercel) deploying an empty shell to a preview URL.

**Definition of done for this phase:** a signed-in user can land on an empty dashboard, the Prisma schema for the core entities (User, Group, GroupMember, Expense, ExpenseSplit, Invitation, SettlementTransaction, Notification) is migrated to a dev Supabase project, and a push to `main` deploys automatically.

---

## Recent Decisions

*(Nothing built yet — this is the initial state. Log decisions here as they're made, in the form: date — decision — why.)*

---

## Known Open Questions / Blockers

Carried from `docs/TechDesign-SettleMates-MVP.md` — these need a product decision, not a code decision, so don't resolve them unilaterally in code without flagging it:

- Group edit/delete permission model (currently assumed: admin-only)
- Invite link expiry/revocation policy (currently assumed: 7-day default, admin-revocable)
- Equal-split rounding rule (currently assumed: remainder to payer)
- Quick Split authentication (currently assumed: unauthenticated create/view, auth required to persist)
- Hard-delete vs. soft-delete/archive for groups and expenses (not yet decided)
- Notification channels beyond in-app/email — is push in scope for MVP or later?
- Budget (~$47/mo) and 12–14 week timeline — carried from early project context, not reconfirmed recently

---

## Next Session Starting Point

Nothing built yet. First session should begin with Phase 1 above — read `AGENTS.md` and `agent_docs/tech_stack.md` in full before scaffolding anything.
