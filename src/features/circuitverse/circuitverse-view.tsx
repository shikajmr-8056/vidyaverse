import { PageHeader } from "@/components/vv/primitives";
import { ArcadeEmbed } from "@/components/vv/arcade-embed";

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
        height="h-[calc(100vh-13rem)] min-h-[720px]"
      />
    </div>
  );
}
