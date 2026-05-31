"use client";

import { useState } from "react";

export function SignUpForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof (data as { message?: string })?.message === "string"
            ? (data as { message: string }).message
            : "Could not create your account.",
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-6 text-center">
        <p className="font-display text-lg font-extrabold text-ink">
          Check your email
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          We&apos;ve sent a verification link to <strong>{form.email}</strong>.
          Click the link to confirm and finish signing in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">First name</span>
          <input
            type="text"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Last name</span>
          <input
            type="text"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastName: e.target.value }))
            }
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-ink">Business name</span>
        <input
          type="text"
          autoComplete="organization"
          value={form.businessName}
          onChange={(e) =>
            setForm((f) => ({ ...f, businessName: e.target.value }))
          }
          className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink">Password</span>
        <input
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
        />
        <span className="mt-1 block text-xs text-ink-muted">
          Minimum 12 characters. Checked against breached-password lists.
        </span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-[color:var(--brand-danger)]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-brand px-6 text-sm font-semibold text-brand-contrast hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
