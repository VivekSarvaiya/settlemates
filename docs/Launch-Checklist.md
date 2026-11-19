# SettleMates Launch Checklist

Everything to do before and after the site goes live, in order. Written 2026-11-19 against the current repo; every link was checked that day.

## How to read this

Each item has a tag saying when it can be done:

| Tag | Meaning |
|---|---|
| **[Now · code]** | Can be done in the repo today, without a domain or any account. |
| **[Now · you]** | You can do it today: a decision, real content, or an account. |
| **[After domain]** | Needs the domain bought and its DNS set up. |
| **[Launch day]** | Checks on the live production site. |
| **[After launch]** | Ongoing work once the site is public. |
| **[Later]** | Only when ads or user accounts arrive (Phase 2+). |

**At a glance (74 items):** 27 could be done before any domain exists (11 in code, 16 by you). On 2026-11-19, 10 of the 11 code items and 1 of yours (the analytics choice) were done. The last code item, the bundle size, waits on your choice of bundler.

Already done in the repo: sitemap, `robots.txt`, canonical URLs, Open Graph and Twitter images, favicon and app icons, `WebSite` / `Organization` / `FAQPage` / `BlogPosting` / `BreadcrumbList` structured data, RSS feed, custom 404 and error pages, self-hosted fonts, and a build that fails if `SITE_URL` points to localhost in production.

---

## 0. Decisions (recommended setup)

| Area | Recommendation | Why |
|---|---|---|
| Hosting, deploys, CDN | **Vercel** | The project is built for it (`config/env.ts` reads `VERCEL_ENV`, Next.js 16 is first-class there). Its CDN is built in. |
| Plan | **Hobby to launch, Pro before ads** | Vercel's [terms](https://vercel.com/legal/terms) allow Hobby only for personal or non-commercial use. AdSense makes the site commercial. See [pricing](https://vercel.com/pricing). |
| Domain registrar and DNS | **Cloudflare** | [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) sells at cost, with free [DNS](https://developers.cloudflare.com/dns/), one-click [DNSSEC](https://developers.cloudflare.com/dns/dnssec/) and free email forwarding. |
| Cloudflare proxy in front of Vercel | **No. Set the records to "DNS only" (grey cloud).** | Vercel [recommends connecting directly](https://vercel.com/guides/using-cloudflare-with-vercel); a second CDN in front causes caching and certificate problems. See Cloudflare's [proxy status](https://developers.cloudflare.com/dns/proxy-status/). |
| Analytics | **[Vercel Web Analytics](https://vercel.com/docs/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights)** | Built into the host and no third-party cookies ([privacy details](https://vercel.com/docs/analytics/privacy-policy)). Free alternatives: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) or [Plausible](https://plausible.io/) (paid). [PostHog](https://posthog.com/docs/libraries/next-js) is for Phase 2, when there are accounts and product funnels. |
| Receiving email (contact@…) | **[Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/)** | Free forwarding to your existing inbox. Paid alternatives with a real mailbox: [Zoho Mail](https://www.zoho.com/mail/zohomail-pricing.html), [Google Workspace](https://workspace.google.com/). |
| Sending email (Phase 2) | **[Resend](https://resend.com/docs/dashboard/domains/introduction)** on its own subdomain (for example `mail.` or `send.`) | Keeps transactional mail reputation separate from the main domain. |
| Blog address | **Keep `/blog`, no `blog.` subdomain** | It's already built that way. One site, one deploy, one Search Console property. A subdomain would need a separate app and redirects. |

**Subdomains you actually need:** `www` (redirects to the main domain), and later one for sending email. `mail.` is **not** needed to receive email; that is done with MX records on the main domain.

---

## 1. Replace placeholders with real data

- [ ] **[Now · you]** Founder name, bio and photo in `content/authors.ts` (currently "Name"). Shown on About, post bylines and the `BlogPosting` structured data.
- [ ] **[Now · you]** Either replace the author before deploying, or set the three posts in `content/blog/*/meta.ts` to `draft: true` until you do. They are published under "Name" right now.
- [ ] **[Now · you]** Choose the contact address (for example `hello@yourdomain`). Then update `CONTACT_EMAIL` in `config/site.ts`; it's used on About, Privacy and Terms.
- [ ] **[Now · you]** Review `content/pages/privacy.mdx` and `content/pages/terms.mdx` (they're drafts, not legal advice). Update `updatedAt` in `app/(marketing)/privacy/_lib/const.ts` and `app/(marketing)/terms/_lib/const.ts` when you change them.
- [x] **[Now · you]** Pick the analytics provider (section 6). Then name it in `privacy.mdx` section 3, and change "may use a cookie" to match what it really does. Done 2026-11-19: Vercel Web Analytics + Speed Insights; Privacy section 3 now names them and states their real cookie and data handling.
- [x] **[Now · code]** Delete the unused scaffold file `public/globe.svg` (needs your OK). Done 2026-11-19 (nothing referenced it).
- [x] **[Now · code]** Add a `.env.example` that documents `SITE_URL`, so a fresh clone knows the build needs it. Done 2026-11-19.
- [ ] **[After launch]** Add your social profile URLs to `sameAs` in the `Organization` structured data (`app/(marketing)/_lib/structuredData.ts`) once the profiles exist.

## 2. Domain

- [ ] **[Now · you]** Pick the name and ending. `.com` is the safest; `.in` signals India. If you can afford both, buy both and redirect one to the other.
- [ ] **[Now · you]** Check the ending is sold by your registrar before buying. Cloudflare's list: [supported TLDs](https://developers.cloudflare.com/registrar/top-level-domains/), [TLD policies](https://www.cloudflare.com/tld-policies/).
  - If it isn't (for example `.in`), buy it from an accredited registrar listed by the [.IN Registry](https://registry.in/). You can still use Cloudflare DNS for free.
- [ ] **[Now · you]** Buy it. Turn on auto-renew, the registrar lock and WHOIS privacy, and add the renewal date to your calendar.
- [ ] **[Now · you]** Reserve the same handle on X, Instagram, LinkedIn and YouTube so nobody squats it.
- [ ] **[Now · you]** Turn on two-factor login for the registrar, Cloudflare ([guide](https://developers.cloudflare.com/fundamentals/setup/account/account-security/2fa/)), Vercel ([guide](https://vercel.com/docs/two-factor-authentication)) and GitHub ([guide](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)). Whoever controls these controls the site.

## 3. DNS, subdomains and email records

- [ ] **[After domain]** Add the domain in Vercel ([add a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)). Copy the exact apex and `www` records Vercel shows into Cloudflare, set to **DNS only**. Don't copy record values from blog posts; Vercel gives project-specific ones. See also [managing DNS records](https://vercel.com/docs/domains/managing-dns-records).
- [ ] **[After domain]** Pick one main address (with or without `www`) and redirect the other to it ([deploying and redirecting](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)). It must match `SITE_URL` exactly.
- [ ] **[After domain]** Also redirect the `*.vercel.app` production address to the real domain, so search engines see one site ([canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
- [ ] **[After domain]** Set up email forwarding with [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/get-started/). It adds the MX and SPF records for you.
- [ ] **[After domain]** Add a DMARC record ([Google's guide](https://support.google.com/a/answer/2466580), [dmarc.org](https://dmarc.org/)). Start with `p=none`, and move to `quarantine` once reports look clean. Gmail's [sender guidelines](https://support.google.com/a/answer/81126) expect SPF, DKIM and DMARC.
- [ ] **[After domain]** Turn on [DNSSEC](https://developers.cloudflare.com/dns/dnssec/).
- [ ] **[After domain]** Optional: add [CAA records](https://developers.cloudflare.com/ssl/edge-certificates/caa-records/). If you do, allow `letsencrypt.org`, which issues Vercel's certificates.
- [ ] **[After domain]** Check every record with [MXToolbox](https://mxtoolbox.com/SuperTool.aspx).
- [ ] **[Later]** When the app sends email, verify a sending subdomain in [Resend](https://resend.com/docs/dashboard/domains/introduction) and add its DKIM and SPF records.

## 4. Hosting and deployment (Vercel)

- [ ] **[Now · you]** Create the Vercel project from the GitHub repo ([Git deployments](https://vercel.com/docs/git)), so `main` deploys to production and every pull request gets a preview.
- [ ] **[Now · you]** Protect `main` on GitHub ([protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)): pull requests only, with checks passing.
- [x] **[Now · code]** Add a GitHub Actions workflow ([docs](https://docs.github.com/en/actions)) that runs `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test` and `pnpm build` on every pull request. Done 2026-11-19: `.github/workflows/ci.yml`, Node from `.nvmrc` (26). It runs `next typegen` before `tsc`, because a fresh checkout has no route types.
- [x] **[Now · code]** Add Dependabot ([config guide](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates)) for weekly dependency updates. Done 2026-11-19: `.github/dependabot.yml` (npm weekly, grouped minor/patch; GitHub Actions monthly).
- [ ] **[After domain]** Set `SITE_URL=https://yourdomain` as a Production [environment variable](https://vercel.com/docs/environment-variables), then redeploy. The canonical URLs, sitemap, robots file, social images and structured data all read it.
- [ ] **[Now · you]** In the Vercel project settings, set Node.js to 26.x (the version in `.nvmrc`, used locally and in CI), or the newest Vercel offers.
- [ ] **[Now · you]** Decide on [Deployment Protection](https://vercel.com/docs/deployment-protection) for preview links, so half-finished pages aren't public.

## 5. CDN and browser caching

Vercel's [CDN](https://vercel.com/docs/cdn) serves the prerendered pages from the edge. Next.js gives hashed files in `/_next/static/` a one-year `immutable` cache. Nothing needs adding; just don't put another CDN in front (section 0).

- [ ] **[Launch day]** Confirm with `curl -I` or DevTools. A file under `/_next/static/` should return `cache-control: public, max-age=31536000, immutable`. Pages should show Vercel cache hits ([CDN cache](https://vercel.com/docs/edge-cache), [HTTP caching on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)).
- [ ] **[After launch]** If you ever add images to `public/`, keep their file names versioned (for example `og-v2.png`) so long caching can't serve a stale copy.

## 6. Analytics and monitoring

- [x] **[Now · code]** Add [Vercel Web Analytics](https://vercel.com/docs/analytics/quickstart) and [Speed Insights](https://vercel.com/docs/speed-insights/quickstart) once you've chosen them. Use the [`beforeSend` option](https://vercel.com/docs/analytics/package) to remove the `#split=` part of every URL. Done 2026-11-19: `components/shared/SiteAnalytics` in the root layout, with `stripUrlFragment` from `lib/analytics.ts`. Checked in dev: a page view from a `#split=` link was recorded without the fragment.
  - **This step is required:** the Privacy page promises analytics never receives split data, and the names and amounts live in that fragment.
  - The code does nothing until the site runs on Vercel.
- [ ] **[Now · you]** Turn on Web Analytics and Speed Insights in the Vercel project's dashboard ([quickstart](https://vercel.com/docs/analytics/quickstart)). The code is in place, but nothing is collected until they're on. On Hobby, collection pauses for a while if you go over the monthly limit ([Hobby plan](https://vercel.com/docs/plans/hobby)).
- [ ] **[Now · you]** Create a [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/) project for error alerts (already in the tech stack). I'll wire it in once you have the DSN. It also has to leave the URL fragment out.
- [ ] **[Launch day]** Set up an uptime check on the home page and the calculator: [UptimeRobot](https://uptimerobot.com/) or [Better Stack](https://betterstack.com/uptime), both with free tiers.
- [ ] **[Launch day]** Open a shared split link, then confirm the analytics and Sentry dashboards show `/split-bill-calculator` with **no** `#split=…`.
- [ ] **[After launch]** Check [runtime logs](https://vercel.com/docs/logs/runtime) and Sentry weekly for the first month.

## 7. Security

- [x] **[Now · code]** Add security headers in `next.config.ts` ([headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)): Done 2026-11-19: `config/securityHeaders.ts`, plus `Cross-Origin-Opener-Policy: same-origin`.
  - `Strict-Transport-Security` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)).
  - `X-Content-Type-Options: nosniff`.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - A `Permissions-Policy` that turns off the camera, microphone and location.
  - `frame-ancestors 'none'`, so no other site can frame yours.
- [x] **[Now · code]** Turn off the `X-Powered-By: Next.js` header ([`poweredByHeader`](https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader)). Done 2026-11-19.
- [x] **[Now · code]** Add a Content Security Policy ([Next.js guide](https://nextjs.org/docs/app/guides/content-security-policy), [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)). Start in `Report-Only` mode, allow the analytics domains, then enforce it once nothing breaks. Report-only stage done 2026-11-19: no violations on any production page. Analytics needs no extra domains in production (its scripts load from your own domain). Still to do: once a real Vercel deploy shows no violations, switch to enforcing.
- [ ] **[After domain]** Publish a [`security.txt`](https://securitytxt.org/) with the real contact address.
- [ ] **[Launch day]** Score the live site on [securityheaders.com](https://securityheaders.com/), [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory) and [SSL Labs](https://www.ssllabs.com/ssltest/).
- [ ] **[Launch day]** Look at the [Vercel Firewall](https://vercel.com/docs/vercel-firewall) defaults (DDoS protection is on automatically).
- [ ] **[After launch]** Only once HTTPS has been stable for a few weeks: consider [HSTS preload](https://hstspreload.org/). It's hard to undo and covers every subdomain.
- [ ] **[After launch]** Check the domain stays clean on [Google Safe Browsing](https://transparencyreport.google.com/safe-browsing/search).

## 8. Legal and privacy

The Privacy and Terms review is in section 1. The Privacy page already describes analytics, so it's only correct once analytics is live.

- [ ] **[Later]** When accounts arrive (Phase 2), review India's Digital Personal Data Protection Act obligations ([MeitY](https://www.meity.gov.in/)), and update the Privacy page before collecting names or emails.

## 9. Search engine visibility and indexation

- [ ] **[After domain]** Add a **Domain property** in [Google Search Console](https://search.google.com/search-console) and verify it with a DNS TXT record ([how to verify](https://support.google.com/webmasters/answer/9008080)).
- [ ] **[After domain]** Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters). It can import the site straight from Search Console. Bing also powers DuckDuckGo and Yahoo results.
- [ ] **[Launch day]** Submit `https://yourdomain/sitemap.xml` in both tools ([sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
- [ ] **[Launch day]** Open `/robots.txt` and `/sitemap.xml` on the live site. Every URL must use the real domain, not localhost or `vercel.app`.
- [ ] **[Launch day]** Request indexing for the home page, `/split-bill-calculator`, `/blog` and each post ([URL Inspection](https://support.google.com/webmasters/answer/9012289), [recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)).
- [ ] **[Launch day]** Test the structured data with the [Rich Results Test](https://search.google.com/test/rich-results) and [Schema validator](https://validator.schema.org/): home (`WebSite` / `Organization`), calculator (`FAQPage`), posts (`BlogPosting`, `BreadcrumbList`).
- [ ] **[Launch day]** Check the link previews: send a link in WhatsApp, then try the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
- [ ] **[After launch]** Optional: ping [IndexNow](https://www.indexnow.org/) (Bing, Yandex) when you publish a post.
- [ ] **[After launch]** Watch the [Page indexing report](https://support.google.com/webmasters/answer/7440203) weekly for the first month, and fix anything "Crawled – currently not indexed". It can take days to weeks for Google to show the [site name](https://developers.google.com/search/docs/appearance/site-names).
- [ ] **[After launch]** Read Google's [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) once. Keep publishing guides (2–4 a month), linking each new post to the calculator and to older posts.

## 10. Performance and Core Web Vitals

- [ ] **[Now · code]** Fix the known bundle issue: the shared barrel files ship the calculator's JavaScript to every page. That's about 288 KB gzipped on the About, Privacy and blog pages, versus about 293 KB on home, where the calculator actually lives. Noted in `docs/Blog-Plan.md` section 8. **Tried 2026-11-19 and reverted:** taking the calculator out of the shared barrel trims the content pages to 276–279 KB, but Turbopack then duplicates shared code, and home and calculator grow to 312 and 307 KB. Building with webpack instead (`next build --webpack`, no code change) measured 268 KB on home and 273 KB everywhere else, lighter on every page. Switching bundlers is your decision.
- [x] **[Now · code]** Run [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) and an accessibility pass ([axe DevTools](https://www.deque.com/axe/devtools/), [WAVE](https://wave.webaim.org/)) locally on every page type, and fix what they find. Done 2026-11-19 on a production build (mobile): performance 99–100, accessibility, best practices and SEO 100 on home, calculator, About, a post and Privacy. Fixed the one issue found: the calculator's summary list had `role="group"` on its `<dl>`.
- [x] **[Now · code]** Add a web app manifest ([`manifest.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)), so "Add to Home Screen" on phones gets the right name, colours and icon. Done 2026-11-19: `app/manifest.ts`.
- [ ] **[Launch day]** Run [PageSpeed Insights](https://pagespeed.web.dev/) on mobile for home, calculator and one post. Aim for green [Core Web Vitals](https://web.dev/articles/vitals): LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
- [ ] **[After launch]** Watch Speed Insights (real visitors) and Search Console's [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520). Google's field data ([CrUX](https://developer.chrome.com/docs/crux)) only appears once there's enough traffic.
- [ ] **[After launch]** Optional deeper test: [WebPageTest](https://www.webpagetest.org/) on a mid-range Android profile, which is closer to your real users than a laptop.

## 11. Backlinks and getting the word out

Earn links; never buy them. Paid links break Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

- [ ] **[After launch]** Launch on [Product Hunt](https://www.producthunt.com/launch).
- [ ] **[After launch]** Post a [Show HN](https://news.ycombinator.com/showhn.html) and a story on [Indie Hackers](https://www.indiehackers.com/).
- [ ] **[After launch]** List it as a Splitwise alternative on [AlternativeTo](https://alternativeto.net/) and [SaaSHub](https://www.saashub.com/), and submit it to [BetaList](https://betalist.com/).
- [ ] **[After launch]** Answer real questions about splitting rent and trip costs on [Quora](https://www.quora.com/), and in communities like [r/personalfinanceindia](https://www.reddit.com/r/personalfinanceindia/) and [r/IndiaInvestments](https://www.reddit.com/r/IndiaInvestments/). Read each community's self-promotion rules first, and lead with the guide, not the link.
- [ ] **[After launch]** Offer guest posts or quotes to Indian personal-finance and student or flat-hunting blogs. Point them to the rent and trip guides.
- [ ] **[After launch]** Share in the places your users already are: college and hostel groups, flatmate groups, travel groups. Share the result link itself; it shows the product in one tap.
- [ ] **[After launch]** Track who links to you with [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) (free once the site is verified) or the [backlink checker](https://ahrefs.com/backlink-checker).

## 12. Later: ads (AdSense)

- [ ] **[Later]** Move Vercel to Pro first: ads make the site commercial ([terms](https://vercel.com/legal/terms)).
- [ ] **[Later]** Read the [AdSense program policies](https://support.google.com/adsense/answer/48182) and [apply](https://adsense.google.com/start/).
- [ ] **[Later]** Publish `ads.txt` ([guide](https://support.google.com/adsense/answer/12171612)).
- [ ] **[Later]** Add a Google-certified consent banner for visitors from the EEA, UK and Switzerland ([requirements](https://support.google.com/adsense/answer/13554116)), and update the Privacy page for ad cookies and Google as a vendor.
- [ ] **[Later]** Re-check page speed after ads go in. Ads are the most common cause of layout shift.

---

## Launch day, in order

1. Merge to `main`, then watch the Vercel production build pass.
2. Open every page on a phone. Run a split, copy the link, and open it in a private window.
3. Check `/robots.txt` and `/sitemap.xml` use the real domain.
4. Run securityheaders.com, SSL Labs and PageSpeed Insights.
5. Submit the sitemap in Search Console and Bing, then request indexing for the main pages.
6. Confirm analytics records visits without `#split=` in the URL.
7. Turn on the uptime monitor.
8. Share the link.
