import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Lucentaa",
  description: "Log in to your Lucentaa account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in"
      description="Log in to reach your dashboard."
    >
      <LoginForm />
    </AuthShell>
  );
}
