# Tech Stack — SettleMates

Detailed reference for the exact tools this project uses. Check here before adding a dependency or picking an approach that isn't shown.

## Languages & Frameworks

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js, App Router | Pin to the latest stable release when scaffolding — don't assume a specific version without checking |
| Language | TypeScript, strict mode | `strict: true` in `tsconfig.json`, no exceptions |
| Styling | Tailwind CSS | Utility-first; avoid ad hoc CSS files except for truly global styles |
| UI components | shadcn/ui | Copy components in as needed rather than installing a monolithic UI library |
| Server-state data fetching | TanStack Query | All client-side reads/mutations against the API layer go through this, not raw `fetch` calls scattered in components |
| Forms | React Hook Form + Zod | Zod schema is the single source of truth for both client-side form validation and server-side request validation — define once, reuse both places where possible |
| Motion | Framer Motion | Used sparingly — key transitions only (e.g., settlement reveal), not decorative animation everywhere |
| ORM | Prisma | Schema lives in `db/schema.prisma`; migrations via `prisma migrate` |
| Database | Supabase PostgreSQL | Relational — this matters for the ledger/balance data, don't reach for a document-store mental model |
| Auth | Supabase Auth | Google OAuth + Magic Link primary; email/password optional |
| Storage | Supabase Storage | Receipts (P2), group cover images, avatars |
| Realtime | Supabase Realtime | WebSocket-based; used for live balance/activity updates |
| Email | Resend | Transactional only: invitations, magic links, notifications, welcome |
| Analytics | PostHog (product) + Vercel Analytics (performance) | |
| Error monitoring | Sentry | |
| Hosting/CI | Vercel | Git-push-to-deploy, preview per PR |
| Testing | Vitest + React Testing Library | |

## Project Layout

Code lives at the **repository root — there is no `src/` folder**. `app/`, `components/`, `domains/`, `lib/`, `db/`, `config/`, and `tests/` are all top-level directories, and the `@/` path alias maps to the repo root. The `src/` tree sketched in `docs/TechDesign-MVP.md` is superseded; `rules/nextjs.md` holds the canonical file-type destination table.

## Setup Commands

`pnpm` is the package manager — `packageManager` in `package.json` pins the version. Never use `npm` or `yarn`: they write a competing lockfile and ignore the pin.

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm dev
pnpm lint
pnpm exec tsc --noEmit      # typecheck (no "typecheck" script defined yet)
pnpm build
```

Vitest is the chosen test runner but is not installed yet, so there is no `test` script — add it when the suite is set up.

## Canonical Patterns

**Route Handler with Zod validation (the standard shape for every API mutation):**

```typescript
// app/api/groups/[id]/expenses/route.ts
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireGroupMembership } from "@/domains/members/auth";

const createExpenseSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(200),
  payerId: z.string().uuid(),
  splitType: z.enum(["equal", "exact", "percentage", "shares"]),
  splits: z.array(z.object({ userId: z.string().uuid(), shareAmount: z.number() })),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // Verify membership before touching business logic — never trust the client's claimed group access.
  await requireGroupMembership(params.id);

  const body = createExpenseSchema.parse(await req.json());
  // ...delegate to the expenses domain module for split validation + persistence
}
```

**Prisma schema entity (illustrative shape — full schema lives in `db/schema.prisma`, generate the rest with your coding agent from the Tech Design's Data Model section):**

```prisma
model Expense {
  id          String          @id @default(uuid())
  groupId     String
  payerId     String
  createdById String
  amount      Decimal
  description String
  category    String?
  splitType   String          // "equal" | "exact" | "percentage" | "shares"
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  group       Group           @relation(fields: [groupId], references: [id], onDelete: Cascade)
  splits      ExpenseSplit[]

  @@index([groupId, createdAt])
}
```

**TanStack Query usage (client-side read):**

```typescript
const { data: balances } = useQuery({
  queryKey: ["groups", groupId, "balances"],
  queryFn: () => fetch(`/api/groups/${groupId}/balances`).then((r) => r.json()),
});
```

Why these patterns: validation happens once, at the boundary, with a schema that's reused rather than re-implemented; membership/authorization is checked before any business logic runs, not after; and all server-state reads flow through TanStack Query so cache invalidation on mutation (and on incoming Realtime events) stays consistent everywhere instead of being reinvented per component.
