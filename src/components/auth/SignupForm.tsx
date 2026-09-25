"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  FieldError,
  NotConfiguredNotice,
  authInputClass,
  authLabelClass,
} from "./AuthShell";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
};

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    const next: Errors = {};
    if (!email) next.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter a password.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!confirm) next.confirm = "Confirm your password.";
    else if (password !== confirm) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!isSupabaseConfigured) {
      setErrors({ form: "Authentication isn't configured yet." });
      return;
    }

    setLoading(true);
    try {
      const { data: result, error } = await createClient().auth.signUp({
        email,
        password,
      });
      if (error) {
        const m = error.message.toLowerCase();
        if (m.includes("already registered") || m.includes("already exists")) {
          setErrors({ email: "An account with this email already exists." });
        } else if (m.includes("password")) {
          setErrors({ password: error.message });
        } else {
          setErrors({ form: error.message });
        }
        return;
      }

      // With email confirmation on, an existing address returns a user with
      // no identities instead of an error.
      if (result.user && result.user.identities?.length === 0) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }

      if (result.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setConfirmEmail(email);
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (confirmEmail) {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal/[0.04] p-6 text-center shadow-glow-teal">
        <h2 className="text-lg font-bold text-ink">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          We sent a confirmation link to{" "}
          <span className="font-mono text-teal-light">{confirmEmail}</span>.
          Click it to activate your account, then log in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
        >
          Go to Log In
        </Link>
      </div>
    );
  }

  return (
    <>
      {!isSupabaseConfigured && <NotConfiguredNotice />}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <p
            role="alert"
            className="rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber-light"
          >
            {errors.form}
          </p>
        )}

        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={authInputClass}
            placeholder="you@hospital.org"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={authInputClass}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          />
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div>
          <label htmlFor="confirm" className={authLabelClass}>
            Confirm Password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            className={authInputClass}
          />
          <FieldError id="confirm-error" message={errors.confirm} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-light hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </>
  );
}
