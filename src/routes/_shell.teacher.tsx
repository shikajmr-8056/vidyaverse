import { createFileRoute } from "@tanstack/react-router";
import { TeacherDashboardView } from "@/features/teacher";

export const Route = createFileRoute("/_shell/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard · Class 7B Science · VidyaVerse" },
      { name: "description", content: "Mastery heatmaps, student diagnostics, offline sync tracker and assignment creator." },
      { property: "og:title", content: "Teacher Dashboard · Class 7B Science · VidyaVerse" },
      { property: "og:description", content: "Mastery heatmaps, student diagnostics, offline sync tracker and assignment creator." },
    ],
  }),
  component: TeacherPage,
});

function TeacherPage() {
  return <TeacherDashboardView />;
}
