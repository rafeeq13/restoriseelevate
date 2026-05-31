import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { getCurrentCustomer } from "@/lib/auth";
import { getPayloadSafe } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false, follow: false },
};

type Address = {
  id: string | number;
  label?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
};

export default async function AddressesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/sign-in`);

  let addresses: Address[] = [];
  const payload = await getPayloadSafe();
  if (payload) {
    try {
      const res = await payload.find({
        collection: "customer-addresses",
        where: { customer: { equals: customer.id } },
        limit: 50,
      });
      addresses = res.docs as unknown as Address[];
    } catch {
      addresses = [];
    }
  }

  return (
    <>
      <PageHeader eyebrow="Account" title="Saved addresses" />
      <Container className="py-16">
        {addresses.length === 0 ? (
          <p className="text-ink-muted">
            You haven&apos;t saved any addresses yet. Addresses you enter at
            checkout will appear here.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-5"
              >
                {a.label && (
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                    {a.label}
                  </p>
                )}
                <p className="mt-1 font-display text-base font-extrabold text-ink">
                  {a.fullName}
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}
                  <br />
                  {a.city}
                  {a.region ? `, ${a.region}` : ""} {a.postalCode}
                  <br />
                  {a.country}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
