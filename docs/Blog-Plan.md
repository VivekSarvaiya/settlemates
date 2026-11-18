# SettleMates Blog — Plan and As-Built Notes

**Status:** built and live on 2026-11-18 (layout, post page, index, wiring, About/Privacy/Terms) with three published posts. Placeholders to replace are listed in section 6. Section 8 covers what changed from the plan while building, section 9 explains how to publish a post, and section 10 describes the three example posts.

**Goal:** a file-based MDX blog inside this repo at `/blog/[slug]`, with no CMS and no new vendor. Posts are pre-rendered to static HTML at build time, and publishing a post is a pull request. A headless CMS (Sanity, Contentful) only becomes worth it if non-developers start writing posts; the URLs would stay the same if we migrated.

**Scope:** the blog layout, the post page, the blog index, wiring (sitemap, RSS, nav), and the trust pages (About, Privacy, Terms). No blog content is written as part of this work.

---

## 1. What was verified

| Original assumption | What the repo actually has |
|---|---|
| Reuse `ShareBar` for sharing posts | ❌ `components/ui/share-bar.tsx` is a coloured proportion bar from the old calculator design and is unused. Posts need a new share button (Web Share API with a copy-link fallback). |
| Tailwind is probably v4 | ✅ v4: `@import "tailwindcss"` and `@theme` in `app/globals.css`; there is no `tailwind.config`. Tailwind's default text sizes are **not** replaced, so `text-sm`/`text-base`/`text-lg` are Tailwind's stock 14/16/18px, not the 13/15/24px in `rules/tailwind.md` and the UIUX doc, and `text-xl` and similar still compile. Sticking to the allowed sizes is a review discipline, not a build-time guarantee. |
| The UIUX doc allows a separate expressive type system for marketing | ❌ `docs/UIUX-Design.md` allows only 2 weights and 3 sizes. The marketing-only display tokens (`text-display-md`, `text-display-lg`, `text-lead`) are recorded in `AGENTS.md`. They are enough for the blog (see decision D3). |
| The post reader goes in a route-local `_lib/posts.ts` | ❌ The sitemap and the RSS feed also need it. `rules/nextjs.md` says code used by more than one route belongs in `lib/`, not an `_` folder. |
| Dependencies: `gray-matter`, `next-mdx-remote`, `reading-time`, rehype plugins, `@tailwindcss/typography` | ❌ `gray-matter` (last release 2021) and `reading-time` (last release 2022) are effectively unmaintained, which `AGENTS.md` rules out. Next.js 16 supports MDX itself through `@next/mdx`, so none of these are needed (see D1, D4). |
| SEO plumbing exists | ✅ `JsonLd`, `OgImage`, `app/sitemap.ts`, `app/robots.ts`, `config/routes.ts`, `config/env.ts`, and the home page's `WebSite`/`Organization` structured data with the `#organization` id, which posts reference as publisher. |
| No Privacy, Terms or About pages | ✅ None exist. `docs/SDLC-Roadmap.md` (Pre-Launch) already lists Privacy Policy and Terms of Service. |
| No auth, API or database | ✅ Confirmed. The site is marketing-only. |
| The blog is on the roadmap | ⚠️ It is not in the `AGENTS.md` Roadmap phases. It fits the "SEO *(parallel)*" track in `docs/SDLC-Roadmap.md`; add it there when the work starts. |

---

## 2. Decisions

**D1. MDX via Next's own `@next/mdx`.** Dependencies are `@next/mdx` (pinned to the installed Next version, 16.3.5), `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, and `remark-gfm` (for tables). Posts are loaded by dynamic import, the pattern in the Next.js 16 MDX guide. Turbopack only accepts plugins given as strings, so pass `'remark-gfm'` by name. `.mdx` is not added to `pageExtensions`, so MDX files never become routes on their own.

**D2. One folder per post: `content/blog/<slug>/` holding `meta.ts`, `index.mdx` and the post's images.**
- The post's details live in `meta.ts` as `export const meta = { … } satisfies PostMetaInput`. TypeScript checks them while writing, and the Zod schema checks them again when the post loads, so a bad post fails the build. No front-matter library is needed.
- `meta.ts` is separate from `index.mdx` on purpose: listing posts (layout, sitemap, feed, index) only imports `meta.ts`, so MDX and the components posts use stay off every other page (see section 8).
- The hero image is imported in `meta.ts`, so `next/image` gets real width and height and the page doesn't shift as it loads.
- The slug is the folder name and must be lowercase kebab-case, or the build fails.

**D3. No Tailwind typography plugin.** Its defaults use weights 600–800 and its own size scale, which break the design system. Each markdown element gets a styled component using tokens that already exist:

| Element | Class |
|---|---|
| Post title (H1) | `text-display-lg font-medium` (40→68px) |
| H2 | `text-display-md font-medium` (28→40px, the same size as section headings elsewhere on the site) |
| H3 | `text-lead font-medium` (same size as body; set apart by weight, per the UIUX doc) |
| Body, lists, quotes | `text-lead` |
| Captions, dates, metadata | `text-sm` |
| Inline code | `bg-muted rounded px-1`, Inter (no mono font is loaded) |

The reading column is `max-w-2xl` (about 672px), inside the UIUX doc's 640–720px range. No new tokens are added.

**D4. No libraries for small jobs.**
- **Reading time** is word count ÷ 200, rounded up.
- **Table of contents:** `##` and `###` headings are read from the raw `.mdx` text. The heading component and the table of contents share one slug function, so their ids always match. Two headings with the same slug fail the build.
- **Images:** plain markdown images (`![]()`) fail the build with "use `<Figure>`", so every image goes through `next/image`.
- **Code highlighting:** none. Not needed for this content.

**D5. Drafts.** `meta.draft: true` posts show in `pnpm dev` and on Vercel preview deployments, and are hidden in production builds. They always render with `robots: noindex`. The flag is derived in `config/env.ts` (`NODE_ENV === "development"` or `VERCEL_ENV === "preview"`).

**D6. The blog stays hidden until the first published post.** With zero published posts:
- `/blog` renders an empty state with `noindex`.
- `/blog` is left out of the sitemap.
- The Blog links don't appear in the header or footer.

The first published post turns all three on automatically, which avoids launching a thin, empty page.

**D7. No pagination or category pages yet.** The index lists every post until there are about 24. After that, add `/blog/page/[n]` (a path, not `?page=`). Posts still show a category badge. Starter categories, all in one constant: **Guides, Trips, Flatmates, Money basics**.

**D8. Authors are shown on the About page, not on separate author pages.** Author records live in `content/authors.ts`. The author box and `BlogPosting.author.url` link to `/about#<authorId>`.

**D9. About, Privacy and Terms have their own layouts, not the blog's.** About is a landing-style page built from components and `const.ts` data in `app/(marketing)/about/_components/`: hero with key facts, principles, today vs. next (reusing the home page's `UPCOMING_MODES`), the founder card with the `#founder` anchor, and a dark contact band. Privacy and Terms share `components/shared/LegalPage`: a muted header band with summary and last-updated date, "at a glance" cards, a numbered contents list (sticky on desktop), and smaller document type via `LEGAL_MDX_COMPONENTS`. Their text stays in `content/pages/{privacy,terms}.mdx`. Sections must be numbered `## 1. …`, `## 2. …` (a test enforces it), and the contents list is read from those headings by `lib/contentPages.ts`. The text describes the site as it is today: no accounts, no cookies, no analytics, nothing stored on our servers. It is a draft for the owner to review, not legal advice.

**D10. Optional `<QuickSplit />` component** that embeds the real calculator inside an article. It isn't in the global MDX component list: a post imports it at the top (`import { QuickSplit } from "@/components/mdx/QuickSplit/QuickSplit"`), and it lazy-loads the calculator with `next/dynamic`.

**D11. Consolidation done as part of this work:**
- **`config/site.ts`:** `SITE_NAME` and locale, moved from `app/(marketing)/_lib/const.ts`.
- **`lib/seo.ts`:** `absoluteUrl` and the organisation reference, now that home, calculator and blog all need them.
- **`components/shared/Breadcrumb`:** used by blog posts, and the calculator page switches to it.
- **`OgImage`:**
  - gains an article variant: category + title, no worked example;
  - uses the split-arrow glyph from `AppIcon` instead of the "S".

**D12. RSS at `app/(marketing)/blog/feed.xml/route.ts`.** This is a deliberate exception to the "route handlers live in `app/api/`" row of `rules/nextjs.md`: a feed is a public document like the sitemap, not an API.

**D13. No `Reveal` animations on the article body,** so the text is visible without JavaScript and is never hidden at first paint. Cards on the index may use `Reveal`, as the rest of the site does.

---

## 3. Folder structure

```txt
content/
  authors.ts                        # author records: name, role, bio, optional photo import
  blog/<slug>/meta.ts · index.mdx   # typed meta + body; images beside them
  pages/privacy.mdx · terms.mdx     # numbered legal sections; About is component-built
mdx-components.tsx                  # required by @next/mdx; maps elements → components/mdx

config/
  routes.ts                         # + blog, blogPost(slug), blogFeed, about, privacy, terms
  site.ts                           # new: SITE_NAME, locale
  env.ts                            # + draft visibility flag

lib/
  seo.ts                            # absoluteUrl, organisation reference
  hooks/useWebShare.ts              # share sheet, copy-link fallback
  blog/
    schema.ts                       # Zod meta schema, slug rule, categories
    const.ts                        # CATEGORIES, WORDS_PER_MINUTE, RELATED_POST_LIMIT
    types.ts
    posts.ts                        # server-only: read folders, import meta.ts, validate, raw text
    content.ts                      # server-only: import index.mdx (post page only)
    feed.ts · format.ts             # RSS builder; date and reading-time formatting
    select.ts                       # pure: visible, sorted, featured, related
    headings.ts                     # pure: TOC extraction, slugify, duplicate check, reading time

components/
  mdx/
    MdxElements/                    # p, lists, a, blockquote, hr, strong, code, pre, table, h1/img guards
    Heading/ · Figure/ · Callout/ · Disclaimer/ · CtaCard/ · ContactEmail/ · QuickSplit/
    index.ts                        # MDX_COMPONENTS
  blog/PostCard/ · AuthorAvatar/    # shared by the index, post page, calculator page and About
  shared/Breadcrumb/ · LegalPage/   # new
  shared/OgImage/                   # + article variant

app/(marketing)/
  blog/
    page.tsx                        # index
    feed.xml/route.ts               # RSS
    opengraph-image.tsx
    _lib/const.ts · structuredData.ts   # Blog + BreadcrumbList
    [slug]/
      page.tsx                      # generateStaticParams, generateMetadata, notFound()
      opengraph-image.tsx
      _components/                  # PostHeader, TableOfContents, SharePost, AuthorBox, RelatedPosts
      _lib/structuredData.ts        # BlogPosting + BreadcrumbList
  about/page.tsx · _components/{AboutHero,Principles,Roadmap,Team,Contact}/
  privacy/ · terms/                 # page.tsx + _lib/const.ts (summary, highlights) around LegalPage
  privacy/page.tsx
  terms/page.tsx

tests/
  fixtures/blog.ts                  # buildPost(overrides)
  lib/blog/schema · select · headings · feed .test.ts
  lib/seo.test.ts                   # sitemap: published posts in, drafts out, blog hidden when empty
  components/Heading · SharePost · TableOfContents .test.tsx
```

Every component folder follows the `Feature.tsx` / `useFeature.ts` / `types.ts` / `const.ts` convention in `AGENTS.md`.

---

## 4. Post page anatomy (top to bottom)

1. Breadcrumb: Home › Blog › post title
2. Category badge, H1, description
3. Byline: author, published date, "Updated" date when set, reading time
4. Hero image (optional)
5. Table of contents. On desktop it's a sticky sidebar highlighting the current section. On mobile it's a collapsible native `<details>`, which needs no JavaScript.
6. Article body; every H2 and H3 has an anchor link
7. Disclaimer, only where the post includes `<Disclaimer />`
8. Call-to-action card linking to the calculator (always shown; `<CtaCard />` is also available mid-article)
9. Share button
10. Author box, linking to `/about#<authorId>`
11. Read next (full-width band): "Keep reading" with up to 3 related posts (same category first, then newest) and an "All guides" link, then "Quick links" to the calculator, all guides, How it works and the FAQ (`[slug]/_components/QuickLinks/const.ts`)

**Behind the page:**
- `generateStaticParams` pre-builds every visible post. Unknown slugs and production drafts reach `notFound()` and return a real 404 with `noindex`.
- `generateMetadata` sets:
  - title, description, canonical URL;
  - preview tags with `type: "article"`, published and modified times, author and section;
  - `en_IN` locale and a large-image card.
- Structured data:
  - `BlogPosting`: headline, description, published and modified dates, author, publisher by `@id`, image, `inLanguage`, `articleSection`, `wordCount`;
  - `BreadcrumbList`.
- A preview image generated for each post.

**Blog index:** the latest post shown large, then a card grid. Page header with metadata, `Blog` and `BreadcrumbList` structured data, an RSS `<link>`, and an empty state when no posts are published.

---

## 5. Build order

Each step ends with `pnpm lint`, `pnpm exec tsc --noEmit` and `pnpm test` passing.

1. **Foundation:** install packages, MDX config, `mdx-components.tsx`, content model, `lib/blog`, routes, env flag, and unit tests for the schema, draft filter, sorting, related posts, headings and reading time.
2. **Post page,** with one clearly marked placeholder draft post so the layout renders end to end.
3. **Blog index.**
4. **Wiring:**
   - sitemap entries for posts with `lastModified`;
   - RSS feed;
   - header and footer links (check the header at 768px with six nav items, and move the nav breakpoint to `lg` if it's cramped);
   - links from the calculator page to related guides, once posts exist.
5. **Trust pages:** About (with author bios), Privacy, Terms, and footer links to them.
6. **Verification:**
   - `pnpm build` and `pnpm run test:coverage`;
   - browser check at desktop and 375px;
   - served tags and structured data;
   - a check that a draft never appears in production HTML, the sitemap or RSS.

Update `AGENTS.md` (Current State and Roadmap) and `MEMORY.md` when done. Commit only when asked.

---

## 6. Owner answers (2026-11-18)

1. **Author:** one author, the founder. Until the real details are in, `content/authors.ts` holds a clearly marked placeholder: name **"Name"**, role **"Founder of SettleMates"**, a placeholder bio and initials instead of a photo. Replace them with the real name, a 2–3 sentence bio and a photo **before publishing the first post**. Google weighs real authorship heavily for money topics.
2. **Operator:** an individual, not a company. The contact email is a placeholder (`CONTACT_EMAIL` in `config/site.ts`, set to an `example.com` address). Replace it before launch; the About, Privacy and Terms pages read it from that one place.
3. **Ads:** AdSense is later, not now. The trust pages describe today's site: no accounts, no cookies, no analytics, nothing stored on our servers. Before applying for AdSense:
   - update the Privacy page (third-party cookies, Google as a vendor);
   - qualify "Private by default" in the Features and FAQ copy;
   - add a Google-certified consent banner for EEA and UK visitors;
   - re-check page speed.

### Before launch checklist (placeholders to replace)

- [ ] Author name, bio and photo in `content/authors.ts`
- [ ] `CONTACT_EMAIL` in `config/site.ts`
- [ ] Owner review of `content/pages/privacy.mdx` and `content/pages/terms.mdx`
- [x] Placeholder draft post deleted; replaced by three real posts (section 10)
- [ ] Before deploying: the three posts are published (`draft: false`) under the placeholder author "Name". Replace the author first, or set `draft: true` until you do.

---

## 7. Deferred (not in this work)

- Pagination (`/blog/page/[n]`): add at about 24 posts.
- Category and tag pages.
- Separate author pages.
- Code syntax highlighting.
- Newsletter or email capture.
- A headless CMS, only if non-developers start writing.
- Ads and consent management: see section 6, answer 3.

---

## 8. What changed while building (2026-11-18)

- **Post meta moved to `meta.ts`.** With `export const meta` inside the MDX, listing posts had to import every post's MDX. That pulled the MDX components, including `QuickSplit`'s loader, into the shared layout and so onto every page.
- **The MDX import lives in `lib/blog/content.ts`, not `posts.ts`.** Turbopack bundles statically analysable dynamic imports even when they aren't called, so keeping it in `posts.ts` put MDX in every page that lists posts.
- **No `dynamicParams = false`.** In Next 16.3.5 it logs `Error: Internal: NoFallbackError` for every unknown slug. The visitor gets the same 404, but on Vercel that would look like server errors. The page and the per-post preview image call `notFound()` instead.
- **Literal content path.** `path.join(process.cwd(), "content", "blog")` must stay literal. A path built from a constant made Turbopack trace the whole project into the server output.
- **The per-post preview image is built on request (ƒ).** That's normal for metadata images on dynamic routes. `content/blog` is in that route's server trace, so it works on Vercel. Unknown and draft slugs return 404.
- **Type scale.** `text-lg` is 18px here, smaller than the 20px body, so H2 uses `text-display-md` and the post title `text-display-lg` (D3 updated).
- **Header nav moved to the `lg` breakpoint.** With six links, the nav wrapped at 768px. Below 1024px the menu button is used.
- **The featured post card stacks until `lg`.** Side by side at 768px it cropped the image.
- **JavaScript per page** (compressed, against the last commit): home 279 → 282 KB, calculator 279 → 287 KB, 404 274 → 276 KB. The blog, About, Privacy and Terms pages are 287 KB, and a post that embeds `<QuickSplit />` is 290 KB.
- **Known, not changed: the calculator ships to every page.** The cause predates the blog: `app/(marketing)/_components/index.ts` exports the home `Hero`, and the layout imports `Header`/`Footer` from that index, while `components/shared/index.ts` exports the calculator. Importing directly cut the calculator from non-calculator pages, but Turbopack then split the animation library into many small chunks and home grew to 315 KB, so it was reverted. A proper fix needs its own pass (for example, moving the calculator out of the shared barrel and checking chunking with a bundle analyser).

---

## 9. How to publish a post

1. Create `content/blog/<slug>/` (lowercase words joined by hyphens; this becomes the URL).
2. Add `meta.ts`:

   ```ts
   import type { PostMetaInput } from "@/lib/blog/types";
   import hero from "./hero.jpg"; // optional

   export const meta = {
     title: "How to split rent fairly with flatmates", // 10–70 characters
     description: "…",                                  // 50–160 characters
     publishedAt: "2026-12-01",                         // YYYY-MM-DD
     updatedAt: "2026-12-05",                           // optional, not before publishedAt
     category: "Flatmates",                             // Guides | Trips | Flatmates | Money basics
     authorId: "founder",
     draft: true,                                       // flip to false (or remove) to publish
     image: { src: hero, alt: "…" },                    // optional
   } satisfies PostMetaInput;
   ```

3. Add `index.mdx` with the body. Start sections with `##` (never `#`; the title comes from `meta.ts`). Each heading must be unique.
4. Use these components without importing them: `<Callout variant="note|tip|warning" title="…">`, `<Figure src={image} alt="…" caption="…" />` (import the image at the top), `<CtaCard />`, `<Disclaimer />` (use it on posts touching money, tax or legal topics). Import `QuickSplit` at the top to embed the calculator.
5. Check it with `pnpm dev` (drafts show there), then set `draft: false` and open a pull request. The Vercel preview shows drafts too.
6. The first published post automatically turns on `/blog` indexing, the sitemap entries, the RSS items, the header and footer Blog links and the calculator page's "Guides" section.

---

## 10. The three example posts (2026-11-18)

Written as models for future posts. Each one shows a different pattern worth copying:

| Post | Category | What it demonstrates |
|---|---|---|
| `split-rent-fairly-unequal-rooms` | Flatmates | One running example used across three methods; tables with right-aligned ₹ columns; a `tip` and a `warning` callout; a quoted message readers can copy |
| `split-group-trip-expenses` | Trips | Before, during and after structure; a worked settlement that matches the calculator's own answer (checked in the browser); the embedded `<QuickSplit />` |
| `ask-friend-to-pay-you-back` | Money basics | Ready-to-send message scripts as blockquotes; an internal link to another post; the `<Disclaimer />` for a post about lending money |

House style they follow:
- **Talk to one reader.** Use "you" and a concrete moment ("You paid for dinner on Friday…"). No invented personal stories attributed to the author.
- **Use real ₹ numbers and make them add up.** Every worked example totals correctly; check the maths before publishing.
- **Short paragraphs, plain words, headings that say what the section answers.**
- **Be honest about the product.** Mention what the calculator does today (equal splits of what people paid), and nothing it doesn't.
- **Avoid facts that go stale.** Don't quote bank limits, laws or statistics unless you link a source and plan to keep it current. For example, the posts say "share your UPI ID or QR" rather than recommending UPI payment requests, which NPCI has restricted for person-to-person use.
- **End with something the reader can do,** often a link to the calculator.
