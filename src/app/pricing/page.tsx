import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Pricing — Lucenta",
  description:
    "Lucenta pricing for pilot programs and enterprise deployments. Contact us to talk through your imaging department's needs.",
};

const tiers = [
  {
    name: "Pilot Program",
    tag: "For a single imaging department",
    price: "Contact Us",
    description:
      "A structured, time-boxed pilot to validate Lucenta against your own studies before any wider rollout.",
    features: [
      "Guided onboarding with our clinical team",
      "Support for one or more modalities (X-ray, CT, MRI)",
      "DICOM/PACS integration assistance",
      "Weekly performance review sessions",
      "No long-term commitment",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    tag: "For health systems and networks",
    price: "Contact Us",
    description:
      "For multi-site health systems ready to scale AI-assisted review across departments and modalities.",
    features: [
      "Everything in Pilot Program",
      "Multi-site deployment support",
      "Dedicated implementation team",
      "Custom SLAs and reporting",
      "Priority access to new model releases",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple, conversation-first pricing."
        description="Lucenta is in the pilot stage — pricing is scoped to your imaging department's size and needs, not a self-serve checkout. Reach out and we'll put together a plan together."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  tier.highlighted
                    ? "border-teal/40 bg-teal/[0.04] shadow-glow-teal"
                    : "border-white/10 bg-white/[0.02] hover:border-teal/30"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-8">
                    <Pill tone="amber">Most Common</Pill>
                  </div>
                )}
                <span className="font-mono text-xs uppercase tracking-widest text-ink/45">
                  {tier.tag}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-ink">
                  {tier.name}
                </h2>
                <p className="mt-4 text-3xl font-bold text-teal-light">
                  {tier.price}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {tier.description}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-ink/75"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-teal" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-8 block rounded-md px-6 py-3 text-center text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-teal text-navy hover:bg-teal-light hover:shadow-glow-teal"
                      : "border border-white/15 bg-white/5 text-ink hover:border-teal/40 hover:bg-white/10"
                  }`}
                >
                  Request a Demo
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-balance text-center text-sm text-ink/50">
            No payment is collected on this site. All pricing is finalized
            directly with our team based on your department&apos;s scope.
          </p>
        </Container>
      </section>
    </>
  );
}
