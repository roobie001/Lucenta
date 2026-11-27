"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteChrome({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkspace = pathname === "/demo" || pathname?.startsWith("/demo/");

  if (isWorkspace) {
    return <main className="h-screen w-screen overflow-hidden bg-[#0a0f18]">{children}</main>;
  }

  return (
    <>
      <Navbar userEmail={userEmail} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
