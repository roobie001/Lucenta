import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Pricing | Lucentaa",
  description:
    "Pilot and enterprise pricing is set case by case. Contact us with details about your imaging department.",
};

const tiers = [
  {
    name: "Pilot Program",
    tag: "For a single imaging department",
    price: "Contact Us",
    description:
      "A time-limited pilot on your own studies. Scope and terms would be agreed with each partner before anything starts.",
    features: [
      "Pilot support included",
      "Modalities and scope agreed with each partner",
      "Terms agreed up front",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    tag: "For health systems and networks",
    price: "Contact Us",
    description:
      "For health systems that may later want to use Lucentaa across several departments or sites. Nothing at this tier exists yet.",
    features: [
      "Everything in Pilot Program",
      "Multi-site plans scoped case by case",
      "Terms agreed directly with our team",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Pricing depends on your department."
        description="Lucentaa is an early concept, so there is no self-serve checkout and no public price list. If you'd like to be a pilot partner, tell us about your imaging department and we'll work out terms together."
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
                    <Pill tone="amber">Multi-Site</Pill>
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
                  Get in Touch
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-balance text-center text-sm text-ink/50">
            No payment is taken on this site. Pricing is agreed directly with
            our team.
          </p>
        </Container>
      </section>
    </>
  );
}
