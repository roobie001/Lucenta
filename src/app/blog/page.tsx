import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { PageHeader } from "@/components/ui/PageHeader";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Lucentaa",
  description:
    "Notes on AI-assisted imaging, our pilot program, and how we're building Lucentaa alongside radiologists.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the team."
        description="Thoughts on AI-assisted imaging, pilot updates, and how we're building Lucentaa — written as things actually happen, not marketing copy."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-teal/40 hover:shadow-glow-teal sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>{post.tag}</Pill>
                  <span className="font-mono text-xs text-ink/40">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-ink transition-colors group-hover:text-teal-light sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-teal-light">
                  Read post →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
