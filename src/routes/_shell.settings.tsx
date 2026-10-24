import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "@/features/settings";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Accessibility · VidyaVerse" },
      { name: "description", content: "Personalize language, dark/light theme, typography size and offline download policies." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <SettingsView />;
}
