import { createFileRoute } from "@tanstack/react-router";
import { ClassroomsView } from "@/features/classrooms";

export const Route = createFileRoute("/_shell/classrooms")({
  head: () => ({
    meta: [
      { title: "Classrooms · Learning Cohorts · VidyaVerse" },
      { name: "description", content: "Collaborative school cohorts, assignments, team challenges and announcements." },
    ],
  }),
  component: ClassroomsPage,
});

function ClassroomsPage() {
  return <ClassroomsView />;
}
