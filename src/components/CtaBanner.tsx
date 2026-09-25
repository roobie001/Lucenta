import Link from "next/link";
import { Container } from "./ui/Container";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-dot-texture py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Interested in being a pilot partner?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-ink/70">
            We are seeking pilot partners among healthcare providers. Tell us
            about your imaging department and we&apos;ll take it from there.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-md bg-teal px-7 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
            >
              Become a Pilot Partner
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
