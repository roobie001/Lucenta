import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucentaa — AI-Assisted Clinical Imaging Review",
  description:
    "Lucentaa helps healthcare professionals review X-rays, CT scans, and MRIs faster with AI-assisted image analysis built for the clinical workflow.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-navy font-sans text-ink antialiased">
        <Navbar userEmail={user?.email ?? null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
