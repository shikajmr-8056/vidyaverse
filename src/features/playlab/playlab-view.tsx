import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed } from "@/components/vv/arcade-embed";

export function PlayLabView() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="PlayLab · Educational Game Engine"
        description="Curriculum-based interactive games with real-time physics, Math Ludo, 3D Solar System, and algorithmic mazes."
      />

      <ArcadeEmbed
        title="PlayLab"
        defaultRoute="/playlab"
        height="h-[calc(100vh-13rem)] min-h-[720px]"
      />
    </div>
  );
}
