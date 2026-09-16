import { Container } from "./ui/Container";

export function CtaBanner() {
  return (
    <section id="about" className="relative overflow-hidden border-b border-white/10 bg-dot-texture py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Give your radiologists an AI second opinion, on every study.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-ink/70">
            Talk to the Lucenta team about running a pilot in your imaging
            department.
          </p>
          <div className="mt-8">
            <a
              href="#get-started"
              className="inline-block rounded-md bg-teal px-7 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
