import { useState } from "react";
import {
  Code2, Play, RotateCcw, CheckCircle2, Terminal,
  Layers, Braces, Sparkles, AlertCircle, HelpCircle,
  Lightbulb, Target, ArrowRight, Save, Shield, Check,
  ChevronRight, Smartphone, Laptop, FileCode, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, DemoTag } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

// ==========================================
// GUIDED CHALLENGES DEFINITION
// ==========================================
interface CodeChallenge {
  id: string;
  name: string;
  topic: "Sequences" | "Loops" | "Conditionals" | "Variables" | "Debugging";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objective: string;
  instructions: string[];
  initialBlocks: string[];
  targetPos: { x: number; y: number };
  targetDir?: "UP" | "RIGHT" | "DOWN" | "LEFT";
  maxBlocks: number;
  hint: string;
  xpReward: number;
}

const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: "ch-1",
    name: "Challenge 1: Rover's First Flight Path",
    topic: "Sequences",
    difficulty: "Beginner",
    objective: "Command the rover to move forward 3 times and turn right to face the solar pad at (3, 0).",
    instructions: [
      "Add three move_forward() blocks to travel straight across row 0.",
      "Add one turn_right() block so the rover faces south toward the battery terminal.",
      "Run the sequence and observe the step-by-step execution tracer.",
    ],
    initialBlocks: ["move_forward()", "move_forward()", "move_forward()", "turn_right()"],
    targetPos: { x: 3, y: 0 },
    targetDir: "DOWN",
    maxBlocks: 5,
    hint: "The grid is 4x4 starting at (0,0). Three forward moves take you from (0,0) -> (1,0) -> (2,0) -> (3,0).",
    xpReward: 30,
  },
  {
    id: "ch-2",
    name: "Challenge 2: Square Perimeter Loop",
    topic: "Loops",
    difficulty: "Intermediate",
    objective: "Navigate a perimeter route using a repeat loop instead of typing repeated forward blocks.",
    instructions: [
      "Use the 'repeat 4 times do' loop block to encapsulate repetitive commands.",
      "Inside the loop, insert move_forward() and turn_right().",
      "Notice how loops keep code clean and eliminate copy-pasted blocks.",
    ],
    initialBlocks: ["repeat 4 times do", "  move_forward()", "  turn_right()"],
    targetPos: { x: 0, y: 0 },
    maxBlocks: 4,
    hint: "A square has 4 equal sides and 4 right angles. Repeating (forward + turn right) 4 times returns to the origin.",
    xpReward: 40,
  },
  {
    id: "ch-3",
    name: "Challenge 3: Sensor Obstacle Avoidance",
    topic: "Conditionals",
    difficulty: "Advanced",
    objective: "Guide the rover around asteroid debris at (2,0) to reach the solar outpost at (3,1).",
    instructions: [
      "Check if an obstacle is ahead using conditional branching.",
      "Turn right, advance around the barrier, then re-orient toward (3,1).",
      "Avoid crashing into the outer grid perimeter.",
    ],
    initialBlocks: [
      "move_forward()",
      "turn_right()",
      "move_forward()",
      "turn_left()",
      "move_forward()",
      "move_forward()",
    ],
    targetPos: { x: 3, y: 1 },
    maxBlocks: 8,
    hint: "Drop down to row 1 early to bypass the rock at (2,0), then advance right toward column 3.",
    xpReward: 50,
  },
];

// Available block palette
const BLOCK_PALETTE = [
  { text: "move_forward()", category: "Motion", color: "#42A5E8", bg: "#DDF2FC" },
  { text: "turn_left()", category: "Motion", color: "#42A5E8", bg: "#DDF2FC" },
  { text: "turn_right()", category: "Motion", color: "#42A5E8", bg: "#DDF2FC" },
  { text: "repeat 4 times do", category: "Loops", color: "#F5A623", bg: "#FFF0D5" },
  { text: "  move_forward()", category: "Indented Loop Body", color: "#F5A623", bg: "#FFF0D5" },
  { text: "  turn_right()", category: "Indented Loop Body", color: "#F5A623", bg: "#FFF0D5" },
  { text: "if obstacle_ahead() then", category: "Conditionals", color: "#19B99A", bg: "#DDF8EE" },
  { text: "set speed = 10", category: "Variables", color: "#6541F5", bg: "#EAE7FF" },
];

export function CodeVerseView() {
  const d = useDemo();

  // Studio tabs: challenges | workspace | theory | syntax
  const [activeStudioTab, setActiveStudioTab] = useState<string>("challenges");

  // Selected Challenge
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("ch-1");
  const activeChallenge = CODE_CHALLENGES.find((c) => c.id === selectedChallengeId) ?? CODE_CHALLENGES[0]!;

  // CodeBlock Script Stack
  const [blocks, setBlocks] = useState<string[]>(activeChallenge.initialBlocks);

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(false);
  const [runningBlockIdx, setRunningBlockIdx] = useState<number | null>(null);
  const [roverPos, setRoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [roverDir, setRoverDir] = useState<"UP" | "RIGHT" | "DOWN" | "LEFT">("RIGHT");
  const [outputLogs, setOutputLogs] = useState<string[]>([
    "Rover Client Engine ready. Select a challenge and run verification tests.",
  ]);

  // Test Case Evaluation State
  const [testResults, setTestResults] = useState<{
    ran: boolean;
    destPassed: boolean;
    boundsPassed: boolean;
    blockCountPassed: boolean;
    errorMsg?: string | undefined;
  }>({
    ran: false,
    destPassed: false,
    boundsPassed: false,
    blockCountPassed: false,
  });

  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Mobile Workspace Sub-Tab (blocks | canvas | console | code)
  const [mobileSubTab, setMobileSubTab] = useState<"blocks" | "canvas" | "console" | "code">("blocks");

  // Switch challenge
  const handleSelectChallenge = (chId: string) => {
    setSelectedChallengeId(chId);
    const ch = CODE_CHALLENGES.find((c) => c.id === chId) ?? CODE_CHALLENGES[0]!;
    setBlocks(ch.initialBlocks);
    setRoverPos({ x: 0, y: 0 });
    setRoverDir("RIGHT");
    setRunningBlockIdx(null);
    setIsRunning(false);
    setShowHint(false);
    setTestResults({ ran: false, destPassed: false, boundsPassed: false, blockCountPassed: false });
    setOutputLogs([`Loaded ${ch.name}: ${ch.objective}`]);
  };

  const handleAddBlock = (blockText: string) => {
    if (blocks.length < 12 && !isRunning) {
      setBlocks([...blocks, blockText]);
      setOutputLogs((prev) => [...prev, `[EDITOR] Added instruction node: ${blockText}`]);
    }
  };

  const handleRemoveBlock = (index: number) => {
    if (!isRunning) {
      setBlocks(blocks.filter((_, i) => i !== index));
    }
  };

  const handleResetScript = () => {
    setBlocks(activeChallenge.initialBlocks);
    setRoverPos({ x: 0, y: 0 });
    setRoverDir("RIGHT");
    setRunningBlockIdx(null);
    setIsRunning(false);
    setTestResults({ ran: false, destPassed: false, boundsPassed: false, blockCountPassed: false });
    setOutputLogs(["[RESET] Restored challenge initial template."]);
  };

  // Run Test Suite & Step-by-Step Simulation
  const handleRunProgram = async () => {
    setIsRunning(true);
    setRoverPos({ x: 0, y: 0 });
    setRoverDir("RIGHT");
    setOutputLogs(["[RUNTIME] Initializing rover interpreter..."]);

    let curX = 0;
    let curY = 0;
    let curDir: "UP" | "RIGHT" | "DOWN" | "LEFT" = "RIGHT";
    let hitBoundary = false;

    // Expand repeat loops into executed instructions
    const flatCommands: { cmd: string; origIdx: number }[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]!;
      if (b.startsWith("repeat")) {
        const countMatch = b.match(/\d+/);
        const iterations = countMatch ? Number(countMatch[0]) : 4;
        // Collect following indented lines
        const loopBody: string[] = [];
        let j = i + 1;
        while (j < blocks.length && blocks[j]!.startsWith("  ")) {
          loopBody.push(blocks[j]!.trim());
          j++;
        }
        for (let iter = 0; iter < iterations; iter++) {
          loopBody.forEach((subCmd) => flatCommands.push({ cmd: subCmd, origIdx: i }));
        }
        i = j - 1; // advance index
      } else {
        flatCommands.push({ cmd: b.trim(), origIdx: i });
      }
    }

    for (let step = 0; step < flatCommands.length; step++) {
      const { cmd, origIdx } = flatCommands[step]!;
      setRunningBlockIdx(origIdx);
      await new Promise((r) => setTimeout(r, 450));

      if (cmd === "turn_left()") {
        const dirs: Array<"UP" | "LEFT" | "DOWN" | "RIGHT"> = ["UP", "LEFT", "DOWN", "RIGHT"];
        curDir = dirs[(dirs.indexOf(curDir) + 1) % 4] ?? "RIGHT";
        setRoverDir(curDir);
        setOutputLogs((p) => [...p, `[STEP ${step + 1}] Rotated left → Heading ${curDir}`]);
      } else if (cmd === "turn_right()") {
        const dirs: Array<"UP" | "RIGHT" | "DOWN" | "LEFT"> = ["UP", "RIGHT", "DOWN", "LEFT"];
        curDir = dirs[(dirs.indexOf(curDir) + 1) % 4] ?? "RIGHT";
        setRoverDir(curDir);
        setOutputLogs((p) => [...p, `[STEP ${step + 1}] Rotated right → Heading ${curDir}`]);
      } else if (cmd === "move_forward()") {
        let nX = curX;
        let nY = curY;
        if (curDir === "UP") nY -= 1;
        if (curDir === "RIGHT") nX += 1;
        if (curDir === "DOWN") nY += 1;
        if (curDir === "LEFT") nX -= 1;

        if (nX < 0 || nX > 3 || nY < 0 || nY > 3) {
          hitBoundary = true;
          setOutputLogs((p) => [...p, `💥 [COLLISION] Step ${step + 1} struck grid boundary at (${nX}, ${nY})!`]);
          break;
        }

        // Challenge 3 asteroid check at (2,0)
        if (activeChallenge.id === "ch-3" && nX === 2 && nY === 0) {
          hitBoundary = true;
          setOutputLogs((p) => [...p, `💥 [COLLISION] Step ${step + 1} hit asteroid debris at (2,0)!`]);
          break;
        }

        curX = nX;
        curY = nY;
        setRoverPos({ x: curX, y: curY });
        setOutputLogs((p) => [...p, `[STEP ${step + 1}] Advanced forward to (${curX}, ${curY})`]);
      }
    }

    setRunningBlockIdx(null);
    setIsRunning(false);

    // Evaluate Test Criteria
    const destMatches = curX === activeChallenge.targetPos.x && curY === activeChallenge.targetPos.y;
    const dirMatches = !activeChallenge.targetDir || curDir === activeChallenge.targetDir;
    const destPassed = destMatches && dirMatches && !hitBoundary;
    const boundsPassed = !hitBoundary;
    const blockCountPassed = blocks.length <= activeChallenge.maxBlocks;
    const allPassed = destPassed && boundsPassed && blockCountPassed;

    setTestResults({
      ran: true,
      destPassed,
      boundsPassed,
      blockCountPassed,
      errorMsg: !destPassed
        ? `Rover finished at (${curX}, ${curY}) facing ${curDir}, but target is (${activeChallenge.targetPos.x}, ${activeChallenge.targetPos.y}).`
        : !boundsPassed
        ? "Program collided with obstacles or perimeter bounds."
        : !blockCountPassed
        ? `Code efficiency test failed: used ${blocks.length} blocks (limit is ${activeChallenge.maxBlocks}).`
        : undefined,
    });

    if (allPassed) {
      setOutputLogs((p) => [...p, "🎉 [SUCCESS] All test cases passed! +XP awarded."]);
      d.unlock("coder");
      d.awardActivityXp(
        `codeverse-${activeChallenge.id}`,
        activeChallenge.xpReward,
        `Passed CodeVerse ${activeChallenge.name}`,
      );
      setVictoryModalOpen(true);
    } else {
      setOutputLogs((p) => [...p, "❌ [FAILED] Test suite failed. Inspect diagnostic notes and debug."]);
    }
  };

  // Real-world Python code translation
  const pythonCode = `# VidyaVerse Auto-Generated Python Code
from vidyaverse_robot import Rover

bot = Rover(speed=10)

${blocks
  .map((b) => {
    if (b.startsWith("repeat")) {
      const match = b.match(/\d+/);
      const count = match ? match[0] : "4";
      return `for step in range(${count}):`;
    }
    if (b.startsWith("  ")) return `    bot.${b.trim()}`;
    if (b.startsWith("if")) return "if bot.detect_obstacle():";
    if (b.startsWith("set")) return "speed = 10";
    return `bot.${b}`;
  })
  .join("\n")}

print("Algorithm verified successfully.")
`;

  // Real-world Arduino C++ code translation
  const arduinoCode = `// VidyaVerse Generated Arduino C++ Sketch
#include <Servo.h>

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Executing sequenced instructions
${blocks
  .map((b) => {
    if (b.startsWith("repeat")) return "  for (int i = 0; i < 4; i++) {";
    if (b.startsWith("  ")) return "    motorForward(100);";
    if (b === "turn_right()") return "  motorTurnRight(90);";
    if (b === "turn_left()") return "  motorTurnLeft(90);";
    if (b.startsWith("if")) return "  if (digitalRead(SENSOR_PIN) == HIGH) {";
    return `  // ${b}`;
  })
  .join("\n")}
  
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
}
`;

  return (
    <div className="space-y-6">
      {/* Studio Header with Electric Indigo Identity */}
      <PageHeader
        title="CodeVerse: Computational Thinking & Code Studio"
        description="Master patterns, algorithms, loops, and conditions with interactive visual blocks, accompanied by real Python and Arduino C++ syntax bridges."
        eyebrow={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
              <Code2 className="h-3.5 w-3.5" /> Programming Workshop
            </span>
            <DemoTag>Client Offline Verified</DemoTag>
          </div>
        }
      />

      {/* Distinction Banner: Block Simulation vs Real Code */}
      <div className="rounded-xl border border-[#6541F5]/30 bg-[#EAE7FF]/40 p-4 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-[#6541F5]">
          <Shield className="h-4 w-4" /> Visual Block Engine: In-Browser Simulated Virtual Rover
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Blocks run directly inside this browser sandbox. The <strong>Python</strong> and <strong>Arduino C++</strong> views provide an educational syntax bridge to show how your visual logic maps to industry-standard code.
        </p>
      </div>

      {/* Main Studio Navigation Tabs */}
      <Tabs value={activeStudioTab} onValueChange={setActiveStudioTab} className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 w-full sm:w-auto flex flex-wrap">
          <TabsTrigger
            value="challenges"
            className="data-[state=active]:bg-[#6541F5] data-[state=active]:text-white text-xs font-bold"
          >
            🎯 Guided Challenges (3)
          </TabsTrigger>
          <TabsTrigger
            value="workspace"
            className="data-[state=active]:bg-[#0284C7] data-[state=active]:text-white text-xs font-bold"
          >
            🧩 Block Coding Workspace
          </TabsTrigger>
          <TabsTrigger
            value="theory"
            className="data-[state=active]:bg-[#19B99A] data-[state=active]:text-white text-xs font-bold"
          >
            💡 Computational Thinking Concepts
          </TabsTrigger>
          <TabsTrigger
            value="syntax"
            className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-xs font-bold"
          >
            💻 Real-World Code Bridge
          </TabsTrigger>
        </TabsList>

        {/* ======================================================== */}
        {/* 1. GUIDED CHALLENGES SELECTION                           */}
        {/* ======================================================== */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {CODE_CHALLENGES.map((ch) => (
              <div
                key={ch.id}
                className={cn(
                  "card-surface p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3",
                  selectedChallengeId === ch.id
                    ? "border-[#6541F5] ring-2 ring-[#6541F5]/20 shadow-md"
                    : "border-border hover:border-[#6541F5]/50",
                )}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge className="bg-[#6541F5] text-white text-[10px] font-bold">{ch.topic}</Badge>
                    <span className="text-[11px] font-bold text-[#19B99A]">+{ch.xpReward} XP</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{ch.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{ch.objective}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSelectChallenge(ch.id);
                    setActiveStudioTab("workspace");
                  }}
                  className="w-full bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold"
                >
                  Load Challenge Workspace →
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 2. INTERACTIVE BLOCK WORKSPACE (RESPONSIVE & MOBILE)     */}
        {/* ======================================================== */}
        <TabsContent value="workspace" className="space-y-6">
          {/* Active Challenge Header Panel */}
          <div className="card-surface p-4.5 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#6541F5] text-white text-[10px] font-bold">{activeChallenge.topic}</Badge>
                <h3 className="font-bold text-sm text-foreground">{activeChallenge.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{activeChallenge.objective}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowHint(!showHint)} className="text-xs h-8">
                <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#F5A623]" /> Hint
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetScript} className="text-xs h-8">
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {showHint && (
            <div className="rounded-xl bg-[#FFF0D5] p-3.5 text-xs text-[#B45309] border border-[#F5A623]/30 leading-relaxed">
              💡 <strong>Solution Hint:</strong> {activeChallenge.hint}
            </div>
          )}

          {/* MOBILE PURPOSEFUL SUB-TABS (Screen width < 768px) */}
          <div className="md:hidden flex gap-1 border-b border-border pb-2 overflow-x-auto">
            {(
              [
                { id: "blocks", label: "Blocks & Script" },
                { id: "canvas", label: "Rover Grid" },
                { id: "console", label: "Tests & Logs" },
                { id: "code", label: "Syntax" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMobileSubTab(t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors",
                  mobileSubTab === t.id ? "bg-[#6541F5] text-white" : "bg-card border border-border text-muted-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* WORKSPACE LAYOUT (3-Column Desktop Grid / Responsive Tabbed Mobile) */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Column 1: Block Palette (Desktop or Mobile Tab 'blocks') */}
            <div
              className={cn(
                "md:col-span-4 space-y-4",
                "max-md:block",
                mobileSubTab !== "blocks" && "max-md:hidden",
              )}
            >
              <Panel title="Block Palette">
                <p className="text-xs text-muted-foreground mb-3">Tap blocks to add them to your script:</p>
                <div className="space-y-1.5">
                  {BLOCK_PALETTE.map((block, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isRunning || blocks.length >= 12}
                      onClick={() => handleAddBlock(block.text)}
                      className="w-full text-left p-2.5 rounded-xl border border-border bg-card hover:bg-muted font-mono text-xs font-semibold flex items-center justify-between shadow-xs transition-transform active:scale-98"
                    >
                      <span className="truncate">{block.text}</span>
                      <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 ml-1"
                        style={{ backgroundColor: block.bg, color: block.color }}
                      >
                        {block.category}
                      </span>
                    </button>
                  ))}
                </div>
              </Panel>

              {/* Active Script Queue */}
              <Panel title={`Active Script (${blocks.length} / ${activeChallenge.maxBlocks} max)`}>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {blocks.map((block, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono font-bold transition-all",
                        runningBlockIdx === i
                          ? "bg-[#6541F5] text-white ring-2 ring-[#6541F5]/40"
                          : "bg-card border border-border text-foreground",
                      )}
                    >
                      <span>
                        {i + 1}. {block}
                      </span>
                      {!isRunning && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBlock(i)}
                          className="text-muted-foreground hover:text-destructive text-sm px-1"
                          aria-label={`Remove block ${i + 1}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border mt-3">
                  <Button
                    onClick={handleRunProgram}
                    disabled={blocks.length === 0 || isRunning}
                    className="w-full bg-[#19B99A] hover:bg-[#19B99A]/90 text-white font-bold text-xs h-10 shadow-sm"
                  >
                    <Play className="h-4 w-4 mr-1.5 fill-current" />
                    {isRunning ? "Executing Instructions..." : "Run & Test Solution"}
                  </Button>
                </div>
              </Panel>
            </div>

            {/* Column 2: 4x4 Rover Simulation Grid (Desktop or Mobile Tab 'canvas') */}
            <div
              className={cn(
                "md:col-span-4 card-surface p-5 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-between",
                "max-md:block",
                mobileSubTab !== "canvas" && "max-md:hidden",
              )}
            >
              <div className="w-full">
                <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3 text-xs">
                  <span className="font-bold text-foreground">Virtual Rover Canvas</span>
                  <span className="font-mono text-muted-foreground">
                    Pos: ({roverPos.x}, {roverPos.y}) · Dir: {roverDir}
                  </span>
                </div>

                {/* 4x4 Visual Grid */}
                <div className="grid grid-cols-4 gap-2 bg-muted/40 p-3 rounded-2xl border border-border my-2 mx-auto max-w-[280px]">
                  {Array.from({ length: 4 }).map((_, rIdx) =>
                    Array.from({ length: 4 }).map((_, cIdx) => {
                      const isRover = roverPos.x === cIdx && roverPos.y === rIdx;
                      const isTarget = cIdx === activeChallenge.targetPos.x && rIdx === activeChallenge.targetPos.y;
                      const isAsteroid = activeChallenge.id === "ch-3" && cIdx === 2 && rIdx === 0;

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={cn(
                            "h-14 w-14 rounded-xl flex items-center justify-center font-bold text-xs transition-all border",
                            isRover && "bg-[#EAE7FF] border-2 border-[#6541F5] text-[#6541F5] shadow-md scale-105 z-10",
                            !isRover && isTarget && "bg-[#DDF8EE] border-2 border-[#19B99A] text-[#19B99A] animate-pulse",
                            !isRover && isAsteroid && "bg-[#FCE5EB] border-[#E95778] text-[#E95778]",
                            !isRover && !isTarget && !isAsteroid && "bg-card border-border/80 text-muted-foreground/40",
                          )}
                        >
                          {isRover ? (
                            <div className="flex flex-col items-center">
                              <span className="text-lg">🏎️</span>
                              <span className="text-[8px] font-mono font-bold leading-none">
                                {roverDir === "UP" ? "▲" : roverDir === "RIGHT" ? "▶" : roverDir === "DOWN" ? "▼" : "◀"}
                              </span>
                            </div>
                          ) : isTarget ? (
                            <div className="flex flex-col items-center">
                              <span className="text-base">🏁</span>
                              <span className="text-[8px] font-bold">GOAL</span>
                            </div>
                          ) : isAsteroid ? (
                            <span className="text-sm">🪨</span>
                          ) : (
                            <span className="text-[9px] font-mono">{cIdx},{rIdx}</span>
                          )}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>

              {/* Mobile Quick Run Trigger */}
              <div className="md:hidden w-full pt-3">
                <Button
                  onClick={handleRunProgram}
                  disabled={blocks.length === 0 || isRunning}
                  className="w-full bg-[#19B99A] text-white font-bold text-xs h-9"
                >
                  <Play className="h-3.5 w-3.5 mr-1" /> Run Code
                </Button>
              </div>
            </div>

            {/* Column 3: Terminal Logs & Test Results (Desktop or Mobile Tab 'console') */}
            <div
              className={cn(
                "md:col-span-4 space-y-4",
                "max-md:block",
                mobileSubTab !== "console" && "max-md:hidden",
              )}
            >
              {/* Test Suite Verification Panel */}
              <Panel title="Automated Test Cases">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <span>1. Reached Destination ({activeChallenge.targetPos.x}, {activeChallenge.targetPos.y}):</span>
                    {testResults.ran ? (
                      testResults.destPassed ? (
                        <span className="text-[#19B99A] font-bold">PASSED ✓</span>
                      ) : (
                        <span className="text-[#E11D48] font-bold">FAILED ✗</span>
                      )
                    ) : (
                      <span className="text-muted-foreground font-medium">Pending Run</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <span>2. Zero Boundary Collisions:</span>
                    {testResults.ran ? (
                      testResults.boundsPassed ? (
                        <span className="text-[#19B99A] font-bold">PASSED ✓</span>
                      ) : (
                        <span className="text-[#E11D48] font-bold">FAILED ✗</span>
                      )
                    ) : (
                      <span className="text-muted-foreground font-medium">Pending Run</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <span>3. Efficiency (≤ {activeChallenge.maxBlocks} blocks):</span>
                    {testResults.ran ? (
                      testResults.blockCountPassed ? (
                        <span className="text-[#19B99A] font-bold">PASSED ✓</span>
                      ) : (
                        <span className="text-[#E11D48] font-bold">FAILED ✗</span>
                      )
                    ) : (
                      <span className="text-muted-foreground font-medium">Pending Run</span>
                    )}
                  </div>

                  {testResults.errorMsg && (
                    <div className="rounded-lg bg-[#FFE4E6] p-2.5 text-xs text-[#E11D48] leading-snug">
                      <strong>Diagnostic:</strong> {testResults.errorMsg}
                    </div>
                  )}
                </div>
              </Panel>

              {/* Execution Console Logs */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs font-mono text-neutral-300 space-y-1.5 min-h-[160px] max-h-[220px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-neutral-500 border-b border-neutral-800 pb-1 mb-2 text-[10px]">
                  <Terminal className="h-3 w-3" /> ROVER DEBUGGER CONSOLE
                </div>
                {outputLogs.map((log, idx) => (
                  <p key={idx} className="leading-snug break-all">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Mobile Tab 'code': Syntax Preview */}
            <div
              className={cn(
                "md:hidden space-y-3",
                mobileSubTab !== "code" && "hidden",
              )}
            >
              <div className="rounded-xl bg-neutral-950 p-4 font-mono text-xs text-neutral-200">
                <pre>{pythonCode}</pre>
              </div>
            </div>
          </div>

          {/* CodeVerse Victory Modal */}
          <Dialog open={victoryModalOpen} onOpenChange={setVictoryModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-[#19B99A]">
                  <CheckCircle2 className="h-6 w-6 text-[#19B99A]" /> Challenge Completed!
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2 text-xs">
                <p className="text-foreground">
                  You successfully verified <strong>{activeChallenge.name}</strong>. All test criteria met!
                </p>
                <div className="rounded-xl bg-card border border-border p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="font-bold text-foreground">{activeChallenge.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blocks Used:</span>
                    <span className="font-bold text-foreground">
                      {blocks.length} of {activeChallenge.maxBlocks} max
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">XP Reward:</span>
                    <span className="font-bold text-[#19B99A]">+{activeChallenge.xpReward} XP Awarded</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setVictoryModalOpen(false)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setVictoryModalOpen(false);
                      setActiveStudioTab("syntax");
                    }}
                    className="bg-[#6541F5] text-white text-xs font-bold"
                  >
                    View Python Translation →
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ======================================================== */}
        {/* 3. COMPUTATIONAL THINKING CONCEPTS THEORY                */}
        {/* ======================================================== */}
        <TabsContent value="theory" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "1. Algorithms & Sequencing",
                desc: "An algorithm is an ordered sequence of instructions. Changing the order changes the outcome completely.",
                analogy: "Like baking bread: You cannot bake the dough before mixing the flour and water.",
              },
              {
                title: "2. Loops & Repetition",
                desc: "Loops allow a block of instructions to repeat N times, saving memory and eliminating redundant typing.",
                analogy: "Like marching: Instead of saying 'step, step, step', say 'repeat 10 steps'.",
              },
              {
                title: "3. Conditionals & Branching",
                desc: "Conditionals make decisions based on sensor inputs: IF a condition is true, execute branch A, else branch B.",
                analogy: "Like carrying an umbrella: IF it is raining, open the umbrella.",
              },
            ].map((concept, i) => (
              <div key={i} className="card-surface p-5 rounded-2xl border border-border space-y-2 shadow-sm">
                <Badge className="bg-[#19B99A] text-white text-[10px] font-bold">Concept {i + 1}</Badge>
                <h4 className="font-bold text-sm text-foreground">{concept.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{concept.desc}</p>
                <div className="rounded-lg bg-muted/60 p-2.5 text-[11px] text-foreground border border-border">
                  💡 <strong>Real-world Analogy:</strong> {concept.analogy}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 4. REAL-WORLD CODE SYNTAX BRIDGE (PYTHON & ARDUINO C++)   */}
        {/* ======================================================== */}
        <TabsContent value="syntax" className="space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">Visual Blocks to Production Code Bridge</h3>
                <p className="text-xs text-muted-foreground">
                  See how your visual blocks translate into Python and Arduino C++ code:
                </p>
              </div>
              <Badge className="bg-[#6541F5] text-white text-[10px]">Syntax Preview Only</Badge>
            </div>

            <Tabs defaultValue="python" className="space-y-4">
              <TabsList className="bg-muted border border-border p-1">
                <TabsTrigger value="python" className="text-xs font-bold">
                  🐍 Python 3
                </TabsTrigger>
                <TabsTrigger value="arduino" className="text-xs font-bold">
                  ⚡ Arduino C++
                </TabsTrigger>
              </TabsList>

              <TabsContent value="python">
                <div className="rounded-xl bg-neutral-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-neutral-800">
                  <pre>{pythonCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="arduino">
                <div className="rounded-xl bg-neutral-950 p-4 font-mono text-xs text-cyan-400 overflow-x-auto leading-relaxed border border-neutral-800">
                  <pre>{arduinoCode}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
