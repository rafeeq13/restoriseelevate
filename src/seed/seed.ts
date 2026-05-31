import type { Payload } from "payload";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * Seed marketing collections with fake/sample data.
 *
 * Exported as a function so it can be invoked from a Next.js API route
 * (where Next handles module resolution) without needing tsx/swc loaders.
 *
 * Idempotent: each upsert checks for an existing record (by slug or unique
 * field) before creating. Safe to re-run.
 */

// ---------- Lexical rich-text helper -------------------------------------

function richText(paragraphs: readonly string[]): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        version: 1,
        format: "",
        indent: 0,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: [
          {
            type: "text",
            version: 1,
            format: 0,
            mode: "normal",
            style: "",
            text,
            detail: 0,
          },
        ],
      })),
    },
  } as unknown as SerializedEditorState;
}

// ---------- Data ---------------------------------------------------------

const SERVICES = [
  {
    slug: "meta-ads",
    name: "Meta Ads",
    category: "advertising",
    tagline: "Facebook & Instagram campaigns engineered for footfall.",
    summary:
      "Paid advertising campaigns on Facebook and Instagram. Setup, creative, audience research, conversion tracking, and ongoing optimisation.",
    body: [
      "We engineer Meta campaigns around the unit economics of hospitality — covers, orders, and average ticket.",
      "Every campaign starts with a tracking audit: pixel events, conversion API, attribution windows, and offline event matching where it makes sense.",
      "Then we build the creative pipeline: weekly food-shot rotations, UGC sourcing, and short-form video specifically tuned for Reels and Stories placements.",
    ],
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    category: "advertising",
    tagline: "Search, Performance Max, and YouTube — built for ROAS.",
    summary:
      "Paid search, display, Performance Max, and YouTube. Keyword research, ad copy, landing-page guidance, bid strategy, and ROAS optimisation.",
    body: [
      "Hospitality search demand is fundamentally local. We structure Google Ads campaigns around radius targeting, dayparting, and intent buckets that matter to operators.",
      "Performance Max gets the heavy lifting once we have enough conversion signal; before that, we lean on classic Search with manual oversight.",
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    category: "seo",
    tagline: "Technical, local, and content SEO for hospitality.",
    summary:
      "Technical SEO, on-page optimisation, local SEO for hospitality, content strategy, link acquisition, schema, and Google Business Profile management.",
    body: [
      "We treat SEO as a multi-disciplinary practice: technical foundations, local-pack hygiene, structured data, and a sustainable content programme.",
      "For multi-venue groups we maintain Google Business Profile parity across locations and centralise reputation management.",
    ],
  },
  {
    slug: "social-media",
    name: "Social Media Management",
    category: "social",
    tagline: "Strategy, content, and community — done in-house feel.",
    summary:
      "Strategy, planning, scheduling, community management, and reporting across Instagram, Facebook, TikTok, and other platforms.",
    body: [
      "We run social like a newsroom: weekly content calendar, monthly strategy review, and daily community management — with a dedicated brand voice per client.",
    ],
  },
  {
    slug: "graphics-design",
    name: "Graphics Design",
    category: "creative",
    tagline: "Identity, menus, packaging, and ads — handled.",
    summary:
      "Brand identity, menus, packaging, social graphics, advertising creatives, and full visual identity systems.",
    body: [
      "From the moment a guest sees your logo on Instagram to the menu they hold in-store, every brand surface earns its place in your stack.",
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    category: "software",
    tagline: "High-performance sites with online ordering built in.",
    summary:
      "Marketing sites, brochure sites, and online ordering systems for restaurants and takeaways.",
    body: [
      "We build sites that earn their hosting cost — Core Web Vitals all green, SEO foundations baked in, and online ordering that actually converts on mobile.",
    ],
  },
  {
    slug: "pos-setup",
    name: "POS Setup",
    category: "operations",
    tagline: "POS selection, integration, and staff training.",
    summary:
      "POS selection, configuration, delivery + payment integration, inventory management, staff training, and ongoing support.",
    body: [
      "POS is the operational backbone of your venue. We help you choose the right system, integrate it with delivery aggregators and payment processors, and train your team.",
    ],
  },
  {
    slug: "delivery-platforms",
    name: "Delivery Platform Setup",
    category: "operations",
    tagline: "End-to-end aggregator onboarding and launch optimisation.",
    summary:
      "End-to-end account setup on UberEats, Deliveroo, Just Eat, Grubhub, foodpanda, and regional aggregators.",
    body: [
      "Aggregator setup looks simple until you hit the menu rules, dispatch logic, and store-hours quirks. We handle the launch end-to-end and stay through the first month.",
    ],
  },
] as const;

const TEAM_MEMBERS = [
  {
    name: "Muhammad Usama",
    slug: "muhammad-usama",
    role: "Founder & CEO",
    bio: "Operator-focused founder with a background in performance marketing and hospitality systems. Builds the engagement model and leads strategy on every account.",
    order: 1,
  },
  {
    name: "Ayesha Khan",
    slug: "ayesha-khan",
    role: "Head of Performance Marketing",
    bio: "Twelve years across Meta, Google, and TikTok performance — last six exclusively in food and hospitality.",
    order: 2,
  },
  {
    name: "Daniel Reeves",
    slug: "daniel-reeves",
    role: "Creative Director",
    bio: "Brand systems, menu design, and food photography direction. Previously at a London-based hospitality studio.",
    order: 3,
  },
  {
    name: "Priya Shah",
    slug: "priya-shah",
    role: "Head of SEO",
    bio: "Technical and local SEO specialist. Owns the GBP and structured-data programmes across all client accounts.",
    order: 4,
  },
  {
    name: "Omar Farooq",
    slug: "omar-farooq",
    role: "Hospitality Operations Lead",
    bio: "Former multi-venue operator. Runs POS rollouts, delivery setups, and menu engineering engagements.",
    order: 5,
  },
];

const REVIEWS = [
  {
    personName: "Sara Mehmood",
    personRole: "Operations Director",
    businessName: "Alba Restaurant Group",
    country: "United Kingdom",
    rating: 5,
    quote:
      "Within three months they had our online orders up 2.4× and our cost per acquisition down by nearly half. The team feels like an extension of ours.",
    featured: true,
  },
  {
    personName: "James Carter",
    personRole: "Founder",
    businessName: "Harvest Cafés",
    country: "Canada",
    rating: 5,
    quote:
      "Restorise rebuilt our delivery stack from scratch and gave us a brand that finally matches the food. No hand-offs, no surprises — just senior people doing senior work.",
    featured: true,
  },
  {
    personName: "Isabella Romano",
    personRole: "Group GM",
    businessName: "Roma Trattoria",
    country: "European Union",
    rating: 5,
    quote:
      "We tried two agencies before. Both pitched well, neither delivered. Restorise's first month had us reconsidering what an agency relationship should feel like.",
    featured: false,
  },
  {
    personName: "Aiden Chen",
    personRole: "Marketing Lead",
    businessName: "Bento Lab",
    country: "Australia",
    rating: 5,
    quote:
      "They understood our market within the first call. ROAS lifted from 3.1× to 5.8× in 90 days without any creative we had to second-guess.",
    featured: false,
  },
  {
    personName: "Layla Hassan",
    personRole: "Co-founder",
    businessName: "Maison Vert",
    country: "United Arab Emirates",
    rating: 5,
    quote:
      "The brand refresh and POS rollout landed in the same quarter. Both teams talked to each other — that alone was worth the engagement.",
    featured: false,
  },
];

const PORTFOLIO = [
  {
    title: "Order growth at a multi-venue group",
    slug: "alba-order-growth",
    client: "Alba Restaurant Group",
    industry: "restaurant",
    country: "United Kingdom",
    summary:
      "14-venue UK restaurant group. Performance marketing rebuild + ordering stack overhaul. 6-month engagement.",
    outcomes: [
      { metric: "Online orders", value: "+184%", context: "6-month average" },
      { metric: "Return on ad spend", value: "5.8×", context: "Blended Meta + Google" },
      { metric: "Customer acquisition cost", value: "−42%", context: "vs. baseline quarter" },
    ],
    body: [
      "Alba came to us mid-relaunch after a national rollout that hadn't landed online orders at the expected pace.",
      "Our diagnostic flagged three issues: a delivery-app menu out of sync with their direct-ordering catalogue, a fragmented pixel + CAPI setup, and creative fatigue across Meta accounts.",
      "Over the next six months we rebuilt the ordering stack, consolidated tracking, and replaced the always-on Meta creative with a weekly UGC rotation. Orders trended up steadily from week four onward.",
    ],
  },
  {
    title: "ROAS lift for an indie café chain",
    slug: "harvest-roas-lift",
    client: "Harvest Cafés",
    industry: "cafe",
    country: "Canada",
    summary:
      "Café chain in Vancouver and Toronto. Brand refresh, online ordering, and Meta + Google performance ramp.",
    outcomes: [
      { metric: "Return on ad spend", value: "+97%", context: "Quarter on quarter" },
      { metric: "Repeat orders", value: "+31%", context: "Loyalty programme launch" },
      { metric: "Direct order share", value: "+22pp", context: "vs aggregator volume" },
    ],
    body: [
      "Harvest had an outdated identity and was over-indexed on delivery aggregators. We refreshed the brand, built direct ordering, and shifted media spend toward owned channels.",
      "The loyalty programme launch in month four was the inflection point — repeat order rate climbed from 18% to 49% across six months.",
    ],
  },
  {
    title: "CAC reduction at a delivery-first concept",
    slug: "roma-cac-reduction",
    client: "Roma Trattoria",
    industry: "cloud-kitchen",
    country: "European Union",
    summary:
      "Delivery-first Italian concept across Berlin and Amsterdam. Aggregator menu re-engineering + Meta acquisition.",
    outcomes: [
      { metric: "Customer acquisition cost", value: "−42%", context: "Trailing 90 days" },
      { metric: "Aggregator rank", value: "Top 3", context: "Per cuisine, per zone" },
      { metric: "Average ticket", value: "+18%", context: "Menu engineering" },
    ],
    body: [
      "Roma was burning capital on Meta acquisition while their aggregator rank slipped. We re-engineered the menu, fixed dispatch reliability, and rebuilt creative around moments-of-craving.",
    ],
  },
  {
    title: "Brand and POS rollout in MENA",
    slug: "maison-vert-rollout",
    client: "Maison Vert",
    industry: "restaurant",
    country: "United Arab Emirates",
    summary:
      "New restaurant launch in Dubai. End-to-end brand identity, POS configuration, and pre-launch campaigns.",
    outcomes: [
      { metric: "Pre-launch wait-list", value: "2,400+", context: "Captured in 6 weeks" },
      { metric: "Soft-launch covers", value: "Sold out", context: "First two weeks" },
      { metric: "Press coverage", value: "9 outlets", context: "Including Time Out Dubai" },
    ],
    body: [
      "We led the brand identity, menu design, POS configuration, and pre-launch acquisition for Maison Vert's flagship in DIFC.",
      "By the time the doors opened, the venue had 2,400+ wait-list emails and confirmed press coverage in nine major outlets.",
    ],
  },
];

const AUTHORS = [
  {
    name: "Ayesha Khan",
    slug: "ayesha-khan",
    role: "Head of Performance Marketing",
    bio: "Writes about paid acquisition, attribution, and the unit economics of hospitality marketing.",
  },
  {
    name: "Priya Shah",
    slug: "priya-shah",
    role: "Head of SEO",
    bio: "Writes about local SEO, GBP optimisation, and content strategy for multi-venue groups.",
  },
  {
    name: "Daniel Reeves",
    slug: "daniel-reeves",
    role: "Creative Director",
    bio: "Writes about brand systems, menu design, and food photography for hospitality.",
  },
];

const BLOG_CATEGORIES = [
  { name: "Performance Marketing", slug: "performance-marketing" },
  { name: "Search & SEO", slug: "search-seo" },
  { name: "Brand & Creative", slug: "brand-creative" },
  { name: "Operations", slug: "operations" },
];

const BLOG_TAGS = [
  { name: "Meta Ads", slug: "meta-ads-tag" },
  { name: "Google Ads", slug: "google-ads-tag" },
  { name: "Local SEO", slug: "local-seo" },
  { name: "Delivery Platforms", slug: "delivery-platforms-tag" },
  { name: "Menu Engineering", slug: "menu-engineering" },
  { name: "Branding", slug: "branding" },
];

const BLOG_POSTS = [
  {
    title: "Why most restaurants get Meta attribution wrong",
    slug: "meta-attribution-restaurants",
    excerpt:
      "If your reports say Meta is responsible for 80% of orders, you're almost certainly looking at last-click attribution against a leaky pixel.",
    categorySlug: "performance-marketing",
    authorSlug: "ayesha-khan",
    tagSlugs: ["meta-ads-tag"],
    pinned: true,
    featured: true,
    daysAgo: 5,
    body: [
      "Most hospitality operators inherit their Meta attribution from whoever set up their pixel first — usually a freelancer years ago.",
      "The result: every order with a pixel touchpoint gets credited to Meta, regardless of whether Meta actually moved the needle.",
      "The fix is straightforward but rarely done: install Conversions API, set up offline event matching for in-venue orders, and use a sane attribution window (7-day click, 1-day view is a reasonable baseline).",
    ],
  },
  {
    title: "The aggregator menu sync problem",
    slug: "aggregator-menu-sync",
    excerpt:
      "Every operator we audit has at least three pricing discrepancies between their POS and their delivery aggregator menus. Here's why it matters.",
    categorySlug: "operations",
    authorSlug: "daniel-reeves",
    tagSlugs: ["delivery-platforms-tag", "menu-engineering"],
    featured: true,
    daysAgo: 12,
    body: [
      "Aggregator commissions compress margin on every order. Most operators upcharge to compensate — fine in principle, broken in execution.",
      "The most common pattern: prices are uplifted on Aggregator A but not Aggregator B, or uplifted at launch and never re-checked when the base menu changed.",
      "The fix is a quarterly menu reconciliation — POS as the source of truth, every aggregator menu reconciled against it.",
    ],
  },
  {
    title: "Local SEO in 2026: what still works",
    slug: "local-seo-2026",
    excerpt:
      "Most local SEO advice you'll read online is from 2019. Here's what actually moves the local pack in 2026.",
    categorySlug: "search-seo",
    authorSlug: "priya-shah",
    tagSlugs: ["local-seo"],
    daysAgo: 22,
    body: [
      "The local pack ranking factors have quietly consolidated in the last 18 months. Three things matter more than everything else combined.",
      "First, Google Business Profile completeness and consistency across categories, services, and attributes. Second, review velocity — not just count, but recency. Third, location-relevant citations from local press and food blogs.",
    ],
  },
  {
    title: "Why your brand refresh stalled",
    slug: "brand-refresh-stalled",
    excerpt:
      "Most hospitality brand refreshes ship the logo and stop there. The systemic uplift comes from the next 90 days.",
    categorySlug: "brand-creative",
    authorSlug: "daniel-reeves",
    tagSlugs: ["branding"],
    daysAgo: 40,
    body: [
      "A brand refresh that ends at the logo unveil is a vanity project. The actual return comes from systematically applying the new identity to every customer-facing surface.",
      "Menus, packaging, social templates, ad creative, POS receipts, the website, even SMS notifications — every one is an opportunity to compound brand recognition.",
    ],
  },
];

const FAQ_CATEGORIES = [
  { name: "Engagement & pricing", slug: "engagement-pricing", order: 1 },
  { name: "Scope & timelines", slug: "scope-timelines", order: 2 },
  { name: "Process & reporting", slug: "process-reporting", order: 3 },
  { name: "Regions & languages", slug: "regions-languages", order: 4 },
];

const FAQ_ITEMS = [
  {
    categorySlug: "engagement-pricing",
    question: "Do you offer fixed-price packages or only retainers?",
    answer: [
      "We offer both. Productised packages are the cleanest way to start — fixed scope, fixed price, fixed timeline.",
      "Retainers are more common for ongoing media management and content production. Project work covers one-time engagements like web builds and brand refreshes.",
    ],
    order: 1,
  },
  {
    categorySlug: "engagement-pricing",
    question: "What's the minimum monthly spend for a paid media engagement?",
    answer: [
      "We typically need £2,500 / month media spend for Meta or Google to gather enough signal in 30 days. Below that we recommend organic-first programmes.",
    ],
    order: 2,
  },
  {
    categorySlug: "scope-timelines",
    question: "How quickly can you start an engagement?",
    answer: [
      "Productised packages start within five working days of contract sign-off. Retainers and projects typically have a 2-3 week kickoff window so the team can assemble.",
    ],
    order: 1,
  },
  {
    categorySlug: "scope-timelines",
    question: "Can you handle a venue-specific launch campaign?",
    answer: [
      "Yes — venue launches are a productised package. 6-week run-up with pre-launch capture, soft-launch optimisation, and 4 weeks of post-launch optimisation.",
    ],
    order: 2,
  },
  {
    categorySlug: "process-reporting",
    question: "How often do you report?",
    answer: [
      "Weekly written summary, monthly strategic review, quarterly business review. Real-time dashboards are always-on, viewable any time.",
    ],
    order: 1,
  },
  {
    categorySlug: "process-reporting",
    question: "Who owns the ad accounts and data?",
    answer: [
      "You do — always. We work via Business Manager access on your accounts. If we part ways, you retain everything.",
    ],
    order: 2,
  },
  {
    categorySlug: "regions-languages",
    question: "Which regions and currencies do you support?",
    answer: [
      "We invoice in GBP, USD, CAD, EUR, AUD, and AED, and our team has campaigns running across the UK, US, Canada, the EU, Australia, and the MENA region.",
    ],
    order: 1,
  },
  {
    categorySlug: "regions-languages",
    question: "Do you produce content in non-English markets?",
    answer: [
      "Yes — we have copywriting and creative teams covering English, French, Spanish, German, Italian, Dutch, Portuguese, and Arabic.",
    ],
    order: 2,
  },
];

// ---------- Idempotent upsert helper -------------------------------------

async function upsertBySlug<T extends Record<string, unknown>>(
  payload: Payload,
  collection: string,
  slug: string,
  data: T,
): Promise<{ id: string | number; created: boolean }> {
  const existing = await payload.find({
    collection: collection as never,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as { id: string | number };
    return { id: doc.id, created: false };
  }
  const created = await payload.create({
    collection: collection as never,
    data: { slug, ...data } as never,
  });
  return { id: (created as { id: string | number }).id, created: true };
}

// ---------- Main entry ---------------------------------------------------

export type SeedResult = {
  services: { created: number; total: number };
  teamMembers: { created: number; total: number };
  reviews: { created: number; total: number };
  portfolio: { created: number; total: number };
  authors: { created: number; total: number };
  blogCategories: { created: number; total: number };
  blogTags: { created: number; total: number };
  blogPosts: { created: number; total: number };
  faqCategories: { created: number; total: number };
  faqItems: { created: number; total: number };
};

export async function runSeed(payload: Payload): Promise<SeedResult> {
  // Services
  let svcCreated = 0;
  for (const svc of SERVICES) {
    const { created } = await upsertBySlug(payload, "services", svc.slug, {
      name: svc.name,
      category: svc.category,
      tagline: svc.tagline,
      summary: svc.summary,
      body: richText(svc.body),
      status: "published",
    });
    if (created) svcCreated++;
  }

  // Team members
  let teamCreated = 0;
  for (const m of TEAM_MEMBERS) {
    const { created } = await upsertBySlug(payload, "team-members", m.slug, {
      name: m.name,
      role: m.role,
      bio: m.bio,
      order: m.order,
    });
    if (created) teamCreated++;
  }

  // Reviews
  let reviewsCreated = 0;
  for (const r of REVIEWS) {
    const existing = await payload.find({
      collection: "reviews",
      where: {
        and: [
          { personName: { equals: r.personName } },
          { businessName: { equals: r.businessName } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    await payload.create({ collection: "reviews", data: r as never });
    reviewsCreated++;
  }

  // Portfolio
  let portfolioCreated = 0;
  for (const p of PORTFOLIO) {
    const { created } = await upsertBySlug(payload, "portfolio", p.slug, {
      title: p.title,
      client: p.client,
      industry: p.industry,
      country: p.country,
      summary: p.summary,
      outcomes: p.outcomes,
      body: richText(p.body),
      status: "published",
    });
    if (created) portfolioCreated++;
  }

  // Authors
  const authorIdBySlug = new Map<string, string | number>();
  let authorsCreated = 0;
  for (const a of AUTHORS) {
    const { id, created } = await upsertBySlug(payload, "authors", a.slug, {
      name: a.name,
      role: a.role,
      bio: a.bio,
    });
    authorIdBySlug.set(a.slug, id);
    if (created) authorsCreated++;
  }

  // Blog categories
  const blogCategoryIdBySlug = new Map<string, string | number>();
  let bcCreated = 0;
  for (const c of BLOG_CATEGORIES) {
    const { id, created } = await upsertBySlug(payload, "blog-categories", c.slug, {
      name: c.name,
    });
    blogCategoryIdBySlug.set(c.slug, id);
    if (created) bcCreated++;
  }

  // Blog tags
  const blogTagIdBySlug = new Map<string, string | number>();
  let btCreated = 0;
  for (const t of BLOG_TAGS) {
    const { id, created } = await upsertBySlug(payload, "blog-tags", t.slug, {
      name: t.name,
    });
    blogTagIdBySlug.set(t.slug, id);
    if (created) btCreated++;
  }

  // Blog posts
  let bpCreated = 0;
  for (const p of BLOG_POSTS) {
    const authorId = authorIdBySlug.get(p.authorSlug);
    const categoryId = blogCategoryIdBySlug.get(p.categorySlug);
    if (!authorId || !categoryId) continue;
    const tagIds = p.tagSlugs
      .map((s) => blogTagIdBySlug.get(s))
      .filter((v): v is string | number => v !== undefined);
    const publishedAt = new Date(Date.now() - p.daysAgo * 86400000).toISOString();
    const { created } = await upsertBySlug(payload, "blog-posts", p.slug, {
      title: p.title,
      excerpt: p.excerpt,
      author: authorId,
      category: categoryId,
      tags: tagIds,
      body: richText(p.body),
      status: "published",
      publishedAt,
      featured: p.featured ?? false,
      pinned: p.pinned ?? false,
    });
    if (created) bpCreated++;
  }

  // FAQ categories
  const faqCategoryIdBySlug = new Map<string, string | number>();
  let fcCreated = 0;
  for (const c of FAQ_CATEGORIES) {
    const { id, created } = await upsertBySlug(payload, "faq-categories", c.slug, {
      name: c.name,
      order: c.order,
    });
    faqCategoryIdBySlug.set(c.slug, id);
    if (created) fcCreated++;
  }

  // FAQ items
  let fiCreated = 0;
  for (const i of FAQ_ITEMS) {
    const categoryId = faqCategoryIdBySlug.get(i.categorySlug);
    if (!categoryId) continue;
    const existing = await payload.find({
      collection: "faq-items",
      where: { question: { equals: i.question } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) continue;
    await payload.create({
      collection: "faq-items",
      data: {
        category: categoryId,
        question: i.question,
        answer: richText(i.answer),
        order: i.order,
      } as never,
    });
    fiCreated++;
  }

  return {
    services: { created: svcCreated, total: SERVICES.length },
    teamMembers: { created: teamCreated, total: TEAM_MEMBERS.length },
    reviews: { created: reviewsCreated, total: REVIEWS.length },
    portfolio: { created: portfolioCreated, total: PORTFOLIO.length },
    authors: { created: authorsCreated, total: AUTHORS.length },
    blogCategories: { created: bcCreated, total: BLOG_CATEGORIES.length },
    blogTags: { created: btCreated, total: BLOG_TAGS.length },
    blogPosts: { created: bpCreated, total: BLOG_POSTS.length },
    faqCategories: { created: fcCreated, total: FAQ_CATEGORIES.length },
    faqItems: { created: fiCreated, total: FAQ_ITEMS.length },
  };
}
