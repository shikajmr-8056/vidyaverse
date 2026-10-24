import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lessons } from "@/data/demo";
import { LessonView } from "@/features/learning";

export const Route = createFileRoute("/_shell/lesson/$id")({
  loader: ({ params }) => {
    const lesson = lessons.find((l) => l.id === params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.lesson.title} · VidyaVerse` : "Lesson not found · VidyaVerse";
    const desc = loaderData ? `${loaderData.lesson.subject}, ${loaderData.lesson.chapter}.` : "This lesson does not exist.";
    return {
      meta: [
        { title: t },
        { name: "description", content: desc },
        { property: "og:title", content: t },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="card-surface p-10 text-center rounded-xl border border-border">
      <p className="font-semibold text-foreground">Lesson not found</p>
      <Link to="/learn" className="mt-3 inline-block text-[#6541F5] font-semibold underline">
        Back to library
      </Link>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  return <LessonView lesson={lesson} />;
}
