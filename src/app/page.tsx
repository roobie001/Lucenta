import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PlatformLayers } from "@/components/PlatformLayers";
import { AIWorkflow } from "@/components/AIWorkflow";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PlatformLayers />
      <AIWorkflow />
      <FeatureGrid />
      <CtaBanner />
      <Footer />
    </main>
  );
}
