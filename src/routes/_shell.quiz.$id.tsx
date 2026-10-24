import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { quizzes } from "@/data/demo";
import { QuizView } from "@/features/quizzes";

export const Route = createFileRoute("/_shell/quiz/$id")({
  loader: ({ params }) => {
    const quiz = quizzes[params.id];
    if (!quiz) throw notFound();
    return { quiz, id: params.id };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.quiz.title} · VidyaVerse` : "Quiz not found · VidyaVerse";
    return {
      meta: [
        { title: t },
        { name: "description", content: "Practice quiz with explanations and Concept Detective feedback." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Practice quiz with explanations and Concept Detective feedback." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="card-surface p-10 text-center rounded-xl border border-border">
      <p className="font-semibold text-foreground">Quiz not found.</p>
      <Link to="/learn" className="text-[#6541F5] font-semibold underline mt-2 inline-block">
        Back to library
      </Link>
    </div>
  ),
  component: QuizPage,
});

function QuizPage() {
  const { quiz, id } = Route.useLoaderData();
  return <QuizView quiz={quiz} quizId={id} />;
}
