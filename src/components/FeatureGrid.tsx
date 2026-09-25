import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";

const features = [
  {
    title: "DICOM Compatibility",
    description:
      "The plan is to read standard DICOM studies from X-ray, CT, and MRI, with PACS integration so a team can keep working the way it does now.",
    tag: "Interoperability",
  },
  {
    title: "Patient Privacy",
    description:
      "Data protection practices are being designed in line with applicable regulations, including Nigeria's NDPR, as the platform moves toward pilot testing.",
    tag: "Data Protection",
  },
  {
    title: "Pilot Program",
    description:
      "We are seeking pilot partners among healthcare providers. A pilot would run on your own studies, with success criteria agreed up front.",
    tag: "Adoption",
  },
  {
    title: "Planned Validation",
    description:
      "Nothing has been clinically tested yet. We plan to work directly with radiologists during pilot testing to validate the platform's outputs.",
    tag: "Validation",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-b border-white/10 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Design Goals</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            The questions imaging departments ask first.
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            Will it work with our systems? Where does the patient data go? Can
            we try it without risk? These are the questions we are designing
            around.
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
