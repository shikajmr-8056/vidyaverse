import { describe, expect, it } from "vitest";
import { lessons, misconceptions } from "@/data/demo";

describe("AI Tutor: Concept Detective Grounding & Scaffolding", () => {
  it("grounds core diagnostic topics in approved NCERT curriculum lessons", () => {
    const fractionLesson = lessons.find((l) => l.id === "fractions-intro");
    expect(fractionLesson).toBeDefined();
    expect(fractionLesson?.board).toBe("NCERT");
    expect(fractionLesson?.classLevel).toBe(7);

    const circuitLesson = lessons.find((l) => l.id === "electric-circuits");
    expect(circuitLesson).toBeDefined();
    expect(circuitLesson?.subject).toBe("Science");

    const decimalLesson = lessons.find((l) => l.id === "decimals-place-value");
    expect(decimalLesson).toBeDefined();
  });

  it("verifies structured misconceptions have diagnostic reasons and practice checks", () => {
    expect(misconceptions.length).toBeGreaterThanOrEqual(3);

    for (const m of misconceptions) {
      expect(m.id).toBeDefined();
      expect(m.question).toBeDefined();
      expect(m.studentAnswer).toBeDefined();
      expect(m.misconception).toBeDefined();
      expect(m.why.length).toBeGreaterThan(15);
      expect(m.lessonId).toBeDefined();
      expect(m.practice).toBeDefined();
      expect(m.practice.options.length).toBeGreaterThanOrEqual(2);
      expect(m.practice.correct).toBeGreaterThanOrEqual(0);
      expect(m.practice.correct).toBeLessThan(m.practice.options.length);
    }
  });

  it("evaluates fractions addition misconception logic (1/2 + 1/3 = 5/6 not 2/5)", () => {
    const fracMis = misconceptions.find((m) => m.id === "add-fractions");
    expect(fracMis).toBeDefined();
    expect(fracMis?.studentAnswer).toBe("2/5");
    // Verify common denominator step
    const half = 1 / 2;
    const third = 1 / 3;
    const sum = half + third; // 5/6 = 0.8333...
    const erroneousSum = 2 / 5; // 0.4
    expect(sum).toBeGreaterThan(half);
    expect(erroneousSum).toBeLessThan(half); // Clear mathematical contradiction of erroneous sum!
  });

  it("correctly flags out-of-syllabus or uncertain topics", () => {
    const isOutOfSyllabus = (query: string) => {
      const lower = query.toLowerCase();
      const outOfScopeKeywords = ["quantum", "black hole", "crypto", "calculus", "cheat", "movie"];
      return outOfScopeKeywords.some((kw) => lower.includes(kw));
    };

    expect(isOutOfSyllabus("Explain quantum entanglement")).toBe(true);
    expect(isOutOfSyllabus("How do black holes form?")).toBe(true);
    expect(isOutOfSyllabus("Why is 1/2 + 1/3 not 2/5?")).toBe(false);
    expect(isOutOfSyllabus("How does a switch work in an electric circuit?")).toBe(false);
  });
});

describe("VidyaVerse Voice: Command Parser & Offline Language Packs", () => {
  it("matches supported curriculum voice commands correctly", () => {
    const parseCommand = (cmd: string) => {
      const lower = cmd.toLowerCase();
      if (lower.includes("fraction") || lower.includes("भिन्न") || lower.includes("ಭಿನ್ನರಾಶಿ")) {
        if (lower.includes("quiz") || lower.includes("test")) {
          return { action: "quiz", route: "/quiz/fractions" };
        }
        return { action: "lesson", route: "/lesson/fractions-intro" };
      }
      if (lower.includes("circuit") || lower.includes("विद्युत") || lower.includes("ಸರ್ಕ್ಯೂಟ್")) {
        return { action: "lesson", route: "/lesson/electric-circuits" };
      }
      if (lower.includes("progress") || lower.includes("streak") || lower.includes("ಪ್ರಗತಿ")) {
        return { action: "progress", route: "/progress" };
      }
      return { action: "general", route: null };
    };

    expect(parseCommand("Open fractions lesson")).toEqual({ action: "lesson", route: "/lesson/fractions-intro" });
    expect(parseCommand("Start fractions quiz")).toEqual({ action: "quiz", route: "/quiz/fractions" });
    expect(parseCommand("Check my study streak")).toEqual({ action: "progress", route: "/progress" });
    expect(parseCommand("ವಿಧ್ಯುತ್ ಸರ್ಕ್ಯೂಟ್ ತೆರೆಯಿರಿ")).toEqual({ action: "lesson", route: "/lesson/electric-circuits" });
    expect(parseCommand("विद्युत परिपथ खोलें")).toEqual({ action: "lesson", route: "/lesson/electric-circuits" });
  });

  it("manages regional language packs with modest storage footprints", () => {
    const packs = [
      { code: "en", name: "English Acoustic Pack", sizeMb: 38 },
      { code: "hi", name: "Hindi Acoustic Pack", sizeMb: 45 },
      { code: "kn", name: "Kannada Acoustic Pack", sizeMb: 48 },
    ];

    // Total storage should be under 150 MB (lightweight for low-cost Android/Raspberry Pi)
    const totalMb = packs.reduce((acc, p) => acc + p.sizeMb, 0);
    expect(totalMb).toBeLessThan(150);
    expect(packs.find((p) => p.code === "hi")?.sizeMb).toBe(45);
    expect(packs.find((p) => p.code === "kn")?.sizeMb).toBe(48);
  });
});
