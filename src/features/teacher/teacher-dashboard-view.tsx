import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap, Users, CheckCircle2, Plus, FileSpreadsheet,
  AlertTriangle, Clock, ArrowRight, BookOpen, ShieldCheck,
  Wifi, WifiOff, RotateCcw, Download, Search, FileText,
  Check, Layers, Lock, HelpCircle, Info, Sparkles, Filter
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { teacherRoster, classrooms, DEMO_LAST_SYNC, misconceptions, lessons } from "@/data/demo";
import { useDemo } from "@/lib/demo-store";
import { toast } from "sonner";

interface AssignmentRecord {
  id: string;
  title: string;
  classCode: string;
  className: string;
  kind: "Lesson" | "Quiz" | "STEM Lab";
  due: string;
  submissions: number;
  totalStudents: number;
  status: "Active" | "Graded" | "Pending Sync";
}

const INITIAL_ASSIGNMENTS: AssignmentRecord[] = [
  {
    id: "asg-1",
    title: "Electric current and simple circuits",
    classCode: "SCI7B",
    className: "Class 7B Science",
    kind: "Lesson",
    due: "Wed, 14 Oct",
    submissions: 24,
    totalStudents: 25,
    status: "Active"
  },
  {
    id: "asg-2",
    title: "Simple circuits check (Quiz)",
    classCode: "SCI7B",
    className: "Class 7B Science",
    kind: "Quiz",
    due: "Fri, 16 Oct",
    submissions: 21,
    totalStudents: 25,
    status: "Active"
  },
  {
    id: "asg-3",
    title: "Emergency Lantern CircuitVerse Lab",
    classCode: "SCI7B",
    className: "Class 7B Science",
    kind: "STEM Lab",
    due: "Mon, 19 Oct",
    submissions: 18,
    totalStudents: 25,
    status: "Active"
  },
  {
    id: "asg-4",
    title: "Nutrition in Plants Review",
    classCode: "SCI7B",
    className: "Class 7B Science",
    kind: "Lesson",
    due: "Completed 5 Oct",
    submissions: 25,
    totalStudents: 25,
    status: "Graded"
  }
];

const TOPIC_MASTERY_DATA = [
  { topic: "Ch 1: Plants", submitted: 25, mastered: 23, avgScore: 92 },
  { topic: "Ch 2: Animals", submitted: 24, mastered: 20, avgScore: 83 },
  { topic: "Ch 4: Heat", submitted: 23, mastered: 18, avgScore: 78 },
  { topic: "Ch 14: Circuits", submitted: 24, mastered: 22, avgScore: 89 },
  { topic: "Math: Fractions", submitted: 22, mastered: 16, avgScore: 72 }
];

export function TeacherDashboardView() {
  const d = useDemo();
  const [activeTab, setActiveTab] = useState("overview");

  // Assignment Modal State
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClass, setNewClass] = useState("SCI7B");
  const [newKind, setNewKind] = useState<"Lesson" | "Quiz" | "STEM Lab">("Lesson");
  const [newDue, setNewDue] = useState("Next Monday (19 Oct)");
  const [assignments, setAssignments] = useState<AssignmentRecord[]>(INITIAL_ASSIGNMENTS);

  // Search filter for students
  const [studentSearch, setStudentSearch] = useState("");

  // Create Classroom Modal State
  const [createClassModal, setCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("Class 7");
  const [newClassPolicy, setNewClassPolicy] = useState<"open" | "approval">("open");
  const [createdJoinCode, setCreatedJoinCode] = useState<string | null>(null);

  // Offline mesh sync simulated state
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(DEMO_LAST_SYNC);
  const [pendingSyncTablets, setPendingSyncTablets] = useState(1);
  const [isSyncingHub, setIsSyncingHub] = useState(false);

  // Role check: Is user actually in Teacher role?
  const isTeacherRole = d.role === "teacher";

  const handleExportReport = () => {
    const csvRows = [
      ["Student Name", "Assignments Completed", "Quiz Score (%)", "Flagged Concept Gap", "Last Mesh Sync"],
      ...teacherRoster.map((s) => [
        `"${s.name}"`,
        `"${s.assignments}"`,
        s.quiz !== null ? `${s.quiz}` : "N/A",
        `"${s.gap}"`,
        `"${s.lastSync}"`
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "VidyaVerse_Class_7B_Cohort_Diagnostic.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Cohort Diagnostic CSV Exported", {
      description: "VidyaVerse_Class_7B_Cohort_Diagnostic.csv downloaded to your device."
    });
  };

  const handleDeployAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }

    const newRecord: AssignmentRecord = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      classCode: newClass,
      className: newClass === "SCI7B" ? "Class 7B Science" : "Class 7 Mathematics",
      kind: newKind,
      due: newDue,
      submissions: 0,
      totalStudents: 25,
      status: "Active"
    };

    setAssignments([newRecord, ...assignments]);
    toast.success("Assignment Queued for Broadcast", {
      description: `"${newTitle}" queued on Kalyan School Mesh Hub for ${newRecord.className}.`
    });
    setAssignmentModal(false);
    setNewTitle("");
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const generated = "SCI" + Math.floor(100 + Math.random() * 900);
    setCreatedJoinCode(generated);
    toast.success("Classroom Created", {
      description: `${newClassName} generated with Revocable Code: ${generated}`
    });
  };

  const handleTriggerHubSync = () => {
    setIsSyncingHub(true);
    setTimeout(() => {
      setIsSyncingHub(false);
      setPendingSyncTablets(0);
      const nowStr = new Date().toLocaleString([], {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
      setLastSyncTimestamp(`${nowStr} (Reconciled)`);
      toast.success("School Mesh Hub Reconciled", {
        description: "All classroom tablets synchronized. Submissions and roster up to date."
      });
    }, 1200);
  };

  const filteredRoster = teacherRoster.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.gap.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Portal: Instructor Command Hub"
        description="Task-oriented classroom administration, assignment broadcasting, student topic diagnostics, and offline mesh synchronization."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
            <GraduationCap className="h-3.5 w-3.5" /> Instructor Role · Kalyan Govt. School
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!isTeacherRole && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  d.set("role", "teacher");
                  toast.success("Switched to Teacher Role");
                }}
                className="border-[#F5A623] text-[#F5A623] hover:bg-[#FFF0D5] text-xs font-bold"
              >
                Switch to Teacher Demo
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportReport}
              className="border-border text-xs font-semibold"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-[#19B99A]" /> Export CSV Report
            </Button>
            <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Deploy Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border text-foreground max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#6541F5] flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create & Assign Learning Task
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDeployAssignment} className="space-y-3.5 pt-2 text-xs">
                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">Target Classroom:</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                    >
                      <option value="SCI7B">Class 7B Science (25 students)</option>
                      <option value="MATH7">Class 7 Mathematics (23 students)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">Task Type:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Lesson", "Quiz", "STEM Lab"] as const).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setNewKind(k)}
                          className={`rounded-lg p-2 text-center font-bold text-xs border transition-all ${
                            newKind === k
                              ? "bg-[#6541F5] text-white border-[#6541F5]"
                              : "card-surface border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">Assignment Title:</label>
                    <input
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Conduct Ohm's Law Experiment in CircuitVerse"
                      className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold mb-1">Due Date / Session:</label>
                    <input
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      placeholder="e.g. Friday, 16 Oct (Activity Period)"
                      className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                    />
                  </div>

                  <div className="rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/50 p-2.5 text-[11px] text-foreground space-y-1">
                    <strong className="text-[#F5A623] flex items-center gap-1 font-bold">
                      <WifiOff className="h-3.5 w-3.5" /> Offline Broadcast Pipeline:
                    </strong>
                    <p className="text-muted-foreground">
                      This assignment will be cached on the school Raspberry Pi hub and automatically distributed to student tablets as they connect via Wi-Fi Direct.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <Button type="button" variant="outline" size="sm" onClick={() => setAssignmentModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-[#6541F5] text-white font-bold">
                      Broadcast Assignment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Role Notice & Demo Environment Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/40 p-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#F5A623] shrink-0" />
          <span className="font-semibold text-foreground">
            <strong>Demonstration Sandbox:</strong> Viewing authorized educator data for Teacher Mrs. K. Lakshmi (Class 7B Science).
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#F5A623]/40 bg-card dark:bg-[#F5A623]/15 text-[#F5A623] text-[10px]">
            Demo Data Verified
          </Badge>
          <span className="text-[11px] text-muted-foreground">RBAC Enforced</span>
        </div>
      </div>

      {/* Primary Task Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border border-border rounded-xl flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs font-semibold">
            Overview & Alerts
          </TabsTrigger>
          <TabsTrigger value="classrooms" className="text-xs font-semibold">
            Classrooms & Resources
          </TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs font-semibold">
            Assignments ({assignments.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">
            Student Roster & Diagnostics
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs font-semibold">
            Topic Mastery & Heatmap
          </TabsTrigger>
          <TabsTrigger value="offline-sync" className="text-xs font-semibold">
            School Mesh Sync Tracker
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & STUDENTS NEEDING SUPPORT */}
        {/* ============================================================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">Assigned Classes</span>
              <p className="text-2xl font-bold text-foreground">2 Sections</p>
              <span className="text-[11px] text-muted-foreground">Class 7B & Class 7A</span>
            </div>

            <div className="card-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Students</span>
              <p className="text-2xl font-bold text-[#6541F5]">48 Learners</p>
              <span className="text-[11px] text-[#19B99A] font-semibold">47 Synced this week</span>
            </div>

            <div className="card-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">Active Tasks</span>
              <p className="text-2xl font-bold text-[#F5A623]">3 Active</p>
              <span className="text-[11px] text-muted-foreground">84% Submission rate</span>
            </div>

            <div className="card-surface p-4 rounded-2xl border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-[#E95778] uppercase flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Needs Attention
              </span>
              <p className="text-2xl font-bold text-[#E95778]">2 Students</p>
              <span className="text-[11px] text-muted-foreground">Concept gaps / Sync stale</span>
            </div>
          </div>

          {/* Students Needing Intervention */}
          <Panel title="Action Required: Students Who May Need Support">
            <p className="text-xs text-muted-foreground mb-4">
              Pedagogical diagnostic triggers flagged from recent quiz checks and offline sync intervals:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E95778]/30 bg-[#FCE5EB]/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E95778]" />
                    <span className="font-bold text-foreground text-xs">Demo Student 02 (Roll 7B-02)</span>
                  </div>
                  <Badge variant="outline" className="border-[#E95778]/40 bg-card dark:bg-[#E95778]/15 text-[#E95778] text-[10px]">
                    Concept Gap: 64%
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">
                    <strong>Flagged Root Error:</strong> Comparing & Adding Fractions ($1/2 + 1/3 = 2/5$).
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Consistently adds numerators directly without finding a common denominator.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E95778]/20 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6541F5]">Recommended Intervention:</span>
                  <Link
                    to="/tutor"
                    search={{ q: "Why is 1/2 + 1/3 not 2/5?" }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6541F5] hover:underline"
                  >
                    Launch Concept Detective <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#F5A623]" />
                    <span className="font-bold text-foreground text-xs">Demo Student 04 (Roll 7B-04)</span>
                  </div>
                  <Badge variant="outline" className="border-[#F5A623]/40 bg-card dark:bg-[#F5A623]/15 text-[#F5A623] text-[10px]">
                    Stale Sync (5 Oct)
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">
                    <strong>Sync Warning:</strong> Device has not checked in to school hub for 8 days.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    0/2 assignments received on central roster. Tablet likely pending local Wi-Fi bubble reconciliation.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5A623]/20 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#F5A623]">Action:</span>
                  <button
                    onClick={() => setActiveTab("offline-sync")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F5A623] hover:underline"
                  >
                    View School Mesh Tracker <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </Panel>

          {/* Quick Assignments Progress */}
          <Panel title="Recent Assignment Submissions">
            <div className="space-y-3">
              {assignments.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-xl border border-border card-surface p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{a.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {a.kind}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{a.className} · Due: {a.due}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-foreground">{a.submissions} / {a.totalStudents}</span>
                      <span className="text-[10px] text-muted-foreground block">Turned In</span>
                    </div>
                    <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#19B99A] h-full"
                        style={{ width: `${(a.submissions / a.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: CLASSROOMS & RESOURCES */}
        {/* ============================================================== */}
        <TabsContent value="classrooms" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Assigned Sections & Learning Cohorts</h3>
              <p className="text-xs text-muted-foreground">Manage enrolled members, organize digital resources, and issue revocable join codes.</p>
            </div>
            <Dialog open={createClassModal} onOpenChange={setCreateClassModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Create New Class Section
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border text-foreground max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#6541F5]">
                    Create School Class Section
                  </DialogTitle>
                </DialogHeader>
                {createdJoinCode ? (
                  <div className="space-y-3 py-3 text-center">
                    <CheckCircle2 className="h-10 w-10 text-[#19B99A] mx-auto" />
                    <p className="font-bold text-sm text-foreground">Classroom Generated Successfully!</p>
                    <div className="p-3 bg-[#EAE7FF] rounded-xl border border-[#6541F5]/30 font-mono text-xl font-bold text-[#6541F5]">
                      JOIN CODE: {createdJoinCode}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Codes are revocable enrollment tokens. Display this on the classroom blackboard.
                    </p>
                    <Button size="sm" onClick={() => { setCreatedJoinCode(null); setCreateClassModal(false); }}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Section Name:</label>
                      <input
                        required
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="e.g. Class 7B Science Explorers"
                        className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Grade Level:</label>
                      <select
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                      >
                        <option value="Class 6">Class 6 (Middle School)</option>
                        <option value="Class 7">Class 7 (Middle School)</option>
                        <option value="Class 8">Class 8 (Middle School)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Enrollment Policy:</label>
                      <select
                        value={newClassPolicy}
                        onChange={(e) => setNewClassPolicy(e.target.value as "open" | "approval")}
                        className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
                      >
                        <option value="open">Open with Join Code</option>
                        <option value="approval">Teacher Approval Required</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <Button type="button" variant="outline" size="sm" onClick={() => setCreateClassModal(false)}>
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
          </div>

          {/* Active Classrooms Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {classrooms.map((c) => (
              <div key={c.code} className="card-surface rounded-2xl border border-border p-4 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{c.name}</h4>
                    <span className="text-[11px] text-muted-foreground">Instructor: {c.teacher}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs bg-[#EAE7FF] text-[#6541F5] px-2 py-0.5 rounded-md border border-[#6541F5]/20">
                      {c.code}
                    </span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Revocable Token</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Assigned Tasks:</span>
                    <span className="font-semibold text-foreground">{c.assigned.length} Tasks</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Team Challenge:</span>
                    <span className="font-semibold text-foreground truncate max-w-[200px]">{c.team}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">Policy: Open with Code</span>
                  <Link
                    to="/classrooms"
                    className="inline-flex items-center gap-1 font-bold text-xs text-[#6541F5] hover:underline"
                  >
                    Open Classroom Workspace <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Classroom Resource Hub */}
          <Panel title="Classroom Syllabus Resources & Toolkits">
            <p className="text-xs text-muted-foreground mb-3">
              Distribute verified curriculum files and offline experiment guides to student tablets:
            </p>
            <div className="space-y-2.5">
              {[
                { title: "NCERT Class 7 Science Chapter 14 Textbook PDF", size: "3.2 MB", type: "Official Syllabus" },
                { title: "CircuitVerse Emergency Lantern Breadboard Blueprint", size: "1.8 MB", type: "Lab Guide" },
                { title: "Mathematics Chapter 2 Fractions Remedial Worksheet", size: "1.4 MB", type: "Practice Sheet" }
              ].map((res, rIdx) => (
                <div key={rIdx} className="rounded-xl border border-border card-surface p-3 flex items-center justify-between text-xs">
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
                    onClick={() => toast.success(`Cached: ${res.title}`, { description: "Resource ready on School Hub." })}
                    className="text-xs border-border"
                  >
                    <Download className="h-3 w-3 mr-1" /> Share to Mesh
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 3: ASSIGNMENTS MANAGER */}
        {/* ============================================================== */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Assignment Distribution & Tracking</h3>
              <p className="text-xs text-muted-foreground">Review incoming student submissions, verify grading, and queue new tasks.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setAssignmentModal(true)}
              className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Deploy Assignment
            </Button>
          </div>

          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a.id} className="card-surface rounded-2xl border border-border p-4 shadow-xs text-xs space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{a.title}</h4>
                      <Badge variant="outline" className="text-[10px]">
                        {a.kind}
                      </Badge>
                      <Badge className={a.status === "Graded" ? "bg-[#19B99A] text-white" : "bg-[#6541F5] text-white"}>
                        {a.status}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Target: {a.className} ({a.classCode}) · Due Date: {a.due}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-foreground">{a.submissions} / {a.totalStudents}</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {Math.round((a.submissions / a.totalStudents) * 100)}% Complete
                    </span>
                  </div>
                </div>

                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#19B99A] h-full transition-all duration-500"
                    style={{ width: `${(a.submissions / a.totalStudents) * 100}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-muted-foreground">
                    Broadcasted over Kalyan School Mesh Hub · Offline Safe
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info(`Viewing submissions for "${a.title}"`)}
                      className="h-7 text-xs border-border"
                    >
                      Review Submissions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 4: STUDENT ROSTER & TOPIC DIAGNOSTICS */}
        {/* ============================================================== */}
        <TabsContent value="students" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Class 7B Authorized Student Roster</h3>
              <p className="text-xs text-muted-foreground">Individual competency levels, flagged bottlenecks, and device sync logs.</p>
            </div>
            <div className="relative w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-muted-foreground" />
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student or concept gap..."
                className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
              />
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="rounded-2xl border border-border card-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3.5">Student Identifier</th>
                    <th className="p-3.5">Assignments</th>
                    <th className="p-3.5">Quiz Mastery</th>
                    <th className="p-3.5">Flagged Concept Gap</th>
                    <th className="p-3.5">Last Mesh Sync</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRoster.map((s, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-bold text-foreground">
                        {s.name}
                        <span className="block text-[10px] text-muted-foreground font-normal">Roll: 7B-0{idx + 1}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-foreground">{s.assignments}</span>
                        {s.gap === "Not yet synced" && (
                          <span className="block text-[10px] text-[#F5A623] font-medium">Pending hub upload</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {s.quiz !== null ? (
                          <Badge
                            variant="outline"
                            className={
                              s.quiz >= 80
                                ? "border-[#19B99A]/40 text-[#19B99A]"
                                : s.quiz >= 70
                                ? "border-[#42A5E8]/40 text-[#42A5E8]"
                                : "border-[#E95778]/40 text-[#E95778]"
                            }
                          >
                            {s.quiz}%
                          </Badge>
                        ) : s.gap === "Not yet synced" ? (
                          <Badge variant="outline" className="border-[#F5A623]/40 text-[#F5A623] text-[10px]">
                            Offline Queued
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">Not Started</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {s.gap === "None flagged" ? (
                          <span className="text-[#19B99A] font-medium flex items-center gap-1">
                            <Check className="h-3 w-3" /> On Track
                          </span>
                        ) : s.gap === "Not yet synced" ? (
                          <span className="text-[#F5A623] font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" /> Offline (Not Yet Synced)
                          </span>
                        ) : (
                          <span className="text-[#E95778] font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 shrink-0" /> {s.gap}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-muted-foreground text-[11px]">
                        <span className={s.lastSync.includes("Not synced") ? "text-[#F5A623] font-medium" : ""}>
                          {s.lastSync}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Viewing diagnostic profile for ${s.name}`)}
                          className="text-xs h-7 text-[#6541F5] hover:bg-[#EAE7FF]/30 font-bold"
                        >
                          Diagnostics
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 5: TOPIC MASTERY & HEATMAP */}
        {/* ============================================================== */}
        <TabsContent value="analytics" className="space-y-6">
          <Panel title="Class 7B Syllabus Topic Mastery Distribution">
            <p className="text-xs text-muted-foreground mb-4">
              Comparison of total submissions versus students demonstrating conceptual mastery (&gt; 80% quiz score):
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOPIC_MASTERY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="topic" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-foreground)",
                      borderColor: "var(--color-border)",
                      borderRadius: "12px",
                      boxShadow: "var(--shadow-card)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Bar dataKey="submitted" name="Submissions" fill="#6541F5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mastered" name="Mastered (>80%)" fill="#19B99A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Common Misconceptions Catalog */}
          <Panel title="Diagnosed Misconceptions Across Cohort">
            <div className="grid gap-3 sm:grid-cols-2">
              {misconceptions.map((m) => (
                <div key={m.id} className="rounded-xl border border-border card-surface p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{m.misconception}</span>
                    <Badge variant="outline" className="text-[10px] text-[#E95778] border-[#E95778]/30">
                      High Frequency
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong>Root Cause:</strong> {m.why}
                  </p>
                  <div className="pt-2 border-t border-border flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground">Standard Question: "{m.question}"</span>
                    <Link
                      to="/tutor"
                      search={{ q: m.question }}
                      className="font-bold text-[#6541F5] hover:underline"
                    >
                      Remediate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 6: SCHOOL MESH SYNC TRACKER */}
        {/* ============================================================== */}
        <TabsContent value="offline-sync" className="space-y-6">
          <div className="rounded-2xl border border-border card-surface p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#EAE7FF] text-[#6541F5] flex items-center justify-center">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Kalyan School Micro-Mesh Hub</h3>
                  <span className="text-xs text-muted-foreground">Raspberry Pi 4 local server running at school admin desk</span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleTriggerHubSync}
                disabled={isSyncingHub}
                className="bg-[#19B99A] text-white hover:bg-[#14957c] font-bold text-xs"
              >
                <RotateCcw className={`h-3.5 w-3.5 mr-1.5 ${isSyncingHub ? "animate-spin" : ""}`} />
                {isSyncingHub ? "Reconciling Mesh Hub..." : "Reconcile Hub Now"}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Last Sync Received</span>
                <p className="font-bold text-foreground text-sm">{lastSyncTimestamp}</p>
                <span className="text-[11px] text-[#19B99A] font-medium">Automatic hourly pulse</span>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Pending Sync Tablets</span>
                <p className="font-bold text-foreground text-sm">
                  {pendingSyncTablets === 0 ? "0 Devices" : `${pendingSyncTablets} Device Pending`}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {pendingSyncTablets === 0 ? "All 25 tablets in sync" : "Demo Student 04 awaiting connection"}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Sync Protocol</span>
                <p className="font-bold text-foreground text-sm">CRDT Reversible Log</p>
                <span className="text-[11px] text-muted-foreground">Zero data loss on packet drop</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-background text-xs space-y-1.5 text-muted-foreground">
              <strong className="text-foreground block">How Rural Classroom Sync Works:</strong>
              <p className="leading-relaxed text-[11px]">
                Students complete lessons and quizzes without cellular internet. When tablets come within 30 meters of the school Raspberry Pi hub, scores and assignments sync automatically over Wi-Fi Direct. Teachers can view updated mastery logs at the end of each school day.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
