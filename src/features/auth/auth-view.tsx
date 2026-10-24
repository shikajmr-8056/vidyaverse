import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  User,
  GraduationCap,
  HeartHandshake,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Sparkles,
  School,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { useDemo, type UserRole } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

interface FormState {
  name: string;
  identifier: string; // Roll number, Email, or Phone
  pin: string;
  school: string;
  linkedChild: string;
  isRegistering: boolean;
}

export function AuthView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { role?: string; mode?: string };
  const demo = useDemo();

  const initialRole: UserRole | null =
    search.role === "student" || search.role === "teacher" || search.role === "parent"
      ? (search.role as UserRole)
      : null;

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    identifier: "",
    pin: "",
    school: "Kalyan Government Higher Primary School",
    linkedChild: "",
    isRegistering: search.mode === "register",
  });

  const roles = [
    {
      id: "student" as UserRole,
      title: "Student Explorer",
      badge: "Classes 4 to 10",
      icon: User,
      color: "#6541F5",
      bg: "#EAE7FF",
      border: "border-[#6541F5]/30",
      description:
        "Access gamified science, math and coding missions. Collect Sparks in the Bazaar and build offline experiments.",
      demoLabel: `Continue as Demo Student (${demoStudent.name})`,
      targetRoute: "/dashboard",
    },
    {
      id: "teacher" as UserRole,
      title: "Teacher & Educator",
      badge: "School Instructors",
      icon: GraduationCap,
      color: "#19B99A",
      bg: "#DDF8EE",
      border: "border-[#19B99A]/30",
      description:
        "Monitor cohort competency heatmaps, detect student misconceptions early, broadcast offline assignments, and export class reports.",
      demoLabel: "Continue as Demo Teacher (Mrs. K. Lakshmi)",
      targetRoute: "/teacher",
    },
    {
      id: "parent" as UserRole,
      title: "Parent & Guardian",
      badge: "Family Overview",
      icon: HeartHandshake,
      color: "#F5A623",
      bg: "#FFF0D5",
      border: "border-[#F5A623]/30",
      description:
        "View your child's weekly attendance, completed chapters, offline learning hours, and teacher notifications in your language.",
      demoLabel: "Continue as Demo Parent (Guardian View)",
      targetRoute: "/parent",
    },
  ];

  // Auto-fill demo credentials
  const handleLoadDemoCredentials = (role: UserRole) => {
    setErrorMessage(null);
    if (role === "student") {
      setForm((f) => ({
        ...f,
        name: demoStudent.name,
        identifier: "7B-14",
        pin: "2026",
        school: demoStudent.school,
      }));
    } else if (role === "teacher") {
      setForm((f) => ({
        ...f,
        name: "Mrs. K. Lakshmi",
        identifier: "lakshmi.k@kalyanschool.edu.in",
        pin: "Teach@2026",
        school: "Kalyan Government Higher Primary School",
      }));
    } else {
      setForm((f) => ({
        ...f,
        name: "Ramesh R. (Parent)",
        identifier: "+91 98451 23456",
        pin: "Parent26",
        linkedChild: demoStudent.name,
        school: demoStudent.school,
      }));
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    handleLoadDemoCredentials(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validation Rules
    if (!form.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!form.identifier.trim()) {
      const field =
        selectedRole === "student"
          ? "roll number or student ID"
          : selectedRole === "teacher"
            ? "teacher email or employee code"
            : "mobile number";
      setErrorMessage(`Please provide your ${field}.`);
      return;
    }
    if (!form.pin.trim()) {
      setErrorMessage(
        selectedRole === "student"
          ? "Please enter your 4-digit class PIN."
          : "Please enter your password.",
      );
      return;
    }
    if (selectedRole === "student" && form.pin.length < 4) {
      setErrorMessage("Student PIN must be at least 4 digits.");
      return;
    }
    if (selectedRole === "parent" && !form.linkedChild.trim()) {
      setErrorMessage("Please enter the student's name or roll number to link.");
      return;
    }

    setIsLoading(true);

    // Simulated authorization & role verification (500ms)
    setTimeout(() => {
      setIsLoading(false);
      demo.set("role", selectedRole!);

      const roleObj = roles.find((r) => r.id === selectedRole);
      setSuccessMessage(`Authorized as ${selectedRole}: Welcome, ${form.name}! Entering portal...`);

      setTimeout(() => {
        if (selectedRole === "teacher") {
          navigate({ to: "/teacher" });
        } else if (selectedRole === "parent") {
          navigate({ to: "/parent" });
        } else {
          navigate({ to: "/dashboard" });
        }
      }, 700);
    }, 550);
  };

  const currentRoleConfig = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="VidyaVerse home" className="hover:opacity-90">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-2xl">
          {/* Step 1: Role Selection Portal Picker */}
          {!selectedRole && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5] dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
                  <Sparkles className="h-3.5 w-3.5" /> Portal Sign-In & Onboarding
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Choose Your Learning Portal
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  VidyaVerse provides tailored experiences for students, educators, and families.
                  Select your portal below to proceed with sign-in.
                </p>
              </div>

              {/* Demo Notice Banner */}
              <div className="rounded-xl border border-dashed border-[#D8D5FF] dark:border-[#7C5CFA]/30 bg-[#F5F5FF] dark:bg-[#1A1A28] p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-[#6541F5] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-foreground">Offline Simulation Notice: </strong>
                  This prototype runs client-side without a live authentication server. Selecting an
                  account configures your session with verified demo credentials before launching
                  the portal.
                </div>
              </div>

              {/* 3 Distinct Role Cards */}
              <div className="grid gap-3.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={r.id}
                      className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:border-[#6541F5] hover:shadow-md transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                          style={{ backgroundColor: r.bg, color: r.color }}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground">{r.title}</h2>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {r.badge}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                            {r.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center sm:self-center shrink-0">
                        <Button
                          onClick={() => handleRoleSelection(r.id)}
                          className="w-full sm:w-auto bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold gap-1.5 h-9 px-4 shadow-sm"
                        >
                          Select Portal <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Need help accessing your school hub? Contact your teacher or school administrator.
              </div>
            </div>
          )}

          {/* Step 2: Dedicated Role Authentication Form */}
          {selectedRole && currentRoleConfig && (
            <div className="card-surface rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-md space-y-6">
              {/* Back to Role Selection button */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <button
                  onClick={handleBackToRoleSelection}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change Portal
                </button>

                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor: currentRoleConfig.bg,
                    color: currentRoleConfig.color,
                  }}
                >
                  <currentRoleConfig.icon className="h-3.5 w-3.5" />
                  {currentRoleConfig.title}
                </span>
              </div>

              {/* Form Title & Subtitle */}
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  {form.isRegistering
                    ? `Register as ${currentRoleConfig.title}`
                    : `Sign In to ${currentRoleConfig.title}`}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedRole === "student"
                    ? "Enter your class roll number and 4-digit PIN to access your learning journey."
                    : selectedRole === "teacher"
                      ? "Access your classroom roster, student diagnostic heatmaps, and offline sync logs."
                      : "Track your linked child's academic progress, chapter mastery, and school notices."}
                </p>
              </div>

              {/* Fast Demo One-Click Fill Button */}
              <div className="rounded-xl bg-[#F5F5FF] dark:bg-[#1A1A28] border border-[#D8D5FF]/60 dark:border-[#7C5CFA]/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-foreground block">Quick Prototype Sign-In:</span>
                  <span className="text-[11px] text-muted-foreground">
                    Pre-fills valid credentials for {currentRoleConfig.title}.
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadDemoCredentials(selectedRole)}
                  className="border-[#6541F5]/40 text-[#6541F5] hover:bg-[#EAE7FF] text-xs font-semibold shrink-0"
                >
                  Autofill Demo
                </Button>
              </div>

              {/* Error & Success Notification Banners */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE] dark:bg-[#19B99A]/15 p-3 text-xs text-[#19B99A] flex items-center gap-2 font-medium"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Main Sign-In Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label htmlFor="auth-name" className="block font-semibold text-foreground mb-1">
                    {selectedRole === "student"
                      ? "Student Full Name"
                      : selectedRole === "teacher"
                        ? "Educator Name"
                        : "Parent / Guardian Name"}
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={
                      selectedRole === "student"
                        ? "e.g. Ananya R."
                        : selectedRole === "teacher"
                          ? "e.g. Mrs. K. Lakshmi"
                          : "e.g. Ramesh R."
                    }
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6541F5]"
                  />
                </div>

                {/* Identifier: Roll number, Email or Phone */}
                <div>
                  <label
                    htmlFor="auth-identifier"
                    className="block font-semibold text-foreground mb-1"
                  >
                    {selectedRole === "student"
                      ? "Class & Roll Number (or Student ID)"
                      : selectedRole === "teacher"
                        ? "Teacher Email or Staff ID"
                        : "Mobile Number / Guardian ID"}
                  </label>
                  <input
                    id="auth-identifier"
                    type="text"
                    required
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    placeholder={
                      selectedRole === "student"
                        ? "e.g. 7B-14"
                        : selectedRole === "teacher"
                          ? "e.g. lakshmi.k@kalyanschool.edu.in"
                          : "e.g. +91 98451 23456"
                    }
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6541F5]"
                  />
                </div>

                {/* Special Field for Parents: Linked Child Name/Roll */}
                {selectedRole === "parent" && (
                  <div>
                    <label
                      htmlFor="auth-child"
                      className="block font-semibold text-foreground mb-1"
                    >
                      Linked Student Name or Roll Number
                    </label>
                    <input
                      id="auth-child"
                      type="text"
                      required
                      value={form.linkedChild}
                      onChange={(e) => setForm({ ...form, linkedChild: e.target.value })}
                      placeholder="e.g. Ananya R. (Class 7B)"
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6541F5]"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Used to connect your guardian dashboard with your student's progress records.
                    </p>
                  </div>
                )}

                {/* School Name */}
                <div>
                  <label htmlFor="auth-school" className="block font-semibold text-foreground mb-1">
                    Affiliated School / Micro-Hub
                  </label>
                  <div className="relative">
                    <input
                      id="auth-school"
                      type="text"
                      value={form.school}
                      onChange={(e) => setForm({ ...form, school: e.target.value })}
                      placeholder="e.g. Demo Government Higher Primary School"
                      className="w-full h-10 rounded-xl border border-input bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6541F5]"
                    />
                    <School className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Password / Class PIN with Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-pin" className="block font-semibold text-foreground">
                      {selectedRole === "student" ? "4-Digit Class PIN" : "Password"}
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      {selectedRole === "student"
                        ? "Class PIN provided by school"
                        : "Min 6 characters"}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="auth-pin"
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.pin}
                      onChange={(e) => setForm({ ...form, pin: e.target.value })}
                      placeholder={selectedRole === "student" ? "e.g. 2026" : "••••••••"}
                      className="w-full h-10 rounded-xl border border-input bg-background pl-8 pr-10 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6541F5]"
                    />
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs shadow-md shadow-[#6541F5]/25 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying & Authorizing...
                      </>
                    ) : (
                      <>
                        Authorize & Launch {currentRoleConfig.title} Portal
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Toggle Sign-In / Register Mode */}
                <div className="text-center pt-2 text-xs text-muted-foreground">
                  {form.isRegistering ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, isRegistering: false })}
                        className="font-semibold text-[#6541F5] hover:underline"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      New to VidyaVerse at your school?{" "}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, isRegistering: true })}
                        className="font-semibold text-[#6541F5] hover:underline"
                      >
                        Create Profile
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Compact Auth Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>VidyaVerse Prototype (v2.4)</span>
          <span>·</span>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
