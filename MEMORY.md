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
- **2026-11-17** — Home hero headline now shows the live answer ("Amit owes you ₹600.") from the calculator's settlement. `Hero` is a client component that owns `useSplitCalculator` and renders the shared `SplitCalculatorCard`; `/split-bill-calculator` still uses the self-contained `SplitCalculator`. The hook is imported by path, never through `components/shared/index.ts` (that barrel is used by Server Components). Mobile still shows the headline above the fold only, so the swap is unseen while typing — open question.
- **2026-11-17** — Launch pass on honesty and the calculator. Copy now claims only what ships (one bill at a time); trips and shared living appear only in a "Coming soon" section with no sign-up form. Calculator: per-row live balance ("gets back"/"owes") replaced the Share column; amounts regroup Indian-style on blur; button is "See who pays whom"; Share (Web Share API) is primary when available, else Copy; copied text ends with a `/split-bill-calculator#split=…` link that reopens the split (base64url JSON in the URL fragment, Zod-validated, cleared from the address bar after loading). `formatCents` now shows two paise digits whenever there are paise (₹762.50). "How it works" is a Goa example computed by the real engines; Reveal is faster (0.45s, 16px).
- **2026-11-17** — Calculator page SEO pass: route renamed `/calculator` → `/split-bill-calculator` (permanent redirect in `next.config.ts`; browsers keep the `#split=` fragment across it). Title "Split Bill Calculator: Who Owes Whom, Free", `lang="en-IN"`, `summary_large_image` cards, generated OG images (`components/shared/OgImage`, hex colours because the renderer can't read CSS variables). "How to split a bill when people paid different amounts" section is computed by the real engines; FAQ rewritten around search questions and feeds the FAQPage JSON-LD.
- **2026-11-18** — Built the MDX blog (`@next/mdx`, posts as `content/blog/<slug>/meta.ts` + `index.mdx`) plus About/Privacy/Terms. Plan, as-built notes and the publishing guide: `docs/Blog-Plan.md`. Keep post listing off the MDX graph (`lib/blog/posts.ts` imports only `meta.ts`; MDX loads via `lib/blog/content.ts`), keep the content path literal for Turbopack tracing, and don't add `dynamicParams = false` (Next 16.3.5 logs NoFallbackError per unknown slug). Author "Name" and `CONTACT_EMAIL` are owner-approved placeholders; AdSense is deferred.
- **2026-11-18** — Replaced the placeholder post with three published example posts (rent, group trips, asking a friend to pay you back) and added a Read next band (related posts + Quick links) to post pages. Posts are `draft: false` under the placeholder author "Name" — flagged to the owner; house style is in `docs/Blog-Plan.md` section 10.
- **2026-11-18** — Owner asked that About, Privacy and Terms not look like blog posts. About is now a landing-style page (hero facts, principles, roadmap, founder, dark contact band). Privacy/Terms use `components/shared/LegalPage` (header band, at-a-glance cards, numbered contents, smaller type via `LEGAL_MDX_COMPONENTS`). `ProsePage` and `content/pages/about.mdx` were removed.
- **2026-11-18** — Home Features became a live, interactive bento grid (settlement graph, paisa receipt, share link, privacy zeros) running the real engines. The layout now imports Header/Footer directly because the `_components` barrel was shipping the grid's client JS (~9 KB gz) to every marketing page; home is 291 KB gz, other pages stay at 287 KB.
- **2026-11-18** — Owner: analytics will be added before launch, so copy must not claim "no cookies", "no tracking" or "nothing saved". Claims now cover only the split (never stored on our servers); the Privacy page has an Analytics section and promises analytics never gets split data, so the analytics setup must strip the `#split=` fragment. The owner found any privacy tile in the bento too technical (counters, then a browser-vs-server view); it was replaced by a "Ready for the group chat" tile showing the real copied message. Privacy claims now live only in the FAQ, About and Privacy pages. Footer got a giant wordmark.
- **2026-11-19** — Did the 8 launch-checklist code items that needed no decision: security headers with a report-only CSP, the manifest, `.env.example`, CI (with `next typegen` before `tsc`), Dependabot, and a Lighthouse pass (100s after fixing `role="group"` on the calculator summary `<dl>`). The barrel split was reverted (Turbopack duplication). Open: the analytics choice, a possible switch to webpack builds, and deleting `public/globe.svg`.

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

- **2026-11-19** — Owner chose Vercel Web Analytics (+ Speed Insights). Wired with `beforeSend` stripping `#split=`, which was verified in dev. Privacy section 3 names Vercel and its real data handling (no third-party cookies; a request hash discarded after 24 h). `public/globe.svg` deleted. Production builds stay on Turbopack (webpack switch not decided).
- **2026-11-19** — Quick Split cap raised from 20 to 50 people at the owner's request (`MAX_PARTICIPANTS`; the share-link schema reads the same constant, so links with 21–50 people now open). The About facts, About roadmap and home Features copy now read the constant instead of a hard-coded "20".
- **2026-11-19** — Added `components/ui/dotted-glow-background.tsx` (Aceternity `DottedGlowBackground`, copied as-is at the owner's request) behind the home Hero, in the theme teal (`--primary` for dots and glow). The site has no dark mode, so the layer stays at `opacity-20`. A replica of one frame measured ~9 ms for ~10k dots at 1024 px wide.
- **2026-11-19** — Dark mode added at the owner's request: Magic UI `AnimatedThemeToggler` in the header (bar from `sm` up, "Theme" row in the mobile menu below `sm`), saved as `theme` in localStorage, applied before first paint by `THEME_INIT_SCRIPT` in the root `<head>` (saved choice, else system). Dark `--primary-text` brightened to teal-500 for contrast; a text-contrast sweep of every page passes in both themes.
