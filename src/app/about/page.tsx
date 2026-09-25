import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About | Lucentaa",
  description:
    "Why Lucentaa exists, who is behind it, and where: a small team in Lagos, Nigeria developing an early concept for AI-assisted imaging review.",
};

const team = [
  {
    name: "Name TBD",
    role: "Co-Founder & CEO",
    bio: "Bio TBD. Leads product and clinical partnerships.",
  },
  {
    name: "Name TBD",
    role: "Co-Founder & CTO",
    bio: "Bio TBD. Leads AI research and engineering.",
  },
  {
    name: "Name TBD",
    role: "Clinical Advisor (to be confirmed)",
    bio: "Bio TBD. We intend to bring in a practicing radiologist for this role.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Why we're building Lucentaa."
        description="Reading rooms are handling more studies with the same number of people, and the software hasn't changed much to help. That is the problem we're working on."
      />

      <section className="border-b border-white/10 py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Mission</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Give radiologists a faster start on every study.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              We want to build tools that fit into the radiology workflow that
              already exists. The goal is not to replace the radiologist. It is
              to hand them a first pass on each study, so their time goes to the
              hard reads. We plan to do that work with the clinicians who will
              use it, and to test it openly before it goes near patient care.
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
              We are based in Lagos, where imaging backlogs and a shortage of
              radiologists are a daily reality for many hospitals. Lucentaa
              comes out of one question: how can a small number of radiologists
              work through a growing pile of X-ray, CT, and MRI studies without
              cutting corners?
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              It&apos;s very early. Lucentaa is a concept, and no pilots are
              running yet. We are seeking pilot partners among healthcare
              providers, and we plan to work directly with radiologists during
              pilot testing to validate the platform&apos;s outputs.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Team</Eyebrow>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              The people behind Lucentaa.
            </h2>
            <p className="mt-4 text-balance text-ink/70">
              A small team in Lagos. We plan to bring in clinical advisors as
              the project develops. Names and bios will go here once they are
              confirmed.
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
