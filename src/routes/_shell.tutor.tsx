import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AiTutorView } from "@/features/ai-tutor";

export const Route = createFileRoute("/_shell/tutor")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Tutor · Concept Detective · VidyaVerse" },
      { name: "description", content: "Curriculum diagnostic AI assistant that detects root misconceptions with friendly analogies." },
      { property: "og:title", content: "AI Tutor · Concept Detective · VidyaVerse" },
      { property: "og:description", content: "Curriculum diagnostic AI assistant that detects root misconceptions with friendly analogies." },
    ],
  }),
  component: TutorPage,
});

function TutorPage() {
  const search = useSearch({ from: "/_shell/tutor" });
  return <AiTutorView initialQuery={search["q"] || ""} />;
}
