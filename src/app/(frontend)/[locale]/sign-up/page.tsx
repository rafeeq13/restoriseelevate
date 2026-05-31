import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { SignUpForm } from "@/components/commerce/SignUpForm";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Link href="/" aria-label="Restorise Business Solutions">
            <Image
              src="/brand/logo-stacked.webp"
              alt="Restorise Business Solutions"
              width={280}
              height={120}
              priority
              className="mx-auto h-20 w-auto"
            />
          </Link>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Save designs, track orders, and check out faster next time.
          </p>
        </div>
        <div className="mt-10">
          <SignUpForm />
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-ink underline underline-offset-4"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
