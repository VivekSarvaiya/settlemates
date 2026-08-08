# **Collaborative Shared Expense Platform Research Report**

## **Project name**

SettleMates — A web-first progressive web application for frictionless peer-to-peer shared expense management, prioritizing search visibility and a best-in-class, layperson-friendly user experience.

## **Core concept**

The market for peer-to-peer shared expense management is undergoing a significant and hostile transition. For the past decade, incumbent platforms have dominated the sector, establishing the primary mental models for how groups record, split, and settle shared costs. However, recent aggressive changes by market leaders have severely compromised the fundamental utility of these applications. Market incumbents have introduced severe restrictions on free-tier users, limiting data entry to a mere three to four expenses per day, enforcing ten-second unskippable video advertisements between entries, and paywalling basic functionalities such as historical analytics and currency conversions1.  
SettleMates is proposed as a modern, web-first platform designed to restore friction-free collaborative financial tracking. It solves the immediate pain point of walled gardens while introducing modern, transparent settlement algorithms that maintain group trust.  
The application will differentiate itself and beat competitors entirely on the basis of superior UI/UX. The interface must be exceptionally easy to use for a layperson; managing expenses should never feel hectic, cluttered, or overwhelming. While incumbents force users to navigate confusing feature bloat simply to add a dinner bill3, SettleMates will focus heavily on workflow superiority and operational transparency. Furthermore, existing "Simplify Debts" algorithms are heavily criticised for being confusing and opaque, frequently obscuring who actually paid for what and making users feel they are paying individuals they do not know6. The platform will position its settlement engine as highly transparent, providing an explicit, easy-to-understand visual audit trail of how simplified debts were calculated.  
User acquisition for this product will rely heavily on organic search. Therefore, strong Search Engine Optimization (SEO) is a primary driver for the architecture and content strategy, ensuring the platform can easily reach people actively searching for "free bill splitters" or "Splitwise alternatives" on the web.  
To facilitate a realistic development cycle for a solo engineer, the Minimum Valuable Product (MVP) must be aggressively scoped. The MVP will strictly avoid imaginary or hard features, meaning complex offline-sync queues and early monetization strategies are completely excluded from the current roadmap. The MVP will include core modules for "Trips" and "Shared Living" (which will require users to create an account for long-running ledger management), and "Quick Split" (facilitating ad-hoc restaurant bills without requiring an account).

## **Target users**

The platform targets three primary demographic profiles, each exhibiting distinct behavioural patterns, financial needs, and workflow frustrations that existing solutions fail to address adequately.  
The first critical demographic is the Cross-Border Traveller. This cohort consists of groups of friends, backpackers, and digital nomads engaging in multi-destination travel. They transact across multiple fiat currencies—for example, paying for an accommodation in Euros, local transport in British Pounds, and dining in Japanese Yen8. Their primary frustration is fluctuating foreign exchange rates that make end-of-trip settlements contentious. The UI must elegantly handle multi-currency inputs, converting all entries to a unified base currency for final settlement to prevent rounding errors and financial disputes without overwhelming the user with complex financial screens. Because trips are long-running, this cohort will be required to create accounts to maintain their channels.  
The second key demographic is the Shared Living Cohort, encompassing roommates and couples managing joint households. Individuals living together share recurring, often mundane costs such as rent, utilities, broadband internet, and household groceries. This group requires long-term, continuous ledger management, meaning user accounts are required to persist this data securely. Their primary pain points revolve around the inherent awkwardness of interpersonal debt collection and the friction of repetitive data entry10. They frequently complain that existing applications make it difficult to edit honest mistakes without deleting and completely re-entering complex transactions1. This cohort requires highly editable transaction histories and seamless integration with deep-linked payment methods, all wrapped in a stress-free UI.  
The third demographic is the "Quick Split" User, representing colleagues, casual acquaintances, or extended friend networks sharing a singular event, such as a large restaurant bill or concert tickets. These users demand absolute zero friction. Forcing an acquaintance to download a native application and register an account simply to pay their £15 share of a pizza constitutes a terminal barrier to product adoption. The solution for this user is a highly accessible web interface reachable via a simple QR code scan or shared text link. Guest mode capabilities must allow these transient users to view the itemised bill, claim their specific items, and access payment routing instructions instantly without ever creating an account13.

## **Technical decisions (if any)**

To meet the stringent constraints of a solo developer building a production-ready SaaS platform, the technical architecture must aggressively eliminate operational overhead. The technical decisions outlined below form a cohesive, modern technology stack tailored for rapid iteration, excellent SEO, and best-in-class UX.

### **Architectural Pattern Analysis**

Evaluating the primary architectural paradigms—Monolithic, Modular Monolith, and Microservices—reveals that a Modular Monolith is the optimal choice for this stage of product development15. A Microservices architecture would introduce unsustainable DevOps overhead for a solo developer16.  
The Modular Monolith approach, implemented within Next.js using Domain-Driven Design (DDD) principles, offers the ideal compromise. The repository will be structured explicitly by business domains (e.g., /domains/users, /domains/expenses, /domains/settlements). Each domain will encapsulate its own services and UI components, enforcing strict boundaries while allowing the entire application to be deployed as a single unit on Vercel15.

### **Unified Full-Stack Framework and SEO**

Next.js utilising the App Router serves as the unified full-stack framework. The App Router natively supports React Server Components (RSC), which securely execute data-fetching on the server. This drastically reduces the client-side JavaScript payload, ensuring the fast page load speeds required for an exceptionally smooth UX17.  
Crucially, Next.js is unparalleled for SEO. By rendering pages on the server, search engine crawlers can instantly index the content of public-facing marketing pages, blog posts, and dynamic "Quick Split" templates. The Next.js Metadata API will be used to dynamically generate rich SEO tags, ensuring the product ranks highly when users search for expense-splitting utilities.

### **Database and Backend Infrastructure**

Supabase (utilising Relational PostgreSQL) is overwhelmingly superior to Firebase for financial technology applications. Financial ledgers inherently demand ACID compliance and strict relational constraints20. Supabase pushes security directly to the database tier using Postgres Row Level Security (RLS)13.

### **Authentication and Authorization**

Supabase Auth will be utilized to handle the bifurcated user requirements.

* **Account Required:** For "Trips" and "Shared Living", standard OAuth and email/password authentication will be enforced. This guarantees that long-running ledgers are securely tied to verified identities.  
* **No Account Required:** For "Quick Split" scenarios, Supabase's Anonymous Sign-ins will be utilized. This allows transient users to interact with a specific shared bill via a shareable link without the friction of a sign-up form13.

### **Real-Time Collaboration Capabilities**

To provide real-time updates—such as multiple users concurrently checking off items on a shared digital receipt—WebSockets managed via Supabase Realtime is the recommended architecture. It abstracts the complexity of maintaining WebSocket connection pools and easily updates the UI so users never feel out of sync when editing a bill simultaneously23.

### **Settlement Engine Algorithm Design**

The objective of "Debt Simplification" is to calculate the absolute minimum number of financial transactions required to settle a complex graph of shared debts. The application will implement a Greedy Minimum Cash Flow Algorithm. This algorithm operates in highly efficient ![][image1] time complexity and provides a 2-approximation, meaning it almost always finds the true optimal solution for small groups26.  
To solve the UI/UX complaints surrounding competitor algorithms, the UI must visually explain *why* User A is paying User C. The interface will feature a "Show Calculation" breakdown, demystifying the greedy algorithm and proving the math in a friendly, non-hectic manner.

### **Progressive Web App (PWA)**

While heavy offline support (background syncing, local databases) is excluded from the MVP to avoid unnecessary complexity, the application will still be configured as a basic Progressive Web App (PWA). This simply means adding a Web App Manifest and basic caching for static assets, allowing users to "Add to Home Screen" for a native-like full-screen experience28.

### **Payment Integration Strategy**

To bypass the prohibitive costs and regulatory burdens of Open Banking APIs in the MVP phase29, the platform will facilitate peer-to-peer settlement routing without ever touching the actual flow of funds. The platform will dynamically generate URL deep-linking schemes for popular fintech applications (e.g., monzo.me/username/amount or revolut.me)31. The UI will make this feel seamless, requiring only a single tap for a user to open their banking app with the amount pre-filled.

## **Competitor insights**

The landscape of shared expense applications is heavily segmented between highly monetised market leaders that suffer from feature bloat and fragmented, feature-poor independent alternatives.

| Feature / Capability | Splitwise | Splid / Tricount | ATM Split | SettleMates (Proposed) |
| :---- | :---- | :---- | :---- | :---- |
| **User Experience (UX)** | Cluttered, ad-heavy, confusing feature placement5 | Functional but dated | Basic | **Primary Focus:** Minimalist, layperson-friendly, zero-friction |
| **Account Requirement** | Mandatory registration to participate | Optional / Guest mode available | No account required12 | Hybrid (Guest for quick bills, Auth for long trips) |
| **Settlement Transparency** | "Simplify Debts" is opaque and heavily criticised | Basic simplification | Greedy algorithm implementation | Transparent visual audit trail of the algorithm |
| **Payment Routing** | Integrated (Stripe/Paytm) | Manual bank transfers | EPC QR / Manual routing | Automated URL Schemes (monzo.me, etc.)33 |

### **Workflow Gaps and Differentiation Opportunities**

The primary differentiator for SettleMates is **UI/UX Simplicity combined with SEO reach**. Competitors have allowed their interfaces to become hectic and overloaded. Users frequently complain that navigating paywalls, small input fields, and confusing categorization makes adding a simple payment a frustrating chore5. SettleMates will capture market share by offering an interface so intuitive that a layperson can understand their financial liabilities at a glance.  
A second profound workflow gap exists around the cross-contamination of algorithmic debt. When applications attempt to simplify debts globally across a user's entire profile, severe social friction occurs. A user might be instructed to send money to individuals they barely know, causing immense confusion. SettleMates will strictly firewall settlement simplifications to the context of individual groups, and the UI will walk the user through the settlement logic clearly.  
Finally, the "Quick Split" flow is a massive opportunity. When a large group finishes a restaurant meal, incumbents force users to pass a single phone around or mandate app store downloads. SettleMates leverages its web-first nature: a QR code scan instantly opens a fast-loading, SEO-indexed Next.js page where friends can claim items as guests and settle via Monzo or Revolut links in seconds28.

## **Budget/timeline**

The following estimates reflect the baseline operating expenditures and the development lifecycle for a solo software engineer taking the platform from conceptualization to a production-ready, validated MVP.

### **Cost Estimation (Monthly Operating Expense)**

By strategically leveraging managed cloud infrastructure, the baseline burn rate can be kept exceptionally low.

| Resource / Service | Purpose | Estimated Cost (Monthly) |
| :---- | :---- | :---- |
| **Vercel Pro** | Frontend hosting, SSR for SEO, Global Edge caching18 | $20.00 |
| **Supabase Pro** | PostgreSQL Database, Auth, Storage, WebSockets20 | $25.00 |
| **Domain & DNS** | Cloudflare / Namecheap domain registration and routing | \~$2.00 |
| **Exchange Rate API** | Live mid-market rates (Free tier)8 | $0.00 |
| **Total Estimated MVP OPEX** | **Production Infrastructure** | **\~$47.00 / month** |

### **Delivery Timeframe (12-14 Weeks)**

The project is scoped for a single full-stack developer operating in rapid, iterative sprints, with a heavy emphasis on front-end polish and SEO.

* **Weeks 1-3 (Foundation & Architecture):** Establish the Next.js App Router environment and initialize the Supabase schema. Define the Modular Monolith domain-driven folder architecture. Implement the Next.js Metadata API for core SEO structure15.  
* **Weeks 4-7 (Core Workflows & Mathematics):** Develop the authentication flows (Account creation for Trips/Living; Anonymous sign-in for Quick Split). Build the CRUD operations for Groups. Implement and write unit tests for the Greedy Minimum Cash Flow settlement algorithm13.  
* **Weeks 8-10 (UI/UX Polish & Real-time):** This is the most critical phase. Focus entirely on building a stress-free, layperson-friendly user interface. Integrate Supabase Realtime to establish WebSocket connections for live updates during collaborative receipt splitting23.  
* **Weeks 11-12 (Payments & Landing Pages):** Implement the logic to dynamically generate URL payment schemes (e.g., monzo.me)37. Build high-converting, SEO-optimized landing pages to capture search traffic for "free bill splitters".  
* **Weeks 13-14 (Compliance, Testing & Launch):** Execute installation testing across iOS Safari and Android Chrome, perform Lighthouse SEO, accessibility, and performance auditing, and execute a controlled public beta release.

## **Handoff Context**

Stage: research App name: SettleMates User level: B Target platform: web Budget: $47/month OPEX Timeline: 12-14 Weeks Source files: research-SettleMates.md

#### **Works cited**

> 1. Splitwise is useless now\!\!\! : r/IndiaTech \- Reddit, [https://www.reddit.com/r/IndiaTech/comments/18l3wet/splitwise\_is\_useless\_now/](https://www.reddit.com/r/IndiaTech/comments/18l3wet/splitwise_is_useless_now/)  
> 2. I got frustrated with Splitwise's expense limits, so I built my ... \- Reddit, [https://www.reddit.com/r/SideProject/comments/1sugzcm/i\_got\_frustrated\_with\_splitwises\_expense\_limits/](https://www.reddit.com/r/SideProject/comments/1sugzcm/i_got_frustrated_with_splitwises_expense_limits/)  
> 3. SplitWise feels dead to use as a free user. I can't be the only one?, [https://www.reddit.com/r/androidapps/comments/1mynv2j/splitwise\_feels\_dead\_to\_use\_as\_a\_free\_user\_i\_cant/](https://www.reddit.com/r/androidapps/comments/1mynv2j/splitwise_feels_dead_to_use_as_a_free_user_i_cant/)  
> 4. Splitwise \- App Store, [https://apps.apple.com/cz/app/splitwise/id458023433](https://apps.apple.com/cz/app/splitwise/id458023433)  
> 5. The downfall of Splitwise : r/personalfinance \- Reddit, [https://www.reddit.com/r/personalfinance/comments/186v5wj/the\_downfall\_of\_splitwise/](https://www.reddit.com/r/personalfinance/comments/186v5wj/the_downfall_of_splitwise/)  
> 6. to simplfy debt for each contact too. if a contact exists in more than, [https://feedback.splitwise.com/forums/162446-general/suggestions/19709293-to-simplfy-debt-for-each-contact-too-if-a-contact](https://feedback.splitwise.com/forums/162446-general/suggestions/19709293-to-simplfy-debt-for-each-contact-too-if-a-contact)  
> 7. Evaluating Splitwise's interface and its influence on group dynamics, [https://medium.com/@nidhibhat.1098/evaluating-splitwises-interface-and-its-influence-on-group-dynamics-f6f1f3ef1355](https://medium.com/@nidhibhat.1098/evaluating-splitwises-interface-and-its-influence-on-group-dynamics-f6f1f3ef1355)  
> 8. Free Multi-Currency Expense Splitter | Split Group Bills & Travel Costs, [https://global-split.vercel.app/](https://global-split.vercel.app/)  
> 9. ATM Split \- App Store, [https://apps.apple.com/gb/app/atm-split/id6762064476](https://apps.apple.com/gb/app/atm-split/id6762064476)  
> 10. Genz-Splitwise \- IJFMR, [https://www.ijfmr.com/papers/2026/3/77470.pdf](https://www.ijfmr.com/papers/2026/3/77470.pdf)  
> 11. david.c.morgan – Page 2 – DigiTalk \- University of Bristol, [https://digitalk.blogs.bristol.ac.uk/author/david-c-morgan/page/2/](https://digitalk.blogs.bristol.ac.uk/author/david-c-morgan/page/2/)  
> 12. ATM Split \- App Store, [https://apps.apple.com/tt/app/atm-split/id6762064476?l=fr-FR](https://apps.apple.com/tt/app/atm-split/id6762064476?l=fr-FR)  
> 13. Supabase RLS Best Practices: Production Patterns for Secure Multi, [https://makerkit.dev/blog/tutorials/supabase-rls-best-practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)  
> 14. The seven things we replace first in a vibe-coded codebase, [https://appssemble.com/blog/seven-things-replaced-first](https://appssemble.com/blog/seven-things-replaced-first)  
> 15. nextjs-ddd-architect | Skills Market... \- LobeHub, [https://lobehub.com/skills/jordinodejs-.github-config-nextjs-ddd-architect](https://lobehub.com/skills/jordinodejs-.github-config-nextjs-ddd-architect)  
> 16. Monolith vs. Modular Monolith: An Indie Hacker's Choice, [https://mustafaerbay.com.tr/en/blog/career/monolith-vs-modular-monolith-indie-hacker-secimi/](https://mustafaerbay.com.tr/en/blog/career/monolith-vs-modular-monolith-indie-hacker-secimi/)  
> 17. SaaS Architecture Patterns with Next.js: Complete... \- Vladimir Siedykh, [https://vladimirsiedykh.com/blog/saas-architecture-patterns-nextjs](https://vladimirsiedykh.com/blog/saas-architecture-patterns-nextjs)  
> 18. The Ultimate Guide to Software Architecture in Next.js, [https://dev.to/shayan\_saed/the-ultimate-guide-to-software-architecture-in-nextjs-from-monolith-to-microservices-i2c](https://dev.to/shayan_saed/the-ultimate-guide-to-software-architecture-in-nextjs-from-monolith-to-microservices-i2c)  
> 19. The Rise of Full-Stack TypeScript: 2020 to 2026 \- PkgPulse, [https://www.pkgpulse.com/guides/rise-of-full-stack-typescript-2020-to-2026](https://www.pkgpulse.com/guides/rise-of-full-stack-typescript-2020-to-2026)  
> 20. Using Supabase as a Backend for React and Next.js Apps, [https://javascript.plainenglish.io/using-supabase-as-a-backend-for-react-and-next-js-apps-b6b4f0f2483f](https://javascript.plainenglish.io/using-supabase-as-a-backend-for-react-and-next-js-apps-b6b4f0f2483f)  
> 21. Supabase RLS Guide 2026: Policies That Actually Work, [https://designrevision.com/blog/supabase-row-level-security](https://designrevision.com/blog/supabase-row-level-security)  
> 22. Should I proxy Firebase/Supabase through a NodeJS backend?, [https://www.reddit.com/r/reactjs/comments/18t6kgt/should\_i\_proxy\_firebasesupabase\_through\_a\_nodejs/](https://www.reddit.com/r/reactjs/comments/18t6kgt/should_i_proxy_firebasesupabase_through_a_nodejs/)  
> 23. WebSocket vs SSE vs Supabase Realtime — Real-Time Pattern, [https://aidxn.com/blog/websocket-vs-sse-vs-supabase-realtime-2026/](https://aidxn.com/blog/websocket-vs-sse-vs-supabase-realtime-2026/)  
> 24. Should I use WebSockets or just keep using real-time DB? \- Reddit, [https://www.reddit.com/r/Supabase/comments/1hcso3d/should\_i\_use\_websockets\_or\_just\_keep\_using/](https://www.reddit.com/r/Supabase/comments/1hcso3d/should_i_use_websockets_or_just_keep_using/)  
> 25. Handling WebSockets | Supabase Docs, [https://supabase.com/docs/guides/functions/websockets](https://supabase.com/docs/guides/functions/websockets)  
> 26. Splitwise Low Level Design — Expense Splitter LLD Interview Guide, [https://lldhub.in/blog/expense-splitter-lld-design](https://lldhub.in/blog/expense-splitter-lld-design)  
> 27. Greedy | PDF | Computer Programming \- Scribd, [https://www.scribd.com/document/697920089/Greedy](https://www.scribd.com/document/697920089/Greedy)  
> 28. Guides: PWAs | Next.js, [https://nextjs.org/docs/app/guides/progressive-web-apps](https://nextjs.org/docs/app/guides/progressive-web-apps)  
> 29. TrueLayer Reviews, Feess & Pricing (July 2026\) \- Merchant Machine, [https://merchantmachine.co.uk/open-banking-payments/truelayer/](https://merchantmachine.co.uk/open-banking-payments/truelayer/)  
> 30. How much it will cost you to access Open Banking account ... \- Medium, [https://medium.com/@francesca\_52463/how-much-it-will-cost-you-to-access-open-banking-account-information-in-the-uk-386da74213e9](https://medium.com/@francesca_52463/how-much-it-will-cost-you-to-access-open-banking-account-information-in-the-uk-386da74213e9)  
> 31. Personal Terms | Revolut Poland, [https://www.revolut.com/en-PL/legal/terms/](https://www.revolut.com/en-PL/legal/terms/)  
> 32. Digital banks | Study at UCL, [https://www.ucl.ac.uk/study/current-students/international-students/international-support/money-and-finances/digital-banks](https://www.ucl.ac.uk/study/current-students/international-students/international-support/money-and-finances/digital-banks)  
> 33. Cheque-Mate \- App Store, [https://apps.apple.com/gb/app/cheque-mate/id6759045959](https://apps.apple.com/gb/app/cheque-mate/id6759045959)  
> 34. Free SEPA/EPC QR Code Generator \- QuickQR, [https://www.quickqrcode.app/epc](https://www.quickqrcode.app/epc)  
> 35. Benchmarks | Supabase Docs, [https://supabase.com/docs/guides/realtime/benchmarks](https://supabase.com/docs/guides/realtime/benchmarks)  
> 36. Build an Expense Splitter App | Full-Stack Practice Project, [https://www.frontendmentor.io/challenges/expense-splitter](https://www.frontendmentor.io/challenges/expense-splitter)  
> 37. EPC Standard & SEPA-QR – Technical Structure Explained, [https://girocodegenerator.com/en/wissen/epc-standard](https://girocodegenerator.com/en/wissen/epc-standard)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAaCAYAAACq/ULmAAAEnUlEQVR4Xu2ZW8hVRRTH1yntYlgYEShlhKihJEGEXR7CCxb0VEYKiiIYKaEIUVQ+9ZLSBUIU80GfS6GC6qVeNKJECsKCrhZkZVppF01N83P9z5q195x11uw953zn8F30B4uz57/mtmdmz5r5PqKhomGFkcEI7fZoZPRNxQIrdMzoGpOJbJdYsRfcxPYq22a2q43PYxXb01b0GMT4X8o23YrDnAErDIZXSCpcFkZxMtsRtlNRHnGVo3wj2y9Fqp3fSepUs3xPrf6vW91N/qR0+d7TuoJ+Y/uf0u3vYRtolP5Dke8ytnNRuivw+aFiNORxltKNoNwVVjS8xfYpSd67jA+M4QH50oqGZdQs3+23J+U6KR3lXcf2AUn/nynlFjBGHh+xvWzFTkCjWMEp5pLkmVdKza7fzXa61JKgLFYRfv8zPrCG7QErGh4hf+Vm0sm0lIRSf4Rk6uu5le3FWIhaw3bslcniJ6ov3PyyuMFdRj9DebHmr/CL/GhrTOQDv5q0x0NU389BkpxAbfeL8Dwz8oHXqC02t9SFMvNjIYd7SQruNrplAkk+7P0FYZ+9MtYcZrE9EZ7vISmDLUKQd8gZ9Acpne9Jkr0eB5ixxqfgNLmTbWlI72b7t/CmQQ/fDs9XkfThn9LdJNUv5Su2fVb0iKdUV3JdzMALId9nkTY+aHW8QfJpKyhjy31s0h7e5EwK2s0hrbFzSZFD3hfa+pDeHtIAu0HdCXAt2+1RGrEX5e04VvEstfe9imbd3kB5fEOSD0dmZQ5XkVPW5tkYNP2aUGfOHcmbHKS3Gm1G0PWO8WFIxyD9ktFcGmW8Ue4nKa9f0y1sz5dul8XU3odKrqf8yfHyrXA0D403MXF9h2NHBXZy7gvpayJNgb4tPOMobPuJ9HtGS2HLgrj/r5Nsd1XMJr+eJHqKOGkdhodJ8u0x+vKgV3EbSTywaGCdGn5zsJOzI6S9GBO/l8Y55YaQxuIUkueA5tf3rhWZLSR1rMRvunjBHZT/ngXxCkiRynMn+XoMPn17MgMaWPFVlYcDxX9bOzm4eyCt8SYG+oEorYsB7eEXR98csPXiPT10XHKuEouofqza0M6m+JHE761OPcFVUeXXwDrHOhLYF9RAr7FL0X7hDgYeJdnzu+FvK0T8QNLOc9bhgOvGQGLRVYIG9luRZK+uO4WgLC6XHjjlwJ/qkgbWXFaT5I9PfhuCFoM/N30XpaeR5PmE5Ct9h+0F8mNVDO4lGNBx1hG4lqTeupMu+JxaT7otpAZI0b9/7SXZq/GMIFaHt3KxjeEecDQY7hII3h72JGQoun2C7We2gyQX1jfVQXLMxdaCvsAei3yo4rrIZ00PDZbjbMfYjjbkGYvAA74c0FZqDPrGU5TfwaECA4M7mUX/JNVvGo1u2qn7nDJBw17QH3LC+6F/3qvqhbXfvM+2yYrVeN0tqHRaEDu+teIwQuNSfPBYGDS7JfcaLAD8u6F7OpoKHwRYnIo6pweNpyiqlgdMBP51gT8nPa6uPlNMTB9fM4vlVrhwcId+CtvlVrxID3GHfdjS4972uLqL+APqqyOFkd37IeJCHLTz9Kwk/+eo/aQAAAAASUVORK5CYII=>