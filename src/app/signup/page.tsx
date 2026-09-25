import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Get Started | Lucentaa",
  description: "Create a Lucentaa account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Lucentaa is an early concept. An account gets you into a demo dashboard that uses sample data only."
    >
      <SignupForm />
    </AuthShell>
  );
}
