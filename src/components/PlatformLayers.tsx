import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";
import { Pill } from "./ui/Pill";

const layers = [
  {
    label: "01 — Intake",
    title: "Imaging Intake",
    description:
      "Studies stream in directly from PACS or DICOM upload, auto-routed and normalized for analysis without disrupting existing radiology workflows.",
    tags: ["PACS Integration", "DICOM Parsing", "Auto De-identification"],
  },
  {
    label: "02 — Analysis",
    title: "AI Analysis Engine",
    description:
      "Purpose-built models scan X-ray, CT, and MRI series for findings, measuring regions of interest and scoring confidence for every detection.",
    tags: ["Multi-Modality Models", "Region Detection", "Confidence Scoring"],
  },
  {
    label: "03 — Review",
    title: "Clinical Review Layer",
    description:
      "Findings surface inside a radiologist-facing viewer with prioritized worklists, annotated overlays, and one-click sign-off.",
    tags: ["Prioritized Worklist", "Annotated Overlays", "Audit Trail"],
  },
];

export function PlatformLayers() {
  return (
    <section id="platform" className="border-b border-white/10 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Architecture</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            A layered platform, built for the reading room.
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            Each layer of Lucenta handles one part of the imaging pipeline —
            from intake to sign-off — so radiologists stay in control at
            every step.
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
