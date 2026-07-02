import { StudioNav } from "@/components/studio/studio-nav";
import { StudioHero } from "@/components/studio/studio-hero";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { FloatingBubbles } from "@/components/visual/floating-bubbles";

export const metadata = { title: "灵感工作台 · Inspiration Muse Studio" };

export default function StudioPage() {
  return (
    <main className="bg-gallery relative min-h-screen overflow-hidden pt-4">
      <FloatingBubbles density="sparse" />
      <StudioNav />
      <StudioHero />
      <PromptPanel />
    </main>
  );
}
