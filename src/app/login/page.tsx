import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Log In — Lucenta",
  description: "Lucenta account access is coming soon.",
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden bg-grid-texture py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <Eyebrow>Account</Eyebrow>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-ink">
            Log in — coming soon
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Lucenta accounts aren&apos;t open yet. We&apos;re building
            authentication and secure access alongside our pilot program.
            Reach out if you&apos;d like early access.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-teal/40 hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
