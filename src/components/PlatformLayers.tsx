import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";
import { Pill } from "./ui/Pill";

const layers = [
  {
    label: "01 / Intake (planned)",
    title: "Imaging Intake",
    description:
      "The plan is for studies to arrive by DICOM upload or from a hospital's PACS, with identifying details stripped and images normalized. The radiology team's routine would stay as it is.",
    tags: ["PACS Integration", "DICOM Parsing", "Auto De-identification"],
  },
  {
    label: "02 / Analysis (planned)",
    title: "AI Analysis Engine",
    description:
      "The AI models we are aiming to build would read each X-ray, CT, or MRI series, mark regions that may matter, and attach a confidence score to every detection.",
    tags: ["Multi-Modality Models", "Region Detection", "Confidence Scoring"],
  },
  {
    label: "03 / Review (planned)",
    title: "Clinical Review Layer",
    description:
      "In the intended design, flagged findings open in a viewer made for radiologists, with a prioritized worklist and overlays on the image. The radiologist confirms or dismisses each one, then signs off.",
    tags: ["Prioritized Worklist", "Annotated Overlays", "Audit Trail"],
  },
];

export function PlatformLayers() {
  return (
    <section className="border-b border-white/10 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Planned Design</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Three stages between the scanner and the report.
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            This is the design we are working toward. Each stage has one job:
            studies come in, the models look at them, and a radiologist decides
            what stands. None of it is built yet.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-6">
          {layers.map((layer) => (
            <div
              key={layer.title}
              className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:shadow-glow-teal sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-teal-light">
                    {layer.label}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-ink sm:text-2xl">
                    {layer.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65">
                    {layer.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {layer.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
