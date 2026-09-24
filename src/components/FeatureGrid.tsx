import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";

const features = [
  {
    title: "DICOM Compatibility",
    description:
      "Native support for DICOM studies across modalities, with direct PACS integration so imaging teams don't change how they work.",
    tag: "Interoperability",
  },
  {
    title: "Privacy by Design",
    description:
      "Patient data is de-identified at intake, encrypted in transit and at rest, and never leaves your infrastructure boundary without consent.",
    tag: "Security",
  },
  {
    title: "Pilot Program",
    description:
      "A structured, low-risk onboarding path for health systems to validate Lucentaa against their own studies before wider rollout.",
    tag: "Adoption",
  },
  {
    title: "Clinical Validation",
    description:
      "Every model is benchmarked against radiologist-annotated datasets and reviewed for performance before it reaches a worklist.",
    tag: "Evidence",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-b border-white/10 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built for real clinical environments.
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            Lucentaa is designed around the constraints that matter most in
            healthcare — compatibility, privacy, evidence, and a safe path to
            adoption.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:bg-white/[0.04] hover:shadow-glow-teal sm:p-7"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-teal-light">
                {feature.tag}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
