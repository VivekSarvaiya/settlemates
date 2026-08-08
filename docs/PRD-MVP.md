# Product Requirements Document: SettleMates MVP

| Field | Value |
|---|---|
| Product | SettleMates |
| Version | MVP (1.0) |
| Document Status | Draft — for engineering & product review |
| Last Updated | July 31, 2026 |
| Stage | PRD |
| Source | Product Context / PRD Generation Brief |

---

## 1. Executive Summary

### 1.1 Product Overview

SettleMates is a modern, collaborative shared-expense management platform for groups. It goes beyond simple bill-splitting to support four real-world scenarios — **group trips, quick one-time bill splits, shared living, and group events** — under a single, coherent product rather than as bolted-on features.

This is a startup-style side project with production-quality ambitions: solve a genuine, recurring coordination problem well enough to validate real user demand, while demonstrating full-stack product and engineering judgment. The MVP is scoped for an initial **1,000–10,000 user** launch, built for iteration speed and maintainability rather than premature scale.

### 1.2 Product Vision

SettleMates exists to remove the friction of managing money among people who trust each other but don't want to do math together. Specifically, the product should:

- **Eliminate spreadsheets and manual calculation** as the default coping mechanism for shared expenses.
- **Reduce awkward money conversations** by making balances visible, objective, and always up to date, so no one has to be "the one who brings up money."
- **Make settlement simple and trustworthy** — not just a number, but a clear, explainable answer to "who pays whom, and why."
- **Feel purpose-built**, not like a stripped-down personal finance app or a cluttered do-everything tool — the emphasis is collaboration and clarity, not feature breadth.
- **Deliver a production-quality SaaS experience** from day one (reliable, accessible, responsive) while staying intentionally small in scope.
- **Be architected for growth** — the MVP should not require a rewrite to go from hundreds to tens of thousands of users, even though it will launch as a modular monolith.

The product deliberately does *not* try to become a travel planner, a budgeting app, or a chat tool. Its job is to be the best possible system of record and settlement engine for shared spending.

### 1.3 Success Criteria

**Activation**

| Metric | Target | Measurement |
|---|---|---|
| Users who add their first expense in their first session | ≥70% | Product analytics |
| Invited members who successfully join a group | ≥80% | Invitation funnel tracking |

**Engagement**

| Metric | Target | Measurement |
|---|---|---|
| Expenses per active group | 5+ average | Event analytics |
| Members who add expenses or view balances | ≥80% | Session/activity data |
| Average session duration | 3–5 minutes | Session analytics |

**Retention**

| Metric | Target | Measurement |
|---|---|---|
| Users who create/join another group within 30 days | ≥25% | Cohort retention |
| Completed trips that lead to another group by the same organizer | ≥40% | Group lifecycle tracking |

**Revenue**

Not applicable for MVP — no monetization is being built in this phase. Once the core loop is validated, future SaaS metrics to track include **Free → Premium conversion rate, MRR, ARPU, and LTV**. *(**Assumption:** the specific premium feature set and pricing model are undefined and out of scope for this PRD — see Appendix.)*

---

## 2. Problem Statement

### 2.1 Problem Definition

People who share expenses — on trips, in shared housing, at dinners, or around one-off events — consistently run into the same friction points:

- Forgetting who paid for what, especially across a multi-day trip or a household with recurring costs.
- Doing balance math manually, which is error-prone and gets worse as group size or expense count grows.
- Defaulting to spreadsheets, which work but require setup, discipline, and manual formula maintenance.
- Using WhatsApp or group chat as a makeshift ledger, where expense context gets buried in unrelated messages.
- Spending a disproportionate amount of time reconciling balances at the *end* of a trip or month, when it should have been tracked continuously.
- Avoiding the conversation altogether — because bringing up money, even small amounts, carries social friction between friends, roommates, or partners.

### 2.2 Why Existing Solutions Are Insufficient

Spreadsheets require someone to build and maintain formulas, don't scale well to real-time group collaboration, and are easy to lose track of or share incorrectly. Chat apps like WhatsApp are unstructured — an expense mentioned in a 200-message thread has effectively no retrievable context by day three of a trip. Dedicated expense-splitting apps exist, but users still report friction around onboarding complexity, cluttered UX, and settlement logic that isn't clearly explained — the app tells you a number, not *why* that's the number.

### 2.3 Why This Problem Persists

Shared-expense tracking sits in an awkward middle ground: it's too informal and socially sensitive for people to want to use a "serious" finance tool, but too error-prone and tedious to keep solving with ad hoc spreadsheets and chat messages forever. Existing tools have tended to compete on feature breadth (trip planning, receipt scanning, multi-currency, budgeting) rather than on making the core loop — add expense, see balance, settle up — as frictionless and trustworthy as possible. Because the pain is recurring but low-grade rather than acute, most groups route around it with habit rather than actively searching for a better tool.

### 2.4 Why This Is a Good Opportunity Now

The target audience already coordinates socially and financially through apps — group chats for logistics, shared maps for locations, instant payment apps (e.g., UPI) for actually moving money. There's a clear behavioral gap between "track it informally in chat" and "use a full personal finance app," and no strong default has emerged that's purpose-built for the *tracking and settlement* step specifically, without also trying to own payments, budgeting, or trip planning.

### 2.5 Impact Analysis

- **User Impact:** Less time spent on manual calculation, fewer balance-tracking errors, less social friction around money, and clear group-level visibility at any point in time.
- **Market Impact:** An opportunity to win users who are dissatisfied with the onboarding friction and UX clutter of existing shared-expense tools.
- **Business Impact:** A focused MVP that can validate real usage and retention before any investment in monetization or premium features.

---

## 3. Target Audience

### 3.1 Primary Persona: Young Professionals & Friend Groups

**Demographics**
- Age 18–40
- Students, working professionals, digital nomads, and frequent travelers
- Comfortable with smartphones and modern web applications

**Psychographics**
- Heavy users of WhatsApp for group coordination
- Use tools like Google Maps for shared logistics and UPI (or equivalent instant payment apps) for actually transferring money
- Not finance experts and not looking to become one — they want the *simplest possible* way to handle shared money, not a robust personal-finance suite

**Motivations**
- Wanting to enjoy time with friends/family without money admin hanging over the group
- Wanting to be seen as fair and organized, without personally having to do the math
- Wanting a single source of truth everyone in the group can trust

**Frustrations**
- Forgetting who paid for what by the time it's time to settle
- Manually calculating who owes whom, especially with uneven splits
- Losing expense context in spreadsheets or chat threads
- The social awkwardness of asking someone to pay you back

**Jobs to Be Done**
1. Track shared expenses during a trip or event as they happen.
2. Split a bill quickly without doing manual math.
3. Settle balances clearly and fairly at the end of a trip, event, or month.
4. Avoid awkward, repeated conversations about who owes what.

**Current Solutions & Pain Points**

| Current Solution | Pain Points | SettleMates's Advantage |
|---|---|---|
| Spreadsheets | Manual setup and formulas, error-prone, awkward to share and keep updated live | Purpose-built UX with automatic, always-current calculations |
| WhatsApp / group chat | Unstructured, no persistent ledger, context gets buried in unrelated messages | Centralized expense history with a running, visible balance |
| Existing expense-splitting apps | UX clutter, onboarding friction, settlement logic that isn't clearly explained | Simpler workflow and a transparent, explainable settlement engine |

### 3.2 Secondary Personas

**Roommates (Shared Living)**
Ongoing household groups who split recurring costs (rent, utilities, groceries) monthly rather than settling once at the end of a trip. Their core need is a persistent, low-effort record that resets or rolls over predictably, with visibility into who's behind on contributing.

**Event Organizers**
Someone coordinating a one-off group event (a party, a group gift, a shared outing) who needs to collect and track contributions from a group that may not all know each other. Their core need is low-friction group setup and invitation, since the group is often assembled ad hoc.

**Friends Splitting a One-Time Bill**
Someone at a restaurant or a single shared purchase who wants to divide a bill and move on — no group setup, no ongoing relationship with the app required. Their core need is speed: this is the Quick Split use case.

---

## 4. User Stories

### Epic: Group Expense Coordination

**Primary User Story**

> As a trip organizer, I want to create a trip, invite my friends, and track all shared expenses in one place so that everyone always knows the group's financial status and the trip can be settled effortlessly at the end.

**Acceptance Criteria**
- [ ] A user can create a new group/trip.
- [ ] A user can invite others to join.
- [ ] Expenses can be added with a payer and a set of participants.
- [ ] Balances update automatically after each expense.
- [ ] A settlement summary is visible at any time, not just at trip end.

### Supporting User Stories

**Expense Contributor**
> As a trip member, I want to quickly add an expense and choose who participated so that balances update automatically without manual calculations.

- AC: Expense entry captures payer, participants, amount, and split type in a single flow.
- AC: Balances recalculate immediately on save, with no separate "refresh" step.

**Participant**
> As a participant, I want to receive notifications whenever an expense affects me so that I always know my current balance.

- AC: A notification (in-app at minimum) is triggered whenever an expense is added, edited, or deleted that changes the user's balance.
- AC: Notification content is specific enough to understand the change without opening the app (e.g., what changed and by how much).

**Shared Living User**
> As a roommate, I want to track recurring household expenses so that everyone contributes fairly every month.

- AC: A group can be used on an ongoing basis (not just settled once and archived).
- AC: Balance history is retained and viewable across months, not just the current period.

**Quick Split User**
> As someone paying for dinner, I want to split a bill in under a minute so that everyone knows exactly how much they owe before leaving.

- AC: A user can start a split without first creating a persistent group.
- AC: The flow (enter amount → choose split → share result) is completable in a small number of taps/steps, optimized for mobile.

---

## 5. Functional Requirements

### 5.1 MVP — Must Have (P0)

#### F1. Trip / Group Creation

- **Description:** Users can create a group representing a trip, a shared-living arrangement, or an event, with a name and a type.
- **User Value:** Establishes the container for all collaborative expense tracking.
- **Business Value:** Primary onboarding and activation mechanic.
- **Acceptance Criteria:**
  - [ ] User can create a group with a name and a type (e.g., trip, shared living, event).
  - [ ] The creator becomes the group's owner/admin. *(**Assumption:** role/permission rules — e.g., who can edit or delete the group — are not specified in the source context; flagged for a product decision, see Appendix.)*
  - [ ] The new group appears immediately in the user's dashboard.
- **Dependencies:** Authentication, group data model.
- **Estimated Effort:** Medium

#### F2. Member Invitations

- **Description:** Users can invite others to a group via a shareable link.
- **User Value:** Makes the group collaborative rather than single-player.
- **Business Value:** Core viral/network-growth mechanic.
- **Acceptance Criteria:**
  - [ ] A unique, shareable invite link can be generated per group.
  - [ ] The join flow is simple and mobile-friendly, minimizing steps between "receive link" and "in the group."
  - [ ] Joining a group makes the group and its history visible to the new member immediately.
- **Dependencies:** Authentication, group membership storage.
- **Estimated Effort:** Medium
- *(**Open question, not resolved by source:** should invite links expire or be revocable? Flagged in Appendix.)*

#### F3. Expense Management

- **Description:** Users can add, view, and manage expenses within a group, capturing payer, participants, amount, and description.
- **User Value:** The core, recurring action of the product.
- **Business Value:** Primary source of product utility and usage data.
- **Acceptance Criteria:**
  - [ ] User can add an expense with amount, description, payer, and participants.
  - [ ] Full expense history is visible within the group, in reverse-chronological order.
  - [ ] User can edit or delete an expense they created. *(**Assumption:** whether group admins can also edit/delete others' expenses is not specified in source; flagged in Appendix.)*
- **Dependencies:** Database schema, input validation, balance calculation engine.
- **Estimated Effort:** High

#### F4. Equal Split

- **Description:** The default split mode divides an expense evenly across all selected participants.
- **User Value:** Fast default for the most common case.
- **Business Value:** Keeps the core add-expense flow low-friction.
- **Acceptance Criteria:**
  - [ ] Equal split is calculated automatically once participants are selected.
  - [ ] Remainder cents (when an amount doesn't divide evenly) are allocated using a defined, consistent rule. *(**Assumption:** the exact rounding rule — e.g., assign remainder to the payer — is not specified in source and needs a product decision; flagged in Appendix.)*
- **Dependencies:** F3.
- **Estimated Effort:** Low–Medium

#### F5. Custom Split

- **Description:** Users can manually define each participant's share instead of splitting evenly.
- **User Value:** Handles real-world cases where costs aren't shared equally.
- **Business Value:** Differentiates from naive equal-only splitters; supports more use cases (e.g., shared living rent by room size).
- **Acceptance Criteria:**
  - [ ] Supports splitting by exact amount, by percentage, and by weighted shares. *(**Assumption:** this specific set of custom-split modes is an industry-standard default, not explicitly itemized in the source; flagged in Appendix as a decision to confirm.)*
  - [ ] Validation prevents saving a split that doesn't reconcile to the total expense amount.
- **Dependencies:** F3.
- **Estimated Effort:** Medium

#### F6. Live Balance Calculation

- **Description:** Each member's net balance within a group updates automatically as expenses are added, edited, or deleted.
- **User Value:** Always-current visibility into who owes what, without manual recalculation.
- **Business Value:** Core trust driver for the product.
- **Acceptance Criteria:**
  - [ ] Balances recalculate immediately after any expense change.
  - [ ] Users can view their current net balance within a group at any time.
  - [ ] Balance calculations are consistent across sessions and devices.
- **Dependencies:** F3, F4, F5, real-time sync layer.
- **Estimated Effort:** Medium

#### F7. Smart Settlement Engine

- **Description:** Calculates a minimal repayment plan for a group — the smallest set of payments needed to settle all balances to zero.
- **User Value:** Removes the mental burden of figuring out an efficient way to settle up.
- **Business Value:** A key differentiator versus naive "everyone pays everyone" tools.
- **Acceptance Criteria:**
  - [ ] Settlement view shows a minimized set of "who pays whom" transactions.
  - [ ] Output is explainable — a user should be able to see why the suggested payments resolve the group's balances, not just trust a black-box number.
  - [ ] Settlement calculation is deterministic and consistent given the same balance state.
- **Dependencies:** F6, algorithm implementation.
- **Estimated Effort:** Medium–High
- *(**Assumption:** the source specifies the outcome — "minimal repayment plan" — but not the algorithm. A standard debt-simplification / min-cash-flow approach is the conventional choice; flagged for confirmation in Appendix.)*

#### F8. Quick Split Mode

- **Description:** A fast, lightweight flow for splitting a one-time bill without setting up a persistent group.
- **User Value:** Solves the "splitting dinner" case in under a minute.
- **Business Value:** Broadens the product's use cases beyond multi-day trips and ongoing groups.
- **Acceptance Criteria:**
  - [ ] A split can be created without first creating a full group.
  - [ ] Supports both equal and custom split modes.
  - [ ] Result is easily shareable (e.g., via link).
  - [ ] Flow is optimized for mobile, minimizing steps to completion.
- **Dependencies:** Minimal group data model, bill entry UI.
- **Estimated Effort:** Medium
- *(**Open question, not resolved by source:** should Quick Split allow fully guest/unauthenticated access, or require light authentication? This is explicitly an open question in the source context — flagged in Appendix as blocking a final UX decision.)*

### 5.2 Should Have (P1)

- **Shared Living Mode:** Extends the product to ongoing, recurring-expense households rather than only discrete trips — meaningfully broadens the addressable use case without adding new core mechanics (it reuses F3–F7). *(**Open question carried from source:** should this ship in the first release, or move to a later phase if MVP scope tightens?)*
- **Expense Categories & Activity Timeline:** Adds light organization and context (what was spent on, and when) that supports engagement and retention without being required for the core loop to function.
- **Basic Notifications:** Closes the loop on F6 (Live Balance Calculation) by proactively informing users when their balance changes, rather than requiring them to check. *(**Assumption**, per source: MVP scope is basic in-app or lightweight system notifications only; the source explicitly leaves final channel prioritization — push, email, in-app — as an open question, flagged in Appendix.)*

### 5.3 Could Have (P2)

- **Receipt Upload:** Builds trust and provides an audit trail for disputed expenses, but adds file storage and handling complexity disproportionate to MVP goals.
- **QR Code Invitations:** A convenience alternative to link-based invites (F2); low differentiation value for an initial release.
- **Expense Comments & Dispute Handling:** Valuable for group trust over time, but expands scope meaningfully (notifications, moderation, UI) — best deferred until the core add/split/settle loop is validated with real users.

---

## 6. Out of Scope (Not in MVP)

| Excluded Item | Reason |
|---|---|
| AI receipt OCR | High implementation complexity relative to core value; premature before the core loop is validated |
| Multi-currency support | Adds significant complexity to balance and settlement math; explicitly deferred until after MVP validation |
| Payment gateway integration | Requires compliance/security overhead disproportionate to MVP scope; SettleMates tracks settlement, it does not move money |
| Native mobile apps | A responsive, mobile-first web app reduces maintenance surface for a small team while still serving mobile users |
| Offline-first support | Introduces sync-conflict complexity not justified at MVP scale |
| Travel planning, hotels, itineraries, bookings | Outside the core problem (expense tracking and settlement, not trip planning) |
| Chat and messaging | Redundant with tools users already use (e.g., WhatsApp); the product intentionally does not compete here |
| Budgets and financial planning | A distinct problem space from shared-expense settlement; including it risks scope creep and diluted positioning |

---

## 7. Non-Functional Requirements

### 7.1 Performance

Target: **balanced performance** — fast and predictable, not real-time-critical.

- **Page Load:** Target under ~2 seconds on typical broadband/4G conditions. *(**Assumption:** the source specifies "balanced performance" without a numeric target; this is a conventional MVP benchmark, flagged for confirmation.)*
- **API Response:** Common actions (add expense, view balance, view settlement) should feel immediate — target under ~500ms p95. *(**Assumption**, same basis as above.)*
- **Concurrent Users:** Designed to support the stated launch scale of 1,000–10,000 users.
- **Uptime:** Production-appropriate reliability via managed infrastructure; no formal SLA required at MVP stage.

### 7.2 Security

- **Authentication:** Secure authentication via Auth.js / NextAuth or equivalent.
- **Authorization:** Group-based access control — only group members can view or act on that group's data.
- **Data Protection:** Encryption in transit (HTTPS) and at rest via the managed database provider.
- **Compliance:** No special compliance regime required for MVP; SettleMates stores expense *records*, not payment credentials, which meaningfully limits compliance surface.

### 7.3 Accessibility

- Target **WCAG 2.1 AA**: keyboard navigability, screen-reader-friendly labeling, sufficient color contrast, visible focus states throughout.

### 7.4 Platform

- Responsive, mobile-first web application.
- Support for modern evergreen browsers: Chrome, Safari, Firefox, Edge.
- PWA-installable, per the preferred technical stack. *(**Open question:** whether PWA support is a P0 MVP requirement or a P1 enhancement is not explicitly stated in source; flagged in Appendix.)*
- Internationalization is explicitly not required for MVP.

### 7.5 Scalability

- Architecture should scale from initial validation (hundreds of users) to the stated 1,000–10,000 user launch target without a major rewrite.
- A modular monolith is the intended approach — avoid premature microservices.
- Data model should anticipate growing group histories and expense ledgers (e.g., indexing on group and user identifiers from the outset).

### 7.6 Technical Constraints

The preferred stack, per product context, should not be redesigned without a compelling reason:

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend / Database | Supabase or Firebase |
| Authentication | Auth.js / NextAuth |
| Real-time sync | WebSockets or SSE |
| Hosting | Vercel |
| Delivery model | Progressive Web App (PWA) |

**Architectural constraints:**
- Single repository, single deployment.
- Minimal DevOps overhead — favor managed services over self-hosted infrastructure.
- Modular, maintainable codebase; avoid premature microservices.
- Mobile-first, accessible, and secure by default.

*(**Open question, not resolved by source:** Supabase vs. Firebase, and WebSockets vs. SSE, are each presented as either/or options without a stated decision criterion. Both should be resolved before implementation begins — flagged in Appendix.)*

---

## 8. Quality Standards

Engineering quality standards (testing, linting, type safety, coding conventions, CI/CD, and repository rules) will be defined separately in **AGENTS.md**.

---

## 9. UI/UX Requirements

### 9.1 Design Principles

1. **Clarity First** — At a glance, any user should understand who owes what and why. Balances and settlement information should never require interpretation or mental math.
2. **Low Friction** — Adding an expense or running a Quick Split should feel nearly instantaneous. Every unnecessary step in these core flows is a tax on the product's core value proposition.
3. **Trust Through Transparency** — Settlement logic must be explainable and auditable. Users should be able to trace *why* the app is telling them to pay a specific amount to a specific person, not just accept a number.

### 9.2 Information Architecture

```
├── Landing Page
├── Authentication
│   ├── Sign Up
│   ├── Sign In
│   └── Password Reset
├── Dashboard
│   ├── Groups
│   └── Balances (cross-group overview)
├── Group Detail
│   ├── Expenses
│   ├── Settlement Summary
│   └── Activity Timeline
├── Quick Split (standalone flow, no group required)
├── Profile
└── Settings
```

### 9.3 Key User Flows

**Flow 1: Create and Invite a Group**
Landing page or dashboard → Create group → Invite members → First expense added → Shared balances visible.

**Flow 2: Add an Expense**
Open group → Add expense → Choose payer and participants → Save → Balances update automatically.

**Flow 3: Settle a Group**
Open settlement view → Review simplified debt summary → See who pays whom → Mark group/trip complete.

---

## Appendix: Assumptions, Gaps & Open Questions

Per the brief's instruction to explicitly label assumptions and flag missing information, the following items were either **assumed** (industry-standard default used in place of an unspecified detail) or are **genuinely open** (a decision the source context does not make, and that should be resolved before implementation):

| Area | Gap / Open Question | Status |
|---|---|---|
| Group roles & permissions | Who can edit/delete a group, remove members, or edit another member's expense? | **Open — not specified in source** |
| Invite link lifecycle | Do invite links expire or become revocable, or remain valid indefinitely? | **Open — not specified in source** |
| Rounding rule for Equal Split | How is a non-evenly-divisible amount's remainder allocated? | **Open — not specified in source** |
| Custom Split modes | Assumed exact-amount, percentage, and weighted-share modes as the standard set | **Assumption — confirm before build** |
| Settlement algorithm | "Minimal repayment plan" outcome is specified; the algorithm (assumed: debt-simplification / min-cash-flow) is not | **Assumption — confirm before build** |
| Quick Split authentication | Guest access vs. light authentication required | **Open — explicitly unresolved in source** |
| Notification channels | Priority order across in-app, push, email post-launch | **Open — explicitly unresolved in source** |
| Shared Living timing | Ship in v1, or defer to a later phase if scope tightens | **Open — explicitly unresolved in source** |
| Database provider | Supabase vs. Firebase — no selection criteria given | **Open — not specified in source** |
| Real-time layer | WebSockets vs. SSE — no selection criteria given | **Open — not specified in source** |
| PWA requirement level | Whether PWA support is P0 (MVP) or P1 | **Open — not specified in source** |
| Performance targets | Specific page-load/API-response numbers assumed at conventional MVP benchmarks | **Assumption — confirm before build** |
| Monetization / premium tier | Future metrics (conversion, MRR, ARPU, LTV) are named, but the premium feature set and pricing are undefined | **Out of scope for this PRD by design** |

**Note on prior context:** An earlier document shared in this conversation referenced a budget of approximately **$47/month OPEX**, a **12–14 week timeline**, and a **solo developer** as the resourcing model. The current context brief doesn't restate these constraints. If they still apply, they should be added to Section 7 (Non-Functional Requirements) or a dedicated Constraints section before this PRD is finalized for handoff — flag if that's not the case anymore.
