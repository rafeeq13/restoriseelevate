import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Link } from "@/i18n/navigation";
import { getCurrentCustomer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/sign-in`);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title={`Hi${customer.firstName ? `, ${customer.firstName}` : ""}.`}
        description={customer.email}
      />
      <Container className="py-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/account/orders", label: "Orders", desc: "Order history, status, and tracking." },
            { href: "/account/addresses", label: "Addresses", desc: "Saved billing and shipping addresses." },
            { href: "/account/designs", label: "Designs", desc: "Approved artwork and revision threads." },
          ].map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="block rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-5 transition hover:border-[color:var(--brand-primary)]"
              >
                <p className="font-display text-base font-extrabold text-ink">
                  {card.label}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{card.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
