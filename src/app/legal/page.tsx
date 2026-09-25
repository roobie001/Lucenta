import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Legal | Lucentaa",
  description: "Lucentaa's Privacy Policy and Terms of Service.",
};

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy & Terms of Service"
        description="Last updated September 2026. Lucentaa is an early concept, so these terms will change as the project develops."
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
                    This Privacy Policy describes how Lucentaa (&quot;Lucentaa,&quot;
                    &quot;we,&quot; &quot;us&quot;) collects, uses, and protects
                    information in connection with our website and the concept
                    it describes. Lucentaa is at an early concept stage and is
                    not currently offered to any healthcare organization. If
                    pilot agreements are signed in future, they may include
                    additional terms governing patient and imaging data.
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
                    form. If you create an account, we also collect your email
                    address and the credentials needed to log you in. We may
                    also collect standard technical information,
                    such as browser type and pages visited, to help us
                    understand and improve the site.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    3. Imaging and Health Data
                  </h3>
                  <p className="mt-2">
                    Lucentaa does not currently collect or process real patient
                    imaging or health data, and this site uses sample data
                    only. If that changes, for example in a future pilot, we
                    would handle such data under a separate written agreement
                    with the relevant healthcare organization, and we would
                    update this policy first. Data protection practices are
                    being designed in line with applicable regulations,
                    including Nigeria&apos;s NDPR, as the platform moves toward
                    pilot testing.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    4. How We Use Information
                  </h3>
                  <p className="mt-2">
                    We use the information you provide to respond to
                    inquiries, consider interest in becoming a pilot partner,
                    and communicate with you about Lucentaa. We do not sell
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
                    contacting hello@lucentaa.com.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    7. Changes to This Policy
                  </h3>
                  <p className="mt-2">
                    As Lucentaa moves toward pilot testing, this policy will be
                    updated to reflect new data practices. We will post the
                    updated date at the top of this page.
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
                    By accessing this website or using the demo dashboard, you
                    agree to these Terms of Service. If you do not agree,
                    please do not use the site.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    2. Early Concept
                  </h3>
                  <p className="mt-2">
                    Lucentaa is an early-stage concept. The dashboard and
                    examples on this site use sample data to illustrate the
                    idea, and no model on this site produces real analysis.
                    Lucentaa is not a finished product and is not available for
                    clinical use. Features and descriptions may change as the
                    project develops.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    3. Not a Substitute for Clinical Judgment
                  </h3>
                  <p className="mt-2">
                    Lucentaa is intended to provide assistive, informational
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
                    4. Future Pilot Agreements
                  </h3>
                  <p className="mt-2">
                    Any future use of Lucentaa by a healthcare organization
                    would be governed by a separate, signed pilot or service
                    agreement, which would take precedence over these general
                    Terms of Service with respect to platform use, data
                    handling, and clinical responsibilities.
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
                    permitted by law, Lucentaa disclaims liability for any
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
                    hello@lucentaa.com.
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
