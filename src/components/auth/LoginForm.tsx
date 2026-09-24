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

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Incorrect email or password. If you don't have an account yet, sign up first.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox for the confirmation link.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: typeof errors = {};
    if (!email) next.email = "Enter your email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!isSupabaseConfigured) {
      setErrors({ form: "Authentication isn't configured yet." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrors({ form: friendlyError(error.message) });
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
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
            placeholder="jane@hospital.org"
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
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={authInputClass}
          />
          <FieldError id="password-error" message={errors.password} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log In"}
        </button>

        <p className="text-center text-sm text-ink/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal-light hover:underline">
            Get started
          </Link>
        </p>
      </form>
    </>
  );
}
