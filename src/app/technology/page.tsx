import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Technology — Lucenta",
  description:
    "How the Lucenta platform approaches AI-assisted imaging analysis, DICOM compatibility, data privacy, and infrastructure — in plain language.",
};

const approachPoints = [
  {
    title: "In development, pilot stage",
    description:
      "Lucenta's models are under active development and are being evaluated in structured pilots with partner sites. They are not yet cleared for standalone diagnostic use, and every output is reviewed by a qualified radiologist before it informs a clinical decision.",
  },
  {
    title: "Assistive, not autonomous",
    description:
      "The AI layer is designed to surface candidate findings and prioritize worklists — it does not make a diagnosis. Radiologists retain full authority to confirm, edit, or dismiss any AI-suggested finding.",
  },
  {
    title: "Trained and evaluated on annotated data",
    description:
      "Models are trained and benchmarked against radiologist-annotated imaging datasets, with performance reviewed before any version is introduced into a pilot environment.",
  },
];

const dicomPoints = [
  {
    title: "Native DICOM support",
    description:
      "Lucenta reads and processes standard DICOM series directly, without requiring imaging teams to change their acquisition or storage formats.",
  },
  {
    title: "PACS-compatible intake",
    description:
      "Studies can be routed from existing PACS infrastructure, so the analysis pipeline fits alongside current imaging systems rather than replacing them.",
  },
  {
    title: "Multi-modality parsing",
    description:
      "The intake layer normalizes studies across X-ray, CT, and MRI series so downstream analysis handles each modality consistently.",
  },
];

const privacyPoints = [
  {
    title: "De-identification at intake",
    description:
      "Patient-identifying DICOM metadata is stripped or masked as studies enter the pipeline, ahead of any analysis step.",
  },
  {
    title: "Encryption in transit and at rest",
    description:
      "Imaging data and derived findings are encrypted both while moving through the pipeline and while stored.",
  },
  {
    title: "Access boundaries",
    description:
      "Data access is scoped per pilot partner, with no cross-institution sharing of imaging data or findings.",
  },
  {
    title: "Compliance-aware architecture",
    description:
      "The platform is being built with HIPAA-aware data handling practices in mind. Formal certifications, including SOC 2 Type II, are in progress and not yet complete.",
  },
];

const infraPoints = [
  {
    title: "Cloud-hosted pipeline",
    description:
      "The analysis pipeline runs on cloud infrastructure with isolated environments per pilot deployment.",
  },
  {
    title: "Auditable processing",
    description:
      "Each study's path through intake, analysis, and review is logged to support traceability during pilots.",
  },
  {
    title: "Built for iteration",
    description:
      "Infrastructure is designed to support frequent model evaluation and updates as the platform moves through pilot phases.",
  },
];

function PointList({
  points,
}: {
  points: { title: string; description: string }[];
}) {
  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-6">
      {points.map((point) => (
        <div
          key={point.title}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:shadow-glow-teal sm:p-8"
        >
          <h3 className="text-lg font-bold text-ink sm:text-xl">
            {point.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {point.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Technology"
        title="How the platform works, in plain language."
        description="Lucenta is an early-stage, pilot software product. Here's an honest look at our AI approach, data compatibility, privacy practices, and infrastructure."
      />

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex justify-center">
              <Pill tone="amber">In Development — Pilot Stage</Pill>
            </div>
            <Eyebrow>AI Approach</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Assistive AI, reviewed by clinicians.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              We describe our AI capabilities as they are today — in
              development and pilot testing — not as a finished, validated
              clinical product.
            </p>
          </div>
          <PointList points={approachPoints} />
        </Container>
      </section>

      <section className="border-b border-white/10 bg-white/[0.015] py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Compatibility</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              DICOM compatibility.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              Built to work with the imaging formats and systems radiology
              departments already use.
            </p>
          </div>
          <PointList points={dicomPoints} />
        </Container>
      </section>

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Privacy & Security</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Data privacy and security approach.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              Patient data protection is treated as a foundational
              requirement, not an add-on.
            </p>
          </div>
          <PointList points={privacyPoints} />
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Infrastructure</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Infrastructure overview.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              A high-level look at how the pipeline is hosted and operated
              during pilot deployments.
            </p>
          </div>
          <PointList points={infraPoints} />
        </Container>
      </section>
    </>
  );
}
