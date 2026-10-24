import { createFileRoute } from "@tanstack/react-router";
import { ChallengesView } from "@/features/gamification";

export const Route = createFileRoute("/_shell/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges & STEM Missions · VidyaVerse" },
      { name: "description", content: "Daily curriculum challenges, school competitions and hands-on build missions." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  return <ChallengesView />;
}
