# Deploying to Vercel + Supabase → `restorisebusinesssolutions.com`

This is the **shortest possible path** to get the site live on your custom
domain. The whole flow takes **~10 minutes** plus DNS propagation wait.

## What you (the human) MUST do

These steps require your accounts / your browser session / your DNS.
Nobody else can perform them on your behalf — they need your login.

---

## Step 1 — Supabase: copy the pooler connection string

1. Open your Supabase project → **Connect** button (top-right)
2. Choose **Connection string** → **Transaction pooler** (port `6543`)
3. Copy the URI. It looks like:
   ```
   postgresql://postgres.abcdxyz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your real Supabase DB password (you set
   it when you created the project).
5. **Append** these query params so Payload works with PgBouncer:
   ```
   ?pgbouncer=true&connection_limit=1
   ```
   Final URI looks like:
   ```
   postgresql://postgres.abcdxyz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

> **Why pooler?** Vercel runs as serverless functions; each invocation can
> open a new connection. The pooler (PgBouncer) protects Supabase from
> connection exhaustion. The two query params disable prepared statements
> which PgBouncer's transaction mode doesn't support.

Keep this URI on your clipboard — you'll paste it into Vercel next.

---

## Step 2 — Vercel: import the GitHub repo

1. Go to <https://vercel.com/new>
2. Click **Import Git Repository** → select `rafeeq13/restoriseelevate`
3. Project Settings (left side):
   - **Framework Preset**: `Next.js` (auto-detected — leave it)
   - **Root Directory**: `./` (default — leave it)
   - **Build Command**: leave default (`npm run build`)
   - **Output Directory**: leave default (`.next`)
   - **Install Command**: leave default (`npm install`)
   - **Node.js Version** (under Build & Deployment after first deploy):
     `22.x`

**Do NOT click Deploy yet** — env vars first.

---

## Step 3 — Vercel: add 3 environment variables

Expand the **Environment Variables** section on the import page and add
all three. Make sure each is enabled for **Production, Preview, AND
Development** (all checkboxes).

| Variable | Value |
|---|---|
| `DATABASE_URI` | The Supabase pooler URI from Step 1 (with `?pgbouncer=true&connection_limit=1`) |
| `PAYLOAD_SECRET` | `Y9e25WUPpkHorxWn4JABxB5CY1GMRCugSEzUrSU1tlw=` *(or generate a new one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)* |
| `NEXT_PUBLIC_SITE_URL` | `https://restorisebusinesssolutions.com` |

Optional later (skip for first deploy — they only enable extra features):
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` → enables transactional email
- `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`
  → enables cloud media uploads (Supabase Storage / Cloudflare R2 / S3).
  See `.env.example` for the full list — they don't block first deploy.

---

## Step 4 — Deploy

Click **Deploy**. First build takes 2–4 minutes.

When it finishes Vercel gives you a temp URL like
`restoriseelevate-xyz.vercel.app`. **Open it.**

- Home page should load with the Aurora hero.
- Click around — About, Services, Portfolio, Contact, etc. should all
  render. They'll show empty CMS data ("coming soon" copy) which is
  expected — you haven't added content yet.
- Test `/admin` — the Payload login screen should load.

If the temp URL works, you're 80% done. Move to Step 5.

If the build fails or the temp URL errors, see **Troubleshooting** below.

---

## Step 5 — Vercel: add the custom domain

1. In your Vercel project → **Settings → Domains**
2. Type `restorisebusinesssolutions.com` → **Add**
3. Vercel prompts for either:
   - **Nameservers** (move them to Vercel) — clean but you lose Hostinger
     email/DNS control
   - **A + CNAME records** (keep Hostinger nameservers) — recommended
     because you still want Hostinger to manage your domain

Pick **A + CNAME records**. Vercel will show you:
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

(Vercel sometimes shows a slightly different IP — use whatever it gives
you, not the snippet above.)

---

## Step 6 — Hostinger: fix nameservers + add DNS records

Your domain right now points to `ns1.dns-parking.com` (the parking
service). Until you switch off parking, the DNS Zone Editor won't
accept records.

### 6a. Switch off parking
1. Hostinger hPanel → **Domains** (sidebar) → `restorisebusinesssolutions.com` → **Manage**
2. **Nameservers** section → **Change nameservers** → choose
   **Use Hostinger nameservers**:
   - `ns1.hostinger.com`
   - `ns2.hostinger.com`
3. Save. Wait **5–30 minutes** for nameserver change to propagate.

### 6b. Add the Vercel records
1. Hostinger hPanel → **Domains → DNS / Nameservers → DNS Zone Editor**
2. **Delete** any existing A records with name `@` or empty (they're from
   the parking page — they'll point you back to dns-parking.com)
3. **Add** these two records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` *(use the IP Vercel showed you in Step 5)* | 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

Save.

---

## Step 7 — Wait + verify

- Back in Vercel → **Settings → Domains** → status will flip from
  *"Invalid Configuration"* to **`Valid Configuration`** ✓ once DNS
  propagates (usually under 30 minutes).
- SSL certificate is issued **automatically** by Vercel (Let's Encrypt).
  No manual step.
- Open <https://restorisebusinesssolutions.com> — site is live.

---

## After it's live

### Create the Super Admin user
1. Open <https://restorisebusinesssolutions.com/admin>
2. You'll see the **Create First User** screen (this only appears once,
   on a fresh empty DB).
3. Enter your email + a strong password. This user is automatically the
   Super Admin.
4. Log in. Populate the CMS:
   - **Site Settings** → tagline, contact email, geographic scope
   - **Navigation** → header links + CTA label
   - **Footer** → columns, legal links, copyright
   - **Services**, **Portfolio**, **Reviews**, **Team**, **FAQ**, **Blog Posts**

### Lock down the schema (later, optional)
The current `payload.config.ts` runs `push: true` in production. This is
fine for an empty database but risky once you have real data — schema
changes in code could drift the live DB silently.

When you're ready, run locally:
```powershell
cd restorise-web
npx payload migrate:create
```
This generates timestamped SQL migration files in `src/migrations/`.
Commit them, then flip `push: true` back to:
```ts
push: process.env.NODE_ENV !== "production",
```
And update the Vercel build command to:
```
npx payload migrate && next build
```

---

## Troubleshooting

### Build fails on Vercel with `Cannot find module ...`
Most often: `node_modules` not installed properly. In Vercel dashboard →
**Project Settings → Functions** check Node version is `22.x`. If still
broken, **Deployments → ... → Redeploy** and tick "Clear cache".

### `DATABASE_URI` errors / "prepared statement does not exist"
Your URI is missing the pgbouncer params. Edit the env var in Vercel →
make sure it ends with `?pgbouncer=true&connection_limit=1`. Redeploy.

### `PAYLOAD_SECRET is required in production`
You forgot to set it as an env var, or set it for the wrong environment.
In Vercel → **Settings → Environment Variables** make sure
`PAYLOAD_SECRET` is checked for **Production**.

### Site loads but `/admin` 500s
Most likely the Postgres URI password has a special character that
needs URL-encoding. Re-encode the password in the URI:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

### Domain status stuck on "Invalid Configuration"
DNS not propagated yet. Test from your terminal:
```powershell
nslookup restorisebusinesssolutions.com 8.8.8.8
```
Should return `76.76.21.21` (or whatever Vercel told you). If it still
shows a parking IP, your nameserver switch hasn't propagated — wait
longer (up to 24h for global DNS, usually <1h).

### Logo / images broken on home page
The hero uses `/brand/hero-image.jpg`. Confirm the file is present in
`public/brand/`. It should be — it was in the initial commit.

### Lead form submissions not arriving by email
Email is opt-in. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`SMTP_FROM_ADDRESS` env vars in Vercel and redeploy. Without those, the
form still saves to the Leads collection in the admin panel — you'll see
submissions there even without email.

### Media uploads failing in /admin
Vercel serverless filesystem is read-only. To enable uploads, configure
cloud storage in env vars (see `.env.example` → S3 section). You can
point this at Supabase Storage (S3-compatible), Cloudflare R2, or AWS S3.

---

## Quick env var reference

Three required for first deploy:

```bash
DATABASE_URI=postgresql://postgres.xxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
PAYLOAD_SECRET=Y9e25WUPpkHorxWn4JABxB5CY1GMRCugSEzUrSU1tlw=
NEXT_PUBLIC_SITE_URL=https://restorisebusinesssolutions.com
```

Everything else in `.env.example` is optional and unlocks specific
features (email, CRM, analytics, commerce) as you need them.
