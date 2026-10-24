import { createFileRoute } from "@tanstack/react-router";
import { LearningMeshView } from "@/features/offline-sync";

export const Route = createFileRoute("/_shell/mesh")({
  head: () => ({
    meta: [
      { title: "Offline Learning Mesh · VidyaVerse" },
      { name: "description", content: "Peer-to-peer and micro-server local educational Wi-Fi network status." },
      { property: "og:title", content: "Offline Learning Mesh · VidyaVerse" },
      { property: "og:description", content: "Peer-to-peer and micro-server local educational Wi-Fi network status." },
    ],
  }),
  component: MeshPage,
});

function MeshPage() {
  return <LearningMeshView />;
}
