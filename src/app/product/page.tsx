import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Product — Lucenta",
  description:
    "How Lucenta works: from study upload to AI analysis to clinical review, across X-ray, CT, MRI, and reporting workflows.",
};

const workflowSteps = [
  {
    step: "01",
    title: "Upload",
    description:
      "Studies arrive via DICOM upload or direct PACS integration, automatically de-identified and normalized for the analysis pipeline.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Pilot models scan the study for candidate findings, flag regions of interest, and attach a confidence score to each detection.",
  },
  {
    step: "03",
    title: "Clinical Review",
    description:
      "A radiologist reviews every AI-flagged finding inside a dedicated viewer, confirms or dismisses it, and signs off before it reaches a report.",
  },
];

const useCases = [
  {
    tag: "X-Ray",
    title: "Chest & Musculoskeletal X-Ray",
    description:
      "Supports review of common chest and MSK X-ray studies, highlighting regions that may warrant closer attention during read.",
  },
  {
    tag: "CT",
    title: "CT Triage Support",
    description:
      "Helps prioritize incoming CT studies by surfacing potential findings early, so higher-urgency scans can be reviewed sooner.",
  },
  {
    tag: "MRI",
    title: "MRI Series Review",
    description:
      "Assists with navigating multi-series MRI studies by organizing findings alongside the relevant slices and sequences.",
  },
  {
    tag: "Reporting",
    title: "Structured Reporting Assist",
    description:
      "Drafts structured summary fields from confirmed findings to reduce manual transcription — every field remains fully editable.",
  },
];

const sampleFindings = [
  { label: "Finding", value: "Pulmonary nodule, right upper lobe", tone: "amber" as const },
  { label: "Confidence", value: "94.2%", tone: "teal" as const },
  { label: "Region", value: "RUL — Segment 3", tone: "neutral" as const },
  { label: "Status", value: "Pending radiologist review", tone: "amber" as const },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product"
        title="From incoming scan to a reviewed finding."
        description="Lucenta is built around the existing radiology workflow — imaging teams keep their tools, and AI-assisted analysis slots in between upload and sign-off."
      />

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Workflow</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Upload → AI Analysis → Clinical Review
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              Three stages, one pipeline. Every study passes through the same
              path, and a radiologist always has final say.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {workflowSteps.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:shadow-glow-teal">
                  <span className="font-mono text-xs uppercase tracking-widest text-teal-light">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    {item.description}
                  </p>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="pointer-events-none absolute -right-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-r from-teal/60 to-transparent sm:block" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-white/[0.015] py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Use Cases</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built across modalities.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              Lucenta&apos;s pilot models are being developed and validated
              across the imaging types that make up the bulk of daily
              reading-room volume.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:bg-white/[0.04] hover:shadow-glow-teal sm:p-7"
              >
                <Pill>{useCase.tag}</Pill>
                <h3 className="mt-4 text-lg font-bold text-ink sm:text-xl">
                  {useCase.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Interface</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              A preview of the analysis view.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              A styled mockup of the clinical review interface, shown with
              sample data for illustration.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Pill tone="amber">Sample Data — Not a Live Patient Record</Pill>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-100/60 p-6 sm:p-10">
              <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                      Incoming Study
                    </span>
                    <Pill tone="amber">New</Pill>
                  </div>
                  <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-white/15 bg-navy/60">
                    <span className="font-mono text-xs text-ink/40">
                      CT_CHEST_0417.dcm
                    </span>
                  </div>
                  <div className="mt-4 space-y-1.5 font-mono text-xs text-ink/50">
                    <p>Modality: CT</p>
                    <p>Patient ID: ****3821 (demo)</p>
                    <p>Series: 3 / Slices: 214</p>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-3 py-2 lg:flex-col lg:py-0">
                  <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-teal/60 lg:block" />
                  <span className="block h-10 w-px bg-gradient-to-b from-transparent to-teal/60 lg:hidden" />
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-teal/50 bg-teal/10 shadow-glow-teal">
                    <span className="font-mono text-sm font-bold text-teal-light">
                      AI
                    </span>
                  </div>
                  <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-teal/60 lg:block" />
                  <span className="block h-10 w-px bg-gradient-to-t from-transparent to-teal/60 lg:hidden" />
                </div>

                <div className="rounded-xl border border-teal/30 bg-teal/[0.04] p-5 shadow-glow-teal">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                      AI Summary (Demo)
                    </span>
                    <Pill tone="teal">Processed</Pill>
                  </div>
                  <div className="mt-4 space-y-3">
                    {sampleFindings.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="font-mono text-xs uppercase tracking-wide text-ink/45">
                          {row.label}
                        </span>
                        <span
                          className={`text-right text-sm font-medium ${
                            row.tone === "amber"
                              ? "text-amber-light"
                              : row.tone === "teal"
                              ? "text-teal-light"
                              : "text-ink/80"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Want to see it on your own studies?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-ink/70">
              We&apos;re onboarding a limited number of imaging departments
              into the pilot program.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block rounded-md bg-teal px-7 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
