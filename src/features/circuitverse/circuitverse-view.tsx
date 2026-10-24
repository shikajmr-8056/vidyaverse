import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed, ArcadeTab } from "@/components/vv/arcade-embed";

const CIRCUITVERSE_TABS: ArcadeTab[] = [
  { id: "studio", label: "Circuit Simulator Studio", route: "/circuitverse", icon: "⚡" },
];

export function CircuitVerseView() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="CircuitVerse · Electronics & Physics Laboratory"
        description="Wire resistors, DC power sources, switches, logic gates, and LEDs on a virtual breadboard with live Ohm's law analytics."
      />

      <ArcadeEmbed
        title="CircuitVerse"
        defaultRoute="/circuitverse"
        tabs={CIRCUITVERSE_TABS}
        height="h-[calc(100vh-12.5rem)] min-h-[720px]"
      />
    </div>
  );
}
