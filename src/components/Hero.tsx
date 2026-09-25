import Link from "next/link";
import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";

const badges = [
  "Early Concept",
  "Seeking Pilot Partners",
  "DICOM Compatibility Planned",
  "Based in Lagos, Nigeria",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-grid-texture">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Early Concept</Eyebrow>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            We&apos;re designing a first pass
            <br />
            <span className="text-teal-light">for every imaging study.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink/70 sm:text-lg">
            Lucentaa is a concept for an AI tool that would flag candidate
            findings on X-ray, CT, and MRI studies and move the urgent ones up
            the worklist. A radiologist would review every flag before anything
            reached a report. It is at an early stage, and we are seeking pilot
            partners among healthcare providers.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal sm:w-auto"
            >
              Become a Pilot Partner
            </Link>
            <Link
              href="/product"
              className="w-full rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-teal/40 hover:bg-white/10 sm:w-auto"
            >
              See the Concept
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
          {badges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink/50"
            >
              <span className="h-1 w-1 rounded-full bg-teal/70" />
              {badge}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
