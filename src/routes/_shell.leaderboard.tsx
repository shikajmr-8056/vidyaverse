import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardView } from "@/features/gamification";

export const Route = createFileRoute("/_shell/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard · Fair Offline Competition · VidyaVerse" },
      { name: "description", content: "Weekly and lifetime student leaderboards with late offline sync reconciliation." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return <LeaderboardView />;
}
