import { createFileRoute } from "@tanstack/react-router";
import { CircuitVerseView } from "@/features/circuitverse";

export const Route = createFileRoute("/_shell/circuitverse")({
  head: () => ({
    meta: [
      { title: "CircuitVerse · Virtual Electronics Lab · VidyaVerse" },
      { name: "description", content: "Interactive virtual breadboard, components, Ohm's law simulation and Arduino preview." },
      { property: "og:title", content: "CircuitVerse · Virtual Electronics Lab · VidyaVerse" },
      { property: "og:description", content: "Interactive virtual breadboard, components, Ohm's law simulation and Arduino preview." },
    ],
  }),
  component: CircuitVersePage,
});

function CircuitVersePage() {
  return <CircuitVerseView />;
}
