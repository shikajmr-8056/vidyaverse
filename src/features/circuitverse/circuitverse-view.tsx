import { useState } from "react";
import {
  CircuitBoard, Zap, Power, RotateCcw, Lightbulb, Battery, Cpu,
  Sparkles, Sliders, Info, Save, AlertTriangle, CheckCircle2, Shield,
  ArrowRight, BookOpen, Layers, Check, Wrench, HelpCircle, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, DemoTag } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

// ==========================================
// COMPONENT LIBRARY SPECIFICATIONS
// ==========================================
interface PowerSource {
  id: string;
  name: string;
  voltage: number;
  desc: string;
}

const POWER_SOURCES: PowerSource[] = [
  { id: "bat-9v", name: "9V Transistor Battery", voltage: 9.0, desc: "Standard 9V PP3 alkaline cell" },
  { id: "rail-5v", name: "5V USB / Arduino Rail", voltage: 5.0, desc: "Regulated 5V TTL logic level" },
  { id: "cell-3v", name: "3V Lithium Coin Cell", voltage: 3.0, desc: "CR2032 low-voltage coin battery" },
];

interface ResistorOption {
  value: number;
  label: string;
  bands: string;
  recommendedFor: string;
}

const RESISTORS: ResistorOption[] = [
  { value: 100, label: "100 Ω", bands: "Brown - Black - Brown", recommendedFor: "Bright (Caution: High Current)" },
  { value: 220, label: "220 Ω", bands: "Red - Red - Brown", recommendedFor: "Safe 5V LED Limiter" },
  { value: 330, label: "330 Ω", bands: "Orange - Orange - Brown", recommendedFor: "Safe 9V Standard Limiter" },
  { value: 1000, label: "1 kΩ (1000 Ω)", bands: "Brown - Black - Red", recommendedFor: "Dim Indicator / Low Power" },
  { value: 10000, label: "10 kΩ (10000 Ω)", bands: "Brown - Black - Orange", recommendedFor: "Pull-up / Logic Level" },
];

interface LedOption {
  color: "Red" | "Amber" | "Green" | "Blue";
  forwardVoltage: number;
  maxCurrent_mA: number;
  hex: string;
}

const LEDS: LedOption[] = [
  { color: "Red", forwardVoltage: 1.8, maxCurrent_mA: 25, hex: "#EF4444" },
  { color: "Amber", forwardVoltage: 2.0, maxCurrent_mA: 25, hex: "#F59E0B" },
  { color: "Green", forwardVoltage: 2.2, maxCurrent_mA: 25, hex: "#10B981" },
  { color: "Blue", forwardVoltage: 3.0, maxCurrent_mA: 30, hex: "#3B82F6" },
];

type LogicMode = "NONE" | "AND" | "OR" | "NOT";

export function CircuitVerseView() {
  const d = useDemo();

  // Studio Mode: experiments | workbench | concepts | physical-kit
  const [activeStudioTab, setActiveStudioTab] = useState<string>("experiments");

  // Circuit Reactive Parameters
  const [selectedPowerId, setSelectedPowerId] = useState<string>("bat-9v");
  const [selectedResistorVal, setSelectedResistorVal] = useState<number>(330);
  const [selectedLedColor, setSelectedLedColor] = useState<"Red" | "Amber" | "Green" | "Blue">("Green");
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(false);
  const [isSwitchBClosed, setIsSwitchBClosed] = useState<boolean>(false); // Secondary switch for logic gates
  const [logicGateMode, setLogicGateMode] = useState<LogicMode>("NONE");

  // Selected Experiment ID
  const [selectedExpId, setSelectedExpId] = useState<string>("exp-1");

  // Resolved Physical Parameters
  const powerSource = POWER_SOURCES.find((p) => p.id === selectedPowerId) ?? POWER_SOURCES[0]!;
  const ledSpec = LEDS.find((l) => l.color === selectedLedColor) ?? LEDS[0]!;

  // Determine Logic Gate State
  const isLogicGateActive = () => {
    if (logicGateMode === "NONE") return isSwitchClosed;
    if (logicGateMode === "AND") return isSwitchClosed && isSwitchBClosed;
    if (logicGateMode === "OR") return isSwitchClosed || isSwitchBClosed;
    if (logicGateMode === "NOT") return !isSwitchClosed;
    return isSwitchClosed;
  };

  const gateConducting = isLogicGateActive();

  // Ohm's Law Physics Calculations:
  // V_R = max(0, V_source - V_forward)
  // I = V_R / R
  const voltageDrop_LED = gateConducting && powerSource.voltage >= ledSpec.forwardVoltage ? ledSpec.forwardVoltage : 0;
  const resistorVoltage = gateConducting ? Math.max(0, powerSource.voltage - voltageDrop_LED) : 0;
  const current_A = gateConducting && selectedResistorVal > 0 ? resistorVoltage / selectedResistorVal : 0;
  const current_mA = Math.round(current_A * 1000 * 10) / 10;
  const powerDissipation_mW = Math.round(current_A * current_A * selectedResistorVal * 1000);

  // Diagnostic State Flags
  const isUnderVoltage = gateConducting && powerSource.voltage < ledSpec.forwardVoltage;
  const isBurnedOut = gateConducting && current_mA > ledSpec.maxCurrent_mA;
  const isOpenCircuit = !gateConducting;
  const isOptimal = gateConducting && !isUnderVoltage && !isBurnedOut && current_mA >= 5 && current_mA <= ledSpec.maxCurrent_mA;

  // LED Illumination Opacity (0 to 1)
  const ledGlow = isBurnedOut ? 0 : isUnderVoltage || !gateConducting ? 0 : Math.min(1, Math.max(0.2, current_mA / 20));

  const handleToggleSwitch = () => {
    const next = !isSwitchClosed;
    setIsSwitchClosed(next);
    if (next) {
      d.unlock("circuit-closed");
      d.awardActivityXp("circuitverse-first-close", 20, "Closed a live circuit in CircuitVerse");
    }
  };

  const handleReset = () => {
    setSelectedPowerId("bat-9v");
    setSelectedResistorVal(330);
    setSelectedLedColor("Green");
    setIsSwitchClosed(false);
    setIsSwitchBClosed(false);
    setLogicGateMode("NONE");
  };

  const handleSaveToPortfolio = () => {
    d.addProject({
      title: "Breadboard Electronics Simulation",
      category: "Electronics",
      status: "completed",
      xpEarned: 100,
      description: `Verified ${powerSource.name} (${powerSource.voltage}V) powering ${selectedLedColor} LED through ${selectedResistorVal}Ω resistor. Current draw: ${current_mA}mA.`,
      skills: ["Ohm's Law", "Current Limiting", "Component Selection"],
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header with Emerald / Teal Identity */}
      <PageHeader
        title="CircuitVerse: Virtual Electronics Lab"
        description="Interactive electronics workbench featuring Ohm's law physics, component connection diagnostics, logic gates, and physical STEM kit guides."
        eyebrow={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8EE] px-3 py-1 text-xs font-bold text-[#19B99A]">
              <CircuitBoard className="h-3.5 w-3.5" /> Electronics Studio
            </span>
            <DemoTag>Client Offline Simulator</DemoTag>
          </div>
        }
        actions={
          <div className="flex gap-2.5">
            <Button size="sm" variant="outline" onClick={handleReset} className="border-border text-xs font-semibold">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset Lab
            </Button>
            <Button
              size="sm"
              onClick={handleSaveToPortfolio}
              className="bg-[#19B99A] text-white hover:bg-[#19B99A]/90 font-bold text-xs shadow-sm"
            >
              <Save className="h-3.5 w-3.5 mr-1" /> Save to Portfolio (+100 XP)
            </Button>
          </div>
        }
      />

      {/* Main Studio Navigation Tabs */}
      <Tabs value={activeStudioTab} onValueChange={setActiveStudioTab} className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 w-full sm:w-auto flex flex-wrap">
          <TabsTrigger
            value="experiments"
            className="data-[state=active]:bg-[#19B99A] data-[state=active]:text-white text-xs font-bold"
          >
            🧪 Guided Experiments (4)
          </TabsTrigger>
          <TabsTrigger
            value="workbench"
            className="data-[state=active]:bg-[#0284C7] data-[state=active]:text-white text-xs font-bold"
          >
            ⚡ Virtual Breadboard Workbench
          </TabsTrigger>
          <TabsTrigger
            value="concepts"
            className="data-[state=active]:bg-[#6541F5] data-[state=active]:text-white text-xs font-bold"
          >
            📖 Ohm's Law & Logic Theory
          </TabsTrigger>
          <TabsTrigger
            value="physical-kit"
            className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-xs font-bold"
          >
            🧰 Physical STEM Kit Guide
          </TabsTrigger>
        </TabsList>

        {/* ======================================================== */}
        {/* 1. GUIDED EXPERIMENTS                                    */}
        {/* ======================================================== */}
        <TabsContent value="experiments" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "exp-1",
                num: "Exp 1",
                title: "The Single-Loop Torch",
                objective: "Build a closed circuit loop with a 9V cell, 330Ω resistor, and LED.",
                setup: () => {
                  setSelectedPowerId("bat-9v");
                  setSelectedResistorVal(330);
                  setSelectedLedColor("Green");
                  setLogicGateMode("NONE");
                  setIsSwitchClosed(false);
                },
                xp: 25,
              },
              {
                id: "exp-2",
                num: "Exp 2",
                title: "Ohm's Law: Current vs Resistance",
                objective: "Observe how increasing resistance from 100Ω to 1000Ω dims the LED.",
                setup: () => {
                  setSelectedPowerId("bat-9v");
                  setSelectedResistorVal(100);
                  setSelectedLedColor("Red");
                  setLogicGateMode("NONE");
                  setIsSwitchClosed(true);
                },
                xp: 35,
              },
              {
                id: "exp-3",
                num: "Exp 3",
                title: "Digital Logic AND Gate",
                objective: "Connect two switches in series; observe that both must close to conduct.",
                setup: () => {
                  setSelectedPowerId("rail-5v");
                  setSelectedResistorVal(220);
                  setSelectedLedColor("Blue");
                  setLogicGateMode("AND");
                  setIsSwitchClosed(false);
                  setIsSwitchBClosed(false);
                },
                xp: 40,
              },
              {
                id: "exp-4",
                num: "Exp 4",
                title: "Diagnostic: Overload & Burnout",
                objective: "Test the limits of 100Ω vs 9V; observe the dangerous burnout threshold.",
                setup: () => {
                  setSelectedPowerId("bat-9v");
                  setSelectedResistorVal(100);
                  setSelectedLedColor("Amber");
                  setLogicGateMode("NONE");
                  setIsSwitchClosed(false);
                },
                xp: 40,
              },
            ].map((exp) => (
              <div
                key={exp.id}
                className={cn(
                  "card-surface p-4.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3",
                  selectedExpId === exp.id
                    ? "border-[#19B99A] ring-2 ring-[#19B99A]/20 shadow-md"
                    : "border-border hover:border-[#19B99A]/50",
                )}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <Badge className="bg-[#19B99A] text-white text-[10px] font-bold">{exp.num}</Badge>
                    <span className="text-[11px] font-bold text-[#19B99A]">+{exp.xp} XP</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{exp.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{exp.objective}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedExpId(exp.id);
                    exp.setup();
                    setActiveStudioTab("workbench");
                  }}
                  className="w-full bg-[#19B99A] hover:bg-[#19B99A]/90 text-white text-xs font-bold"
                >
                  Load into Workbench →
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 2. VIRTUAL BREADBOARD WORKBENCH                          */}
        {/* ======================================================== */}
        <TabsContent value="workbench" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Interactive Circuit Schematic / Breadboard Canvas */}
            <div className="lg:col-span-8 card-surface p-6 rounded-2xl border border-border shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <CircuitBoard className="h-5 w-5 text-[#19B99A]" />
                  <span className="font-bold text-base text-foreground">Interactive Circuit Schematic</span>
                </div>
                {/* Circuit Condition Badge */}
                <span
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-xs font-bold border",
                    isOpenCircuit && "bg-muted text-muted-foreground border-border",
                    isBurnedOut && "bg-[#FCE5EB] text-[#E95778] border-[#E95778]/40 animate-pulse",
                    isUnderVoltage && "bg-[#FFF0D5] text-[#B45309] border-[#F5A623]/40",
                    isOptimal && "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40",
                  )}
                >
                  {isOpenCircuit
                    ? "⚪ Open Loop (No Current)"
                    : isBurnedOut
                    ? "⚠️ Component Burnout Alert!"
                    : isUnderVoltage
                    ? "⚠️ Under-Voltage Failure"
                    : "⚡ Closed Loop: Normal Current Flow"}
                </span>
              </div>

              {/* Schematic Canvas Box */}
              <div className="relative rounded-2xl border border-border bg-neutral-950 p-6 min-h-[320px] flex flex-col items-center justify-center text-white overflow-hidden select-none">
                {/* Circuit Loop Outline Wire */}
                <div
                  className="relative z-10 w-full max-w-lg border-2 border-dashed rounded-3xl p-6 transition-colors duration-500"
                  style={{
                    borderColor: isOptimal ? "#10B981" : isBurnedOut ? "#EF4444" : "#4B5563",
                  }}
                >
                  {/* Top Wire Segment: Power Source & Knife Switch */}
                  <div className="flex items-center justify-between">
                    {/* Power Source */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2.5 rounded-xl">
                      <Battery className="h-6 w-6 text-[#10B981]" />
                      <div className="text-left text-xs">
                        <p className="font-bold text-white leading-none">{powerSource.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">V_s = {powerSource.voltage}V</p>
                      </div>
                    </div>

                    {/* Switch A */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSwitch}
                        className={cn(
                          "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm flex items-center gap-1.5",
                          isSwitchClosed
                            ? "bg-[#10B981] border-[#10B981] text-white"
                            : "bg-neutral-800 border-neutral-600 text-neutral-300 hover:text-white",
                        )}
                      >
                        <Power className="h-3.5 w-3.5" />
                        {isSwitchClosed ? "Switch A: CLOSED" : "Switch A: OPEN"}
                      </button>

                      {/* Switch B (Visible when Logic Gate mode is active) */}
                      {logicGateMode !== "NONE" && (
                        <button
                          type="button"
                          onClick={() => setIsSwitchBClosed(!isSwitchBClosed)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm flex items-center gap-1.5",
                            isSwitchBClosed
                              ? "bg-[#10B981] border-[#10B981] text-white"
                              : "bg-neutral-800 border-neutral-600 text-neutral-300 hover:text-white",
                          )}
                        >
                          <Power className="h-3.5 w-3.5" />
                          {isSwitchBClosed ? "Switch B: CLOSED" : "Switch B: OPEN"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Middle: Logic Gate Symbol (if active) */}
                  {logicGateMode !== "NONE" && (
                    <div className="my-3 text-center">
                      <span className="rounded-full bg-neutral-800 border border-neutral-600 px-3 py-1 text-xs font-mono font-bold text-[#38BDF8]">
                        Logic Gate: {logicGateMode} [A={isSwitchClosed ? 1 : 0}, B={isSwitchBClosed ? 1 : 0}] → OUT={gateConducting ? 1 : 0}
                      </span>
                    </div>
                  )}

                  {/* Bottom Wire Segment: Resistor & Output LED */}
                  <div className="flex items-center justify-between mt-6">
                    {/* Current Limiting Resistor */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2.5 rounded-xl text-left text-xs">
                      <div className="h-4 w-12 rounded bg-amber-900/60 border border-amber-600 flex items-center justify-center text-[10px] font-mono">
                        {selectedResistorVal}Ω
                      </div>
                      <div>
                        <p className="font-bold text-white leading-none">Resistor R</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">V_R = {resistorVoltage.toFixed(1)}V</p>
                      </div>
                    </div>

                    {/* Output LED */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 p-2.5 rounded-xl text-left text-xs">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isBurnedOut ? "#1F2937" : ledSpec.hex,
                          boxShadow: isOptimal ? `0 0 18px ${ledSpec.hex}` : "none",
                          opacity: isBurnedOut ? 0.3 : ledGlow,
                        }}
                      >
                        <Lightbulb className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-none">{selectedLedColor} LED</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">V_f = {ledSpec.forwardVoltage}V</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Error & Circuit Explanations */}
              <div
                className={cn(
                  "rounded-xl p-4 text-xs space-y-1 border",
                  isOpenCircuit && "bg-muted/70 text-foreground border-border",
                  isBurnedOut && "bg-[#FCE5EB] text-[#E95778] border-[#E95778]/30",
                  isUnderVoltage && "bg-[#FFF0D5] text-[#B45309] border-[#F5A623]/30",
                  isOptimal && "bg-[#DDF8EE] text-[#0F766E] border-[#19B99A]/30",
                )}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {isOptimal ? (
                    <CheckCircle2 className="h-4 w-4 text-[#19B99A]" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <span>Circuit Diagnostic Feedback:</span>
                </div>
                <p className="leading-relaxed">
                  {isOpenCircuit
                    ? "The conducting loop is open. Air has near-infinite electrical resistance, so electrons cannot traverse the gap. Close Switch A to allow current to circulate."
                    : isBurnedOut
                    ? `Warning! Calculated loop current (${current_mA} mA) exceeds the maximum continuous rating of the ${selectedLedColor} LED (${ledSpec.maxCurrent_mA} mA). Excess thermal energy will melt the diode junction. Increase resistance to at least 220 Ω!`
                    : isUnderVoltage
                    ? `Supply voltage (${powerSource.voltage} V) is less than the forward threshold voltage of the ${selectedLedColor} LED (${ledSpec.forwardVoltage} V). Electrons lack sufficient energy to overcome the bandgap.`
                    : `Circuit is operating safely. Current (${current_mA} mA) is safely regulated by the ${selectedResistorVal} Ω resistor. Heat generated in resistor is ${powerDissipation_mW} mW.`}
                </p>
              </div>
            </div>

            {/* Right: Real-Time Physics Telemetry & Component Palettes */}
            <div className="lg:col-span-4 space-y-4">
              {/* Live Ohm's Law Telemetry Meter */}
              <Panel title="Ohm's Law Live Telemetry">
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground font-sans">Supply (V_s):</span>
                    <span className="font-bold text-foreground">{powerSource.voltage.toFixed(1)} V</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground font-sans">LED Drop (V_f):</span>
                    <span className="font-bold text-foreground">{voltageDrop_LED.toFixed(1)} V</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground font-sans">Resistor Drop (V_R):</span>
                    <span className="font-bold text-foreground">{resistorVoltage.toFixed(1)} V</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground font-sans">Loop Current (I = V/R):</span>
                    <span
                      className={cn(
                        "font-bold",
                        isBurnedOut ? "text-[#E95778]" : isOptimal ? "text-[#19B99A]" : "text-muted-foreground",
                      )}
                    >
                      {current_mA} mA
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted-foreground font-sans">Power Dissipated (P):</span>
                    <span className="font-bold text-foreground">{powerDissipation_mW} mW</span>
                  </div>
                </div>
              </Panel>

              {/* Supported Components Toolbar */}
              <Panel title="Component Selectors">
                <div className="space-y-3 text-xs">
                  {/* Power Source Selector */}
                  <div>
                    <label className="font-bold text-muted-foreground block mb-1">Power Supply:</label>
                    <select
                      value={selectedPowerId}
                      onChange={(e) => setSelectedPowerId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-xs font-medium text-foreground focus:outline-none"
                    >
                      {POWER_SOURCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.voltage}V)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resistor Value Selector */}
                  <div>
                    <label className="font-bold text-muted-foreground block mb-1">Protective Resistor:</label>
                    <select
                      value={selectedResistorVal}
                      onChange={(e) => setSelectedResistorVal(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-card p-2 text-xs font-medium text-foreground focus:outline-none"
                    >
                      {RESISTORS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label} — {r.recommendedFor}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* LED Color Selector */}
                  <div>
                    <label className="font-bold text-muted-foreground block mb-1">LED Diode:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {LEDS.map((l) => (
                        <button
                          key={l.color}
                          type="button"
                          onClick={() => setSelectedLedColor(l.color)}
                          className={cn(
                            "rounded-lg p-1.5 text-xs font-bold border transition-all text-center",
                            selectedLedColor === l.color
                              ? "border-[#19B99A] ring-2 ring-[#19B99A]/20 bg-card text-foreground"
                              : "border-border bg-card text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <div className="h-3 w-3 rounded-full mx-auto mb-1" style={{ backgroundColor: l.hex }} />
                          {l.color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logic Gate Mode */}
                  <div>
                    <label className="font-bold text-muted-foreground block mb-1">Logic Module:</label>
                    <select
                      value={logicGateMode}
                      onChange={(e) => setLogicGateMode(e.target.value as LogicMode)}
                      className="w-full rounded-lg border border-border bg-card p-2 text-xs font-medium text-foreground focus:outline-none"
                    >
                      <option value="NONE">None (Simple Single Switch)</option>
                      <option value="AND">AND Gate (Dual Series Switches)</option>
                      <option value="OR">OR Gate (Dual Parallel Switches)</option>
                      <option value="NOT">NOT Gate (Inverter)</option>
                    </select>
                  </div>
                </div>
              </Panel>

              {/* Documented Simulator Limitations */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-1 font-bold text-foreground mb-1">
                  <Info className="h-3.5 w-3.5 text-[#19B99A]" /> Simulator Physics Specifications
                </div>
                This workbench computes idealized DC steady-state lumped parameters ($I = (V - V_f)/R$) with piecewise linear forward threshold voltage approximations. AC reactance, capacitor time constants, and diode thermal runaway are not modeled.
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 3. OHM'S LAW & LOGIC THEORY EXPLANATIONS                 */}
        {/* ======================================================== */}
        <TabsContent value="concepts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Ohm's Law: The Golden Triangle">
              <div className="space-y-3 text-xs text-foreground leading-relaxed">
                <div className="rounded-xl bg-[#DDF8EE] p-4 text-center font-mono font-bold text-[#0F766E] border border-[#19B99A]/30">
                  <p className="text-lg">I = V / R</p>
                  <p className="text-xs font-normal mt-1">Current (Amperes) = Potential (Volts) ÷ Resistance (Ohms)</p>
                </div>
                <p>
                  <strong>Voltage (V)</strong> represents electrical pressure from the cell terminals.
                  <strong> Resistance (R)</strong> opposes the flow of electrons, converting electrical energy into heat.
                  <strong> Current (I)</strong> is the rate at which charge carriers travel through the loop.
                </p>
                <div className="rounded-lg bg-card border border-border p-3 space-y-1">
                  <p className="font-bold text-[#19B99A]">Why do LEDs require resistors?</p>
                  <p className="text-muted-foreground">
                    An LED has negligible internal resistance once turned on. Without a series resistor, excessive current floods the semiconductor, vaporizing the wire bond within milliseconds.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Digital Logic Gates: Truth Tables">
              <div className="space-y-3 text-xs text-foreground leading-relaxed">
                <p>Digital electronics builds complex computers using basic logic operations:</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-muted font-bold">
                      <tr>
                        <th className="p-2 border-r border-border">Gate</th>
                        <th className="p-2 border-r border-border">In A</th>
                        <th className="p-2 border-r border-border">In B</th>
                        <th className="p-2">Output LED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-2 font-bold text-[#19B99A] border-r border-border">AND</td>
                        <td className="p-2 border-r border-border">1 (Closed)</td>
                        <td className="p-2 border-r border-border">1 (Closed)</td>
                        <td className="p-2 font-bold text-[#19B99A]">1 (Lit)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-[#19B99A] border-r border-border">AND</td>
                        <td className="p-2 border-r border-border">1 (Closed)</td>
                        <td className="p-2 border-r border-border">0 (Open)</td>
                        <td className="p-2 text-muted-foreground">0 (Off)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-[#0284C7] border-r border-border">OR</td>
                        <td className="p-2 border-r border-border">1 (Closed)</td>
                        <td className="p-2 border-r border-border">0 (Open)</td>
                        <td className="p-2 font-bold text-[#0284C7]">1 (Lit)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 4. PHYSICAL STEM KIT GUIDE (RURAL CLASSROOMS)            */}
        {/* ======================================================== */}
        <TabsContent value="physical-kit" className="space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#F5A623]" />
              <h3 className="font-bold text-base text-foreground">
                Transitioning from Virtual Simulator to Real STEM Breadboards
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              VidyaVerse designs all virtual simulations to map 1:1 onto low-cost physical classroom components available across Indian rural government schools:
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <Badge className="bg-[#19B99A] text-white text-[10px]">Component Pinout</Badge>
                <h4 className="font-bold text-xs text-foreground">5mm LED Polarity Guide</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  • <strong>Longer Lead (+):</strong> Anode, connects toward positive rail via resistor.<br />
                  • <strong>Shorter Lead (-) / Flat Rim:</strong> Cathode, connects toward 0V / ground rail.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <Badge className="bg-[#F5A623] text-white text-[10px]">Color Code Reader</Badge>
                <h4 className="font-bold text-xs text-foreground">330 Ω Resistor Bands</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  • Band 1: Orange (3)<br />
                  • Band 2: Orange (3)<br />
                  • Band 3: Brown (×10)<br />
                  • Band 4: Gold (±5% tolerance)
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <Badge className="bg-[#0284C7] text-white text-[10px]">Safety Protocol</Badge>
                <h4 className="font-bold text-xs text-foreground">Bench Precautions</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  • Always disconnect the 9V battery before re-routing jumper wires.<br />
                  • Never connect the battery positive snap directly to negative without a resistor.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
