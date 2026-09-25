import { Container } from "./ui/Container";
import { Eyebrow } from "./ui/Eyebrow";
import { Pill } from "./ui/Pill";

const resultRows = [
  { label: "Finding", value: "Pulmonary nodule, right upper lobe", tone: "amber" as const },
  { label: "Confidence", value: "94.2%", tone: "teal" as const },
  { label: "Region", value: "RUL, segment 3", tone: "neutral" as const },
  { label: "Recommended Review", value: "Priority, needs radiologist sign-off", tone: "amber" as const },
];

export function AIWorkflow() {
  return (
    <section className="border-b border-white/10 bg-white/[0.015] py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>How It Would Work</Eyebrow>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From incoming scan to reviewable summary.
          </h2>
          <p className="mt-4 text-balance text-ink/70">
            The idea: when a study comes in, the pipeline runs on it
            automatically, so candidate findings are already listed next to the
            images when a radiologist opens the file. The example below is a
            mockup with sample data, not real output.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-navy-100/60 p-6 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                  Incoming Study (sample)
                </span>
                <Pill tone="amber">New</Pill>
              </div>
              <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-white/15 bg-navy/60">
                <span className="font-mono text-xs text-ink/40">
                  CT_CHEST_0417.dcm
                </span>
              </div>
              <div className="mt-4 space-y-1.5 font-mono text-xs text-ink/50">
                <p>Modality: CT</p>
                <p>Patient ID: ****3821</p>
                <p>Series: 3 / Slices: 214</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-3 py-2 lg:flex-col lg:py-0">
              <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-teal/60 lg:block" />
              <span className="block h-10 w-px bg-gradient-to-b from-transparent to-teal/60 lg:hidden" />
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-teal/50 bg-teal/10 shadow-glow-teal">
                <span className="font-mono text-sm font-bold text-teal-light">
                  AI
                </span>
              </div>
              <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-teal/60 lg:block" />
              <span className="block h-10 w-px bg-gradient-to-t from-transparent to-teal/60 lg:hidden" />
            </div>

            <div className="rounded-xl border border-teal/30 bg-teal/[0.04] p-5 shadow-glow-teal">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                  AI Summary (sample)
                </span>
                <Pill tone="teal">Processed</Pill>
              </div>
              <div className="mt-4 space-y-3">
                {resultRows.map((row) => (
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
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
