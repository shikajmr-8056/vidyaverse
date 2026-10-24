import { useState } from "react";
import {
  Gamepad2, Play, RotateCcw, Award, CheckCircle2, QrCode, Sparkles,
  ArrowRight, Shield, BookOpen, Compass, ChevronRight, HelpCircle, Dices,
  Lightbulb, Clock, Layers, Filter, Check, AlertCircle, FileText, Printer,
  Eye, Trophy, Target, Atom, Globe, Code2, Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, DemoTag } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

// ==========================================
// CODEBOT MAZE DEFINITIONS & LEVELS
// ==========================================
type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";
type Command = "FORWARD" | "TURN_LEFT" | "TURN_RIGHT";

interface MazeLevel {
  id: number;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objective: string;
  grid: number[][]; // 0: empty, 1: obstacle, 2: goal
  startPos: { x: number; y: number };
  startDir: Direction;
  goalPos: { x: number; y: number };
  hint: string;
  parCommands: number;
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    name: "Level 1: Straight Line & First Turn",
    difficulty: "Beginner",
    objective: "Execute sequential commands to reach the solar station at (3, 1).",
    grid: [
      [0, 0, 0, 0],
      [1, 1, 1, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "RIGHT",
    goalPos: { x: 3, y: 1 },
    hint: "Move forward 3 times along the top row, then turn right and move forward 1 step into the portal.",
    parCommands: 5,
  },
  {
    id: 2,
    name: "Level 2: Asteroid Field Navigation",
    difficulty: "Intermediate",
    objective: "Maneuver around space debris to reach the cosmic portal at (3, 3).",
    grid: [
      [0, 0, 0, 0],
      [1, 1, 0, 1],
      [0, 0, 0, 0],
      [0, 1, 1, 2],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "RIGHT",
    goalPos: { x: 3, y: 3 },
    hint: "Advance to column 2, turn right to head down, pass through the middle opening, then proceed to the bottom-right portal.",
    parCommands: 7,
  },
  {
    id: 3,
    name: "Level 3: Zigzag S-Curve Corridor",
    difficulty: "Advanced",
    objective: "Plan an exact algorithmic path through tight barrier walls to reach (0, 3).",
    grid: [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [0, 0, 0, 0],
      [2, 1, 1, 1],
    ],
    startPos: { x: 0, y: 0 },
    startDir: "RIGHT",
    goalPos: { x: 0, y: 3 },
    hint: "Notice column 0 is the only open vertical drop. Turn down early or loop through open passages.",
    parCommands: 6,
  },
];

// ==========================================
// MATH LUDO DEFINITIONS & LEVELS
// ==========================================
interface LudoQuestion {
  level: 1 | 2 | 3;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  hint: string;
}

const LUDO_QUESTIONS: LudoQuestion[] = [
  // Level 1: Halves & Quarters
  {
    level: 1,
    text: "A chapati is cut into 4 equal slices. Rohit eats 2 slices. What fraction did he eat?",
    options: ["1/4", "2/4 (or 1/2)", "3/4", "4/2"],
    correct: 1,
    explanation: "2 out of 4 slices equals 2/4, which simplifies to 1/2.",
    hint: "Count total parts as the denominator (4) and eaten parts as the numerator (2).",
  },
  {
    level: 1,
    text: "Which fraction represents half of a whole?",
    options: ["1/3", "2/4", "3/5", "1/4"],
    correct: 1,
    explanation: "2/4 is equivalent to 1/2 because 2 is half of 4.",
    hint: "Divide both numerator and denominator by 2.",
  },
  {
    level: 1,
    text: "What is 1/4 + 2/4?",
    options: ["3/8", "3/4", "2/8", "1/2"],
    correct: 1,
    explanation: "Denominators are equal: add numerators 1 + 2 = 3. Denominator remains 4.",
    hint: "Keep the bottom number identical and add the top numbers.",
  },
  // Level 2: Like Denominators & Equivalents
  {
    level: 2,
    text: "Calculate: 3/5 + 1/5 =",
    options: ["4/10", "4/5", "3/10", "2/5"],
    correct: 1,
    explanation: "With identical denominators of 5: 3 + 1 = 4, so 4/5.",
    hint: "Do not add denominators together.",
  },
  {
    level: 2,
    text: "Which fraction is equivalent to 3/6?",
    options: ["1/3", "1/2", "2/3", "3/4"],
    correct: 1,
    explanation: "3 divided by 3 is 1, and 6 divided by 3 is 2. Thus 3/6 = 1/2.",
    hint: "Both 3 and 6 can be divided by 3.",
  },
  {
    level: 2,
    text: "What is 3 × 2/7?",
    options: ["6/21", "6/7", "5/7", "2/21"],
    correct: 1,
    explanation: "Whole number multiplies only the numerator: 3 × 2 = 6, keeping 7 as denominator.",
    hint: "Multiply only the top number by 3.",
  },
  // Level 3: Mixed Fractions & Decimals
  {
    level: 3,
    text: "Which decimal is equivalent to 3/4?",
    options: ["0.34", "0.75", "0.43", "0.25"],
    correct: 1,
    explanation: "3/4 = 75/100, which is written as 0.75 in decimal format.",
    hint: "Think of 75 paise out of 100 paise in one Rupee.",
  },
  {
    level: 3,
    text: "Which fraction is larger: 5/9 or 4/9?",
    options: ["5/9", "4/9", "Both are equal", "Cannot be compared"],
    correct: 0,
    explanation: "Since denominators are equal (9), the larger numerator (5 > 4) is larger.",
    hint: "5 slices of the same pizza is more than 4 slices.",
  },
  {
    level: 3,
    text: "Convert 0.2 into a simplified fraction:",
    options: ["2/100", "1/5", "2/5", "1/20"],
    correct: 1,
    explanation: "0.2 = 2/10. Dividing numerator and denominator by 2 yields 1/5.",
    hint: "2 tenths is 2/10. Divide by 2.",
  },
];

// ==========================================
// PLAYLAB CATALOGUE DEFINITION
// ==========================================
interface PlayLabGameInfo {
  id: string;
  name: string;
  subject: "Mathematics" | "Science" | "Computing" | "Social Science";
  classes: string;
  durationMin: number;
  mode: "Digital Playable" | "Physical Board + Digital Companion" | "Physical Classroom Kit";
  learningObjective: string;
  howToPlay: string;
  playable: boolean;
  difficultyLevels: string[];
  physicalBlueprint?: string;
  digitalCompanion?: string;
}

const PLAYLAB_CATALOGUE: PlayLabGameInfo[] = [
  {
    id: "codebot-maze",
    name: "CodeBot Maze",
    subject: "Computing",
    classes: "Class 5 to 8",
    durationMin: 12,
    mode: "Digital Playable",
    learningObjective: "Master sequential algorithms, orientation geometry, and debugging through obstacle pathfinding.",
    howToPlay: "Queue forward and turn commands, execute the sequence, and watch CodeBot traverse the cosmic grid.",
    playable: true,
    difficultyLevels: ["Beginner (Level 1)", "Intermediate (Level 2)", "Advanced (Level 3)"],
  },
  {
    id: "math-ludo",
    name: "Math Ludo",
    subject: "Mathematics",
    classes: "Class 5 to 7",
    durationMin: 15,
    mode: "Digital Playable",
    learningObjective: "Reinforce fractions, equivalent ratios, and decimal conversions in an interactive race to Step 24.",
    howToPlay: "Roll the dice, solve the fraction question to advance your token, and reach the victory checkpoint.",
    playable: true,
    difficultyLevels: ["Level 1: Halves & Quarters", "Level 2: Operations", "Level 3: Decimals"],
  },
  {
    id: "bharat-explorer",
    name: "Bharat Explorer",
    subject: "Social Science",
    classes: "Class 6 to 8",
    durationMin: 20,
    mode: "Physical Board + Digital Companion",
    learningObjective: "Locate major Indian states, landforms, and Deccan plateau river basins.",
    howToPlay: "Teams move across a printable map board, answering geography clues to claim territory cards.",
    playable: false,
    difficultyLevels: ["Standard Classroom Kit"],
    physicalBlueprint: "Printable 4-quadrant Indian physical map board with 40 trivia cards, dice, and state flag tokens.",
    digitalCompanion: "Integrated Clue Generator & River Basin Validator available below in the Companion Studio.",
  },
  {
    id: "newtons-race",
    name: "Newton's Ramp Race",
    subject: "Science",
    classes: "Class 7 to 9",
    durationMin: 25,
    mode: "Physical Board + Digital Companion",
    learningObjective: "Investigate gravitational potential energy, friction, and Newton's laws through ramp experiments.",
    howToPlay: "Adjust classroom cardboard ramps, test varying car weights, predict rollout distance, and verify measurements.",
    playable: false,
    difficultyLevels: ["Physical Lab Practical"],
    physicalBlueprint: "Cardboard ramp template with graduated centimeter scale, 2 toy cars, and clay weights.",
    digitalCompanion: "Digital Stop-Timer & Acceleration Predictor available in companion tools.",
  },
  {
    id: "ecoquest",
    name: "EcoQuest Habitat Explorer",
    subject: "Science",
    classes: "Class 5 to 7",
    durationMin: 30,
    mode: "Physical Classroom Kit",
    learningObjective: "Observe biodiversity, identify autotrophs and pollinators, and classify schoolyard ecosystems.",
    howToPlay: "Student teams explore outdoor school grounds with printed observation checklists and catalog findings.",
    playable: false,
    difficultyLevels: ["Field Activity"],
    physicalBlueprint: "Printable laminated outdoor biodiversity survey matrix with magnifying lens guide.",
  },
];

export function PlayLabView() {
  const d = useDemo();

  // Studio tabs: codebot | ludo | companion | library
  const [activeStudioTab, setActiveStudioTab] = useState<string>("codebot");

  // Filter states for Library
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [filterClass, setFilterClass] = useState<string>("All");
  const [filterMode, setFilterMode] = useState<string>("All");

  // ==========================================
  // CODEBOT MAZE STATE
  // ==========================================
  const [selectedMazeLevelId, setSelectedMazeLevelId] = useState<number>(1);
  const currentMazeLevel = MAZE_LEVELS.find((lvl) => lvl.id === selectedMazeLevelId) ?? MAZE_LEVELS[0]!;

  const [botPos, setBotPos] = useState<{ x: number; y: number }>(currentMazeLevel.startPos);
  const [botDir, setBotDir] = useState<Direction>(currentMazeLevel.startDir);
  const [commandQueue, setCommandQueue] = useState<Command[]>([]);
  const [runningStepIdx, setRunningStepIdx] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mazeMessage, setMazeMessage] = useState<string>("Queue commands to navigate CodeBot to the glowing portal.");
  const [hasWonMaze, setHasWonMaze] = useState(false);
  const [showMazeHint, setShowMazeHint] = useState(false);
  const [mazeVictoryModalOpen, setMazeVictoryModalOpen] = useState(false);

  // Switch level
  const handleSelectMazeLevel = (lvlId: number) => {
    setSelectedMazeLevelId(lvlId);
    const lvl = MAZE_LEVELS.find((l) => l.id === lvlId) ?? MAZE_LEVELS[0]!;
    setBotPos(lvl.startPos);
    setBotDir(lvl.startDir);
    setCommandQueue([]);
    setRunningStepIdx(null);
    setIsRunning(false);
    setHasWonMaze(false);
    setShowMazeHint(false);
    setMazeMessage(`Level ${lvlId} loaded: ${lvl.objective}`);
  };

  const addCommand = (cmd: Command) => {
    if (commandQueue.length < 12 && !isRunning && !hasWonMaze) {
      setCommandQueue([...commandQueue, cmd]);
    }
  };

  const removeCommand = (idx: number) => {
    if (!isRunning && !hasWonMaze) {
      setCommandQueue(commandQueue.filter((_, i) => i !== idx));
    }
  };

  const resetMaze = () => {
    setBotPos(currentMazeLevel.startPos);
    setBotDir(currentMazeLevel.startDir);
    setCommandQueue([]);
    setRunningStepIdx(null);
    setIsRunning(false);
    setHasWonMaze(false);
    setMazeMessage("Commands cleared. Build your algorithmic path!");
  };

  const runCodeBot = async () => {
    if (commandQueue.length === 0 || isRunning) return;
    setIsRunning(true);
    setMazeMessage("CodeBot is executing your algorithmic sequence...");

    let curX = botPos.x;
    let curY = botPos.y;
    let curDir = botDir;

    for (let i = 0; i < commandQueue.length; i++) {
      setRunningStepIdx(i);
      const cmd = commandQueue[i];
      await new Promise((r) => setTimeout(r, 550));

      if (cmd === "TURN_LEFT") {
        const dirs: Direction[] = ["UP", "LEFT", "DOWN", "RIGHT"];
        const nextIdx = (dirs.indexOf(curDir) + 1) % 4;
        curDir = dirs[nextIdx] ?? "RIGHT";
        setBotDir(curDir);
      } else if (cmd === "TURN_RIGHT") {
        const dirs: Direction[] = ["UP", "RIGHT", "DOWN", "LEFT"];
        const nextIdx = (dirs.indexOf(curDir) + 1) % 4;
        curDir = dirs[nextIdx] ?? "RIGHT";
        setBotDir(curDir);
      } else if (cmd === "FORWARD") {
        let nextX = curX;
        let nextY = curY;
        if (curDir === "UP") nextY -= 1;
        if (curDir === "RIGHT") nextX += 1;
        if (curDir === "DOWN") nextY += 1;
        if (curDir === "LEFT") nextX -= 1;

        // Boundary check
        if (nextX < 0 || nextX > 3 || nextY < 0 || nextY > 3) {
          setMazeMessage("💥 Boundary Hit! CodeBot struck the outer perimeter. Recalibrate commands!");
          setIsRunning(false);
          setRunningStepIdx(null);
          return;
        }

        // Obstacle check
        if (currentMazeLevel.grid[nextY]?.[nextX] === 1) {
          setMazeMessage("💥 Obstacle Collision! Path is blocked by an asteroid wall.");
          setIsRunning(false);
          setRunningStepIdx(null);
          return;
        }

        curX = nextX;
        curY = nextY;
        setBotPos({ x: curX, y: curY });

        // Goal reached check
        if (curX === currentMazeLevel.goalPos.x && curY === currentMazeLevel.goalPos.y) {
          setHasWonMaze(true);
          setMazeMessage("🎉 Cosmic Portal Reached! Sequence successfully verified.");
          setIsRunning(false);
          setRunningStepIdx(null);
          setMazeVictoryModalOpen(true);
          d.unlock("maze-solver");
          // Idempotent XP award
          d.awardActivityXp(`playlab-codebot-lvl-${currentMazeLevel.id}`, 40, `Solved CodeBot Maze Level ${currentMazeLevel.id}`);
          return;
        }
      }
    }

    setRunningStepIdx(null);
    if (!hasWonMaze) {
      setMazeMessage("Sequence complete, but CodeBot didn't reach the portal. Add more moves!");
    }
    setIsRunning(false);
  };

  // ==========================================
  // MATH LUDO STATE
  // ==========================================
  const [ludoDifficulty, setLudoDifficulty] = useState<1 | 2 | 3>(1);
  const [diceRoll, setDiceRoll] = useState<number>(3);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [tokenPosition, setTokenPosition] = useState<number>(1);
  const [currentLudoQ, setCurrentLudoQ] = useState<LudoQuestion | null>(null);
  const [selectedLudoOption, setSelectedLudoOption] = useState<number | null>(null);
  const [ludoResult, setLudoResult] = useState<string | null>(null);
  const [ludoRollCount, setLudoRollCount] = useState<number>(0);
  const [ludoCorrectCount, setLudoCorrectCount] = useState<number>(0);
  const [showLudoHint, setShowLudoHint] = useState<boolean>(false);
  const [ludoVictoryModalOpen, setLudoVictoryModalOpen] = useState<boolean>(false);

  const rollDice = () => {
    if (isRollingDice || currentLudoQ !== null) return;
    setIsRollingDice(true);
    setLudoResult(null);
    setSelectedLudoOption(null);
    setShowLudoHint(false);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 4) + 1; // 1 to 4
      setDiceRoll(roll);
      setLudoRollCount((c) => c + 1);
      setIsRollingDice(false);

      // Pick question matching difficulty
      const pool = LUDO_QUESTIONS.filter((q) => q.level === ludoDifficulty);
      const q = pool[Math.floor(Math.random() * pool.length)] ?? pool[0]!;
      setCurrentLudoQ(q);
    }, 400);
  };

  const handleAnswerLudo = (optIdx: number) => {
    if (!currentLudoQ || selectedLudoOption !== null) return;
    setSelectedLudoOption(optIdx);

    const isCorrect = optIdx === currentLudoQ.correct;
    if (isCorrect) {
      setLudoCorrectCount((c) => c + 1);
      let nextPos = tokenPosition + diceRoll;

      // Special Track Checkpoints
      let bonusMsg = "";
      if (nextPos === 6) {
        nextPos += 1;
        bonusMsg = " 🚀 Step 6 Speed Boost (+1 bonus square)!";
      } else if (nextPos === 12) {
        nextPos += 2;
        bonusMsg = " 🌉 Step 12 Fraction Bridge (Skipped +2 ahead)!";
      }

      nextPos = Math.min(24, nextPos);
      setTokenPosition(nextPos);
      setLudoResult(`Correct! 🎯 Advanced +${diceRoll} steps to Square ${nextPos}.${bonusMsg}`);

      // Check for Game Victory (Step 24)
      if (nextPos >= 24) {
        setLudoVictoryModalOpen(true);
        d.awardActivityXp(`playlab-ludo-lvl-${ludoDifficulty}`, 50, `Completed Math Ludo Level ${ludoDifficulty} Race`);
      }
    } else {
      setLudoResult(`Incorrect. You remain at Square ${tokenPosition}. ${currentLudoQ.explanation}`);
    }

    // Dismiss question after brief pause or allow student to clear
    setTimeout(() => {
      setCurrentLudoQ(null);
    }, 2800);
  };

  const resetMathLudo = () => {
    setTokenPosition(1);
    setDiceRoll(3);
    setCurrentLudoQ(null);
    setSelectedLudoOption(null);
    setLudoResult(null);
    setLudoRollCount(0);
    setLudoCorrectCount(0);
    setShowLudoHint(false);
    setLudoVictoryModalOpen(false);
  };

  // ==========================================
  // DIGITAL COMPANION TOOL STATE (Bharat Explorer Clue Tool)
  // ==========================================
  const [activeCompanionClueIdx, setActiveCompanionClueIdx] = useState<number>(0);
  const [companionAnswerRevealed, setCompanionAnswerRevealed] = useState(false);
  const companionClues = [
    {
      card: "Card #1 · River Expedition",
      clue: "I originate in the Brahmagiri Hills at Talakaveri in Karnataka, flowing eastward into the Bay of Bengal. Farmers call me the lifeblood of Tamil Nadu and Karnataka. Which river am I?",
      answer: "The Kaveri River (Cauvery)",
      fact: "The Kaveri basin covers Karnataka, Kerala, Tamil Nadu, and Puducherry.",
    },
    {
      card: "Card #2 · Landform Discovery",
      clue: "I am a high triangular tableland bounded by the Western Ghats on the west and Eastern Ghats on the east. Most of my rivers flow east due to my gentle tilt. Which landform am I?",
      answer: "The Deccan Plateau",
      fact: "Rich black cotton soil covers vast northwestern portions of the Deccan plateau.",
    },
    {
      card: "Card #3 · Historic Capital",
      clue: "I sit along the rugged banks of the Tungabhadra River, crowned with granite boulders, temple chariots, and UNESCO heritage monuments. Which capital city am I?",
      answer: "Hampi (Vijayanagara Empire)",
      fact: "Hampi was one of the largest and wealthiest medieval metropolitan hubs in the world.",
    },
  ];

  // Filtered Game Library
  const filteredCatalogue = PLAYLAB_CATALOGUE.filter((g) => {
    if (filterSubject !== "All" && g.subject !== filterSubject) return false;
    if (filterClass !== "All" && !g.classes.includes(filterClass)) return false;
    if (filterMode !== "All" && g.mode !== filterMode) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Studio Header with PlayLab Amber Identity */}
      <PageHeader
        title="PlayLab: Curriculum Through Games"
        description="Curriculum-aligned digital gaming experiences and structured physical classroom board kits built for offline schools."
        eyebrow={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
              <Gamepad2 className="h-3.5 w-3.5" /> STEM Game Studio
            </span>
            <DemoTag>Client Offline Verified</DemoTag>
          </div>
        }
      />

      {/* Main Studio Navigation Tabs */}
      <Tabs value={activeStudioTab} onValueChange={setActiveStudioTab} className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 w-full sm:w-auto flex flex-wrap">
          <TabsTrigger
            value="codebot"
            className="data-[state=active]:bg-[#6541F5] data-[state=active]:text-white text-xs font-bold"
          >
            🕹️ CodeBot Maze (Digital)
          </TabsTrigger>
          <TabsTrigger
            value="ludo"
            className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-xs font-bold"
          >
            🎲 Math Ludo (Digital Race)
          </TabsTrigger>
          <TabsTrigger
            value="companion"
            className="data-[state=active]:bg-[#0284C7] data-[state=active]:text-white text-xs font-bold"
          >
            🧭 Board Game Companion Tools
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="data-[state=active]:bg-[#19B99A] data-[state=active]:text-white text-xs font-bold"
          >
            📚 Full Game Library ({PLAYLAB_CATALOGUE.length})
          </TabsTrigger>
        </TabsList>

        {/* ======================================================== */}
        {/* 1. CODEBOT MAZE: GENUINELY PLAYABLE WITH PROGRESSION     */}
        {/* ======================================================== */}
        <TabsContent value="codebot" className="space-y-6">
          {/* Educational Objective Banner */}
          <div className="rounded-xl border border-[#6541F5]/30 bg-[#EAE7FF]/40 p-4 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#6541F5]">
              <Target className="h-4 w-4" /> Educational Objective: Computational Thinking & Spatial Algorithms
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Program CodeBot with sequential move and turn instructions. Learn how computers follow steps deterministically, avoid boundary crashes, and debug paths to reach the objective portal.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: 4x4 Interactive Grid & Simulation Canvas */}
            <div className="lg:col-span-7 card-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center">
              {/* Level Selector Bar */}
              <div className="flex flex-wrap items-center justify-between w-full mb-4 border-b border-border pb-3 gap-2">
                <div>
                  <h3 className="font-bold text-base text-foreground">{currentMazeLevel.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentMazeLevel.objective}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((lvlId) => (
                    <Button
                      key={lvlId}
                      size="sm"
                      variant={selectedMazeLevelId === lvlId ? "default" : "outline"}
                      onClick={() => handleSelectMazeLevel(lvlId)}
                      className={cn(
                        "h-7 px-2.5 text-xs font-bold",
                        selectedMazeLevelId === lvlId && "bg-[#6541F5] text-white",
                      )}
                    >
                      Lvl {lvlId}
                    </Button>
                  ))}
                  <Button size="sm" variant="outline" onClick={resetMaze} className="h-7 px-2 text-xs border-border">
                    <RotateCcw className="h-3 w-3 mr-1" /> Reset
                  </Button>
                </div>
              </div>

              {/* 4x4 Grid Visual */}
              <div className="grid grid-cols-4 gap-2.5 bg-muted/40 p-4 rounded-2xl border border-border my-2">
                {currentMazeLevel.grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isBot = botPos.x === cIdx && botPos.y === rIdx;
                    const isObstacle = cell === 1;
                    const isGoal = cIdx === currentMazeLevel.goalPos.x && rIdx === currentMazeLevel.goalPos.y;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={cn(
                          "relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl flex items-center justify-center font-bold text-xs transition-all",
                          isBot && "bg-[#EAE7FF] border-2 border-[#6541F5] text-[#6541F5] shadow-md scale-105 z-10",
                          !isBot && isObstacle && "bg-[#FCE5EB] border border-[#E95778]/50 text-[#E95778]",
                          !isBot && isGoal && "bg-[#FFF0D5] border-2 border-[#F5A623] text-[#F5A623] animate-pulse",
                          !isBot && !isObstacle && !isGoal && "bg-card border border-border/80 text-muted-foreground",
                        )}
                      >
                        {isBot ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xl">🤖</span>
                            <span className="text-[9px] font-mono font-bold leading-none mt-0.5">
                              {botDir === "UP" ? "▲" : botDir === "RIGHT" ? "▶" : botDir === "DOWN" ? "▼" : "◀"}
                            </span>
                          </div>
                        ) : isObstacle ? (
                          <span className="text-base">🪨</span>
                        ) : isGoal ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xl">🌀</span>
                            <span className="text-[9px] font-bold">PORTAL</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 font-mono">
                            {cIdx},{rIdx}
                          </span>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>

              {/* Live Status Message */}
              <div
                className={cn(
                  "w-full rounded-xl p-3 text-xs mt-3 transition-colors text-center font-medium",
                  hasWonMaze
                    ? "bg-[#DDF8EE] text-[#19B99A] font-bold border border-[#19B99A]/30"
                    : mazeMessage.includes("💥")
                    ? "bg-[#FCE5EB] text-[#E95778] font-semibold border border-[#E95778]/30"
                    : "bg-muted/70 text-foreground",
                )}
              >
                {mazeMessage}
              </div>
            </div>

            {/* Right Column: Command Palette & Execution Engine */}
            <div className="lg:col-span-5 space-y-4">
              {/* Command Palette */}
              <Panel title="Command Palette">
                <p className="text-xs text-muted-foreground mb-3">
                  Click commands to add them to your algorithm queue (max 12):
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => addCommand("FORWARD")}
                    disabled={isRunning || hasWonMaze}
                    className="bg-[#42A5E8] hover:bg-[#42A5E8]/90 text-white text-xs font-bold h-10 shadow-sm"
                  >
                    ⬆ Forward
                  </Button>
                  <Button
                    onClick={() => addCommand("TURN_LEFT")}
                    disabled={isRunning || hasWonMaze}
                    className="bg-[#6541F5] hover:bg-[#6541F5]/90 text-white text-xs font-bold h-10 shadow-sm"
                  >
                    ↶ Turn Left
                  </Button>
                  <Button
                    onClick={() => addCommand("TURN_RIGHT")}
                    disabled={isRunning || hasWonMaze}
                    className="bg-[#6541F5] hover:bg-[#6541F5]/90 text-white text-xs font-bold h-10 shadow-sm"
                  >
                    ↷ Turn Right
                  </Button>
                </div>
              </Panel>

              {/* Queued Sequence Stack */}
              <Panel title={`Program Queue (${commandQueue.length} / 12)`}>
                {commandQueue.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center">
                    Queue is empty. Select command cards above to construct your sequence.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {commandQueue.map((cmd, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all",
                          runningStepIdx === idx
                            ? "bg-[#F5A623] text-white ring-2 ring-[#F5A623]/50 scale-102"
                            : "bg-card border border-border text-foreground",
                        )}
                      >
                        <span>
                          {idx + 1}. {cmd}
                        </span>
                        {!isRunning && (
                          <button
                            type="button"
                            onClick={() => removeCommand(idx)}
                            className="text-muted-foreground hover:text-destructive text-xs px-1"
                            aria-label={`Remove command ${idx + 1}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Primary Execution Actions */}
                <div className="flex gap-2.5 mt-4 pt-3 border-t border-border">
                  <Button
                    onClick={runCodeBot}
                    disabled={commandQueue.length === 0 || isRunning || hasWonMaze}
                    className="flex-1 bg-[#19B99A] hover:bg-[#19B99A]/90 text-white font-bold text-xs h-10 shadow-sm"
                  >
                    <Play className="h-4 w-4 mr-1.5 fill-current" />
                    {isRunning ? "Running Sequence..." : "Execute Program"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMazeHint(!showMazeHint)}
                    className="text-xs font-semibold h-10"
                  >
                    <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#F5A623]" /> Hint
                  </Button>
                </div>

                {/* Progressive Hint Drawer */}
                {showMazeHint && (
                  <div className="mt-3 rounded-lg bg-[#FFF0D5] p-3 text-xs text-[#B45309] leading-relaxed border border-[#F5A623]/30">
                    <p className="font-bold">Algorithmic Tip for {currentMazeLevel.name}:</p>
                    <p className="mt-0.5">{currentMazeLevel.hint}</p>
                    <p className="mt-1 font-semibold text-[11px]">Par length: ~{currentMazeLevel.parCommands} commands.</p>
                  </div>
                )}
              </Panel>
            </div>
          </div>

          {/* CodeBot Victory Completion Modal */}
          <Dialog open={mazeVictoryModalOpen} onOpenChange={setMazeVictoryModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-[#19B99A]">
                  <Trophy className="h-6 w-6 text-[#F5A623]" /> Algorithm Verified!
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2 text-xs">
                <p className="text-foreground">
                  CodeBot reached the Cosmic Portal in <strong>{commandQueue.length} commands</strong>!
                </p>
                <div className="rounded-xl bg-card border border-border p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-bold text-foreground">{currentMazeLevel.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimal Par:</span>
                    <span className="font-bold text-foreground">{currentMazeLevel.parCommands} moves</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">XP Reward:</span>
                    <span className="font-bold text-[#19B99A]">+40 XP Recorded</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMazeVictoryModalOpen(false)}
                    className="text-xs"
                  >
                    Review Board
                  </Button>
                  {selectedMazeLevelId < 3 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setMazeVictoryModalOpen(false);
                        handleSelectMazeLevel(selectedMazeLevelId + 1);
                      }}
                      className="bg-[#6541F5] text-white text-xs font-bold"
                    >
                      Next Level →
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ======================================================== */}
        {/* 2. MATH LUDO: GENUINELY PLAYABLE RACE TO 24 SQUARES       */}
        {/* ======================================================== */}
        <TabsContent value="ludo" className="space-y-6">
          {/* Educational Objective Banner */}
          <div className="rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/40 p-4 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#D97706]">
              <Target className="h-4 w-4" /> Educational Objective: Fraction Arithmetic & Ratio Representation
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Roll the dice, solve curriculum-based fraction questions to advance your token across the 24-square board, and reach the finish line. Correct answers unlock forward momentum; errors trigger conceptual explanations.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: 24-Square Winding Board Track */}
            <div className="lg:col-span-8 card-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 mb-4 gap-2">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Math Ludo Racing Circuit</h3>
                    <p className="text-xs text-muted-foreground">Step 1 (Start) → Step 24 (Victory Trophy)</p>
                  </div>
                  {/* Difficulty Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1">Grade Level:</span>
                    {([1, 2, 3] as const).map((lvl) => (
                      <Button
                        key={lvl}
                        size="sm"
                        variant={ludoDifficulty === lvl ? "default" : "outline"}
                        onClick={() => {
                          setLudoDifficulty(lvl);
                          resetMathLudo();
                        }}
                        className={cn(
                          "h-7 px-2.5 text-xs font-bold",
                          ludoDifficulty === lvl && "bg-[#F5A623] text-white hover:bg-[#F5A623]/90",
                        )}
                      >
                        Lvl {lvl}
                      </Button>
                    ))}
                    <Button size="sm" variant="outline" onClick={resetMathLudo} className="h-7 text-xs border-border">
                      <RotateCcw className="h-3 w-3 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                {/* 24-Square Grid Layout */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 my-2">
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((sq) => {
                    const isTokenHere = tokenPosition === sq;
                    const isSpecial = sq === 6 || sq === 12 || sq === 18 || sq === 24;

                    return (
                      <div
                        key={sq}
                        className={cn(
                          "relative h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all border",
                          isTokenHere && "bg-[#FFF0D5] border-2 border-[#F5A623] text-[#D97706] shadow-md scale-105 z-10",
                          !isTokenHere && sq === 24 && "bg-[#DDF8EE] border-[#19B99A] text-[#19B99A]",
                          !isTokenHere && isSpecial && "bg-[#DDF2FC] border-[#42A5E8] text-[#42A5E8]",
                          !isTokenHere && !isSpecial && sq < tokenPosition && "bg-muted/50 border-border text-muted-foreground/60",
                          !isTokenHere && !isSpecial && sq > tokenPosition && "bg-card border-border text-foreground",
                        )}
                      >
                        <span className="text-[10px] text-muted-foreground">{sq}</span>
                        {isTokenHere ? (
                          <span className="text-xl animate-bounce">🏃</span>
                        ) : sq === 24 ? (
                          <span className="text-base">🏆</span>
                        ) : sq === 6 ? (
                          <span className="text-xs">⚡ Boost</span>
                        ) : sq === 12 ? (
                          <span className="text-xs">🌉 Bridge</span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">•</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Message */}
              {ludoResult && (
                <div
                  className={cn(
                    "mt-4 rounded-xl p-3 text-xs font-semibold leading-relaxed",
                    ludoResult.includes("Correct")
                      ? "bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30"
                      : "bg-[#FFF0D5] text-[#B45309] border border-[#F5A623]/30",
                  )}
                >
                  {ludoResult}
                </div>
              )}
            </div>

            {/* Right Column: Dice Roller & Question Card */}
            <div className="lg:col-span-4 space-y-4">
              {/* Dice Action Box */}
              <div className="card-surface p-5 rounded-2xl border border-border shadow-sm text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Turn: Roll & Move
                </p>

                <div className="flex items-center justify-center gap-3 py-2">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#F5A623] bg-[#FFF0D5] text-3xl font-black text-[#D97706] shadow-inner transition-transform",
                      isRollingDice && "rotate-45 scale-110",
                    )}
                  >
                    {isRollingDice ? "🎲" : diceRoll}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-foreground">Current Square: {tokenPosition} / 24</p>
                    <p className="text-muted-foreground">Rolls: {ludoRollCount} · Correct: {ludoCorrectCount}</p>
                  </div>
                </div>

                <Button
                  onClick={rollDice}
                  disabled={isRollingDice || currentLudoQ !== null || tokenPosition >= 24}
                  className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-white font-bold text-xs h-10 shadow-sm"
                >
                  <Dices className="h-4 w-4 mr-1.5" />
                  {isRollingDice ? "Rolling Dice..." : currentLudoQ ? "Answer Below First" : "Roll Dice"}
                </Button>
              </div>

              {/* Question Card (Active after rolling) */}
              {currentLudoQ ? (
                <div className="card-surface p-5 rounded-2xl border-2 border-[#F5A623] shadow-md space-y-3.5">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#F5A623] text-white text-[10px]">
                      Move +{diceRoll} Squares
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setShowLudoHint(!showLudoHint)}
                      className="text-[11px] font-bold text-[#F5A623] hover:underline inline-flex items-center gap-0.5"
                    >
                      <Lightbulb className="h-3 w-3" /> Hint
                    </button>
                  </div>

                  <p className="font-bold text-xs text-foreground leading-snug">
                    {currentLudoQ.text}
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentLudoQ.options.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={selectedLudoOption !== null}
                        onClick={() => handleAnswerLudo(i)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all",
                          selectedLudoOption === null && "border-border bg-card hover:bg-muted text-foreground",
                          selectedLudoOption === i && i === currentLudoQ.correct && "border-[#19B99A] bg-[#DDF8EE] text-[#19B99A] font-bold",
                          selectedLudoOption === i && i !== currentLudoQ.correct && "border-[#E11D48] bg-[#FFE4E6] text-[#E11D48] font-bold",
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {showLudoHint && (
                    <div className="rounded-lg bg-muted/70 p-2.5 text-[11px] text-muted-foreground border border-border">
                      💡 <strong>Hint:</strong> {currentLudoQ.hint}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-surface p-5 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground py-8">
                  Tap <strong>Roll Dice</strong> to take your turn and unlock your next fraction challenge.
                </div>
              )}
            </div>
          </div>

          {/* Math Ludo Victory Modal */}
          <Dialog open={ludoVictoryModalOpen} onOpenChange={setLudoVictoryModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-[#F5A623]">
                  <Trophy className="h-6 w-6 text-[#F5A623]" /> Ludo Champion!
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2 text-xs">
                <p className="text-foreground">
                  You conquered the 24-square board in <strong>{ludoRollCount} rolls</strong> with <strong>{ludoCorrectCount} correct fraction solutions</strong>!
                </p>
                <div className="rounded-xl bg-card border border-border p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-bold text-foreground">
                      {ludoRollCount > 0 ? Math.round((ludoCorrectCount / ludoRollCount) * 100) : 100}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level Completed:</span>
                    <span className="font-bold text-foreground">Level {ludoDifficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">XP Reward:</span>
                    <span className="font-bold text-[#19B99A]">+50 XP Awarded</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" onClick={resetMathLudo} className="bg-[#F5A623] text-white text-xs font-bold">
                    Play Again
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ======================================================== */}
        {/* 3. PHYSICAL BOARD GAMES & DIGITAL COMPANION TOOLS        */}
        {/* ======================================================== */}
        <TabsContent value="companion" className="space-y-6">
          <div className="rounded-xl border border-[#0284C7]/30 bg-[#E0F2FE]/40 p-4 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#0284C7]">
              <Compass className="h-4 w-4" /> Physical Game Activity vs Optional Digital Companion
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These board games are primarily designed for physical classroom play with paper boards and counters. Below you can use our <strong>Digital Companion Studio</strong> for automated clue checking, timing, and rule lookups.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Companion Tool 1: Bharat Explorer Clue Validator */}
            <div className="lg:col-span-7 card-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <Badge className="bg-[#0284C7] text-white text-[10px] mb-1">Digital Companion Tool</Badge>
                  <h3 className="font-bold text-base text-foreground">Bharat Explorer: Clue Validator</h3>
                </div>
                <div className="flex gap-1.5">
                  {companionClues.map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={activeCompanionClueIdx === i ? "default" : "outline"}
                      onClick={() => {
                        setActiveCompanionClueIdx(i);
                        setCompanionAnswerRevealed(false);
                      }}
                      className={cn("h-7 px-2.5 text-xs", activeCompanionClueIdx === i && "bg-[#0284C7] text-white")}
                    >
                      Clue {i + 1}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-card border border-border p-4 space-y-3">
                <span className="text-[10px] font-bold text-[#0284C7] uppercase">
                  {companionClues[activeCompanionClueIdx]?.card}
                </span>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  "{companionClues[activeCompanionClueIdx]?.clue}"
                </p>

                {companionAnswerRevealed ? (
                  <div className="rounded-lg bg-[#DDF8EE] p-3 text-xs text-[#0F766E] border border-[#19B99A]/30 space-y-1">
                    <p className="font-bold">Answer: {companionClues[activeCompanionClueIdx]?.answer}</p>
                    <p className="text-[11px] text-muted-foreground">{companionClues[activeCompanionClueIdx]?.fact}</p>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCompanionAnswerRevealed(true)}
                    className="text-xs font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Reveal Answer for Teacher / Judge
                  </Button>
                )}
              </div>
            </div>

            {/* Companion Blueprint 2: Physical Classroom Setup */}
            <div className="lg:col-span-5 card-surface p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <Badge className="bg-[#F5A623] text-white text-[10px]">Physical Board Activity</Badge>
              <h3 className="font-bold text-sm text-foreground">Printable Classroom Blueprint</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                How to set up Bharat Explorer in an offline classroom without tablets:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-[#19B99A] shrink-0" />
                  <span><strong>Materials:</strong> 1 printed map chart, 4 colored buttons/counters, 1 standard die.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-[#19B99A] shrink-0" />
                  <span><strong>Team Roles:</strong> 1 Navigator (moves piece), 1 Scholar (reads clues), 1 Timekeeper.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-[#19B99A] shrink-0" />
                  <span><strong>Rules:</strong> Roll to move across river basins. Correct clue answer claims the territory card.</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* 4. FULL GAME LIBRARY (ORGANIZED BY SUBJECT, AGE, OBJ)    */}
        {/* ======================================================== */}
        <TabsContent value="library" className="space-y-6">
          {/* Filter Bar */}
          <div className="card-surface p-4 rounded-xl border border-border grid gap-3 sm:grid-cols-3 text-xs">
            <label className="font-semibold text-muted-foreground">
              Subject
              <select
                className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs text-foreground focus:outline-none"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="All">All Subjects</option>
                <option value="Computing">Computing</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
              </select>
            </label>

            <label className="font-semibold text-muted-foreground">
              Grade / Class
              <select
                className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs text-foreground focus:outline-none"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
              </select>
            </label>

            <label className="font-semibold text-muted-foreground">
              Game Format
              <select
                className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs text-foreground focus:outline-none"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="All">All Formats</option>
                <option value="Digital Playable">Digital Playable</option>
                <option value="Physical Board + Digital Companion">Physical Board + Digital Companion</option>
                <option value="Physical Classroom Kit">Physical Classroom Kit</option>
              </select>
            </label>
          </div>

          {/* Game Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalogue.map((game) => (
              <div
                key={game.id}
                className="card-surface p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-border bg-card">
                      {game.subject} · {game.classes}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {game.durationMin} mins
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-foreground">{game.name}</h4>
                  <Badge
                    className={cn(
                      "text-[10px] mt-1 font-semibold",
                      game.mode === "Digital Playable" ? "bg-[#DDF8EE] text-[#19B99A]" : "bg-[#FFF0D5] text-[#D97706]",
                    )}
                  >
                    {game.mode}
                  </Badge>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-foreground block">What you learn:</span>
                      <p className="text-muted-foreground leading-snug">{game.learningObjective}</p>
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">How to play:</span>
                      <p className="text-muted-foreground leading-snug">{game.howToPlay}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  {game.playable ? (
                    <Button
                      size="sm"
                      onClick={() => setActiveStudioTab(game.id === "codebot-maze" ? "codebot" : "ludo")}
                      className="w-full bg-[#6541F5] text-white hover:bg-[#5230E8] text-xs font-bold"
                    >
                      <Play className="h-3.5 w-3.5 mr-1" /> Play Game Now
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveStudioTab("companion")}
                      className="w-full text-xs font-semibold"
                    >
                      View Companion Blueprint
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
