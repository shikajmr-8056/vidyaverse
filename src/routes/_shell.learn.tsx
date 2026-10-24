import { createFileRoute } from "@tanstack/react-router";
import { LearningLibraryView } from "@/features/learning";

export const Route = createFileRoute("/_shell/learn")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof s["q"] === "string" ? (s["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Learning library · VidyaVerse" },
      { name: "description", content: "Browse lessons by curriculum, class, subject and chapter." },
      { property: "og:title", content: "Learning library · VidyaVerse" },
      { property: "og:description", content: "Browse lessons by curriculum, class, subject and chapter." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { q = "" } = Route.useSearch();
  return <LearningLibraryView initialQuery={q} />;
}
