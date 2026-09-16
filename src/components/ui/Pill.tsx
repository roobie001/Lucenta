export function Pill({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "teal" | "amber" | "neutral";
}) {
  const tones: Record<string, string> = {
    teal: "border-teal/40 bg-teal/10 text-teal-light",
    amber: "border-amber/40 bg-amber/10 text-amber-light",
    neutral: "border-white/15 bg-white/5 text-ink/70",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
