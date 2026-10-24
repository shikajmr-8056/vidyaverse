import { createFileRoute } from "@tanstack/react-router";
import { ProjectsView } from "@/features/projects/projects-view";

export const Route = createFileRoute("/_shell/projects")({
  head: () => ({
    meta: [
      { title: "Student Projects & Portfolio · VidyaVerse" },
      { name: "description", content: "Showcase of student-engineered circuits, coding algorithms, and science projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return <ProjectsView />;
}
