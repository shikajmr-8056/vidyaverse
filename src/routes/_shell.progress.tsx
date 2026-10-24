import { createFileRoute } from "@tanstack/react-router";
import { ProgressView } from "@/features/progress";

export const Route = createFileRoute("/_shell/progress")({
  head: () => ({
    meta: [
      { title: "My Progress · Learning Analytics · VidyaVerse" },
      { name: "description", content: "Academic mastery, strengths, learning gaps and revision recommendations." },
      { property: "og:title", content: "My Progress · Learning Analytics · VidyaVerse" },
      { property: "og:description", content: "Academic mastery, strengths, learning gaps and revision recommendations." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  return <ProgressView />;
}
