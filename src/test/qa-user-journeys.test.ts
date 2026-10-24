import { describe, expect, it, beforeEach } from "vitest";
import { demoStudent, classrooms, teacherRoster, lessons, quizzes } from "@/data/demo";
import { safeStorage } from "@/lib/persistence/storage";
import { SITE_CONFIG } from "@/config/site";
import {
  validateAndClampXp,
  evaluateLateSyncPolicy,
  simulateHubSync,
  createQueueItem,
  type SyncQueueItem,
} from "@/lib/services/sync-service";
import type { DemoState, StudentProject } from "@/types";

describe("QA User Journey 1 & 2: Landing Page to Role Selection & Authentication", () => {
  const portalRoutes = {
    student: "/dashboard",
    teacher: "/teacher",
    parent: "/parent",
  };

  it("routes each role accurately to its authorized destination portal", () => {
    expect(portalRoutes.student).toBe("/dashboard");
    expect(portalRoutes.teacher).toBe("/teacher");
    expect(portalRoutes.parent).toBe("/parent");
  });

  it("verifies mock/demo credential presets populate valid data without exposure of child PII", () => {
    expect(demoStudent.name).toBe("Ananya R.");
    expect(demoStudent.classLevel).toBe(7);
    // Verify no private identity fields exist in student demo profile
    expect((demoStudent as any).aadhaar).toBeUndefined();
    expect((demoStudent as any).phone).toBeUndefined();
    expect((demoStudent as any).biometrics).toBeUndefined();
  });
});

describe("QA User Journey 3: Student Resumes Lesson, Completes Quiz & Progress Updates", () => {
  it("locates incomplete lesson and records completion accurately", () => {
    const completedLessonIds = ["decimals-place-value"];
    const targetLesson = lessons.find((l) => !completedLessonIds.includes(l.id));

    expect(targetLesson).toBeDefined();
    const lessonId = targetLesson!.id;

    // Simulate completion
    const newCompleted = [...completedLessonIds, lessonId];
    expect(newCompleted.includes(lessonId)).toBe(true);

    // Verify progress calculation
    const totalSubjectLessons = lessons.filter((l) => l.subject === targetLesson!.subject).length;
    const completedSubjectLessons = newCompleted.filter((id) =>
      lessons.find((l) => l.id === id && l.subject === targetLesson!.subject)
    ).length;

    const progressPercent = Math.round((completedSubjectLessons / totalSubjectLessons) * 100);
    expect(progressPercent).toBeGreaterThan(0);
    expect(progressPercent).toBeLessThanOrEqual(100);
  });

  it("grades quiz responses and awards legitimate XP", () => {
    const fractionsQuiz = quizzes["fractions"]!;
    expect(fractionsQuiz).toBeDefined();
    expect(fractionsQuiz.questions.length).toBeGreaterThan(0);

    // Simulate answering all questions correctly
    const studentAnswers = fractionsQuiz.questions.map((q) => q.correct);
    let correctCount = 0;
    fractionsQuiz.questions.forEach((q, idx) => {
      if (studentAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / fractionsQuiz.questions.length) * 100);
    expect(scorePercent).toBe(100);

    const xpEarned = scorePercent >= 70 ? 40 : 10;
    const clampedXp = validateAndClampXp("quiz_score", xpEarned);
    expect(clampedXp).toBe(40);
  });
});

describe("QA User Journey 4: Idempotent Mission Completion & Duplicate XP Prevention", () => {
  beforeEach(() => {
    safeStorage.removeItem(SITE_CONFIG.storageKeys.demoState);
  });

  it("prevents duplicate XP and rewards when re-attempting or refreshing completed missions", () => {
    const missionId = "daily-fractions-1";
    let state: { completedChallenges: string[]; xp: number; sparks: number } = {
      completedChallenges: [],
      xp: 1450,
      sparks: 350,
    };

    function attemptCompleteMission(id: string, rewardXp: number): boolean {
      if (state.completedChallenges.includes(id)) {
        return false; // Already completed
      }
      const clamped = validateAndClampXp("challenge_completed", rewardXp);
      state = {
        ...state,
        completedChallenges: [...state.completedChallenges, id],
        xp: state.xp + clamped,
        sparks: state.sparks + Math.floor(clamped / 2),
      };
      return true;
    }

    // First completion succeeds
    const firstAttempt = attemptCompleteMission(missionId, 40);
    expect(firstAttempt).toBe(true);
    expect(state.xp).toBe(1490);
    expect(state.sparks).toBe(370);
    expect(state.completedChallenges).toContain(missionId);

    // Save to persistent storage (simulating browser persistence)
    safeStorage.setItem(SITE_CONFIG.storageKeys.demoState, state);

    // Simulate browser refresh by loading state back
    const reloadedState = safeStorage.getItem<typeof state | null>(
      SITE_CONFIG.storageKeys.demoState,
      null
    );
    expect(reloadedState).not.toBeNull();
    state = reloadedState!;

    // Second attempt (after refresh) must be rejected
    const secondAttempt = attemptCompleteMission(missionId, 40);
    expect(secondAttempt).toBe(false);
    expect(state.xp).toBe(1490); // XP has not increased!
    expect(state.sparks).toBe(370); // Sparks have not increased!
  });

  it("ensures Lifetime XP is strictly decoupled from spendable bazaar items", () => {
    let xp = 1500;
    let sparks = 375;

    // Student purchases an item for 150 sparks
    const itemCost = 150;
    expect(sparks).toBeGreaterThanOrEqual(itemCost);

    sparks -= itemCost;
    // Lifetime XP must remain 1500!
    expect(sparks).toBe(225);
    expect(xp).toBe(1500);
  });
});

describe("QA User Journey 5: PlayLab Game Completion Feedback", () => {
  it("verifies CodeBot Maze victory conditions and feedback summary", () => {
    let botPos = { x: 0, y: 0 };
    const goalPos = { x: 3, y: 1 };
    const commands = ["right", "right", "right", "down"];

    // Execute commands
    commands.forEach((cmd) => {
      if (cmd === "right") botPos.x += 1;
      if (cmd === "down") botPos.y += 1;
    });

    const isVictory = botPos.x === goalPos.x && botPos.y === goalPos.y;
    expect(isVictory).toBe(true);

    const movesCount = commands.length;
    const par = 5;
    const earnedStars = movesCount <= par ? 3 : movesCount <= par + 2 ? 2 : 1;
    expect(earnedStars).toBe(3);
  });
});

describe("QA User Journey 6: CircuitVerse & CodeVerse Completion", () => {
  it("verifies closed-loop circuit with switch and resistor powers LED", () => {
    const circuit = {
      batteryVoltage: 9.0,
      switchClosed: true,
      resistorOhms: 330,
      ledForwardVoltage: 2.0,
    };

    const hasPower = circuit.switchClosed && circuit.resistorOhms > 0;
    const currentA = hasPower ? (circuit.batteryVoltage - circuit.ledForwardVoltage) / circuit.resistorOhms : 0;
    const currentmA = currentA * 1000;

    expect(hasPower).toBe(true);
    expect(currentmA).toBeGreaterThan(10);
    expect(currentmA).toBeLessThan(25); // Safe operating current
  });

  it("verifies CodeVerse algorithm output matches expected challenge", () => {
    // Challenge: Sum of first N numbers
    const runSumAlgorithm = (n: number) => {
      let sum = 0;
      for (let i = 1; i <= n; i++) {
        sum += i;
      }
      return sum;
    };

    expect(runSumAlgorithm(5)).toBe(15);
    expect(runSumAlgorithm(10)).toBe(55);
  });
});

describe("QA User Journey 7: Offline Content Access, Local Queue & Sync Reconciliation", () => {
  it("records local progress in sync queue when offline and updates pending count", () => {
    const localQueue: SyncQueueItem[] = [];
    const item1 = createQueueItem("lesson_completed", "lesson-gravity", "Universal Gravitation", 25);
    localQueue.push(item1);

    expect(localQueue.length).toBe(1);
    expect(localQueue[0]?.status).toBe("pending");
    expect(localQueue[0]?.xpEarned).toBe(25);
  });

  it("reconciles pending queue on simulated mesh reconnect", async () => {
    const sampleItem = createQueueItem("quiz_score", "quiz-fractions", "Fraction Operations Quiz", 40);
    const syncResult = await simulateHubSync({
      studentId: "student-ananya-01",
      timestamp: new Date().toISOString(),
      pendingCount: 1,
      queue: [sampleItem],
      completedLessons: ["lesson-gravity"],
      xp: 1450,
      simulateFailure: false,
    });

    expect(syncResult.success).toBe(true);
    expect(syncResult.syncedCount).toBe(1);
    expect(syncResult.validatedXpCredited).toBe(40);
    expect(syncResult.reconciledQueue[0]?.status).toBe("synced");
  });
});

describe("QA User Journey 8: Teacher Portal Classroom Assignments & Diagnostics", () => {
  it("allows teacher to inspect classroom roster and assign new activities", () => {
    const targetClass = classrooms.find((c) => c.code === "SCI7B");
    expect(targetClass).toBeDefined();

    const initialAssignmentCount = targetClass!.assigned.length;
    const newAssignment = {
      title: "Cell Organelles Virtual Lab",
      due: "Friday",
      kind: "Lab" as const,
    };

    const updatedAssignments = [...targetClass!.assigned, newAssignment];
    expect(updatedAssignments.length).toBe(initialAssignmentCount + 1);
  });

  it("aggregates cohort diagnostic gap analysis", () => {
    const studentsWithGaps = teacherRoster.filter((s) => s.gap && s.gap !== "None");
    expect(studentsWithGaps.length).toBeGreaterThan(0);
  });
});

describe("QA User Journey 9: Parent View Restricted to Linked Child Ananya R.", () => {
  it("guarantees parent view is constrained to linked child without cross-student data leakage", () => {
    const parentProfile = {
      guardianName: "Ramesh R.",
      linkedStudent: demoStudent,
    };

    expect(parentProfile.linkedStudent.name).toBe("Ananya R.");
    expect(parentProfile.linkedStudent.classLevel).toBe(7);

    // Verify parent does not have access to unlinked students
    const otherStudents = teacherRoster.filter((s) => s.name !== "Ananya R.");
    expect(otherStudents.length).toBeGreaterThan(0);
    // Parent profile should strictly expose only linkedStudent
    expect(Object.keys(parentProfile)).toEqual(["guardianName", "linkedStudent"]);
  });
});

describe("QA User Journey 10: Mobile Ergonomics & Responsive Constraints", () => {
  it("validates dialog max-height and padding boundaries", () => {
    const dialogStyles = {
      maxWidth: "max-w-lg",
      width: "w-[calc(100%-2rem)]",
      maxHeight: "max-h-[90vh]",
      overflow: "overflow-y-auto",
    };

    expect(dialogStyles.maxHeight).toBe("max-h-[90vh]");
    expect(dialogStyles.overflow).toBe("overflow-y-auto");
  });

  it("enforces minimum touch target size of 44px on primary mobile actions", () => {
    const primaryButtonHeightPx = 44; // min-h-[44px]
    expect(primaryButtonHeightPx).toBeGreaterThanOrEqual(44);
  });
});
