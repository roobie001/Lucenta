import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Technology | Lucentaa",
  description:
    "In plain language: what Lucentaa's AI is meant to do, which imaging formats it should read, and how we plan to handle patient data. Written for an early concept, not a finished product.",
};

const approachPoints = [
  {
    title: "Early concept stage",
    description:
      "No model has been clinically validated, and nothing has been tested with healthcare providers yet. Lucentaa is not cleared for diagnostic or clinical use.",
  },
  {
    title: "Assistive, not autonomous",
    description:
      "The intent is for the AI to flag candidate findings and help order the worklist, not to diagnose anything. Radiologists would confirm, edit, or dismiss any suggested finding.",
  },
  {
    title: "Planned validation",
    description:
      "We plan to work directly with radiologists during pilot testing to validate the platform's outputs, and to test models on annotated imaging datasets before they go near a pilot.",
  },
];

const dicomPoints = [
  {
    title: "DICOM support (planned)",
    description:
      "The plan is for Lucentaa to read standard DICOM series directly, so a team would not need to change how images are acquired or stored.",
  },
  {
    title: "PACS-compatible intake (planned)",
    description:
      "We intend to support sending studies from an existing PACS, so Lucentaa would sit next to current imaging systems instead of replacing them.",
  },
  {
    title: "Multi-modality parsing (planned)",
    description:
      "X-ray, CT, and MRI studies would be converted to a consistent format at intake, so the analysis step could treat every modality the same way.",
  },
];

const privacyPoints = [
  {
    title: "Data protection",
    description:
      "Data protection practices are being designed in line with applicable regulations, including Nigeria's NDPR, as the platform moves toward pilot testing.",
  },
  {
    title: "Security standards",
    description:
      "Infrastructure and data handling will be built to meet healthcare-grade security standards. That is a plan, and none of it has been built yet.",
  },
  {
    title: "No real patient data today",
    description:
      "This site uses made-up sample data only. Lucentaa does not currently collect or process any real patient data.",
  },
];

const infraPoints = [
  {
    title: "Hosting still to be decided",
    description:
      "We haven't settled on hosting or architecture yet. Infrastructure and data handling will be built to meet healthcare-grade security standards, and we'll describe the specifics once they exist.",
  },
  {
    title: "Traceability (planned)",
    description:
      "We intend to record each study's path through intake, analysis, and review, so any result could be traced back.",
  },
  {
    title: "Room to iterate",
    description:
      "We expect to evaluate and update models often once pilots begin, and we'll plan the infrastructure with that in mind.",
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
        title="How we plan to build it, in plain language."
        description="Lucentaa is an early concept. This page covers what we intend the AI to do, what it should work with, how we plan to handle patient data, and what we expect to run on."
      />

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex justify-center">
              <Pill tone="amber">Early Concept Stage</Pill>
            </div>
            <Eyebrow>AI Approach</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Assistive AI, with a radiologist deciding.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              This is where things stand today: an early concept, with no
              clinical testing done and no finished product.
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
              The aim is to work with the formats and systems radiology
              departments already have.
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
              How we plan to handle patient data.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              This is the part of the design that needs the most care.
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
              Infrastructure.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              What we expect to build, described at a high level.
            </p>
          </div>
          <PointList points={infraPoints} />
        </Container>
      </section>
    </>
  );
}
