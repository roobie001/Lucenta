"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";

interface PreviewCard {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  badge: string;
}

const previewCards: PreviewCard[] = [
  {
    id: "review-interface",
    src: "/images/demo/review-interface.png",
    alt: "Lucentaa three-column clinical review workspace showing AI-triaged worklist, interactive CT viewport, and structured draft report",
    title: "Triaged Clinical Workspace",
    description:
      "Urgent studies prioritized automatically alongside live DICOM windowing and structured report drafting.",
    badge: "3-Column PACS Layout",
  },
  {
    id: "highlighted-finding",
    src: "/images/demo/highlighted-finding.png",
    alt: "AI-highlighted pulmonary nodule in the right upper lobe with confidence score and radiologist confirmation panel",
    title: "AI-Highlighted Candidate Findings",
    description:
      "Localized region overlays with confidence scoring awaiting radiologist confirmation.",
    badge: "Human-in-the-Loop",
  },
];

export function ProductPreview() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") {
        setActiveIdx((i) => (i === null ? null : (i + 1) % previewCards.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIdx((i) =>
          i === null ? null : (i - 1 + previewCards.length) % previewCards.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIdx]);

  const activeCard = activeIdx !== null ? previewCards[activeIdx] : null;

  return (
    <section
      id="product-preview"
      className="border-b border-[#1e293b] bg-[#0a0f18] py-24"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>WORKING PROTOTYPE</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Inside the Lucentaa Review Workspace
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            Explore how candidate findings are surfaced, verified, and drafted
            into structured reports.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {previewCards.map((card, idx) => (
            <div
              key={card.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d131f] transition-all duration-300 hover:border-[#14b8a6]/50 hover:shadow-[0_0_32px_rgba(20,184,166,0.16)]"
            >
              <button
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`Enlarge screenshot: ${card.title}`}
                className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[#1e293b] bg-[#06090f] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090f]/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-[#14b8a6]/40 bg-[#0a0f18]/90 px-2.5 py-1 font-mono text-[11px] font-medium text-[#14b8a6] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    className="h-3.5 w-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.5 8V3.5H8M16.5 8V3.5H12M3.5 12v4.5H8M16.5 12v4.5H12"
                    />
                  </svg>
                  Click to enlarge
                </span>
              </button>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-ink">{card.title}</h3>
                    <span className="shrink-0 rounded-full border border-[#14b8a6]/35 bg-[#14b8a6]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#14b8a6]">
                      {card.badge}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/70">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-md bg-[#14b8a6] px-7 py-3.5 text-sm font-semibold text-[#0a0f18] transition-all hover:bg-teal-light hover:shadow-[0_0_28px_rgba(20,184,166,0.35)]"
          >
            Open Interactive Demo (/demo) →
          </Link>
        </div>
      </Container>

      {/* Click-to-enlarge Lightbox Modal */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#0a0f18] shadow-[0_0_48px_rgba(20,184,166,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#1e293b] bg-[#0d131f] px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3
                    id="lightbox-title"
                    className="truncate text-sm font-bold text-ink sm:text-base"
                  >
                    {activeCard.title}
                  </h3>
                  <span className="hidden rounded-full border border-[#14b8a6]/35 bg-[#14b8a6]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#14b8a6] sm:inline-flex">
                    {activeCard.badge}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink/65">
                  {activeCard.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIdx((i) =>
                      i === null
                        ? null
                        : (i - 1 + previewCards.length) % previewCards.length
                    )
                  }
                  className="rounded border border-[#1e293b] bg-[#111827] px-2.5 py-1 font-mono text-xs text-ink/80 transition-colors hover:border-[#14b8a6]/50 hover:text-white"
                  aria-label="Previous screenshot"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIdx((i) =>
                      i === null ? null : (i + 1) % previewCards.length
                    )
                  }
                  className="rounded border border-[#1e293b] bg-[#111827] px-2.5 py-1 font-mono text-xs text-ink/80 transition-colors hover:border-[#14b8a6]/50 hover:text-white"
                  aria-label="Next screenshot"
                >
                  →
                </button>
                <Link
                  href="/demo"
                  className="hidden rounded-md bg-[#14b8a6] px-3 py-1.5 text-xs font-semibold text-[#0a0f18] transition-colors hover:bg-teal-light sm:inline-flex"
                >
                  Try Live Demo →
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveIdx(null)}
                  className="rounded-md border border-[#1e293b] px-2.5 py-1 text-sm text-ink/70 transition-colors hover:border-slate-600 hover:text-white"
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#06090f] p-2 sm:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCard.src}
                alt={activeCard.alt}
                className="max-h-[76vh] w-auto rounded-lg border border-[#1e293b] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
