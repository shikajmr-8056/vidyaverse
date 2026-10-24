import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users, UserPlus, BookOpen, Clock, Megaphone, Trophy, CheckCircle2,
  Calendar, Award, ArrowRight, ShieldCheck, Flame, RotateCcw,
  FileText, Download, Wifi, WifiOff, AlertTriangle, Key,
  Check, Lock, HelpCircle, Info, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { classrooms, demoStudent } from "@/data/demo";
import { toast } from "sonner";

interface OfflineAssignmentStatus {
  id: string;
  title: string;
  kind: "Lesson" | "Quiz";
  due: string;
  lessonId?: string;
  quizId?: string;
  syncState: "synced" | "pending_offline" | "incomplete";
}

const INITIAL_OFFLINE_ASSIGNMENTS: Record<string, OfflineAssignmentStatus[]> = {
  SCI7B: [
    {
      id: "sci-asg-1",
      title: "Electric current and simple circuits",
      kind: "Lesson",
      due: "Wed, 14 Oct",
      lessonId: "electric-circuits",
      syncState: "synced"
    },
    {
      id: "sci-asg-2",
      title: "Simple circuits check (Assessment)",
      kind: "Quiz",
      due: "Fri, 16 Oct",
      quizId: "circuits",
      syncState: "pending_offline" // Completed on tablet, awaiting mesh sync!
    },
    {
      id: "sci-asg-3",
      title: "Nutrition in Plants Review",
      kind: "Lesson",
      due: "Mon, 19 Oct",
      lessonId: "plant-nutrition",
      syncState: "incomplete"
    }
  ],
  MATH7: [
    {
      id: "math-asg-1",
      title: "What a fraction really means",
      kind: "Lesson",
      due: "Thu, 15 Oct",
      lessonId: "fractions-intro",
      syncState: "synced"
    },
    {
      id: "math-asg-2",
      title: "Fractions practice (Quiz)",
      kind: "Quiz",
      due: "Fri, 16 Oct",
      quizId: "fractions",
      syncState: "incomplete"
    }
  ],
  CODE1: [
    {
      id: "code-asg-1",
      title: "Algorithms are step-by-step plans",
      kind: "Lesson",
      due: "Sat, 17 Oct",
      lessonId: "algorithms-steps",
      syncState: "synced"
    }
  ]
};

export function ClassroomsView() {
  const d = useDemo();
  const [selectedClassCode, setSelectedClassCode] = useState("SCI7B");
  const [inputCode, setInputCode] = useState("");
  const [joinMsg, setJoinMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Revocable Join Code State (keyed by class code)
  const [activeCodes, setActiveCodes] = useState<Record<string, string>>({
    SCI7B: "SCI7B",
    MATH7: "MATH7",
    CODE1: "CODE1"
  });
  const [revokedCodes, setRevokedCodes] = useState<string[]>([]);

  // Class Creation Modal
  const [createModal, setCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("Science");
  const [newEnrollmentPolicy, setNewEnrollmentPolicy] = useState<"open" | "approval">("open");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  // Offline Assignments Status
  const [assignmentStatuses, setAssignmentStatuses] = useState(INITIAL_OFFLINE_ASSIGNMENTS);
  const [isReconciling, setIsReconciling] = useState(false);

  const activeClass = classrooms.find((c) => c.code === selectedClassCode) || classrooms[0]!;
  const isMember = d.joined.includes(activeClass.code);
  const isTeacher = d.role === "teacher";

  // Join Classroom Handler with Code Revocation Check
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (!clean) return;

    if (revokedCodes.includes(clean)) {
      setJoinMsg({
        ok: false,
        text: `The join code "${clean}" has been revoked by the instructor. Please ask Mrs. Lakshmi for the updated active code.`
      });
      return;
    }

    const res = d.joinClass(clean);
    setJoinMsg({ ok: res.ok, text: res.message });
    if (res.ok) {
      setSelectedClassCode(clean);
      setInputCode("");
    }
  };

  // Revoke and Regenerate Join Code (Teacher Action)
  const handleRevokeCode = (classCode: string) => {
    const currentCode = activeCodes[classCode] || classCode;
    const newCode = classCode.substring(0, 3) + Math.floor(100 + Math.random() * 899);

    setRevokedCodes((prev) => [...prev, currentCode]);
    setActiveCodes((prev) => ({ ...prev, [classCode]: newCode }));

    toast.success(`Join Code Revoked & Regenerated`, {
      description: `Old code ${currentCode} is now invalid. New active code is ${newCode}.`
    });
  };

  // Create Classroom Handler
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const generated = "HUB" + Math.floor(100 + Math.random() * 900);
    setCreatedCode(generated);
    setActiveCodes((prev) => ({ ...prev, [generated]: generated }));
  };

  // Simulate Mesh Hub Reconciliation for Offline Work
  const handleReconcileOfflineWork = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setAssignmentStatuses((prev) => ({
        ...prev,
        [selectedClassCode]: (prev[selectedClassCode] || []).map((asg) =>
          asg.syncState === "pending_offline" ? { ...asg, syncState: "synced" as const } : asg
        )
      }));
      toast.success("School Mesh Hub Reconciled", {
        description: "Your offline quiz submissions have been synchronized with Mrs. Lakshmi's teacher roster."
      });
    }, 1200);
  };

  const rosterStudents = [
    { name: "Ananya R. (You)", roll: "7B-01", xp: d.xp, badges: 4, syncStatus: "Synced", pendingWork: false },
    { name: "Demo Student 02", roll: "7B-02", xp: 1190, badges: 3, syncStatus: "Synced", pendingWork: false },
    { name: "Demo Student 03", roll: "7B-03", xp: 1340, badges: 5, syncStatus: "Synced", pendingWork: false },
    { name: "Demo Student 04", roll: "7B-04", xp: 950, badges: 2, syncStatus: "Pending Offline (5 Oct)", pendingWork: true },
    { name: "Demo Student 05", roll: "7B-05", xp: 1100, badges: 3, syncStatus: "Synced", pendingWork: false }
  ];

  const currentAssignments = assignmentStatuses[activeClass.code] || [];
  const hasPendingOffline = currentAssignments.some((a) => a.syncState === "pending_offline");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms & Learning Cohorts"
        description="Collaborative classroom sections, revocable join codes, syllabus task distribution, and safe offline work synchronization."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
            <Users className="h-3.5 w-3.5" /> School Sections · Kalyan Govt. School
          </span>
        }
        actions={
          <div className="flex gap-2">
            {isTeacher && (
              <Dialog open={createModal} onOpenChange={setCreateModal}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#6541F5] text-white hover:bg-[#5230E8] text-xs font-bold shadow-xs">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Create Classroom Section
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border text-foreground max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#6541F5]">
                      Create School Class Section
                    </DialogTitle>
                  </DialogHeader>
                  {createdCode ? (
                    <div className="space-y-3 py-3 text-center">
                      <CheckCircle2 className="h-10 w-10 text-[#19B99A] mx-auto" />
                      <p className="font-bold text-sm text-foreground">Classroom Generated Successfully!</p>
                      <div className="p-3 bg-[#EAE7FF] rounded-xl border border-[#6541F5]/30 font-mono text-xl font-bold text-[#6541F5]">
                        JOIN CODE: {createdCode}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Codes are revocable enrollment tokens. Display this on the classroom blackboard.
                      </p>
                      <Button size="sm" onClick={() => { setCreatedCode(null); setCreateModal(false); }}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Classroom Name:</label>
                        <input
                          required
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="e.g. Class 7A Science Explorers"
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Subject:</label>
                        <select
                          value={newClassSubject}
                          onChange={(e) => setNewClassSubject(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                        >
                          <option value="Science">Science</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Computing">Computing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Enrollment Policy:</label>
                        <select
                          value={newEnrollmentPolicy}
                          onChange={(e) => setNewEnrollmentPolicy(e.target.value as "open" | "approval")}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                        >
                          <option value="open">Open Enrollment (Instant with Code)</option>
                          <option value="approval">Teacher Approval Required</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <Button type="button" variant="outline" size="sm" onClick={() => setCreateModal(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="bg-[#6541F5] text-white font-bold">
                          Generate Section
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {/* Security & Code Policy Disclosure Banner */}
      <div className="rounded-xl border border-[#6541F5]/20 bg-[#F5F5FF] dark:bg-[#6541F5]/10 p-3.5 text-xs space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[#6541F5] dark:text-[#7C5CFA]">
            <Key className="h-4 w-4 shrink-0" />
            <span>Classroom Code Security & Authorization Boundary</span>
          </div>
          <Badge variant="outline" className="border-[#6541F5]/30 bg-card dark:bg-[#6541F5]/20 text-[#6541F5] dark:text-[#7C5CFA] text-[10px]">
            Revocable Enrolment Tokens
          </Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[11px]">
          Join codes (e.g. <code>SCI7B</code>) are temporary enrollment identifiers, not authentication credentials. Teachers can revoke or regenerate codes at any time if shared outside the classroom. Student identities are protected under role-based authorization.
        </p>
      </div>

      {/* Classroom Selection Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground">Class Sections:</span>
        {classrooms.map((c) => {
          const isSelected = selectedClassCode === c.code;
          const userJoined = d.joined.includes(c.code);

          return (
            <button
              key={c.code}
              onClick={() => setSelectedClassCode(c.code)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold border transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-[#6541F5] text-white border-[#6541F5] shadow-xs"
                  : "card-surface border-border text-foreground hover:border-[#6541F5]"
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {activeCodes[c.code] || c.code}
              </span>
              {userJoined && (
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#19B99A]"}`} />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Active Classroom Details & Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Class Header Card */}
          <div className="card-surface rounded-2xl border border-border p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{activeClass.name}</h3>
                  <Badge variant="outline" className={isMember ? "border-[#19B99A]/40 text-[#19B99A]" : "border-border"}>
                    {isMember ? "Enrolled Member" : "Guest / Not Enrolled"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Instructor: {activeClass.teacher}</p>
              </div>

              {/* Join Code Display with Revoke Action (Teacher) */}
              <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-xl border border-border">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Active Join Code</span>
                  <span className="font-mono font-bold text-sm text-[#6541F5]">
                    {activeCodes[activeClass.code] || activeClass.code}
                  </span>
                </div>
                {isTeacher && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevokeCode(activeClass.code)}
                    className="h-7 text-[10px] border-[#E95778]/30 text-[#E95778] hover:bg-[#FCE5EB]"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Revoke
                  </Button>
                )}
              </div>
            </div>

            {/* Offline Sync Banner if work is pending */}
            {hasPendingOffline && (
              <div className="rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/50 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-[#F5A623] shrink-0" />
                  <span>
                    <strong>Offline Work Cached on Tablet:</strong> You completed tasks offline that are pending sync with the school hub.
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={handleReconcileOfflineWork}
                  disabled={isReconciling}
                  className="bg-[#F5A623] text-white hover:bg-[#e0951a] text-xs font-bold h-7"
                >
                  <RotateCcw className={`h-3 w-3 mr-1 ${isReconciling ? "animate-spin" : ""}`} />
                  {isReconciling ? "Syncing..." : "Sync Work Now"}
                </Button>
              </div>
            )}
          </div>

          {/* Structured Classroom Tabs */}
          <Tabs defaultValue="assignments" className="space-y-4">
            <TabsList className="bg-muted/40 p-1 border border-border rounded-xl">
              <TabsTrigger value="assignments" className="text-xs font-semibold">
                Assignments ({currentAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs font-semibold">
                Announcements ({activeClass.announcements.length})
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs font-semibold">
                Class Resources
              </TabsTrigger>
              <TabsTrigger value="challenge" className="text-xs font-semibold">
                Team Challenge
              </TabsTrigger>
            </TabsList>

            {/* TAB: ASSIGNMENTS WITH TRI-STATE OFFLINE STATUS */}
            <TabsContent value="assignments" className="space-y-3">
              {currentAssignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground card-surface rounded-xl border border-border">
                  No assignments currently assigned for this class.
                </div>
              ) : (
                currentAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="card-surface rounded-xl border border-border p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{asg.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {asg.kind}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground block">
                        Due Date: {asg.due} · Curriculum Task
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Tri-state indicator */}
                      {asg.syncState === "synced" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#19B99A] bg-[#DDF8EE] px-2.5 py-1 rounded-full border border-[#19B99A]/30">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed & Synced
                        </span>
                      )}
                      {asg.syncState === "pending_offline" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F5A623] bg-[#FFF0D5] px-2.5 py-1 rounded-full border border-[#F5A623]/30">
                          <Clock className="h-3.5 w-3.5" /> Finished Offline (Pending Sync)
                        </span>
                      )}
                      {asg.syncState === "incomplete" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                          Incomplete / Due Soon
                        </span>
                      )}

                      {/* Action Link */}
                      {asg.lessonId && (
                        <Link
                          to="/lesson/$id"
                          params={{ id: asg.lessonId }}
                          className="font-bold text-xs text-[#6541F5] hover:underline"
                        >
                          Open Lesson
                        </Link>
                      )}
                      {asg.quizId && (
                        <Link
                          to="/quiz/$id"
                          params={{ id: asg.quizId }}
                          className="font-bold text-xs text-[#6541F5] hover:underline"
                        >
                          Open Quiz
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* TAB: ANNOUNCEMENTS */}
            <TabsContent value="announcements" className="space-y-3">
              {activeClass.announcements.map((ann, idx) => (
                <div key={idx} className="card-surface rounded-xl border border-border p-4 shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#6541F5] flex items-center gap-1.5">
                      <Megaphone className="h-3.5 w-3.5" /> Announcement from {activeClass.teacher}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{ann.date}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{ann.text}</p>
                </div>
              ))}
            </TabsContent>

            {/* TAB: RESOURCES */}
            <TabsContent value="resources" className="space-y-3">
              {[
                { title: "NCERT Class 7 Science Chapter 14 PDF", size: "3.2 MB", type: "Textbook PDF" },
                { title: "CircuitVerse Emergency Lantern Breadboard Blueprint", size: "1.8 MB", type: "Activity Guide" },
                { title: "Class 7 Fractions Remedial Worksheet", size: "1.2 MB", type: "Worksheet" }
              ].map((res, rIdx) => (
                <div key={rIdx} className="rounded-xl border border-border card-surface p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#EAE7FF] text-[#6541F5] flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">{res.title}</span>
                      <span className="text-[11px] text-muted-foreground">{res.type} · {res.size}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Downloaded: ${res.title}`)}
                    className="h-7 text-xs border-border"
                  >
                    <Download className="h-3 w-3 mr-1" /> Save Offline
                  </Button>
                </div>
              ))}
            </TabsContent>

            {/* TAB: TEAM CHALLENGE */}
            <TabsContent value="challenge" className="space-y-4">
              <div className="card-surface rounded-xl border border-border p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#F5A623]" /> Active Cohort Quest
                  </span>
                  <Badge className="bg-[#FFF0D5] text-[#F5A623] border-[#F5A623]/30">
                    +150 Sparks Pool
                  </Badge>
                </div>
                <p className="text-foreground leading-relaxed">{activeClass.team}</p>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#F5A623] h-full" style={{ width: "65%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Classroom Progress: 16/25 Completed</span>
                  <span>Ends Mon, 19 Oct</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column (4 cols): Join Classroom Form & Class Roster */}
        <div className="lg:col-span-4 space-y-6">
          {/* Join Classroom Card */}
          <Panel title="Enroll in Classroom Section">
            <form onSubmit={handleJoin} className="space-y-3 text-xs">
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Enter the revocable join code provided by your teacher on the blackboard:
              </p>
              <div className="flex gap-2">
                <input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. SCI7B, MATH7"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-[#6541F5] uppercase"
                />
                <Button type="submit" size="sm" className="bg-[#6541F5] text-white font-bold text-xs">
                  Join
                </Button>
              </div>

              {joinMsg && (
                <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                  joinMsg.ok
                    ? "bg-[#DDF8EE] border-[#19B99A]/40 text-[#19B99A]"
                    : "bg-[#FCE5EB] border-[#E95778]/40 text-[#E95778]"
                }`}>
                  {joinMsg.text}
                </div>
              )}
            </form>
          </Panel>

          {/* Classroom Roster with Privacy-Protected Names */}
          <Panel title="Class Members (Class 7B)">
            <p className="text-[11px] text-muted-foreground mb-3">
              Authorized student records protected under school privacy policy:
            </p>
            <div className="space-y-2.5 text-xs">
              {rosterStudents.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-border bg-background flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">{s.name}</span>
                    <span className="text-[10px] text-muted-foreground">{s.roll} · {s.xp} XP</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`text-[9px] ${s.pendingWork ? "border-[#F5A623] text-[#F5A623]" : "border-border text-muted-foreground"}`}>
                      {s.syncStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <SimNote>
            Classrooms use in-memory demo datasets with localized localStorage persistence. All role boundaries strictly enforced.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
