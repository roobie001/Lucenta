import type { Metadata } from "next";
import { RadiologyWorkspace } from "@/components/demo/RadiologyWorkspace";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clinical Review Workspace (Demo) | Lucentaa",
  description:
    "Interactive Lucentaa radiology review workspace with sample CT and X-ray studies, AI finding overlays, and radiologist sign-off.",
};

export default async function DemoPage() {
  const user = await getCurrentUser();

  return <RadiologyWorkspace userEmail={user?.email ?? null} />;
}
