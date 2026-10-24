import { createFileRoute } from "@tanstack/react-router";
import { RewardsView } from "@/features/gamification";

export const Route = createFileRoute("/_shell/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards Store · Academic Incentives · VidyaVerse" },
      { name: "description", content: "Redeem learning XP for physical STEM kits, solar components, stationery and certificates." },
      { property: "og:title", content: "Rewards Store · Academic Incentives · VidyaVerse" },
      { property: "og:description", content: "Redeem learning XP for physical STEM kits, solar components, stationery and certificates." },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return <RewardsView />;
}
