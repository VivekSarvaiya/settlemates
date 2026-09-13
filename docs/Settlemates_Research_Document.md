# Settlemates — Product & Market Research Document

## 1. Purpose

This document consolidates research on the shared-expense app category into a single reference for building **Settlemates**. Rather than a product-by-product breakdown, it's organized around what actually matters for building: the full feature landscape available in the category, the real use cases and personas we're serving, the friction points users consistently report, and where Settlemates can differentiate — including opportunities that go beyond expense splitting altogether.

---

## 2. Market Context: Three Layers of "Splitting"

Shared-expense apps generally serve one of three distinct jobs. Most existing products pick one and stay there — which is itself the opportunity, since real users move between all three.

| Layer | Job to be done | Time horizon | Example |
|---|---|---|---|
| **Ledger** | Ongoing financial relationship between people | Months/years | Rent, groceries, recurring bills with a roommate |
| **Event** | A temporary shared occasion | Days | A trip, a wedding weekend, a group holiday |
| **Moment** | One immediate transaction | Seconds/minutes | A dinner bill, a cab ride, a round of drinks |

The category is crowded at each individual layer, but very few products let a user move fluidly between all three inside one relationship graph (the same friend group might split a dinner tonight, a trip next month, and rent all year). **This seam between layers is Settlemates' core structural opportunity.**

---

## 3. Full Feature Landscape

This is the comprehensive inventory of features that exist across the category today, organized by function rather than by app. Treat this as the menu we're choosing from — not everything belongs in an MVP.

### 3.1 Core Splitting Mechanics
- Equal splits
- Unequal / custom amount splits
- Percentage-based splits
- Share/weight-based splits (e.g., a couple counts as "2 shares," a kid counts as "0.5")
- Exact-amount entry
- Multiple payers on a single expense
- Item-level / itemized splitting ("who ordered what")
- Quantity-based item splitting (e.g., 2kg of something split unevenly by portion)
- Tax and tip auto-distribution across items/people
- Shared items (e.g., an appetizer split among a subset of the group)
- Debt simplification (minimizing the number of transactions needed to settle a group)

### 3.2 Group & Relationship Management
- Persistent groups (trip, household, friend circle)
- One-off/temporary groups that auto-archive
- Private one-to-one expense tracking outside of groups
- "Clubs" or recurring friend collections that persist across many events
- Recurring/subscription-style expenses (rent, utilities, streaming)
- Category tagging for expenses
- Comments/notes on individual expenses
- Activity feed / history log
- Restore deleted expenses

### 3.3 Input & Automation
- Manual entry (title, amount, payer, participants, split type)
- Receipt photo capture
- OCR / AI receipt scanning into line items
- Natural-language expense entry ("Rahul paid 1800 for dinner, split with everyone")
- Bill import from delivery/grocery platforms
- Splitwise-style data import/migration from a competing app

### 3.4 Settlement & Payments
- "Who owes whom" balance view
- Payment requests
- Deep links into payment apps (UPI, PayPal, Venmo-equivalents, iDEAL, Bancontact)
- Reminders to unpaid parties
- "Mark as paid" / payment confirmation workflow (two-sided: payer initiates, recipient confirms)
- Multi-currency support with historical exchange-rate handling

### 3.5 Access & Sharing
- No-account participation via shareable link
- Web-based (no app download required) access for guests
- PWA (installable web app) support
- Sharing via WhatsApp, SMS, email, or messaging apps directly
- Cross-platform sync (mobile + web)
- Offline expense entry with later sync

### 3.6 Data, Export & Analytics
- CSV / Excel / PDF export
- Spending analytics and charts
- Search across expenses
- Attach images/receipts as records

### 3.7 Localization Patterns (India-relevant)
- UPI-native payment flows (rather than card/wallet-first)
- Optimization for low-bandwidth/weak network conditions
- Region-specific delivery/grocery platform integrations
- Language localization

### 3.8 Monetization Patterns Observed
- Fully free, ad-free, donation-supported
- Freemium with daily/monthly expense caps on the free tier
- One-time unlock fee for a specific feature (e.g., larger group size)
- Subscription tier for OCR, analytics, multi-currency, or unlimited entries

---

## 4. User Personas & Use Cases

### Persona A — The Trip Organizer
Plans and tracks a multi-day trip with 4–10 people: flights, hotel, cabs, meals, activities. Needs the ledger to survive the whole trip and produce one clean settlement at the end. Often has 1–2 friends who won't install a new app.

### Persona B — The Roommate / Shared Household
Long-running, recurring expenses: rent, groceries, utilities, subscriptions. Needs low-friction recurring entry and a running balance that doesn't need to be "settled" constantly — more like a shared account statement.

### Persona C — The Couple
Wants to distinguish joint expenses (rent, groceries) from personal ones (their own subscriptions, haircuts) and from occasionally-split ones (a dinner out with friends). Traditional "everyone owes everyone" group logic doesn't fit — they need three buckets, not one.

### Persona D — The Moment Splitter
At a restaurant, in a cab, splitting a bar tab. Needs a sub-60-second flow: open, add people, split, done. Will not tolerate account creation or a multi-step form. Often never opens the app again after that one bill.

### Persona E — The Guest
Doesn't own the group, was just added by a friend. Wants to see what they owe and pay it — nothing more. Every extra step (download, signup, password) is a reason to disengage, and disengagement is what causes settlement to stall.

### Persona F — The Migrator
Already uses a competing app but is frustrated by paywalls or complexity. Will switch if the switching cost (rebuilding groups and history) is removed.

---

## 5. Problems & Friction Points Users Actually Face

Research and user commentary across the category converge on a consistent set of complaints — worth designing against directly:

1. **Account friction for guests.** Requiring every participant to sign up kills participation, especially for one-off events with casual acquaintances.
2. **Paywalled basics.** Daily/monthly caps on expense entry on free tiers generate real resentment and drive people toward "Splitwise refugee" behavior — actively looking for an alternative.
3. **Rigid group models.** Most apps assume every expense in a group is split among everyone. Real life has joint, personal, and partial-group expenses mixed together (especially for couples and households).
4. **Tedious input for many expenses.** A single expense form is fine once; entering 15 expenses over a 5-day trip is not. Manual entry doesn't scale to real trip volume.
5. **The math isn't the hard part — the social layer is.** The genuine pain point users report isn't calculating splits; it's the awkwardness of asking a friend to pay you back, disagreements over fairness, and the friction of turning a "balance" into an actual payment.
6. **Fragmented experiences across contexts.** A restaurant splitter, a trip tracker, and a rent ledger are usually three different apps, even though the same friend group needs all three.
7. **Weak or absent payment closure.** Most apps stop at showing a balance. Very few apps make the payment happen and confirm it happened — the loop is often left open.
8. **Poor fit for India-specific spending patterns.** UPI-first payment habits, and weak-network usage, are often treated as secondary rather than designed-for-first.
9. **Switching cost.** Moving from an existing app to a new one usually means losing group history, which locks users into a worse product they're already unhappy with.

---

## 6. Where Settlemates Can Improve on the Status Quo

Directly answering the friction points above:

- **Zero-friction guest participation.** Organizer creates a split and shares a link; a guest opens it, enters a name, and participates — no download, no account, no password. This alone addresses the single most common complaint in the category.
- **No artificial caps on core usage.** Splitting and settling expenses should never be gated behind a paywall or a daily limit — monetize elsewhere (see Section 8), not on the core loop.
- **Bucketed expense types, not just group expenses.** Support Joint / Split / Personal as first-class categories, particularly for couples and households, instead of forcing every expense into an "everyone owes everyone" model.
- **Fast, bulk-friendly expense entry.** Natural-language or shorthand entry ("Vivek 1200 cab everyone") and receipt scanning should reduce a 5-day trip's worth of expenses from 15 manual forms to a handful of quick taps.
- **Close the loop, not just show the balance.** Every debt should have a clear next action: pay via UPI/payment link → mark as paid → recipient confirms → done. A balance without a path to resolution is half a product.
- **One product, three modes, one relationship graph.** The same friend group should be able to move between Quick Split (a dinner), Trip mode (a vacation), and Living mode (shared rent) without re-adding people or losing history each time.
- **UPI and WhatsApp as first-class citizens**, not bolted-on integrations — for the target market, these are the actual rails people already use to settle up.
- **A real migration path.** Letting a user import their existing groups and history from a competing app removes the single biggest switching cost and turns competitors' unhappy users into a direct acquisition channel.

---

## 7. Beyond Expense Splitting — Expansion Opportunities

Once the core ledger/settlement loop is solid, there are adjacent problems in the same relationship graph worth exploring:

- **Shared budgeting for recurring households** — not just tracking what was spent, but forecasting a shared monthly budget for rent + utilities + groceries.
- **Trip planning integration** — light itinerary or booking references attached to a trip's expense ledger, so "why did we spend this" has context.
- **Group savings / pooled funds** — collecting money upfront for a trip or event (a shared pot) rather than only reconciling after the fact.
- **Social accountability layer** — gentle, non-awkward nudges (rather than blunt "you owe" notifications) that reduce the interpersonal discomfort users report around chasing repayment.
- **Spending insights per relationship** — e.g., "you and your roommate spent X on groceries this quarter" — useful, non-invasive analytics that turn the ledger into something people want to look at, not just settle.
- **Multi-currency travel wallet context** — showing running trip spend against a budget, not just splits, for group travel.
- **Vendor/merchant-side splitting** — a restaurant-facing version of item-level splitting (extending the "moment" layer to the point of sale itself) as a longer-term, more ambitious direction.

---

## 8. Recommended Positioning for Settlemates

**Core promise:** *Split any shared expense in seconds — even if your friends don't have the app.*

**Structural differentiation:** One relationship graph, three modes —

- **Quick Split** — restaurant, cab, one-off moment (sub-60-second flow)
- **Trip** — persistent multi-day shared ledger
- **Living** — recurring rent/utilities/groceries
- *(optional fourth mode)* **Couple** — joint / split / personal buckets

Underpinned by: zero-friction guest access via shareable link, UPI/WhatsApp-native settlement, item-level splitting, and no artificial caps on core functionality.

**What to explicitly avoid building:** a straight feature-for-feature clone of the market leader, a generic "add expense → see balance" app with no distinguishing workflow, an AI receipt scanner as the sole differentiator, or a subscription-only model that gates basic splitting.

---

## 9. Suggested MVP Scope vs. Later Roadmap

| Priority | Feature |
|---|---|
| **MVP — must have** | Equal/unequal/exact splits, groups, no-account guest links, debt simplification, WhatsApp sharing, basic UPI payment links, Quick Split + Trip modes |
| **V2 — strong differentiators** | Item-level/receipt-based splitting, Living mode with recurring expenses, mark-as-paid confirmation loop, Splitwise-style import/migration |
| **V3 — expansion** | Couple mode (Joint/Split/Personal), natural-language expense entry, spending analytics, group savings/pooled funds |
| **Later / exploratory** | Trip planning context, merchant-facing splitting, budget forecasting |

---

## 10. Summary

The category is saturated but not solved. The unmet need isn't a better calculator — every competitor already computes splits correctly. The unmet need is **removing friction between "we shared an expense" and "everyone has actually paid their share,"** while fitting the way people actually live: moving fluidly between one-off moments, trips, and ongoing shared living with the same group of people. That combination — zero-friction access, closed-loop settlement, and one graph across all three usage layers — is where Settlemates can carve out real differentiation.
