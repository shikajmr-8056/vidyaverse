import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed, ArcadeTab } from "@/components/vv/arcade-embed";
import { useDemo } from "@/lib/demo-store";

const PLAYLAB_TABS: ArcadeTab[] = [
  { id: "hub", label: "All Games", route: "/playlab", icon: "🎮" },
  { id: "carrom", label: "Newton's Carrom", route: "/playlab/carrom", icon: "🎯" },
  { id: "ludo", label: "Math Ludo", route: "/playlab/ludo", icon: "🎲" },
  { id: "maze", label: "MazeBot", route: "/playlab/maze", icon: "🤖" },
  { id: "bharat", label: "Bharat Explorer", route: "/playlab/bharat", icon: "🗺️" },
  { id: "solar", label: "3D Solar System", route: "/playlab/solar", icon: "🪐" },
  { id: "chemistry", label: "Chemistry Lab", route: "/playlab/chemistry-lab", icon: "🧪" },
  { id: "physics", label: "Physics Playground", route: "/playlab/physics-playground", icon: "⚙️" },
  { id: "human-body", label: "Human Anatomy", route: "/playlab/human-body", icon: "🫀" },
  { id: "math-viz", label: "Math Visualizer", route: "/playlab/math-visualizer", icon: "📐" },
  { id: "ninjas", label: "Number Ninjas", route: "/playlab/number-ninjas", icon: "🥷" },
  { id: "ecosystem", label: "Ecosystem Simulator", route: "/playlab/ecosystem-simulator", icon: "🌿" },
  { id: "wordquest", label: "WordQuest", route: "/playlab/wordquest", icon: "📖" },
];

export function PlayLabView() {
  const demo = useDemo();

  return (
    <div className="space-y-4">
      <PageHeader
        title="PlayLab · Educational Game Engine"
        description="Curriculum-based interactive games with real-time physics, Math Ludo, 3D Solar System, and algorithmic mazes."
      />

      <ArcadeEmbed
        title="PlayLab"
        defaultRoute="/playlab"
        tabs={PLAYLAB_TABS}
        height="h-[calc(100vh-12.5rem)] min-h-[720px]"
      />
    </div>
  );
}
