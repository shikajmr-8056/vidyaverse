import { createFileRoute } from "@tanstack/react-router";
import { PlayLabView } from "@/features/playlab";

export const Route = createFileRoute("/_shell/playlab")({
  head: () => ({
    meta: [
      { title: "PlayLab · Educational Games · VidyaVerse" },
      { name: "description", content: "Curriculum-based digital and physical board games for classrooms with low connectivity." },
      { property: "og:title", content: "PlayLab · Educational Games · VidyaVerse" },
      { property: "og:description", content: "Curriculum-based digital and physical board games for classrooms with low connectivity." },
    ],
  }),
  component: PlayLabPage,
});

function PlayLabPage() {
  return <PlayLabView />;
}
