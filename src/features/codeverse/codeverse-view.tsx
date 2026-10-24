import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed } from "@/components/vv/arcade-embed";

export function CodeVerseView() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="CodeVerse · Computational Thinking & IDE"
        description="Master Python, JavaScript, and algorithmic problem-solving with automated test cases and offline-capable Monaco editor."
      />

      <ArcadeEmbed
        title="CodeVerse"
        defaultRoute="/codeverse"
        height="h-[calc(100vh-13rem)] min-h-[720px]"
      />
    </div>
  );
}
