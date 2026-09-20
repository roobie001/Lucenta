import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Legal — Lucenta",
  description: "Lucenta's Privacy Policy and Terms of Service.",
};

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy & Terms of Service"
        description="Last updated September 2026. Lucenta is an early-stage, pilot software product — these terms will evolve as the platform matures."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav className="mb-16 flex gap-6 border-b border-white/10 pb-6 font-mono text-xs uppercase tracking-widest">
              <a href="#privacy" className="text-teal-light hover:text-teal-light/80">
                Privacy Policy
              </a>
              <a href="#terms" className="text-teal-light hover:text-teal-light/80">
                Terms of Service
              </a>
            </nav>

            <div id="privacy" className="scroll-mt-24">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Privacy Policy
              </h2>
              <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/70">
                <div>
                  <h3 className="text-base font-bold text-ink">1. Overview</h3>
                  <p className="mt-2">
                    This Privacy Policy describes how Lucenta (&quot;Lucenta,&quot;
                    &quot;we,&quot; &quot;us&quot;) collects, uses, and protects
                    information in connection with our website and pilot
                    software platform. Lucenta is currently offered as an
                    early-stage pilot product to partner organizations under
                    separate pilot agreements, which may include additional
                    terms governing patient and imaging data.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    2. Information We Collect
                  </h3>
                  <p className="mt-2">
                    Through this website, we collect information you provide
                    directly, such as your name, email address, organization,
                    and any message content submitted through our contact
                    form. We may also collect standard technical information,
                    such as browser type and pages visited, to help us
                    understand and improve the site.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    3. Imaging and Health Data
                  </h3>
                  <p className="mt-2">
                    Any patient imaging or health data processed by the
                    Lucenta platform is handled under the terms of a separate
                    pilot or service agreement with the relevant healthcare
                    organization, not under this website Privacy Policy. Such
                    data is de-identified at intake where applicable,
                    encrypted in transit and at rest, and is not used for
                    purposes outside the scope of the applicable agreement.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    4. How We Use Information
                  </h3>
                  <p className="mt-2">
                    We use the information you provide to respond to
                    inquiries, evaluate pilot program applications, and
                    communicate with you about Lucenta. We do not sell
                    personal information to third parties.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    5. Data Retention
                  </h3>
                  <p className="mt-2">
                    We retain contact information for as long as reasonably
                    necessary to respond to your inquiry or maintain an
                    ongoing relationship, unless you ask us to delete it
                    sooner.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    6. Your Rights
                  </h3>
                  <p className="mt-2">
                    You may request access to, correction of, or deletion of
                    personal information you&apos;ve submitted to us by
                    contacting hello@lucenta.health.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    7. Changes to This Policy
                  </h3>
                  <p className="mt-2">
                    As Lucenta moves from pilot to broader deployment, this
                    policy will be updated to reflect new data practices. We
                    will post the updated date at the top of this page.
                  </p>
                </div>
              </div>
            </div>

            <div id="terms" className="mt-20 scroll-mt-24 border-t border-white/10 pt-16">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Terms of Service
              </h2>
              <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/70">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    1. Acceptance of Terms
                  </h3>
                  <p className="mt-2">
                    By accessing this website or participating in the Lucenta
                    pilot program, you agree to these Terms of Service. If you
                    do not agree, please do not use the site or platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    2. Pilot-Stage Product
                  </h3>
                  <p className="mt-2">
                    Lucenta is an early-stage software platform currently
                    offered through structured pilot programs. It is not a
                    finished, generally available diagnostic product. Features,
                    availability, and model performance are subject to change
                    as the platform develops.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    3. Not a Substitute for Clinical Judgment
                  </h3>
                  <p className="mt-2">
                    Lucenta is designed to provide assistive, informational
                    output to qualified healthcare professionals. It is not
                    intended to provide a standalone diagnosis and does not
                    replace the independent clinical judgment of a licensed
                    radiologist or physician. All outputs must be reviewed and
                    confirmed by a qualified clinician before informing patient
                    care.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    4. Pilot Agreements
                  </h3>
                  <p className="mt-2">
                    Use of the Lucenta platform by a healthcare organization is
                    governed by a separate, signed pilot or service agreement,
                    which takes precedence over these general Terms of Service
                    with respect to platform use, data handling, and clinical
                    responsibilities.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    5. Website Use
                  </h3>
                  <p className="mt-2">
                    You agree to use this website only for lawful purposes and
                    not to attempt to disrupt its operation, misrepresent your
                    identity, or submit false information through our forms.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    6. Limitation of Liability
                  </h3>
                  <p className="mt-2">
                    This website and its content are provided &quot;as is&quot;
                    without warranties of any kind. To the fullest extent
                    permitted by law, Lucenta disclaims liability for any
                    damages arising from use of this website, separate from any
                    liability terms set out in a signed pilot agreement.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    7. Contact
                  </h3>
                  <p className="mt-2">
                    Questions about these terms can be directed to
                    hello@lucenta.health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
