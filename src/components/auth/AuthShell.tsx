import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const authInputClass =
  "mt-2 w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/50 aria-[invalid=true]:border-amber/60";

export const authLabelClass =
  "font-mono text-xs uppercase tracking-widest text-ink/50";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-amber-light">
      {message}
    </p>
  );
}

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-grid-texture py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <Container className="relative">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
          <div className="text-center">
            <Eyebrow>Account</Eyebrow>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {description}
            </p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}

export function NotConfiguredNotice() {
  return (
    <p className="mb-5 rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-xs leading-relaxed text-amber-light">
      Authentication isn&apos;t configured yet. Add your Supabase URL and anon
      key to <span className="font-mono">.env.local</span> and restart the dev
      server.
    </p>
  );
}
