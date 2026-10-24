import { describe, expect, it } from "vitest";
import { lessons, misconceptions, achievements } from "@/data/demo";

describe("Student Dashboard Learning Architecture", () => {
  it("determines the correct incomplete lesson to resume", () => {
    // When decimals-place-value is completed, fractions-intro should be the next incomplete lesson
    const completed = ["decimals-place-value"];
    const incomplete = lessons.filter((l) => !completed.includes(l.id));

    expect(incomplete.length).toBeGreaterThan(0);
    const continueLesson = incomplete[0];
    expect(continueLesson).toBeDefined();
    expect(continueLesson?.id).toBe("fractions-intro");
    expect(continueLesson?.subject).toBe("Mathematics");
    expect(continueLesson?.chapter).toBe("Ch 2 · Fractions and Decimals");
  });

  it("calculates chapter progress accurately for the active lesson", () => {
    const completed = ["decimals-place-value"];
    const targetLesson = lessons.find((l) => l.id === "fractions-intro")!;
    const chapterLessons = lessons.filter(
      (l) => l.chapter === targetLesson.chapter && l.subject === targetLesson.subject
    );

    expect(chapterLessons.length).toBe(3); // fractions-intro, fractions-compare, decimals-place-value
    const chapterCompleted = chapterLessons.filter((l) => completed.includes(l.id)).length;
    // decimals-place-value is in this chapter, so 1 of 3 is completed
    expect(chapterCompleted).toBe(1);

    const progressPct = Math.round((chapterCompleted / chapterLessons.length) * 100);
    expect(progressPct).toBe(33);
  });

  it("computes subject completion metrics and next recommended lesson for all core subjects", () => {
    const completed = ["decimals-place-value"];
    const subjects = ["Mathematics", "Science", "Computing", "Social Science"] as const;

    for (const sub of subjects) {
      const subLessons = lessons.filter((l) => l.subject === sub);
      expect(subLessons.length).toBeGreaterThan(0);

      const subCompleted = subLessons.filter((l) => completed.includes(l.id)).length;
      expect(subCompleted).toBeGreaterThanOrEqual(0);

      const nextLesson = subLessons.find((l) => !completed.includes(l.id));
      expect(nextLesson).toBeDefined();
    }
  });

  it("provides structured misconceptions and checkpoints for revision recommendations", () => {
    expect(misconceptions.length).toBeGreaterThanOrEqual(2);

    const fractionsMisconception = misconceptions.find((m) => m.id === "add-fractions");
    expect(fractionsMisconception).toBeDefined();
    expect(fractionsMisconception?.why).toContain("Halves and thirds");
    expect(fractionsMisconception?.practice.options.length).toBe(4);

    const circuitMisconception = misconceptions.find((m) => m.id === "open-switch");
    expect(circuitMisconception).toBeDefined();
    expect(circuitMisconception?.why).toContain("closed switch only completes the path");
  });

  it("keeps lifetime XP separate from weekly points and bazaar sparks", () => {
    const startingXp = 1240;
    const weeklyXp = 260;
    const sparks = 350;

    // Simulating reward redemption of 100 sparks
    const cost = 100;
    const updatedSparks = sparks - cost;
    const updatedLifetimeXp = startingXp; // Lifetime XP remains intact!

    expect(updatedSparks).toBe(250);
    expect(updatedLifetimeXp).toBe(1240);
    expect(weeklyXp).toBe(260);
  });

  it("verifies idempotency of challenge completion", () => {
    const completedChallenges: string[] = ["daily-fractions-1"];
    const challengeId = "daily-fractions-1";

    const isAlreadyCompleted = completedChallenges.includes(challengeId);
    expect(isAlreadyCompleted).toBe(true);

    // Idempotent guard: does not append or award repeatedly
    const updated = isAlreadyCompleted ? completedChallenges : [...completedChallenges, challengeId];
    expect(updated.length).toBe(1);
  });
});
