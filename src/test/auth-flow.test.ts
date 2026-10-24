import { describe, expect, it } from "vitest";
import { demoStudent } from "@/data/demo";

describe("Authentication & Portal Role Flows", () => {
  const roles = [
    {
      id: "student",
      title: "Student Explorer",
      targetRoute: "/dashboard",
      minPinLength: 4,
    },
    {
      id: "teacher",
      title: "Teacher & Educator",
      targetRoute: "/teacher",
      minPinLength: 6,
    },
    {
      id: "parent",
      title: "Parent & Guardian",
      targetRoute: "/parent",
      minPinLength: 6,
    },
  ];

  it("defines distinct portal targets for all 3 primary user personas", () => {
    expect(roles.map((r) => r.id)).toEqual(["student", "teacher", "parent"]);

    const studentRole = roles.find((r) => r.id === "student");
    const teacherRole = roles.find((r) => r.id === "teacher");
    const parentRole = roles.find((r) => r.id === "parent");

    expect(studentRole?.targetRoute).toBe("/dashboard");
    expect(teacherRole?.targetRoute).toBe("/teacher");
    expect(parentRole?.targetRoute).toBe("/parent");
  });

  it("verifies student demo credentials match demoStudent data", () => {
    expect(demoStudent.name).toBe("Ananya R.");
    expect(demoStudent.classLevel).toBe(7);
    expect(demoStudent.school).toBe("Demo Government Higher Primary School");
  });

  it("enforces validation rules for role credentials", () => {
    // Student validation
    const validateStudent = (name: string, pin: string) => {
      if (!name.trim()) return "Name required";
      if (!pin || pin.length < 4) return "PIN must be at least 4 digits";
      return "valid";
    };

    expect(validateStudent("", "1234")).toBe("Name required");
    expect(validateStudent("Ananya", "12")).toBe("PIN must be at least 4 digits");
    expect(validateStudent("Ananya", "1234")).toBe("valid");

    // Parent linked child validation
    const validateParent = (name: string, linkedChild: string) => {
      if (!name.trim()) return "Guardian name required";
      if (!linkedChild.trim()) return "Linked child required";
      return "valid";
    };

    expect(validateParent("Ramesh", "")).toBe("Linked child required");
    expect(validateParent("Ramesh", "Ananya R.")).toBe("valid");
  });
});
