# Restorise Business Solutions — Web

Marketing website and unified administrative dashboard for Restorise Business
Solutions. Built on **Next.js 16 (App Router)** + **Payload CMS v3** +
**PostgreSQL** + **Tailwind CSS v4**.

This repository implements Phase 1 of the project brief
(`../Restorise_Website_Project_Brief.docx`). Phase 2 (hospitality marketplace)
extends the same Payload instance with commerce collections, fulfillment
routing, and a customizer.

---

## Quick start

### 1. Prerequisites

- **Node.js** ≥ 22 (LTS)
- **PostgreSQL** ≥ 14 — local install, or a managed service such as
  [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or
  [Vercel Postgres](https://vercel.com/storage/postgres).
- **npm** ≥ 10 (a recent version ships with Node 22)

### 2. Install

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in the variables. The minimum
viable set for first boot:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYLOAD_SECRET=<generate with `openssl rand -base64 32`>
DATABASE_URI=postgresql://USER:PASS@HOST:5432/restorise
```

All other variables (SMTP, reCAPTCHA, GTM, HubSpot, Brevo, DeepL, Stripe, …)
can be added incrementally — the app degrades gracefully when keys are absent.

See [`.env.example`](./.env.example) for the full list with notes.

### 4. Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin dashboard: <http://localhost:3000/admin>

On first boot Payload will sync the schema to your Postgres instance (`push`
mode is on in development). Sign up as the first user via `/admin` —
they automatically become the Super Admin.

---

## Project layout

```
restorise-web/
├── src/
│   ├── app/
│   │   ├── (frontend)/        Public marketing site
│   │   │   ├── layout.tsx     <html>, fonts, MarketingShell, ConsentScripts
│   │   │   ├── page.tsx       Home
│   │   │   ├── about/         Static about
│   │   │   ├── services/      Index + dynamic [slug]
│   │   │   ├── team/          Team list
│   │   │   ├── portfolio/     Index + dynamic [slug]
│   │   │   ├── reviews/       Testimonials
│   │   │   ├── blog/          Index + dynamic [slug]
│   │   │   ├── faq/           FAQ + JSON-LD
│   │   │   ├── contact/       Contact page
│   │   │   ├── privacy/       Privacy policy (placeholder)
│   │   │   ├── terms/         Terms of service (placeholder)
│   │   │   ├── cookies/       Cookie policy
│   │   │   └── api/leads/     POST /api/leads → lead capture handler
│   │   ├── (payload)/         Payload admin + REST/GraphQL routes
│   │   ├── sitemap.ts         /sitemap.xml — pulls from CMS
│   │   └── robots.ts          /robots.txt
│   ├── collections/           Payload collection configs
│   ├── globals/               Payload global configs (SiteSettings, Nav, Footer, LeadFormSettings)
│   ├── fields/                Shared field modules (seo, slug)
│   ├── components/marketing/  Public site components
│   ├── lib/                   payload accessor, content fetchers, structured data, cn
│   └── payload.config.ts      Central Payload config
├── public/                    Static assets
├── .env.example               Documented env vars
├── next.config.ts             Wrapped with withPayload
└── README.md                  ← you are here
```

Brand assets live one level up at `../brand-assets/` (logo, fonts,
photography, icons). Design tokens consume them in
[`src/app/(frontend)/styles.css`](./src/app/(frontend)/styles.css).

---

## Phase 1 — what's implemented

| Brief section | Status | Notes |
|---|---|---|
| §2 Technical foundation | ✅ | Next 16 + Payload v3 + Postgres + Tailwind v4. |
| §4.1 Page inventory | ✅ | All 12 pages scaffolded. Copy renders from CMS once seeded. |
| §4.2 Technical SEO | ✅ | SSR/SSG, per-page metadata, sitemap.ts, robots.ts, JSON-LD (Organization, FAQPage). |
| §4.3 Geographic strategy | ✅ | Footer disclosure surfaced via SiteSettings global. |
| §4.4 Lead capture pop-up | ✅ | 5s OR 30% scroll trigger, sessionStorage dismissal, reCAPTCHA v3, honeypot, JSON API. |
| §4.5 Multilingual | ✅ | Locale-prefixed routing for EN/DE/FR/ES/IT/NL/PT via `next-intl` + `proxy.ts` (Next 16 middleware). Locale switcher in the header. Per-page hreflang alternates emitted in `<head>` and in the sitemap. DeepL / Google Translate fallback adapter at `POST /api/translate`. |
| §4.6 GDPR | ✅ | Cookie consent banner with 4 categories + Consent Mode v2 defaults + conditional GTM. |
| §4.7 Analytics | ✅ | GTM wrapper. Tag IDs come from env. |
| §6 Admin dashboard | ✅ | All 14 modules backed by Payload collections/globals. |
| §6.2 Roles | ✅ | 6 default roles enforced via access functions. Custom roles can be added via Users.role enum. |
| §7 Blog module | ✅ | Drafts, schedule, categories, tags, authors, SEO per-post, reading time, pinned/featured. |
| §8 FAQ module | ✅ | Categories, ordering, per-question analytics counters, FAQPage JSON-LD. |
| §12 Security | ⚠️ Baseline | HTTPS, password hashing, login lockout, CSRF, XSS protections from framework. Pre-launch security review per §12.4 pending. |

### Phase 2 — scaffolded

The commerce platform foundation (brief §5–§5.10) is wired and ready to be
populated:

- **Collections**: Customers (auth), CustomerAddresses, Products,
  ProductCategories, FulfillmentPartners, Orders, Carts, PromoCodes,
  ArtworkFiles, DesignProjects, QuoteRequests.
- **Globals**: CommerceSettings (currency, VAT, sample pack),
  ShippingZones.
- **Storefront**: `/shop`, `/shop/[category]`, `/shop/[category]/[product]`
  with live tiered pricing + surcharges + add-to-cart, `/cart` with
  inline quantity edits, `/checkout/success` and `/checkout/cancel`.
- **Customer auth + account**: `/sign-in`, `/sign-up`, `/account` dashboard,
  `/account/orders`, `/account/addresses`, `/account/designs`.
- **APIs**: `/api/cart` (GET/POST/PATCH/DELETE), `/api/checkout` (Stripe
  Checkout session), `/api/webhooks/stripe` (signature-verified handler
  that flips orders to `paid` and dispatches fulfillment).
- **Fulfillment routing engine**: provider abstraction at
  `src/lib/fulfillment/providers.ts` + selection logic at
  `src/lib/fulfillment/route.ts`. Reads the FulfillmentPartners registry
  (CMS-managed); falls back to the Lahore manual supplier when no
  partner matches. Gelato / Printful / Packhelp stubs return `manual`
  until their API keys are wired against sandbox accounts.
- **Artwork validation**: `afterChange` hook on ArtworkFiles runs sharp on
  uploaded raster images to extract dimensions, channels, colour space,
  and DPI; PDF/EPS/AI/PSD trigger a manual-review warning. Bleed/trim
  inspection deferred to a future pre-press step.

### Roadmap (next milestones)

1. **Live partner SDK integration** — replace the Gelato/Printful/Packhelp
   provider stubs with real API calls against sandbox accounts, plus
   webhook receivers for partner-side status updates.
2. **Design customizer** — evaluate Customer's Canvas / Canva for
   Business API / Picflow vs an in-house build; integrate behind the
   `Products.supportsCustomizer` flag.
3. **Pre-press validation** — full PDF/AI/EPS inspection (bleed, trim,
   embedded fonts, colour fidelity). Requires a PDF parsing dependency.
4. **Per-page DeepL fallback flow** — wire `/api/translate` into a
   catch-all locale route + page-level cache for the 15+ locales outside
   the seven first-class set.
5. **Content seeding** — agency drafts page copy via Claude.ai per the brief
   and loads it through the admin. Service landing pages and product
   detail pages remain the highest-value SEO targets.

---

## Decisions reserved for the developer (brief §16)

| Decision | Recommendation | Rationale |
|---|---|---|
| Postgres provider | **Supabase** | Postgres + Auth + Storage + generous free tier. Easy migration path. |
| Email marketing | **Brevo** | Transactional + campaign in one platform; free tier supports launch traffic. |
| CRM | **HubSpot** | Free CRM tier; mature API; first-class lifecycle stage modelling. |
| Live chat | **Tawk.to** | Free; sufficient for SMB hospitality use cases. |
| Translation API | **DeepL** | Quality materially better than Google Translate for EU languages. |
| Customizer (Phase 2) | TBD | Re-evaluate at Phase 2 kickoff — Customer's Canvas vs in-house. |
| Error tracking | **Sentry** | Industry standard; free tier OK for launch. |
| CSS | **Tailwind CSS v4** | Per brief recommendation; CSS-first config aligns with design-token-driven theming. |

Each integration's keys live in `.env.example` with notes; the app no-ops
gracefully when a key is missing so the developer can add them incrementally.

---

## Integration runbooks (high-level)

Detailed per-integration runbooks land alongside each integration as it's
activated. The pattern for every integration is the same:

1. Acquire credentials in the provider dashboard.
2. Set the relevant `.env` variables (see `.env.example`).
3. Toggle the integration in the Payload admin under **Settings → Integrations**.
4. Run a smoke test (documented in the per-integration runbook).
5. Rotate keys via the provider; update the env in the hosting provider.

Credentials are **never** committed to git and **never** sent via email or
chat. They live in the hosting provider's environment configuration and in
the agency's password manager.

---

## Deployment

Recommended host: **Vercel** (per brief §2.1). The `withPayload` wrapper in
`next.config.ts` handles the runtime split between admin/API and the
public site.

Production checklist:

- [ ] Rotate `PAYLOAD_SECRET` to a fresh value.
- [ ] Set all `.env` variables in the hosting provider.
- [ ] Point `NEXT_PUBLIC_SITE_URL` at the canonical domain.
- [ ] Configure media storage adapter (S3 / R2) instead of the local disk.
- [ ] Set `push: false` in `postgresAdapter` (already gated on `NODE_ENV === 'production'`) and run an explicit migration.
- [ ] Confirm HSTS, CSP, and other security headers via the hosting layer.
- [ ] Pre-launch security review per brief §12.4.

---

## License

Proprietary — © Restorise Business Solutions. All rights reserved.
