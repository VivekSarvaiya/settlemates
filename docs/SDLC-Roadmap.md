# SettleMates — End-to-End SDLC Roadmap & Checklist

From naming the product through deployment and launch, grounded in the PRD, Tech Design, and AGENTS.md already established for this project. Built for a solo developer working within the ~$47/month OPEX and 12–14 week timeline from the PRD.

**How to use this:** work top to bottom, but treat the tracks marked "(parallel)" as running alongside development rather than strictly after it — landing page work and SEO shouldn't wait until Phase 2 is fully done, for instance. Copy this into GitHub Issues or a Project board if you want it trackable there instead of as a standalone file.

## Phase Overview

| Phase | Focus | Rough Timing *(estimate)* |
|---|---|---|
| 0 | Naming, branding, project setup | Week 0–1 |
| 1 | Technical foundation | Week 1–2 |
| 2 | MVP must-have features (P0) | Week 2–8 |
| 3 | Should-have features (P1) | Week 8–10 |
| 4 | Could-have features (P2, optional) | Week 10–11, only if time allows |
| — | Landing page & marketing site *(parallel)* | Week 6–10 |
| — | SEO *(parallel)* | Week 9–11 |
| — | Testing *(ongoing, intensive pass)* | Throughout, hardening Week 10–11 |
| — | Pre-launch | Week 11–12 |
| — | Deployment / Launch | Week 12 |
| — | Post-launch | Week 13–14+ |

---

## Phase 0 — Naming, Branding & Project Setup

### 0.1 Naming & Domain
- [ ] Confirm "SettleMates" as the final name — already chosen in the PRD; sanity-check it reads clearly out loud and isn't easily mistyped
- [ ] Check domain availability: `.com`, `.app`, `.io` — pick a primary, redirect the others if cheap enough to reserve
- [ ] Register the chosen domain (Namecheap, Cloudflare Registrar, or similar)
- [ ] Quick trademark screening (e.g., USPTO TESS basic search) — a sanity check for obvious conflicts, not a substitute for real legal clearance if this becomes a real business
- [ ] Reserve social handles you actually plan to use (X, Instagram) — skip the ones you won't use, squatting isn't worth the time at MVP stage
- [ ] Set up a project email alias (`hello@yourdomain`) if you want one for support/contact

### 0.2 Branding & Visual Identity
- [ ] Lock the color palette — already defined: teal `#0F766E` primary, coral `#F97316` accent, emerald/rose for balance states
- [ ] Lock the typeface — Inter recommended, tabular numerals for currency figures
- [ ] Sketch 3–5 rough logo directions (wordmark / icon+wordmark / abstract mark)
- [ ] Execute the logo — pick one path:
  - [ ] DIY in Figma or Canva (fastest, free, fits the solo-dev budget)
  - [ ] AI logo generator (Looka, Brandmark) as a starting point to hand-refine
  - [ ] Commission on Fiverr/99designs (~$50–150 *estimate* — a one-time cost, separate from the $47/mo recurring infra budget)
- [ ] Export logo source (SVG) and raster variants (PNG @1x/2x/3x, transparent background)
- [ ] Generate favicon set (16×16, 32×32, 180×180 apple-touch-icon)
- [ ] Generate PWA icon set (192×192 and 512×512, plus maskable variants for `manifest.json`)
- [ ] Design an Open Graph / social share image (1200×630) for link previews
- [ ] Optional: compile colors, type, and logo usage into a short brand sheet in `agent_docs/`

### 0.3 Project & Tooling Setup
- [ ] Create the GitHub repository (private to start)
- [ ] Add `.gitignore` (Next.js/Node defaults, plus `.env*`)
- [ ] Write a README with the one-line product description and a link to `docs/`
- [ ] Enable branch protection on `main` — require PRs even solo, per AGENTS.md's workflow discipline
- [ ] Create a GitHub Project board (or Issues + labels) mirroring AGENTS.md's four roadmap phases
- [ ] Commit `docs/PRD-SettleMates-MVP.md` and `docs/TechDesign-SettleMates-MVP.md`
- [ ] Commit `AGENTS.md`, `MEMORY.md`, `REVIEW-CHECKLIST.md`, and `agent_docs/`
- [ ] Adopt Conventional Commits for commit messages
- [ ] Create accounts: Vercel, Supabase, Resend, PostHog, Sentry (each has a free tier that fits the budget target)
- [ ] Connect the GitHub repo to Vercel so PRs get automatic preview deployments

---

## Phase 1 — Technical Foundation
*(Matches AGENTS.md Roadmap Phase 1)*

- [ ] Scaffold the Next.js App Router project (TypeScript, Tailwind, ESLint)
- [ ] Install and configure shadcn/ui
- [ ] Install TanStack Query, React Hook Form, Zod, Framer Motion
- [ ] Set up Prisma and connect it to a dev Supabase Postgres project
- [ ] Write the initial Prisma schema (User, Group, GroupMember, Expense, ExpenseSplit, Invitation, SettlementTransaction, Notification) per the Tech Design's Data Model
- [ ] Run the first migration, verify via Prisma Studio
- [ ] Configure Supabase Auth (Google OAuth + Magic Link)
- [ ] Write Row-Level Security policies scoped by group membership
- [ ] Build the base app shell — layout, navigation, public vs. auth-gated routes
- [ ] Set environment variables locally, in Vercel Preview, and (later) Vercel Production
- [ ] Confirm CI/CD works: push a branch, watch the preview deployment succeed
- [ ] Add `manifest.json` using the Phase 0 icon set, plus a basic service worker
- [ ] Wire up Sentry
- [ ] Wire up the PostHog and Vercel Analytics skeleton

---

## Phase 2 — MVP Must-Have Features
*(PRD P0 / AGENTS.md Roadmap Phase 2 — implement → unit test → manual QA → check off in MEMORY.md for each)*

- [ ] **F1 — Trip / Group Creation:** create-group form, admin role assignment on creation, dashboard listing
- [ ] **F2 — Member Invitations:** generate shareable link, public unauthenticated preview, join flow, admin revoke
- [ ] **F3 — Expense Management:** add-expense form, paginated history, edit/delete (creator/admin only)
- [ ] **F4 — Equal Split:** server-side calculation, defined remainder-rounding rule
- [ ] **F5 — Custom Split:** exact-amount, percentage, and shares modes, with sum validation
- [ ] **F6 — Live Balance Calculation:** balance aggregation query, Supabase Realtime subscription, balance UI
- [ ] **F7 — Smart Settlement Engine:** debt-simplification algorithm with near-100% test coverage, "who pays whom" UI, mark-complete action
- [ ] **F8 — Quick Split Mode:** standalone flow (no group required), guest create/view, shareable result link

Use `REVIEW-CHECKLIST.md` as the done-definition for every item above — don't mark a feature complete without running through it.

---

## Phase 3 — Should-Have (P1)

- [ ] Shared Living mode (ongoing/recurring group behavior)
- [ ] Expense categories and activity timeline
- [ ] Basic notifications (in-app + email via Resend)

## Phase 4 — Could-Have (P2, only if time remains)

- [ ] Receipt upload (Supabase Storage)
- [ ] QR code invitations
- [ ] Expense comments / dispute handling

---

## Landing Page & Marketing Site *(parallel track)*

- [ ] Wireframe the structure: hero, how-it-works, features, footer
- [ ] Write copy: hero headline/subhead, how-it-works steps, FAQ
- [ ] Build the "how it works" section with a short screen-recorded product walkthrough (video or looping GIF) — record this from the real working app once Phase 2 is functional, not from mockups
- [ ] Implement scroll-reveal animations with Framer Motion's `whileInView`, respecting `prefers-reduced-motion`
- [ ] Reference points for tone and motion: Linear, Wise, Arc, Notion (per the earlier design discussion in this project)
- [ ] Check the landing page specifically on mobile — it's easy to polish the app and forget the marketing site

---

## SEO *(parallel track, hardening before launch)*

**Technical**
- [ ] `sitemap.xml` (Next.js `sitemap.ts`)
- [ ] `robots.txt`
- [ ] Canonical URLs
- [ ] Meta titles and descriptions on every public page
- [ ] Open Graph and Twitter Card tags, using the Phase 0 share image
- [ ] `SoftwareApplication` JSON-LD structured data on the landing page
- [ ] `noindex` on authenticated app routes (dashboard, group pages shouldn't be indexed)

**Performance**
- [ ] Lighthouse pass on the landing page — treat Core Web Vitals thresholds as targets to hit and measure, not guaranteed outcomes
- [ ] Image optimization via `next/image`, lazy-loaded below the fold
- [ ] Font loading via `next/font` to avoid layout shift

**Discovery**
- [ ] Submit the sitemap to Google Search Console
- [ ] Verify domain ownership in Search Console
- [ ] Set up a landing → signup conversion goal in PostHog

---

## Testing
*(Ongoing from Phase 2 — intensive hardening pass before launch)*

- [ ] Unit tests (Vitest) — settlement engine, balance calculations, permission logic, split calculations, and auth flows are the high-priority set per the Tech Design
- [ ] Integration tests on the critical path: create expense → balance updates → settlement reflects it
- [ ] E2E smoke tests (Playwright is the recommended pairing, but wasn't locked in at the Tech Design stage — confirm before building) covering sign up → create group → invite → add expense → view settlement
- [ ] Manual cross-browser pass (Chrome, Safari, Firefox, Edge)
- [ ] Manual cross-device pass on a real phone, not just devtools responsive mode
- [ ] Accessibility audit: automated (axe DevTools) + manual keyboard-only pass + a screen reader spot-check, against the PRD's WCAG 2.1 AA target
- [ ] Security review: confirm with a second test account that RLS actually blocks cross-group access, confirm rate limiting on invite-acceptance and Quick Split endpoints, confirm session expiry behaves correctly
- [ ] Sanity-check for obvious N+1 query patterns with a handful of concurrent test users — full load testing isn't necessary at MVP scale
- [ ] Beta test with 2–3 real friend groups before any public launch — for a product like this, real usage will surface more than any synthetic test

---

## Pre-Launch

- [ ] Privacy Policy page — plain language, covers what's collected and why (matters even for a side project handling emails and financial-adjacent data)
- [ ] Terms of Service page
- [ ] Cookie/consent notice if analytics cookies are in use — check what applies to your actual user base
- [ ] Resend domain verification (SPF, DKIM, DMARC) so invite and notification emails don't land in spam
- [ ] Production Supabase project created, separate from dev, per the Tech Design
- [ ] Production environment variables set in Vercel
- [ ] Full staging walkthrough of every P0 flow, desktop and mobile
- [ ] Confirm Sentry is receiving events from staging
- [ ] Confirm Supabase automatic backups are enabled on the production tier
- [ ] Document the rollback plan (Vercel's instant rollback to the previous deployment)

---

## Deployment / Launch

- [ ] Final production deploy from `main`
- [ ] DNS cutover to the production domain
- [ ] Confirm SSL is active (automatic via Vercel)
- [ ] Smoke test directly on the production URL — the full P0 flow, one more time
- [ ] Confirm analytics and error monitoring are live on production, not just preview
- [ ] Soft launch to a small real group of friends/beta users first
- [ ] Watch error rates and Core Web Vitals for the first 48 hours before any wider announcement

---

## Post-Launch

- [ ] Public launch announcement (Product Hunt, relevant subreddits, X/LinkedIn, personal network — whichever fit your actual audience)
- [ ] Track activation/engagement/retention against the PRD's success metrics (≥70% first-session expense add, ≥80% invite acceptance, and the rest)
- [ ] Weekly PostHog funnel + Sentry trend review for the first month
- [ ] Collect qualitative feedback from early users directly, not just analytics
- [ ] Triage feedback into Phase 3/4 backlog, or a new phase if something unexpected surfaces
- [ ] Monthly maintenance pass per AGENTS.md — dependency updates, vendor pricing tier review, refresh `AGENTS.md`/`MEMORY.md`
