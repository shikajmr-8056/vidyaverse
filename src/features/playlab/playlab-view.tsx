import { ArcadeEmbed } from "@/components/vv/arcade-embed";

export function PlayLabView() {
  return (
    <ArcadeEmbed
      title="PlayLab"
      defaultRoute="/playlab"
      height="h-[calc(100vh-5.5rem)] min-h-[750px]"
    />
  );
}
