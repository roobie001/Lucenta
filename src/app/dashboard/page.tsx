import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { LogoutButton } from "@/components/LogoutButton";
import { UploadDemoCard } from "@/components/dashboard/UploadDemoCard";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | Lucentaa",
  robots: { index: false },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to Lucentaa."
        description="You're signed in to the demo dashboard. Everything here uses sample data."
      />

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-widest text-ink/45">
                  Signed in as
                </span>
                <p className="mt-1 truncate text-lg font-bold text-ink">
                  {user.email}
                </p>
              </div>
              <LogoutButton className="rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-teal/40 hover:bg-white/10" />
            </div>

            <UploadDemoCard />
          </div>
        </Container>
      </section>
    </>
  );
}
