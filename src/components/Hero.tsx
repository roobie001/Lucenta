import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";

const badges = [
  "DICOM Native",
  "HIPAA-Aware Architecture",
  "SOC 2 Type II — In Progress",
  "Built With Radiologists",
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10 bg-grid-texture"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Platform</Eyebrow>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Read every scan with
            <br />
            <span className="text-teal-light">an AI second opinion.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink/70 sm:text-lg">
            Lucenta is an AI-assisted clinical decision-support platform that
            helps healthcare professionals review X-rays, CT scans, and MRIs
            faster and with greater confidence — surfacing findings, flagging
            regions of interest, and prioritizing studies that need attention
            first.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#get-started"
              className="w-full rounded-md bg-teal px-6 py-3 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal sm:w-auto"
            >
              Request a Demo
            </a>
            <a
              href="#platform"
              className="w-full rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-teal/40 hover:bg-white/10 sm:w-auto"
            >
              See the Platform
            </a>
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
