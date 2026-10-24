import { describe, expect, it } from "vitest";
import {
  categoryLabels,
  learnNav,
  exploreNav,
  aiOfflineNav,
  communityNav,
  progressNav,
  portalsNav,
  settingsNav,
  getRoleNavSections,
  getRoleBottomNav,
  getRoleDefaultRoute,
  roleLabels,
  type NavCategory,
} from "@/components/vv/nav";

describe("Navigation Structure", () => {
  it("defines all 7 organized navigation categories", () => {
    expect(learnNav.length).toBeGreaterThan(0);
    expect(exploreNav.length).toBeGreaterThan(0);
    expect(aiOfflineNav.length).toBeGreaterThan(0);
    expect(communityNav.length).toBeGreaterThan(0);
    expect(progressNav.length).toBeGreaterThan(0);
    expect(portalsNav.length).toBeGreaterThan(0);
    expect(settingsNav.length).toBeGreaterThan(0);
  });

  it("contains key educational routes across categories", () => {
    const learnHrefs = learnNav.map((n) => n.to);
    expect(learnHrefs).toContain("/dashboard");
    expect(learnHrefs).toContain("/learn");

    const exploreHrefs = exploreNav.map((n) => n.to);
    expect(exploreHrefs).toContain("/playlab");
    expect(exploreHrefs).toContain("/circuitverse");
    expect(exploreHrefs).toContain("/codeverse");
    expect(exploreHrefs).toContain("/projects");

    const aiOfflineHrefs = aiOfflineNav.map((n) => n.to);
    expect(aiOfflineHrefs).toContain("/tutor");
    expect(aiOfflineHrefs).toContain("/voice");
    expect(aiOfflineHrefs).toContain("/mesh");

    const communityHrefs = communityNav.map((n) => n.to);
    expect(communityHrefs).toContain("/classrooms");
    expect(communityHrefs).toContain("/leaderboard");
    expect(communityHrefs).toContain("/challenges");
    expect(communityHrefs).toContain("/rewards");

    const progressHrefs = progressNav.map((n) => n.to);
    expect(progressHrefs).toContain("/progress");
    expect(progressHrefs).toContain("/downloads");
  });

  it("provides multilingual labels for all 7 navigation categories", () => {
    const categories: NavCategory[] = ["learn", "explore", "ai-offline", "community", "progress", "portals", "settings"];
    for (const cat of categories) {
      expect(categoryLabels[cat].en).toBeDefined();
      expect(categoryLabels[cat].hi).toBeDefined();
      expect(categoryLabels[cat].kn).toBeDefined();
    }
  });
});

describe("Role-Specific Navigation Isolation", () => {
  it("isolates Student navigation from Teacher and Parent portals", () => {
    const studentSections = getRoleNavSections("student");
    const allStudentRoutes = studentSections.flatMap((s) => s.items.map((i) => i.to));

    // Student has core learning & labs
    expect(allStudentRoutes).toContain("/dashboard");
    expect(allStudentRoutes).toContain("/learn");
    expect(allStudentRoutes).toContain("/playlab");
    expect(allStudentRoutes).toContain("/rewards");

    // Strict boundary: Never leak teacher or parent portal into student
    expect(allStudentRoutes).not.toContain("/teacher");
    expect(allStudentRoutes).not.toContain("/parent");
  });

  it("isolates Teacher navigation from Parent portal and student bazaar", () => {
    const teacherSections = getRoleNavSections("teacher");
    const allTeacherRoutes = teacherSections.flatMap((s) => s.items.map((i) => i.to));

    // Teacher has management and curriculum
    expect(allTeacherRoutes).toContain("/teacher");
    expect(allTeacherRoutes).toContain("/classrooms");
    expect(allTeacherRoutes).toContain("/learn");

    // Strict boundary: Never leak parent portal into teacher
    expect(allTeacherRoutes).not.toContain("/parent");
    // Does not clutter teacher command with student cosmetics bazaar
    expect(allTeacherRoutes).not.toContain("/rewards");
  });

  it("isolates Parent / Guardian navigation to essential oversight routes", () => {
    const parentSections = getRoleNavSections("parent");
    const allParentRoutes = parentSections.flatMap((s) => s.items.map((i) => i.to));

    // Parent has oversight routes
    expect(allParentRoutes).toContain("/parent");
    expect(allParentRoutes).toContain("/learn");
    expect(allParentRoutes).toContain("/progress");
    expect(allParentRoutes).toContain("/voice");

    // Strict boundary: Never leak teacher administration into parent view
    expect(allParentRoutes).not.toContain("/teacher");
    expect(allParentRoutes).not.toContain("/rewards");
  });

  it("provides role labels for Student, Teacher, and Parent in 3 languages", () => {
    expect(roleLabels.student.en).toBe("Student Portal");
    expect(roleLabels.teacher.en).toBe("Teacher Portal");
    expect(roleLabels.parent.en).toBe("Guardian Portal");

    expect(roleLabels.student.hi).toBeDefined();
    expect(roleLabels.teacher.hi).toBeDefined();
    expect(roleLabels.parent.hi).toBeDefined();
  });
});

describe("Mobile Bottom Navigation", () => {
  it("provides role-tailored 4 primary destinations for mobile navigation", () => {
    const studentBottom = getRoleBottomNav("student").map((i) => i.to);
    expect(studentBottom).toEqual(["/dashboard", "/learn", "/playlab", "/progress"]);

    const teacherBottom = getRoleBottomNav("teacher").map((i) => i.to);
    expect(teacherBottom).toEqual(["/teacher", "/classrooms", "/learn", "/mesh"]);

    const parentBottom = getRoleBottomNav("parent").map((i) => i.to);
    expect(parentBottom).toEqual(["/parent", "/progress", "/learn", "/voice"]);
  });

  it("maps roles to correct primary hub route", () => {
    expect(getRoleDefaultRoute("student")).toBe("/dashboard");
    expect(getRoleDefaultRoute("teacher")).toBe("/teacher");
    expect(getRoleDefaultRoute("parent")).toBe("/parent");
  });
});
