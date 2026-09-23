# React

## General

- Prefer simple, readable React code.
- Follow modern React (19+) best practices.

## Comments

- **Default to no comment.** A comment carries the *why* the code cannot. If it paraphrases the
  next line, delete it.
- **Hard limit: 1–2 lines per comment.** Never 3+ lines, and never a multi-paragraph doc block
  with a blank `*` separator. If the explanation will not fit in two lines, the code needs a
  clearer name or a smaller function — not a longer comment.
- **Budget: 1–2 comments per changed file.** Not one per function, hook, variable, or type field.
- Never comment a `useState`, a plain guard clause, a mapped array, an import, or a `useCallback`
  whose name already says it.
- Do not restate a signature. `resetActivity()` needs no `/** Resets activity. */`.
- Do not document decisions *not* taken ("no throttle wrapper because…") — that explains absent
  code, which the reader is not looking at.
- Doc blocks only on exported functions whose contract is genuinely non-obvious, still ≤2 lines.
- Never narrate the edit: no `// was:`, `// changed to`, `// added for <ticket>`. Git records that.

Bad — 6 lines, restates the code, documents a non-decision:

```ts
/**
 * Records *which* slots the reviewer was active in — nothing more. The server
 * owns the inactivity threshold and reconstructs review time itself, so nothing
 * here counts, accumulates, or judges; it only observes.
 *
 * Called by: the heartbeat loop, which is its only owner.
 */
```

Good — 2 lines, only the part the code cannot say:

```ts
/**
 * Records which slots the reviewer was active in. The server owns the inactivity
 * threshold and reconstructs review time itself, so nothing here counts or judges.
 */
```

## Memoization

- `useCallback`, `useMemo`, and `React.memo` are performance optimizations. Do not add them by default.
- **React Compiler is NOT enabled in this repo** — manual memoization is still required where it matters.
- Memoize when:
  - The value is read in another hook's dependency array — otherwise that effect re-runs every render.
  - The value is a context provider's `value` — otherwise every consumer re-renders.
  - The callback is passed to a `React.memo` child.
  - The computation is genuinely expensive, or profiling shows a need.
- Otherwise prefer plain functions and values.

## Hook return types

- **Do not annotate a `useX.ts` hook's return type.** No `UseFeatureResult`, `UseDropPinItemResult`,
  `UseSidebarMenuResult`. Let TypeScript infer it — autocomplete and hover are identical, and
  cmd-click lands on the implementation instead of an interface that only restates it.
- An annotation that repeats the returned object is duplication: two places to edit for every
  change, and it drifts. The compiler already has the shape.
- **Annotate only a real contract**: a context value behind `createContext`, an `src/api` hook's
  `UseQueryResult`, or a type a consumer must import by name.
- `…Params` interfaces on hook *inputs* stay named and exported — inputs cannot be inferred.
- A `types.ts` holding nothing but a removed return type should be deleted, not left empty.

```ts
// Bad — the interface only restates the return, and lives in a second file.
export const useMeasureItem = (): UseMeasureItemResult => { … };

// Good — inferred; the object below is the single source of the shape.
export const useMeasureItem = () => {
  …
  return { isMeasureEnabled, hasGpsCoordinates, handleMeasureClick };
};
```

## State

- Avoid storing derived state. Compute values during render whenever practical.
- Never initialize state from props or API data that can change on re-fetch — derive it instead.
  `useState(row.field)` keeps the first render's value forever; use `useState(null)` plus
  `localOverride ?? row.field ?? fallback`.
- Never expose a raw `useState` setter — not from a `useX.ts` hook's return object, and not as a
  prop passed to a child. Return a named handler that wraps it (`handleRunMenuOpenChange`,
  `handleSearchChange`) so the setter stays private, the call site reads as intent rather than
  mechanism, and extra work can be added later without touching every caller.

```ts
// Bad — the setter leaks; every consumer is coupled to the state's shape.
return { isOpen, setIsOpen };
<DropdownMenu open={isOpen} onOpenChange={setIsOpen} />

// Good — the hook owns the transition; the component states what happens.
const handleOpenChange = (open: boolean) => setIsOpen(open);
return { isOpen, handleOpenChange };
<DropdownMenu open={isOpen} onOpenChange={handleOpenChange} />
```

## Effects

- Use `useEffect` only to synchronize with external systems. Never for values computable during render.
- Every listener, timer, subscription, observer, or external resource must be cleaned up in the
  returned function. If the effect can re-run, the previous one must be torn down first.
- Effects must be safe to run twice: StrictMode mounts, unmounts, and remounts in development.
- Dependency arrays must be exhaustive. Suppress the lint rule only with a comment saying why.
- Guard async effects against resolving after unmount or after the effect re-ran. Own the resource
  in a closure-scoped variable, not a shared ref, so each run cleans up exactly what it created.