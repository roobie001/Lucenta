import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { blogPosts, getBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Post Not Found | Lucentaa" };
  return {
    title: `${post.title} | Lucentaa Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-grid-texture py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-widest text-teal-light transition-colors hover:text-teal-light/80"
          >
            ← Back to Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Pill>{post.tag}</Pill>
            <span className="font-mono text-xs text-ink/40">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-balance mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-10 space-y-5 border-t border-white/10 pt-10">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed text-ink/75">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              ← All posts
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-md bg-teal px-6 py-3 text-center text-sm font-semibold text-navy transition-all hover:bg-teal-light hover:shadow-glow-teal"
            >
              Talk to the Team
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
