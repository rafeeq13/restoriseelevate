import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Services } from "./collections/Services";
import { TeamMembers } from "./collections/TeamMembers";
import { Portfolio } from "./collections/Portfolio";
import { Reviews } from "./collections/Reviews";
import { Authors } from "./collections/Authors";
import { BlogCategories } from "./collections/BlogCategories";
import { BlogTags } from "./collections/BlogTags";
import { BlogPosts } from "./collections/BlogPosts";
import { FAQCategories } from "./collections/FAQCategories";
import { FAQItems } from "./collections/FAQItems";
import { Leads } from "./collections/Leads";
import { Translations } from "./collections/Translations";
import { Customers } from "./collections/Customers";
import { CustomerAddresses } from "./collections/CustomerAddresses";
import { ProductCategories } from "./collections/ProductCategories";
import { Products } from "./collections/Products";
import { FulfillmentPartners } from "./collections/FulfillmentPartners";
import { Orders } from "./collections/Orders";
import { Carts } from "./collections/Carts";
import { PromoCodes } from "./collections/PromoCodes";
import { ArtworkFiles } from "./collections/ArtworkFiles";
import { DesignProjects } from "./collections/DesignProjects";
import { QuoteRequests } from "./collections/QuoteRequests";
import { SiteSettings } from "./globals/SiteSettings";
import { Navigation } from "./globals/Navigation";
import { Footer } from "./globals/Footer";
import { LeadFormSettings } from "./globals/LeadFormSettings";
import { CommerceSettings } from "./globals/CommerceSettings";
import { ShippingZones } from "./globals/ShippingZones";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/* ---------------------------------------------------------------------------
 * Locales — Phase 1, section 4.5.1 of the Project Brief.
 * English is the editorial source. Six additional first-class languages are
 * managed per-page in the CMS. All other languages are resolved at request
 * time via the translation API fallback (DeepL / Google), and may be
 * overridden in the CMS via the Translations module.
 * -------------------------------------------------------------------------*/
export const SUPPORTED_LOCALES = [
  { label: "English", code: "en" },
  { label: "German", code: "de" },
  { label: "French", code: "fr" },
  { label: "Spanish", code: "es" },
  { label: "Italian", code: "it" },
  { label: "Dutch", code: "nl" },
  { label: "Portuguese", code: "pt" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

const databaseUri =
  process.env.DATABASE_URI ?? process.env.POSTGRES_URL ?? "";

const payloadSecret = process.env.PAYLOAD_SECRET ?? "";

if (!payloadSecret) {
  // Throw at runtime in production; warn in dev so the developer can boot the
  // server during initial setup before .env is finalized.
  if (process.env.NODE_ENV === "production") {
    throw new Error("PAYLOAD_SECRET is required in production.");
  } else {
    console.warn(
      "[payload] PAYLOAD_SECRET is empty. Set it in .env.local before first login.",
    );
  }
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  secret: payloadSecret || "dev-only-insecure-secret-replace-me",

  admin: {
    user: Users.slug,
    // Lock the panel to the light theme — brand identity is white + red.
    theme: "light",
    meta: {
      titleSuffix: " — Restorise Admin",
    },
    components: {
      // Brand mark in the LEFT sidebar (top, above nav links). Sized via
      // .restorise-nav-brand in custom.scss.
      beforeNavLinks: ["@/components/admin/BrandNav#default"],
      graphics: {
        // Login page logo (centered, full horizontal mark).
        Logo: "@/components/admin/BrandLogo#default",
        // Suppress the small breadcrumb icon — the wordmark is in the
        // sidebar instead, where it has room to breathe.
        Icon: "@/components/admin/BrandIcon#default",
      },
    },
  },

  editor: lexicalEditor({}),

  collections: [
    Users,
    Media,
    Pages,
    Services,
    TeamMembers,
    Portfolio,
    Reviews,
    Authors,
    BlogCategories,
    BlogTags,
    BlogPosts,
    FAQCategories,
    FAQItems,
    Leads,
    Translations,
    Customers,
    CustomerAddresses,
    ProductCategories,
    Products,
    FulfillmentPartners,
    Orders,
    Carts,
    PromoCodes,
    ArtworkFiles,
    DesignProjects,
    QuoteRequests,
  ],

  globals: [
    SiteSettings,
    Navigation,
    Footer,
    LeadFormSettings,
    CommerceSettings,
    ShippingZones,
  ],

  plugins: [
    // Cloud media storage. Active when S3_BUCKET + S3_ACCESS_KEY_ID are set.
    // Works with AWS S3, Cloudflare R2, Supabase Storage (S3-compatible),
    // Backblaze B2, or any other S3-compatible endpoint via S3_ENDPOINT.
    ...(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              region: process.env.S3_REGION ?? "auto",
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
              },
            },
          }),
        ]
      : []),
  ],

  // i18n — see SUPPORTED_LOCALES above.
  localization: {
    locales: SUPPORTED_LOCALES.map(({ label, code }) => ({ label, code })),
    defaultLocale: "en",
    fallback: true,
  },

  // Dev convenience: if DATABASE_URI is not set, fall back to a local SQLite
  // file at ./payload-dev.db so the developer can boot without provisioning
  // Postgres. Production deployments MUST set DATABASE_URI to a Postgres URL.
  db: databaseUri
    ? postgresAdapter({
        pool: { connectionString: databaseUri },
        push: process.env.NODE_ENV !== "production",
      })
    : sqliteAdapter({
        client: { url: "file:./payload-dev.db" },
        push: true,
      }),

  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress:
          process.env.SMTP_FROM_ADDRESS ?? "no-reply@restorise.local",
        defaultFromName: process.env.SMTP_FROM_NAME ?? "Restorise",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, "schema.graphql"),
  },

  // Trust the SITE_URL origin plus localhost for dev/preview.
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? "", "http://localhost:3000"].filter(
    Boolean,
  ) as string[],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? "", "http://localhost:3000"].filter(
    Boolean,
  ) as string[],
});
