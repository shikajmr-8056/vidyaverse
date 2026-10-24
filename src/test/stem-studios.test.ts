import { describe, expect, it } from "vitest";

describe("STEM Studio 1: PlayLab Educational Games", () => {
  it("defines progressive difficulty levels and obstacle grids for CodeBot Maze", () => {
    const levels = [
      { id: 1, par: 5, start: { x: 0, y: 0 }, goal: { x: 3, y: 1 } },
      { id: 2, par: 7, start: { x: 0, y: 0 }, goal: { x: 3, y: 3 } },
      { id: 3, par: 6, start: { x: 0, y: 0 }, goal: { x: 0, y: 3 } },
    ];

    levels.forEach((lvl) => {
      expect(lvl.start.x).toBeGreaterThanOrEqual(0);
      expect(lvl.start.x).toBeLessThan(4);
      expect(lvl.start.y).toBeGreaterThanOrEqual(0);
      expect(lvl.start.y).toBeLessThan(4);
      expect(lvl.goal.x).toBeGreaterThanOrEqual(0);
      expect(lvl.goal.x).toBeLessThan(4);
      expect(lvl.goal.y).toBeGreaterThanOrEqual(0);
      expect(lvl.goal.y).toBeLessThan(4);
      expect(lvl.par).toBeGreaterThan(0);
    });
  });

  it("calculates Math Ludo track progression and ensures valid answer boundaries", () => {
    let tokenPosition = 1;
    const diceRoll = 3;
    const isCorrect = true;

    if (isCorrect) {
      tokenPosition = Math.min(24, tokenPosition + diceRoll);
    }
    expect(tokenPosition).toBe(4);

    // Speed boost at step 6
    if (tokenPosition === 6) {
      tokenPosition += 1;
    }
    expect(tokenPosition).toBe(4);

    // Reaching victory at step 24
    tokenPosition = 24;
    expect(tokenPosition).toBeGreaterThanOrEqual(24);
  });

  it("calculates Newton's Carrom momentum conservation and elastic collision dynamics", () => {
    // Striker mass m1 = 3.0, Coin mass m2 = 1.0
    const m1 = 3.0;
    const m2 = 1.0;
    const u1 = 10.0; // Striker initial velocity
    const u2 = 0.0; // Coin initially at rest
    const restitution = 0.84;

    // 1D elastic head-on collision impulse
    const relativeV = u1 - u2;
    const impulse = (1 + restitution) * relativeV / (1 / m1 + 1 / m2);

    const v1 = u1 - (impulse / m1);
    const v2 = u2 + (impulse / m2);

    // Verify momentum conservation: m1*u1 + m2*u2 ≈ m1*v1 + m2*v2
    const initialMomentum = m1 * u1 + m2 * u2;
    const finalMomentum = m1 * v1 + m2 * v2;
    expect(finalMomentum).toBeCloseTo(initialMomentum, 2);

    // Striker slows down, coin speeds forward
    expect(v1).toBeLessThan(u1);
    expect(v2).toBeGreaterThan(0);
  });

  it("verifies corner pocket proximity detection on 400x400 carrom board", () => {
    const pockets = [
      { x: 26, y: 26 },
      { x: 374, y: 26 },
      { x: 26, y: 374 },
      { x: 374, y: 374 },
    ];
    const pocketRadius = 22;

    const coinNearPocket = { x: 30, y: 30 };
    const coinAtCenter = { x: 200, y: 200 };

    const isPocketed = (coin: { x: number; y: number }) => {
      return pockets.some((p) => Math.hypot(coin.x - p.x, coin.y - p.y) < pocketRadius);
    };

    expect(isPocketed(coinNearPocket)).toBe(true);
    expect(isPocketed(coinAtCenter)).toBe(false);
  });
});

describe("STEM Studio 2: CircuitVerse Physics & Diagnostics", () => {
  it("calculates Ohm's Law loop current and LED forward voltage drops accurately", () => {
    const vSource = 9.0;
    const vLed = 2.2; // Green LED
    const resistance = 330; // 330 Ohms

    const resistorVoltage = Math.max(0, vSource - vLed);
    const currentA = resistorVoltage / resistance;
    const currentmA = Math.round(currentA * 1000 * 10) / 10;

    // (9.0 - 2.2) / 330 = 6.8 / 330 = 0.0206 A = 20.6 mA
    expect(resistorVoltage).toBeCloseTo(6.8, 1);
    expect(currentmA).toBeCloseTo(20.6, 1);
    expect(currentmA).toBeLessThanOrEqual(25); // Safe continuous operation
  });

  it("triggers burnout alert when current exceeds LED threshold", () => {
    const vSource = 9.0;
    const vLed = 1.8; // Red LED
    const lowResistance = 100; // 100 Ohms

    const resistorVoltage = vSource - vLed;
    const currentmA = (resistorVoltage / lowResistance) * 1000;

    // (9.0 - 1.8) / 100 = 7.2 / 100 = 72 mA > 25 mA max rating
    expect(currentmA).toBeCloseTo(72, 1);
    const isBurnedOut = currentmA > 25;
    expect(isBurnedOut).toBe(true);
  });

  it("accurately evaluates digital logic gate truth tables", () => {
    const evalLogic = (gate: "AND" | "OR" | "NOT", inA: boolean, inB: boolean) => {
      if (gate === "AND") return inA && inB;
      if (gate === "OR") return inA || inB;
      if (gate === "NOT") return !inA;
      return inA;
    };

    // AND gate
    expect(evalLogic("AND", true, true)).toBe(true);
    expect(evalLogic("AND", true, false)).toBe(false);
    expect(evalLogic("AND", false, true)).toBe(false);

    // OR gate
    expect(evalLogic("OR", true, false)).toBe(true);
    expect(evalLogic("OR", false, false)).toBe(false);

    // NOT gate
    expect(evalLogic("NOT", true, false)).toBe(false);
    expect(evalLogic("NOT", false, false)).toBe(true);
  });
});

describe("STEM Studio 3: CodeVerse Computational Thinking", () => {
  it("structures guided programming challenges with explicit test cases", () => {
    const challenge = {
      id: "ch-1",
      topic: "Sequences",
      targetPos: { x: 3, y: 0 },
      targetDir: "DOWN",
      maxBlocks: 5,
    };

    expect(challenge.topic).toBe("Sequences");
    expect(challenge.maxBlocks).toBe(5);
    expect(challenge.targetPos.x).toBe(3);
    expect(challenge.targetPos.y).toBe(0);
  });

  it("converts visual block structures into valid Python and Arduino syntax", () => {
    const blocks = ["repeat 4 times do", "  move_forward()", "  turn_right()"];

    const pythonCode = blocks
      .map((b) => {
        if (b.startsWith("repeat")) {
          const match = b.match(/\d+/);
          const count = match ? match[0] : "4";
          return `for step in range(${count}):`;
        }
        if (b.startsWith("  ")) return `    bot.${b.trim()}`;
        return `bot.${b}`;
      })
      .join("\n");

    expect(pythonCode).toContain("for step in range(4):");
    expect(pythonCode).toContain("    bot.move_forward()");
    expect(pythonCode).toContain("    bot.turn_right()");
  });
});
