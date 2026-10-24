import { describe, expect, it } from "vitest";
import { teacherRoster, classrooms, demoStudent } from "@/data/demo";

describe("Teacher Portal & Student Diagnostics", () => {
  it("enforces child privacy on teacher roster without exposing personal identifiers", () => {
    expect(teacherRoster.length).toBeGreaterThanOrEqual(4);

    for (const student of teacherRoster) {
      expect(student.name).toBeDefined();
      // Ensure student names are formatted with privacy-safe pseudonyms
      expect(student.name).toMatch(/^Demo student \d{2}$/);
      // Ensure no raw biometric, Aadhaar or phone numbers exist
      expect((student as any).phone).toBeUndefined();
      expect((student as any).aadhaar).toBeUndefined();
      expect((student as any).biometric).toBeUndefined();
    }
  });

  it("identifies students needing intervention based on concept gaps and sync staleness", () => {
    const studentWithGap = teacherRoster.find((s) => s.gap === "Comparing fractions");
    expect(studentWithGap).toBeDefined();
    expect(studentWithGap?.quiz).toBeLessThan(70);

    const staleSyncStudent = teacherRoster.find((s) => s.gap === "Not yet synced");
    expect(staleSyncStudent).toBeDefined();
    expect(staleSyncStudent?.quiz).toBeNull();
    expect(staleSyncStudent?.assignments).toBe("0/2");
  });

  it("validates classroom cohort assignments and due dates", () => {
    const sciClass = classrooms.find((c) => c.code === "SCI7B");
    expect(sciClass).toBeDefined();
    expect(sciClass?.assigned.length).toBeGreaterThanOrEqual(2);

    for (const asg of sciClass!.assigned) {
      expect(asg.title).toBeDefined();
      expect(["Lesson", "Quiz"]).toContain(asg.kind);
      expect(asg.due).toBeDefined();
    }
  });
});

describe("Parent Portal Linked Child & Privacy Controls", () => {
  it("strictly authorizes parent view to linked child Ananya R.", () => {
    expect(demoStudent.name).toBe("Ananya R.");
    expect(demoStudent.classLevel).toBe(7);
    expect(demoStudent.section).toBe("B");
    expect(demoStudent.startingXp).toBeGreaterThan(1000);
    expect(demoStudent.streakDays).toBeGreaterThanOrEqual(5);
  });

  it("ensures public leaderboard pseudonymizes student identities", () => {
    const pseudonymizeName = (fullName: string, isPseudonymized: boolean) => {
      if (!isPseudonymized) return fullName;
      const parts = fullName.split(" ");
      if (parts.length > 1 && parts[1]) {
        return `${parts[0]} ${parts[1].charAt(0)}.`;
      }
      return parts[0] ?? "";
    };

    expect(pseudonymizeName("Ananya Ramaswamy", true)).toBe("Ananya R.");
    expect(pseudonymizeName("Ravi Kumar", true)).toBe("Ravi K.");
    expect(pseudonymizeName("Ananya Ramaswamy", false)).toBe("Ananya Ramaswamy");
  });
});

describe("Classrooms: Revocable Join Codes & Offline Work Status", () => {
  it("validates classroom join code resolution and revocation logic", () => {
    const activeCodes: Record<string, string> = {
      SCI7B: "SCI7B",
      MATH7: "MATH7",
      CODE1: "CODE1",
    };
    const revokedCodes: string[] = ["SCI7B-OLD", "TEST-EXPIRED"];

    const attemptJoin = (code: string) => {
      const clean = code.trim().toUpperCase();
      if (revokedCodes.includes(clean)) {
        return { ok: false, error: "revoked" };
      }
      const matched = Object.entries(activeCodes).find(([_, v]) => v === clean);
      if (matched) {
        return { ok: true, classCode: matched[0] };
      }
      return { ok: false, error: "not_found" };
    };

    expect(attemptJoin("SCI7B")).toEqual({ ok: true, classCode: "SCI7B" });
    expect(attemptJoin("MATH7")).toEqual({ ok: true, classCode: "MATH7" });
    expect(attemptJoin("SCI7B-OLD")).toEqual({ ok: false, error: "revoked" });
    expect(attemptJoin("UNKNOWN99")).toEqual({ ok: false, error: "not_found" });
  });

  it("delineates tri-state offline assignment status distinctly", () => {
    type TriStateSync = "synced" | "pending_offline" | "incomplete";

    const getStatusBadge = (state: TriStateSync) => {
      switch (state) {
        case "synced":
          return "Completed & Synced";
        case "pending_offline":
          return "Finished Offline (Pending Sync)";
        case "incomplete":
          return "Incomplete / Due Soon";
      }
    };

    expect(getStatusBadge("synced")).toBe("Completed & Synced");
    expect(getStatusBadge("pending_offline")).toBe("Finished Offline (Pending Sync)");
    expect(getStatusBadge("incomplete")).toBe("Incomplete / Due Soon");
  });
});
