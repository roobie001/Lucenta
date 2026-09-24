import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Get Started — Lucentaa",
  description: "Create a Lucentaa account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Lucentaa is in pilot — accounts give you access to a demo dashboard while we onboard partner sites."
    >
      <SignupForm />
    </AuthShell>
  );
}
