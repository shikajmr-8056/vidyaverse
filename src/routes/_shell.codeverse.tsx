import { createFileRoute } from "@tanstack/react-router";
import { CodeVerseView } from "@/features/codeverse";

export const Route = createFileRoute("/_shell/codeverse")({
  head: () => ({
    meta: [
      { title: "CodeVerse · Block Coding & Python Bridge · VidyaVerse" },
      { name: "description", content: "Computational thinking, visual block coding and transition to Python/Arduino C++." },
      { property: "og:title", content: "CodeVerse · Block Coding & Python Bridge · VidyaVerse" },
      { property: "og:description", content: "Computational thinking, visual block coding and transition to Python/Arduino C++." },
    ],
  }),
  component: CodeVersePage,
});

function CodeVersePage() {
  return <CodeVerseView />;
}
