import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Careers | Lucentaa",
  description: "Lucentaa isn't hiring right now. Check back later, or write to us.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="We're not actively hiring yet."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <p className="text-base leading-relaxed text-ink/70">
              Lucentaa is a small team and we don&apos;t have open roles right
              now. That may change as the project grows. Check back later, or
              email us if you&apos;d like us to keep you in mind for future
              openings.
            </p>
            <a
              href="mailto:careers@lucentaa.com"
              className="mt-6 inline-block font-mono text-sm text-teal-light transition-colors hover:text-teal-light/80"
            >
              careers@lucentaa.com
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
