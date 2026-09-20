import { Hero } from "@/components/Hero";
import { PlatformLayers } from "@/components/PlatformLayers";
import { AIWorkflow } from "@/components/AIWorkflow";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CtaBanner } from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformLayers />
      <AIWorkflow />
      <FeatureGrid />
      <CtaBanner />
    </>
  );
}
