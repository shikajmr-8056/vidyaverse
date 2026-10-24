import { createFileRoute } from "@tanstack/react-router";
import { VoiceView } from "@/features/voice";

export const Route = createFileRoute("/_shell/voice")({
  head: () => ({
    meta: [
      { title: "VidyaVerse Voice · Multilingual Audio Assistant" },
      { name: "description", content: "Voice-driven learning companion for low-literacy and regional language students." },
    ],
  }),
  component: VoiceAssistantPage,
});

function VoiceAssistantPage() {
  return <VoiceView />;
}
