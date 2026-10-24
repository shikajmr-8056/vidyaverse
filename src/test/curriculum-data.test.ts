import { describe, expect, it } from "vitest";
import {
  lessons,
  quizzes,
  playlabGames,
  classrooms,
  SUBJECT_THEMES,
  getSubjectTheme,
  misconceptions,
} from "@/data/demo";
import { isLessonSaved, isLessonDownloading } from "@/features/learning";

describe("Curriculum & Subject Tokens", () => {
  it("provides complete lesson data with valid subject themes", () => {
    expect(lessons.length).toBeGreaterThan(0);
    for (const l of lessons) {
      expect(l.id).toBeDefined();
      expect(l.title).toBeDefined();
      expect(l.subject).toBeDefined();
      const theme = getSubjectTheme(l.subject);
      expect(theme.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.tint).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.meterTone).toBeDefined();
    }
  });

  it("provides practice quizzes for curriculum modules", () => {
    const quizKeys = Object.keys(quizzes);
    expect(quizKeys.length).toBeGreaterThan(0);
    for (const k of quizKeys) {
      const q = quizzes[k]!;
      expect(q.title).toBeDefined();
      expect(q.questions.length).toBeGreaterThan(0);
      for (const quest of q.questions) {
        expect(quest.options.length).toBeGreaterThanOrEqual(2);
        expect(quest.correct).toBeGreaterThanOrEqual(0);
        expect(quest.correct).toBeLessThan(quest.options.length);
      }
    }
  });

  it("defines Concept Detective misconceptions with valid why explanations", () => {
    expect(misconceptions.length).toBeGreaterThan(0);
    for (const m of misconceptions) {
      expect(m.id).toBeDefined();
      expect(m.misconception).toBeDefined();
      expect(m.studentAnswer).toBeDefined();
      expect(m.why.length).toBeGreaterThan(10);
    }
  });

  it("contains playlab educational games", () => {
    expect(playlabGames.length).toBeGreaterThan(0);
    const codeBot = playlabGames.find((g) => g.id === "codebot-maze");
    expect(codeBot).toBeDefined();
    expect(codeBot?.playable).toBe(true);
  });

  it("covers multiple curriculum boards, grades, and language translations", () => {
    const ncertLessons = lessons.filter((l) => l.board === "NCERT");
    const karnatakaLessons = lessons.filter((l) => l.board === "Karnataka State Board");
    expect(ncertLessons.length).toBeGreaterThan(0);
    expect(karnatakaLessons.length).toBeGreaterThan(0);

    const class6 = lessons.filter((l) => l.classLevel === 6);
    const class7 = lessons.filter((l) => l.classLevel === 7);
    const class8 = lessons.filter((l) => l.classLevel === 8);
    expect(class6.length).toBeGreaterThan(0);
    expect(class7.length).toBeGreaterThan(0);
    expect(class8.length).toBeGreaterThan(0);

    // Verify multilingual transcript availability
    const multilingual = lessons.filter((l) => l.transcript && l.transcript.en && l.transcript.hi && l.transcript.kn);
    expect(multilingual.length).toBeGreaterThan(0);
  });

  it("enforces complete 7-part chapter structure and guided practice validity", () => {
    const fractionsIntro = lessons.find((l) => l.id === "fractions-intro");
    expect(fractionsIntro).toBeDefined();
    if (!fractionsIntro) return;

    // 1. Concept summary and learning objectives
    expect(fractionsIntro.summary).toBeDefined();
    expect(fractionsIntro.objectives.length).toBeGreaterThanOrEqual(2);

    // 2. Notes, definitions and worked examples
    expect(fractionsIntro.notes.length).toBeGreaterThan(0);
    expect(fractionsIntro.definitions?.length).toBeGreaterThan(0);
    expect(fractionsIntro.examples?.length).toBeGreaterThan(0);

    // 3. Guided practice
    expect(fractionsIntro.guidedPractice).toBeDefined();
    const gp = fractionsIntro.guidedPractice!;
    expect(gp.options.length).toBeGreaterThanOrEqual(2);
    expect(gp.correctIndex).toBeGreaterThanOrEqual(0);
    expect(gp.correctIndex).toBeLessThan(gp.options.length);
    expect(gp.explanation.length).toBeGreaterThan(10);

    // 4. Assessment quiz & STEM sandbox integration
    expect(fractionsIntro.quizId).toBe("fractions");
    expect(fractionsIntro.stemActivity).toBeDefined();
    expect(fractionsIntro.stemActivity?.route).toBe("/playlab");
  });

  it("strictly validates offline download state without false positives", () => {
    const testLesson = lessons.find((l) => l.id === "fractions-intro")!;

    // When nothing is saved
    const emptyDownloads: Record<string, "none" | "downloading" | "saved"> = {};
    expect(isLessonSaved(testLesson, emptyDownloads)).toBe(false);
    expect(isLessonDownloading(testLesson, emptyDownloads)).toBe(false);

    // When downloading
    const downloadingDownloads: Record<string, "none" | "downloading" | "saved"> = {
      "fractions-intro": "downloading",
    };
    expect(isLessonSaved(testLesson, downloadingDownloads)).toBe(false);
    expect(isLessonDownloading(testLesson, downloadingDownloads)).toBe(true);

    // When saved directly
    const directSaved: Record<string, "none" | "downloading" | "saved"> = {
      "fractions-intro": "saved",
    };
    expect(isLessonSaved(testLesson, directSaved)).toBe(true);

    // When saved via associated subject pack
    const packSaved: Record<string, "none" | "downloading" | "saved"> = {
      "pack-math7": "saved",
    };
    expect(isLessonSaved(testLesson, packSaved)).toBe(true);
  });
});
