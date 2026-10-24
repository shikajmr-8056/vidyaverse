import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed, ArcadeTab } from "@/components/vv/arcade-embed";

const CODEVERSE_TABS: ArcadeTab[] = [
  { id: "hub", label: "Code Studio Hub", route: "/codeverse", icon: "💻" },
  { id: "learn", label: "Guided Learn Track", route: "/codeverse/learn", icon: "📘" },
  { id: "challenge", label: "Challenge Arena", route: "/codeverse/challenge", icon: "🏆" },
];

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
        tabs={CODEVERSE_TABS}
        height="h-[calc(100vh-12.5rem)] min-h-[720px]"
      />
    </div>
  );
}
