import { createFileRoute } from "@tanstack/react-router";
import { ParentView } from "@/features/parent";

export const Route = createFileRoute("/_shell/parent")({
  head: () => ({
    meta: [
      { title: "Parent Guardian Portal · VidyaVerse" },
      { name: "description", content: "Supportive, encouraging overview of your child's academic journey and accomplishments." },
    ],
  }),
  component: ParentDashboardPage,
});

function ParentDashboardPage() {
  return <ParentView />;
}
