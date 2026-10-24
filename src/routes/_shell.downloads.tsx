import { createFileRoute } from "@tanstack/react-router";
import { DownloadsView } from "@/features/downloads";

export const Route = createFileRoute("/_shell/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads & Offline Cache · VidyaVerse" },
      { name: "description", content: "Manage downloaded curriculum content packs, language voice packs and SD card storage." },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  return <DownloadsView />;
}
