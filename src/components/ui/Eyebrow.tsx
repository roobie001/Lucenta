export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(13,148,136,0.9)]" />
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal-light">
        {children}
      </span>
    </div>
  );
}
