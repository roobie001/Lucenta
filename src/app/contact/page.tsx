import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Lucenta",
  description:
    "Get in touch with the Lucenta team about the pilot program, partnerships, or general questions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your imaging department."
        description="Whether you're exploring the pilot program or just have questions, we'd like to hear from you."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow>Details</Eyebrow>
              <h2 className="text-2xl font-bold text-ink">Reach us directly</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                We typically respond within one to two business days.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/45">
                    Email
                  </span>
                  <p className="mt-1 text-sm text-ink/80">hello@lucenta.health</p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/45">
                    Pilot Inquiries
                  </span>
                  <p className="mt-1 text-sm text-ink/80">pilot@lucenta.health</p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/45">
                    Location
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-ink/80">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
