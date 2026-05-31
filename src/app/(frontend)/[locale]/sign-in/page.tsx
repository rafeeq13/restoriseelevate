import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { SignInForm } from "@/components/commerce/SignInForm";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
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
            Sign in
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Access your order history, saved designs, and addresses.
          </p>
        </div>
        <div className="mt-10">
          <SignInForm />
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">
          New to Restorise?{" "}
          <Link
            href="/sign-up"
            className="text-ink underline underline-offset-4"
          >
            Create an account
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
