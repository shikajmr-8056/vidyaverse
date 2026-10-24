import { useState, useEffect, useRef } from "react";
import {
  RotateCcw, Sparkles, Target, Lightbulb, Play, AlertCircle,
  CheckCircle2, Compass, Award, Shield, ArrowRight, Zap, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

interface CarromCoin {
  id: string;
  type: "queen" | "white" | "black";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  isPocketed: boolean;
  color: string;
  border: string;
  points: number;
}

const BOARD_SIZE = 400;
const CUSHION_INSET = 36;
const POCKET_RADIUS = 22;
const STRIKER_RADIUS = 16;
const COIN_RADIUS = 12;
const BASELINE_Y = 328;

const POCKETS = [
  { x: 26, y: 26 },
  { x: 374, y: 26 },
  { x: 26, y: 374 },
  { x: 374, y: 374 },
];

function createInitialCoins(): CarromCoin[] {
  return [
    // Queen (Center)
    {
      id: "queen",
      type: "queen",
      x: 200,
      y: 200,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#E95778",
      border: "#9E1436",
      points: 5,
    },
    // 4 White Coins (Cardinal)
    {
      id: "w1",
      type: "white",
      x: 200,
      y: 174,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#FFFDF0",
      border: "#D1C7A5",
      points: 2,
    },
    {
      id: "w2",
      type: "white",
      x: 200,
      y: 226,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#FFFDF0",
      border: "#D1C7A5",
      points: 2,
    },
    {
      id: "w3",
      type: "white",
      x: 174,
      y: 200,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#FFFDF0",
      border: "#D1C7A5",
      points: 2,
    },
    {
      id: "w4",
      type: "white",
      x: 226,
      y: 200,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#FFFDF0",
      border: "#D1C7A5",
      points: 2,
    },
    // 4 Black Coins (Diagonals)
    {
      id: "b1",
      type: "black",
      x: 182,
      y: 182,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#2C2C34",
      border: "#18181E",
      points: 1,
    },
    {
      id: "b2",
      type: "black",
      x: 218,
      y: 182,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#2C2C34",
      border: "#18181E",
      points: 1,
    },
    {
      id: "b3",
      type: "black",
      x: 182,
      y: 218,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#2C2C34",
      border: "#18181E",
      points: 1,
    },
    {
      id: "b4",
      type: "black",
      x: 218,
      y: 218,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      mass: 1.0,
      isPocketed: false,
      color: "#2C2C34",
      border: "#18181E",
      points: 1,
    },
  ];
}

export function NewtonsCarromGame() {
  const d = useDemo();

  // Striker positioning & shooting controls
  const [strikerX, setStrikerX] = useState<number>(200);
  const [aimAngle, setAimAngle] = useState<number>(90); // 90° = straight up
  const [shotPower, setShotPower] = useState<number>(70); // 20% to 100%
  const [boricPowder, setBoricPowder] = useState<boolean>(true); // Reduces friction

  // Game state
  const [coins, setCoins] = useState<CarromCoin[]>(createInitialCoins);
  const [striker, setStriker] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    isMoving: boolean;
    isPocketed: boolean;
  }>({
    x: 200,
    y: BASELINE_Y,
    vx: 0,
    vy: 0,
    isMoving: false,
    isPocketed: false,
  });

  const [score, setScore] = useState<number>(0);
  const [shotsCount, setShotsCount] = useState<number>(0);
  const [activeChallenge, setActiveChallenge] = useState<number>(1);
  const [foulMessage, setFoulMessage] = useState<string | null>(null);
  const [lastPhysicsEvent, setLastPhysicsEvent] = useState<string>(
    "Position striker along the baseline, align trajectory angle, and release."
  );

  // Physics animation frame reference
  const animFrameRef = useRef<number | null>(null);
  const isSimulatingRef = useRef<boolean>(false);

  // Reset striker to baseline when not moving
  useEffect(() => {
    if (!striker.isMoving) {
      setStriker((prev) => ({
        ...prev,
        x: strikerX,
        y: BASELINE_Y,
        vx: 0,
        vy: 0,
        isPocketed: false,
      }));
    }
  }, [strikerX, striker.isMoving]);

  // Main 2D Physics Engine Loop
  const runPhysicsStep = () => {
    setCoins((prevCoins) => {
      let updatedCoins = prevCoins.map((c) => ({ ...c }));
      let updatedStriker = { ...striker };
      const friction = boricPowder ? 0.986 : 0.974;
      const restitution = 0.84;
      let motionRemaining = false;

      // 1. Move striker if in motion
      if (updatedStriker.isMoving && !updatedStriker.isPocketed) {
        updatedStriker.x += updatedStriker.vx;
        updatedStriker.y += updatedStriker.vy;
        updatedStriker.vx *= friction;
        updatedStriker.vy *= friction;

        // Cushion bounces for striker
        if (updatedStriker.x - STRIKER_RADIUS < CUSHION_INSET) {
          updatedStriker.x = CUSHION_INSET + STRIKER_RADIUS;
          updatedStriker.vx = -updatedStriker.vx * restitution;
        } else if (updatedStriker.x + STRIKER_RADIUS > BOARD_SIZE - CUSHION_INSET) {
          updatedStriker.x = BOARD_SIZE - CUSHION_INSET - STRIKER_RADIUS;
          updatedStriker.vx = -updatedStriker.vx * restitution;
        }

        if (updatedStriker.y - STRIKER_RADIUS < CUSHION_INSET) {
          updatedStriker.y = CUSHION_INSET + STRIKER_RADIUS;
          updatedStriker.vy = -updatedStriker.vy * restitution;
        } else if (updatedStriker.y + STRIKER_RADIUS > BOARD_SIZE - CUSHION_INSET) {
          updatedStriker.y = BOARD_SIZE - CUSHION_INSET - STRIKER_RADIUS;
          updatedStriker.vy = -updatedStriker.vy * restitution;
        }

        // Pocket check for striker
        for (const p of POCKETS) {
          const dist = Math.hypot(updatedStriker.x - p.x, updatedStriker.y - p.y);
          if (dist < POCKET_RADIUS) {
            updatedStriker.isPocketed = true;
            updatedStriker.vx = 0;
            updatedStriker.vy = 0;
            setFoulMessage("Foul! Striker pocketed. -10 XP penalty.");
            setLastPhysicsEvent("Striker fell into corner pocket! Re-place on baseline.");
            break;
          }
        }

        if (Math.hypot(updatedStriker.vx, updatedStriker.vy) > 0.08) {
          motionRemaining = true;
        } else {
          updatedStriker.vx = 0;
          updatedStriker.vy = 0;
          updatedStriker.isMoving = false;
        }
      }

      // 2. Move active coins
      for (let i = 0; i < updatedCoins.length; i++) {
        const c = updatedCoins[i];
        if (!c || c.isPocketed) continue;

        c.x += c.vx;
        c.y += c.vy;
        c.vx *= friction;
        c.vy *= friction;

        // Cushion bounces for coins
        if (c.x - c.radius < CUSHION_INSET) {
          c.x = CUSHION_INSET + c.radius;
          c.vx = -c.vx * restitution;
          setLastPhysicsEvent("Bank rebound off cushion: angle of incidence = angle of reflection.");
        } else if (c.x + c.radius > BOARD_SIZE - CUSHION_INSET) {
          c.x = BOARD_SIZE - CUSHION_INSET - c.radius;
          c.vx = -c.vx * restitution;
        }

        if (c.y - c.radius < CUSHION_INSET) {
          c.y = CUSHION_INSET + c.radius;
          c.vy = -c.vy * restitution;
        } else if (c.y + c.radius > BOARD_SIZE - CUSHION_INSET) {
          c.y = BOARD_SIZE - CUSHION_INSET - c.radius;
          c.vy = -c.vy * restitution;
        }

        // Pocket check for coins
        for (const p of POCKETS) {
          const dist = Math.hypot(c.x - p.x, c.y - p.y);
          if (dist < POCKET_RADIUS) {
            c.isPocketed = true;
            c.vx = 0;
            c.vy = 0;
            setScore((s) => s + c.points);
            d.awardActivityXp("carrom-coin-pocketed", c.points * 10, `Pocketed ${c.type} carrom coin`);
            if (c.type === "queen") {
              d.awardActivityXp("carrom-queen-pocketed", 50, "Pocketed Red Queen with momentum conservation");
              setLastPhysicsEvent("🌟 Red Queen Pocketed! +50 XP bonus earned.");
            } else {
              setLastPhysicsEvent(`🎯 ${c.type === "white" ? "White" : "Black"} coin scored into pocket!`);
            }
            break;
          }
        }

        if (Math.hypot(c.vx, c.vy) > 0.08) {
          motionRemaining = true;
        } else {
          c.vx = 0;
          c.vy = 0;
        }
      }

      // 3. Elastic Collisions: Striker vs Coins
      if (updatedStriker.isMoving && !updatedStriker.isPocketed) {
        for (let i = 0; i < updatedCoins.length; i++) {
          const c = updatedCoins[i];
          if (!c || c.isPocketed) continue;

          const dx = c.x - updatedStriker.x;
          const dy = c.y - updatedStriker.y;
          const dist = Math.hypot(dx, dy);
          const minDist = STRIKER_RADIUS + c.radius;

          if (dist < minDist && dist > 0) {
            // Collision normal
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlapping bodies
            const overlap = minDist - dist;
            c.x += nx * overlap * 0.7;
            c.y += ny * overlap * 0.7;
            updatedStriker.x -= nx * overlap * 0.3;
            updatedStriker.y -= ny * overlap * 0.3;

            // Relative velocity along normal
            const kx = updatedStriker.vx - c.vx;
            const ky = updatedStriker.vy - c.vy;
            const p = 2 * (nx * kx + ny * ky) / (3.0 + c.mass);

            // Momentum conservation impulse (Newton's 3rd Law)
            updatedStriker.vx -= p * c.mass * nx * restitution;
            updatedStriker.vy -= p * c.mass * ny * restitution;
            c.vx += p * 3.0 * nx * restitution;
            c.vy += p * 3.0 * ny * restitution;

            setLastPhysicsEvent(
              `⚡ Collision! Striker mass (3.0) transferred momentum to ${c.type} coin (mass 1.0). (Newton's 3rd Law: Action & Reaction)`
            );
            motionRemaining = true;
          }
        }
      }

      // 4. Elastic Collisions: Coin vs Coin
      for (let i = 0; i < updatedCoins.length; i++) {
        for (let j = i + 1; j < updatedCoins.length; j++) {
          const c1 = updatedCoins[i];
          const c2 = updatedCoins[j];
          if (!c1 || !c2 || c1.isPocketed || c2.isPocketed) continue;

          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = c1.radius + c2.radius;

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate
            const overlap = 0.5 * (minDist - dist);
            c1.x -= nx * overlap;
            c1.y -= ny * overlap;
            c2.x += nx * overlap;
            c2.y += ny * overlap;

            // Equal mass 1:1 momentum exchange
            const kx = c1.vx - c2.vx;
            const ky = c1.vy - c2.vy;
            const p = 2 * (nx * kx + ny * ky) / (c1.mass + c2.mass);

            c1.vx -= p * c2.mass * nx * restitution;
            c1.vy -= p * c2.mass * ny * restitution;
            c2.vx += p * c1.mass * nx * restitution;
            c2.vy += p * c1.mass * ny * restitution;

            motionRemaining = true;
          }
        }
      }

      setStriker(updatedStriker);

      if (motionRemaining) {
        animFrameRef.current = requestAnimationFrame(runPhysicsStep);
      } else {
        isSimulatingRef.current = false;
        // Snap striker back to baseline for the next turn
        setStriker({
          x: strikerX,
          y: BASELINE_Y,
          vx: 0,
          vy: 0,
          isMoving: false,
          isPocketed: false,
        });
      }

      return updatedCoins;
    });
  };

  const handleShootStriker = () => {
    if (striker.isMoving || isSimulatingRef.current) return;

    setFoulMessage(null);
    setShotsCount((c) => c + 1);

    // Calculate initial velocity from aim angle and power
    const rad = (aimAngle * Math.PI) / 180;
    // Angle 90 is straight up (-Y direction)
    const initialSpeed = (shotPower / 100) * 16;
    const vx = Math.cos(rad) * initialSpeed;
    const vy = -Math.sin(rad) * initialSpeed;

    setStriker({
      x: strikerX,
      y: BASELINE_Y,
      vx,
      vy,
      isMoving: true,
      isPocketed: false,
    });

    setLastPhysicsEvent(
      `Striker released with initial velocity ${(initialSpeed * 1.5).toFixed(1)} m/s at ${aimAngle}°. Momentum p = ${(3.0 * initialSpeed).toFixed(1)} kg·m/s.`
    );

    isSimulatingRef.current = true;
    animFrameRef.current = requestAnimationFrame(runPhysicsStep);
  };

  const handleResetBoard = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isSimulatingRef.current = false;
    setCoins(createInitialCoins());
    setStriker({
      x: strikerX,
      y: BASELINE_Y,
      vx: 0,
      vy: 0,
      isMoving: false,
      isPocketed: false,
    });
    setScore(0);
    setShotsCount(0);
    setFoulMessage(null);
    setLastPhysicsEvent("Carrom board reset to starting tournament cluster.");
  };

  // Trajectory preview endpoint
  const aimRad = (aimAngle * Math.PI) / 180;
  const aimLength = 65 + (shotPower / 100) * 45;
  const aimTargetX = strikerX + Math.cos(aimRad) * aimLength;
  const aimTargetY = BASELINE_Y - Math.sin(aimRad) * aimLength;

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/40 p-4 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-[#19B99A]">
          <Target className="h-4 w-4" /> Educational Objective: Newton's Laws & Conservation of Linear Momentum
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Simulate authentic carrom physics: observe how striker mass transfers kinetic energy to stationary coins (Newton's 1st Law), how force determines acceleration (Newton's 2nd Law), and how equal-and-opposite reaction forces alter the striker's path after impact (Newton's 3rd Law).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: 400x400 Interactive Carrom Board */}
        <div className="lg:col-span-7 card-surface p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Carrom Board Simulator</span>
              <Badge variant="outline" className="text-[10px] border-[#19B99A]/40 text-[#19B99A]">
                2D Physics Engine
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Shots: <strong className="text-foreground">{shotsCount}</strong>
              </span>
              <span className="font-bold text-[#6541F5]">
                Score: <strong>{score} pts</strong>
              </span>
            </div>
          </div>

          {/* SVG Board */}
          <div className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden border-4 border-[#8B5A2B] bg-[#F7E7CE] shadow-md select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Outer wooden border line */}
              <rect x="10" y="10" width="380" height="380" fill="none" stroke="#6D4019" strokeWidth="2" />

              {/* Wooden Cushion Borders */}
              <rect x="0" y="0" width="400" height="24" fill="#6D4019" />
              <rect x="0" y="376" width="400" height="24" fill="#6D4019" />
              <rect x="0" y="0" width="24" height="400" fill="#6D4019" />
              <rect x="376" y="0" width="24" height="400" fill="#6D4019" />

              {/* 4 Corner Pockets */}
              {POCKETS.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r={POCKET_RADIUS} fill="#18181E" />
                  <circle cx={p.x} cy={p.y} r={POCKET_RADIUS - 3} fill="#0A0A0E" />
                  <circle cx={p.x} cy={p.y} r={POCKET_RADIUS} fill="none" stroke="#D1C7A5" strokeWidth="1.5" />
                </g>
              ))}

              {/* Center Circle & Concentric Patterns */}
              <circle cx="200" cy="200" r="42" fill="none" stroke="#A67B5B" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="16" fill="none" stroke="#E95778" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="3" fill="#E95778" />

              {/* Baseline (Player's Shooting Line) */}
              <line x1="90" y1={BASELINE_Y} x2="310" y2={BASELINE_Y} stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="90" cy={BASELINE_Y} r="10" fill="none" stroke="#E95778" strokeWidth="1.2" />
              <circle cx="90" cy={BASELINE_Y} r="3" fill="#E95778" />
              <circle cx="310" cy={BASELINE_Y} r="10" fill="none" stroke="#E95778" strokeWidth="1.2" />
              <circle cx="310" cy={BASELINE_Y} r="3" fill="#E95778" />

              {/* Top Baseline */}
              <line x1="90" y1="72" x2="310" y2="72" stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="90" cy="72" r="10" fill="none" stroke="#8B5A2B" strokeWidth="1.2" opacity="0.6" />
              <circle cx="310" cy="72" r="10" fill="none" stroke="#8B5A2B" strokeWidth="1.2" opacity="0.6" />

              {/* Corner Diagonal Arrows */}
              <line x1="48" y1="48" x2="110" y2="110" stroke="#8B5A2B" strokeWidth="1" opacity="0.4" />
              <line x1="352" y1="48" x2="290" y2="110" stroke="#8B5A2B" strokeWidth="1" opacity="0.4" />
              <line x1="48" y1="352" x2="110" y2="290" stroke="#8B5A2B" strokeWidth="1" opacity="0.4" />
              <line x1="352" y1="352" x2="290" y2="290" stroke="#8B5A2B" strokeWidth="1" opacity="0.4" />

              {/* Trajectory Guide when striker is stationary */}
              {!striker.isMoving && !striker.isPocketed && (
                <g>
                  <line
                    x1={striker.x}
                    y1={striker.y}
                    x2={aimTargetX}
                    y2={aimTargetY}
                    stroke="#6541F5"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <circle cx={aimTargetX} cy={aimTargetY} r="3" fill="#6541F5" />
                </g>
              )}

              {/* Carrom Coins */}
              {coins.map((c) => {
                if (c.isPocketed) return null;
                return (
                  <g key={c.id}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={c.radius}
                      fill={c.color}
                      stroke={c.border}
                      strokeWidth="2"
                      className="filter drop-shadow-xs"
                    />
                    <circle cx={c.x} cy={c.y} r={c.radius - 4} fill="none" stroke={c.border} strokeWidth="1" opacity="0.6" />
                    {c.type === "queen" && (
                      <circle cx={c.x} cy={c.y} r="3" fill="#FFFFFF" />
                    )}
                  </g>
                );
              })}

              {/* Striker */}
              {!striker.isPocketed && (
                <g>
                  <circle
                    cx={striker.x}
                    cy={striker.y}
                    r={STRIKER_RADIUS}
                    fill="#F5F5FA"
                    stroke="#5230E8"
                    strokeWidth="3"
                    className="filter drop-shadow-md"
                  />
                  <circle cx={striker.x} cy={striker.y} r={STRIKER_RADIUS - 5} fill="none" stroke="#6541F5" strokeWidth="1.5" />
                  <circle cx={striker.x} cy={striker.y} r="3" fill="#6541F5" />
                </g>
              )}
            </svg>
          </div>

          {/* Telemetry Footer */}
          <div className="w-full mt-4 p-3 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground flex items-center justify-between">
            <span className="truncate mr-2">
              <strong>Telemetry:</strong> {lastPhysicsEvent}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetBoard}
              className="h-7 px-2 text-xs font-semibold shrink-0"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>

          {foulMessage && (
            <div className="w-full mt-2.5 p-2.5 rounded-xl border border-[#E95778]/40 bg-[#FCE5EB] text-xs font-semibold text-[#E95778] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{foulMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Shot Controls & Physics Principles */}
        <div className="lg:col-span-5 space-y-5">
          {/* Controls Panel */}
          <div className="card-surface p-5 rounded-2xl border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#6541F5]" /> Shot Controls &amp; Calibration
            </h3>

            {/* Slider 1: Baseline Position */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Striker Baseline Position</span>
                <span className="font-mono text-muted-foreground">{strikerX} px</span>
              </div>
              <input
                type="range"
                min={90}
                max={310}
                value={strikerX}
                disabled={striker.isMoving}
                onChange={(e) => setStrikerX(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg accent-[#6541F5] cursor-pointer"
                aria-label="Adjust striker baseline position"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Left (90px)</span>
                <span>Center (200px)</span>
                <span>Right (310px)</span>
              </div>
            </div>

            {/* Slider 2: Aim Direction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Aiming Angle (Degrees)</span>
                <span className="font-mono font-bold text-[#6541F5]">{aimAngle}°</span>
              </div>
              <input
                type="range"
                min={20}
                max={160}
                value={aimAngle}
                disabled={striker.isMoving}
                onChange={(e) => setAimAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg accent-[#6541F5] cursor-pointer"
                aria-label="Adjust aiming angle"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Left Bank (20°)</span>
                <span>Direct Forward (90°)</span>
                <span>Right Bank (160°)</span>
              </div>
            </div>

            {/* Slider 3: Shot Power */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Striker Force / Power</span>
                <span className="font-mono font-bold text-[#F5A623]">{shotPower}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={shotPower}
                disabled={striker.isMoving}
                onChange={(e) => setShotPower(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg accent-[#F5A623] cursor-pointer"
                aria-label="Adjust striker shot power"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Gentle Tap (20%)</span>
                <span>Standard (60%)</span>
                <span>Maximum Impulse (100%)</span>
              </div>
            </div>

            {/* Friction Powder Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <div>
                <span className="text-xs font-bold text-foreground block">Apply Boric Powder</span>
                <span className="text-[11px] text-muted-foreground">
                  {boricPowder ? "Low friction (μ = 0.014)" : "High friction (μ = 0.026)"}
                </span>
              </div>
              <Button
                size="sm"
                variant={boricPowder ? "default" : "outline"}
                onClick={() => setBoricPowder(!boricPowder)}
                className={cn(
                  "text-xs h-7",
                  boricPowder && "bg-[#19B99A] text-white hover:bg-[#19B99A]/90"
                )}
              >
                {boricPowder ? "Powder Applied ✓" : "Rough Wood"}
              </Button>
            </div>

            {/* Shoot Action Button */}
            <Button
              disabled={striker.isMoving}
              onClick={handleShootStriker}
              className="w-full bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-sm h-10 shadow-sm"
            >
              <Play className="h-4 w-4 mr-1.5 fill-current" />
              {striker.isMoving ? "Striker in Motion..." : "Shoot Striker"}
            </Button>
          </div>

          {/* Physics Learning Principles Cards */}
          <div className="card-surface p-4.5 rounded-2xl border border-border shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-[#F5A623]" /> Key Physics Laws in Action
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-border bg-muted/30">
                <strong className="text-foreground block">1. Newton's First Law (Inertia):</strong>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  The carrom coins remain stationary in the center cluster until an external unbalanced force (the moving striker) strikes them.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-border bg-muted/30">
                <strong className="text-foreground block">2. Newton's Second Law (F = ma):</strong>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Increasing the Shot Power applies greater impulse (Δp = F·Δt), causing the 3× heavier striker to accelerate coins with greater velocity.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-border bg-muted/30">
                <strong className="text-foreground block">3. Newton's Third Law (Action-Reaction):</strong>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  When the striker strikes a coin, the coin pushes back on the striker with equal and opposite force, noticeably slowing or deflecting the striker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
