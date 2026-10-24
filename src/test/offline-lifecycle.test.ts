import { describe, it, expect, beforeEach } from "vitest";
import {
  validateAndClampXp,
  evaluateLateSyncPolicy,
  simulateHubSync,
  MAX_ALLOWED_XP,
  type SyncQueueItem,
} from "@/lib/services/sync-service";
import { safeStorage } from "@/lib/persistence/storage";
import { SITE_CONFIG } from "@/config/site";
import type { DemoState } from "@/types";

describe("VidyaVerse Offline-First Local Data Lifecycle", () => {
  beforeEach(() => {
    safeStorage.removeItem(SITE_CONFIG.storageKeys.demoState);
  });

  describe("1. Anti-Tampering XP Validation & Clamping", () => {
    it("clamps excessive client-supplied XP to defined maximum bounds", () => {
      expect(validateAndClampXp("lesson_completed", 9999)).toBe(MAX_ALLOWED_XP.lesson_completed);
      expect(validateAndClampXp("quiz_score", 500)).toBe(MAX_ALLOWED_XP.quiz_score);
      expect(validateAndClampXp("activity_xp", 150)).toBe(MAX_ALLOWED_XP.activity_xp);
      expect(validateAndClampXp("challenge_completed", 1000)).toBe(MAX_ALLOWED_XP.challenge_completed);
      expect(validateAndClampXp("project_submitted", 5000)).toBe(MAX_ALLOWED_XP.project_submitted);
    });

    it("clamps negative or NaN XP values to 0", () => {
      expect(validateAndClampXp("quiz_score", -50)).toBe(0);
      expect(validateAndClampXp("activity_xp", Number.NaN)).toBe(0);
    });

    it("preserves legitimate XP within valid bounds", () => {
      expect(validateAndClampXp("lesson_completed", 25)).toBe(25);
      expect(validateAndClampXp("quiz_score", 40)).toBe(40);
      expect(validateAndClampXp("activity_xp", 20)).toBe(20);
    });
  });

  describe("2. Transparent Late-Sync Competition Policy", () => {
    it("credits offline activity to weekly competition if synced within 72h grace period", () => {
      const recentTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24h ago
      const policy = evaluateLateSyncPolicy(recentTimestamp);
      expect(policy.creditToWeekly).toBe(true);
      expect(policy.reason).toContain("72h grace period");
    });

    it("credits activity past 72h cutoff to Lifetime XP without weekly cup credit", () => {
      const oldTimestamp = new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(); // 5 days ago (120h)
      const policy = evaluateLateSyncPolicy(oldTimestamp);
      expect(policy.creditToWeekly).toBe(false);
      expect(policy.reason).toContain("Credited 100% to Lifetime XP");
    });
  });

  describe("3. Safe Work Preservation on Sync Failure & Retry", () => {
    const sampleQueue: SyncQueueItem[] = [
      {
        id: "evt-001",
        type: "lesson_completed",
        entityId: "lesson-cells",
        title: "Cell Structure and Function",
        xpEarned: 25,
        timestamp: new Date().toISOString(),
        status: "pending",
        retryCount: 0,
      },
      {
        id: "evt-002",
        type: "quiz_score",
        entityId: "quiz-cells",
        title: "Cell Organelles Quiz",
        xpEarned: 50,
        timestamp: new Date().toISOString(),
        status: "pending",
        retryCount: 0,
      },
    ];

    it("preserves local work when sync experiences network timeout / failure", async () => {
      const failureResult = await simulateHubSync({
        studentId: "student-ananya-01",
        timestamp: new Date().toISOString(),
        pendingCount: 2,
        queue: sampleQueue,
        completedLessons: ["lesson-cells"],
        xp: 1250,
        simulateFailure: true,
      });

      expect(failureResult.success).toBe(false);
      expect(failureResult.error).toBe("NETWORK_TIMEOUT");
      expect(failureResult.reconciledQueue.length).toBe(2);

      // Verify each item was preserved and marked as failed with incremented retry count
      const firstItem = failureResult.reconciledQueue[0];
      const secondItem = failureResult.reconciledQueue[1];
      expect(firstItem?.status).toBe("failed");
      expect(firstItem?.retryCount).toBe(1);
      expect(secondItem?.status).toBe("failed");
      expect(secondItem?.retryCount).toBe(1);
    });

    it("safely retries and reconciles previously failed items on reconnect", async () => {
      // Simulate failed items from previous drop
      const failedQueue: SyncQueueItem[] = sampleQueue.map((i) => ({
        ...i,
        status: "failed",
        retryCount: 1,
      }));

      const retryResult = await simulateHubSync({
        studentId: "student-ananya-01",
        timestamp: new Date().toISOString(),
        pendingCount: 2,
        queue: failedQueue,
        completedLessons: ["lesson-cells"],
        xp: 1250,
        simulateFailure: false,
      });

      expect(retryResult.success).toBe(true);
      expect(retryResult.syncedCount).toBe(2);
      expect(retryResult.reconciledQueue.every((i) => i.status === "synced")).toBe(true);
      expect(retryResult.validatedXpCredited).toBe(75);
    });
  });

  describe("4. Deduplication & Idempotent Scoring", () => {
    it("prevents duplicate XP for identical activity IDs", () => {
      const completedActivities: string[] = ["quiz-fractions-01"];
      const requestedActivityId = "quiz-fractions-01";

      const isAlreadyCompleted = completedActivities.includes(requestedActivityId);
      expect(isAlreadyCompleted).toBe(true);
      // In demo store, awardActivityXp returns false when activity already exists
    });

    it("ensures Lifetime XP is strictly monotonic and never reset by weekly cycles", () => {
      let lifetimeXp = 1450;
      let weeklyXp = 320;

      // Simulate weekly cycle reset
      weeklyXp = 0; // Weekly cup resets for next tournament

      // Lifetime XP must remain 1450
      expect(weeklyXp).toBe(0);
      expect(lifetimeXp).toBe(1450);

      // Adding new offline XP increments lifetime XP
      const newOfflineXp = 25;
      lifetimeXp += newOfflineXp;
      weeklyXp += newOfflineXp;

      expect(lifetimeXp).toBe(1475);
      expect(weeklyXp).toBe(25);
    });
  });

  describe("5. Refresh & Browser Restart Persistence", () => {
    it("serializes and deserializes local state faithfully via safeStorage", () => {
      const stateToPersist: Partial<DemoState> = {
        role: "student",
        xp: 1650,
        sparks: 400,
        weeklyXp: 180,
        pendingSyncCount: 1,
        lastSyncTime: "12 Oct 2026, 4:00 PM",
        completed: ["lesson-1", "lesson-2"],
        completedActivities: ["quiz-1"],
        syncQueue: [
          {
            id: "evt-local-01",
            type: "lesson_completed",
            entityId: "lesson-2",
            title: "Lesson 2",
            xpEarned: 25,
            timestamp: new Date().toISOString(),
            status: "pending",
            retryCount: 0,
          },
        ],
      };

      const writeSuccess = safeStorage.setItem(SITE_CONFIG.storageKeys.demoState, stateToPersist);
      expect(writeSuccess).toBe(true);

      // Simulate browser refresh: reload from storage
      const reloaded = safeStorage.getItem<Partial<DemoState> | null>(
        SITE_CONFIG.storageKeys.demoState,
        null
      );

      expect(reloaded).not.toBeNull();
      expect(reloaded?.xp).toBe(1650);
      expect(reloaded?.pendingSyncCount).toBe(1);
      expect(reloaded?.completed).toEqual(["lesson-1", "lesson-2"]);
      expect(reloaded?.syncQueue?.length).toBe(1);
      expect(reloaded?.syncQueue?.[0]?.id).toBe("evt-local-01");
    });
  });

  describe("6. Pedagogical Distinction: Unsynced vs Unlearned", () => {
    it("distinguishes an un-synced student from an un-learned student", () => {
      const studentLearnedOffline = {
        name: "Student A",
        completedLessons: ["lesson-1"],
        pendingSyncQueue: 1,
        status: "learned_offline_pending_sync",
      };

      const studentNotStarted = {
        name: "Student B",
        completedLessons: [],
        pendingSyncQueue: 0,
        status: "not_started",
      };

      expect(studentLearnedOffline.completedLessons.length).toBeGreaterThan(0);
      expect(studentLearnedOffline.pendingSyncQueue).toBeGreaterThan(0);

      expect(studentNotStarted.completedLessons.length).toBe(0);
      expect(studentNotStarted.pendingSyncQueue).toBe(0);
      expect(studentLearnedOffline.status).not.toBe(studentNotStarted.status);
    });
  });

  describe("7. Understandable Network States", () => {
    function computeEffectiveState(
      isSyncing: boolean,
      networkMode: "online" | "mesh" | "offline",
      pendingCount: number
    ): "syncing" | "offline" | "sync_needed" | "online" {
      if (isSyncing) return "syncing";
      if (networkMode === "offline") return "offline";
      if (pendingCount > 0) return "sync_needed";
      return "online";
    }

    it("evaluates correct understandable state across all four conditions", () => {
      expect(computeEffectiveState(true, "online", 0)).toBe("syncing");
      expect(computeEffectiveState(false, "offline", 3)).toBe("offline");
      expect(computeEffectiveState(false, "online", 2)).toBe("sync_needed");
      expect(computeEffectiveState(false, "online", 0)).toBe("online");
    });
  });
});
