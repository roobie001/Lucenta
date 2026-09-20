import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Careers — Lucenta",
  description: "Lucenta isn't actively hiring yet — check back soon.",
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
              Lucenta is a small, early-stage team and we don&apos;t have open
              roles right now. That will change as the pilot program grows —
              check back soon, or reach out if you&apos;d like to get on our
              radar for future openings.
            </p>
            <a
              href="mailto:careers@lucenta.health"
              className="mt-6 inline-block font-mono text-sm text-teal-light transition-colors hover:text-teal-light/80"
            >
              careers@lucenta.health
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
