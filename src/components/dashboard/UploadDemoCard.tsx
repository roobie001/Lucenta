"use client";

import { useState } from "react";
import { Pill } from "@/components/ui/Pill";

const sampleRows = [
  { label: "Finding", value: "Pulmonary nodule, right upper lobe", tone: "amber" as const },
  { label: "Confidence", value: "94.2%", tone: "teal" as const },
  { label: "Region", value: "RUL — Segment 3", tone: "neutral" as const },
  { label: "Status", value: "Pending radiologist review", tone: "amber" as const },
];

export function UploadDemoCard() {
  const [shown, setShown] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <span className="font-mono text-xs uppercase tracking-widest text-teal-light">
        Upload
      </span>
      <h2 className="mt-2 text-xl font-bold text-ink">Upload a scan</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">
        Scan upload isn&apos;t enabled yet. Click below to preview what an
        analysis result will look like — using sample data only.
      </p>

      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-expanded={shown}
        className="mt-6 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-navy/60 px-6 py-10 text-center transition-all hover:border-teal/50 hover:bg-teal/[0.04]"
      >
        <span className="font-mono text-sm text-ink/70">
          {shown ? "Hide sample result" : "Click to view a sample analysis"}
        </span>
        <span className="mt-1 font-mono text-xs text-ink/35">
          No file is uploaded or processed
        </span>
      </button>

      {shown && (
        <div className="mt-6 rounded-xl border border-teal/30 bg-teal/[0.04] p-5 shadow-glow-teal">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
              Sample Analysis Result
            </span>
            <Pill tone="amber">Demo Data — Not Live AI</Pill>
          </div>
          <div className="mt-4 space-y-3">
            {sampleRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-ink/45">
                  {row.label}
                </span>
                <span
                  className={`text-right text-sm font-medium ${
                    row.tone === "amber"
                      ? "text-amber-light"
                      : row.tone === "teal"
                      ? "text-teal-light"
                      : "text-ink/80"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink/40">
            Illustrative example only. This is static sample content, not the
            output of a model, and not a clinical result.
          </p>
        </div>
      )}
    </div>
  );
}
