# REVIEW-CHECKLIST.md — SettleMates

Run through this before marking any feature "done" or opening a PR for merge. This is the quality and security gate — don't skip items because a feature "seems small."

## Functionality
- [ ] Feature matches its acceptance criteria in `agent_docs/product_requirements.md` exactly
- [ ] Manually tested the happy path in the browser (not just unit tests)
- [ ] Edge cases checked: empty states, zero-amount expenses, single-participant groups, non-evenly-divisible splits

## Code Quality
- [ ] `npm run lint` passes with no new warnings
- [ ] `npm run typecheck` passes — no new `any` without a justifying comment
- [ ] No unrelated files reformatted or touched
- [ ] Domain module boundaries respected (no direct cross-domain internals access)

## Testing
- [ ] Unit tests written for new business logic, especially anything touching balances, splits, or settlement
- [ ] Settlement engine / split-validation changes: coverage at or near 100% for the changed logic
- [ ] Integration test covers the critical path if this feature affects balance state
- [ ] `npm test` passes locally, including previously-passing tests (no regressions)

## Security
- [ ] Row-Level Security policy updated if a new table or access pattern was introduced
- [ ] Server-side authorization check present (not relying on RLS alone) for any admin-only action
- [ ] No secrets, API keys, or connection strings committed
- [ ] User-submitted amounts/splits are validated server-side, never trusted from the client alone

## Accessibility
- [ ] Keyboard-navigable (tab order makes sense, no keyboard traps)
- [ ] Interactive elements have visible focus states
- [ ] Sufficient color contrast (WCAG 2.1 AA target)
- [ ] Screen-reader labels present on icon-only buttons and form inputs

## Performance
- [ ] No obvious N+1 queries introduced (check Prisma query patterns)
- [ ] New list views are paginated if they could grow unbounded (expense history, activity timeline)

## Documentation
- [ ] `MEMORY.md` updated: what shipped, what's next
- [ ] `AGENTS.md` "Current State" updated if this completes or starts a phase
- [ ] Any newly resolved Open Question moved out of the open list in `MEMORY.md`

## Before Deployment (run once per release, not per feature)
- [ ] Full security pass: RLS policies reviewed end-to-end, rate limiting in place on unauthenticated endpoints (invite acceptance, Quick Split creation)
- [ ] Environment variables confirmed set correctly in Vercel/Supabase for the target environment
- [ ] Staging/preview deployment manually walked through on both desktop and mobile viewport
