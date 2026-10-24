import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardView } from "@/features/student";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard · VidyaVerse" },
      { name: "description", content: "Your cosmic learning journey: daily quest, curriculum progress and rewards." },
      { property: "og:title", content: "Student Dashboard · VidyaVerse" },
      { property: "og:description", content: "Your cosmic learning journey: daily quest, curriculum progress and rewards." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <StudentDashboardView />;
}
