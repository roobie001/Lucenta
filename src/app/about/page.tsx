import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About — Lucenta",
  description:
    "Lucenta's mission, founding story, and team — an AI-assisted imaging review platform founded in Lagos, Nigeria.",
};

const team = [
  {
    name: "Founding Team Member",
    role: "Co-Founder & CEO",
    bio: "Placeholder bio — leading product and clinical partnerships.",
  },
  {
    name: "Founding Team Member",
    role: "Co-Founder & CTO",
    bio: "Placeholder bio — leading AI research and engineering.",
  },
  {
    name: "Founding Team Member",
    role: "Clinical Advisor",
    bio: "Placeholder bio — practicing radiologist advising on model validation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built to give every radiologist a second set of eyes."
        description="Lucenta started with a simple observation: imaging departments are stretched thin, and the tools available to them haven't kept pace."
      />

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Mission</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Help clinicians read every scan with more confidence.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Our mission is to build AI-assisted tools that fit into the
              existing radiology workflow — not replace the radiologist, but
              give them a faster, more consistent second opinion on every
              study that comes through the door. We believe that gets built
              carefully, in partnership with the clinicians who will use it,
              and validated openly before it touches real patient care.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-white/[0.015] py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Founded in Lagos, Nigeria.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Lucenta was founded in Lagos, Nigeria, by a small team who saw
              firsthand how imaging backlogs and thin radiology staffing
              affect patient care across growing health systems. What started
              as a research project applying machine learning to X-ray triage
              grew into a broader platform for AI-assisted review across
              X-ray, CT, and MRI.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              We&apos;re still early. Lucenta is currently in active
              development and running structured pilots with partner imaging
              departments — building the platform in the open, with
              radiologists in the room from day one.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Team</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              The people behind Lucenta.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              A small, focused team based in Lagos, building alongside
              clinical advisors. Full bios coming soon.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.role}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center transition-all hover:border-teal/40 hover:shadow-glow-teal"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal/40 bg-teal/10">
                  <span className="font-mono text-sm font-bold text-teal-light">
                    {member.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-teal-light">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
