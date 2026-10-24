import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Gamepad2,
  FlaskConical,
  CircuitBoard,
  Code2,
  BookOpen,
  Clock,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ChevronRight,
  Play,
  Calendar,
  Target,
  Check,
  Compass,
  Bot,
  Sparkles,
  Mic,
  Volume2,
  Send,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo-store";
import { demoStudent, lessons, getSubjectTheme, type Subject } from "@/data/demo";
import { cn } from "@/lib/utils";

// Weekly activity data (Mon - Fri) representing study minutes
const weeklyActivityData = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 50 },
  { day: "Wed", minutes: 25 },
  { day: "Thu", minutes: 65 },
  { day: "Fri", minutes: 45 },
];

export function StudentDashboardView() {
  const d = useDemo();
  const navigate = useNavigate();
  const studentClass = d.studentClass ?? 7;
  const studentName = d.studentName || demoStudent.name;
  const [quickDoubt, setQuickDoubt] = useState("");

  // Filter lessons strictly to the student's class
  const classLessons = useMemo(() => {
    return lessons.filter((l) => l.classLevel === studentClass);
  }, [studentClass]);

  // Determine active lesson in progress (Section B)
  const activeLesson = useMemo(() => {
    const inProgress = classLessons.find((l) => !d.completed.includes(l.id));
    return inProgress || classLessons[0];
  }, [classLessons, d.completed]);

  const isActiveCompleted = activeLesson ? d.completed.includes(activeLesson.id) : false;
  const activeProgressPct = isActiveCompleted ? 100 : activeLesson ? 65 : 0;

  // Distinct subjects supported in student's class (Section D)
  const classSubjects = useMemo(() => {
    const list: Subject[] = ["Mathematics", "Science", "Computing", "Social Science", "English"];
    return list.map((subj) => {
      const subjLessons = classLessons.filter((l) => l.subject === subj);
      const completedCount = subjLessons.filter((l) => d.completed.includes(l.id)).length;
      const theme = getSubjectTheme(subj);
      return {
        subject: subj,
        total: subjLessons.length,
        completed: completedCount,
        hasLessons: subjLessons.length > 0,
        theme,
      };
    }).filter((s) => s.hasLessons);
  }, [classLessons, d.completed]);

  const handleQuickDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDoubt.trim()) return;
    void navigate({ to: "/tutor", search: { q: quickDoubt.trim() } });
  };

  return (
    <div className="w-full space-y-6">
      {/* ========================================================================= */}
      {/* SECTION A — WELCOME GREETING                                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Welcome back, {studentName}!
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            What would you like to learn today?
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge className="bg-[#6541F5]/10 text-[#6541F5] hover:bg-[#6541F5]/15 border-0 font-bold text-xs px-3 py-1 rounded-xl">
            Class {studentClass} {demoStudent.section || "B"}
          </Badge>
          <Badge className="bg-[#FA6400]/10 text-[#FA6400] hover:bg-[#FA6400]/15 border-0 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-[#FA6400]" /> {demoStudent.streakDays} Day Streak
          </Badge>
        </div>
      </div>

      {/* Main Grid: Left Primary Content (8 cols) + Right Contextual Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT PRIMARY CONTENT AREA (8 Columns on lg)                             */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* ===================================================================== */}
          {/* SECTION B — CONTINUE LEARNING (Primary Feature Card)                   */}
          {/* ===================================================================== */}
          {activeLesson ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5037ED] to-[#6541F5] text-white p-6 sm:p-7 shadow-md">
              {/* Subtle background circle decoration */}
              <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white hover:bg-white/25 border-0 font-bold text-xs px-3 py-0.5 rounded-lg">
                    {activeLesson.subject} · Class {studentClass}
                  </Badge>
                  <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {activeLesson.durationMin} Mins
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-white/80 block">
                    {activeLesson.chapter}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {activeLesson.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-normal line-clamp-2 mt-1 max-w-xl leading-relaxed">
                    {activeLesson.summary}
                  </p>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white/90">
                    <span>Lesson Progress</span>
                    <span>{activeProgressPct}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${activeProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white hover:bg-white/95 text-[#5037ED] font-bold text-sm h-11 px-6 rounded-xl shadow-sm"
                  >
                    <Link to="/lesson/$id" params={{ id: activeLesson.id }}>
                      {isActiveCompleted ? "Review Lesson" : "Continue Learning"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 text-center text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto text-[#6541F5] mb-2" />
              <p className="text-sm font-bold text-foreground">No active lesson in progress</p>
              <Button asChild size="sm" className="mt-3 bg-[#6541F5] text-white">
                <Link to="/learn">Start Learning</Link>
              </Button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SECTION C — EXPLORE VIDYAVERSE (4 Activity Cards)                      */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Explore VidyaVerse
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                Interactive STEM & Coding Studios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: PlayLab */}
              <div className="rounded-2xl border border-[#FFE2CC] bg-[#FFF8F2] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between hover:shadow-sm transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FA6400]/15 text-[#FA6400] flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">PlayLab</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Learn through games.
                    </p>
                  </div>
                </div>
                <div className="pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-[#FA6400]/30 text-[#FA6400] hover:bg-[#FA6400] hover:text-white font-bold text-xs h-8 rounded-xl transition-colors"
                  >
                    <Link to="/playlab">Explore Games</Link>
                  </Button>
                </div>
              </div>

              {/* Card 2: Explore Experiments */}
              <div className="rounded-2xl border border-[#CEF5EC] bg-[#F2FBF8] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between hover:shadow-sm transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#19B99A]/15 text-[#19B99A] flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">Explore</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Discover science and mathematics.
                    </p>
                  </div>
                </div>
                <div className="pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-[#19B99A]/30 text-[#19B99A] hover:bg-[#19B99A] hover:text-white font-bold text-xs h-8 rounded-xl transition-colors"
                  >
                    <Link to="/projects">Try Experiments</Link>
                  </Button>
                </div>
              </div>

              {/* Card 3: CircuitVerse */}
              <div className="rounded-2xl border border-[#E0D8FD] bg-[#F7F5FE] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between hover:shadow-sm transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#6541F5]/15 text-[#6541F5] flex items-center justify-center">
                    <CircuitBoard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">CircuitVerse</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Build and understand circuits.
                    </p>
                  </div>
                </div>
                <div className="pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-[#6541F5]/30 text-[#6541F5] hover:bg-[#6541F5] hover:text-white font-bold text-xs h-8 rounded-xl transition-colors"
                  >
                    <Link to="/circuitverse">Open Lab</Link>
                  </Button>
                </div>
              </div>

              {/* Card 4: CodeVerse */}
              <div className="rounded-2xl border border-[#D4ECFF] bg-[#F2F8FE] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between hover:shadow-sm transition-all group">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0A73C7]/15 text-[#0A73C7] flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">CodeVerse</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Learn programming by doing.
                    </p>
                  </div>
                </div>
                <div className="pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-[#0A73C7]/30 text-[#0A73C7] hover:bg-[#0A73C7] hover:text-white font-bold text-xs h-8 rounded-xl transition-colors"
                  >
                    <Link to="/codeverse">Start Coding</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION D — MY SUBJECTS                                               */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                My Subjects · Class {studentClass}
              </h2>
              <Link
                to="/learn"
                className="text-xs font-bold text-[#6541F5] hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {classSubjects.map((item) => {
                const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                return (
                  <div
                    key={item.subject}
                    className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-[#6541F5]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border"
                        style={{
                          backgroundColor: item.theme.tint,
                          color: item.theme.primary,
                          borderColor: item.theme.border,
                        }}
                      >
                        {item.subject.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {item.subject}
                        </h4>
                        <span className="text-xs text-muted-foreground block">
                          {item.completed} of {item.total} chapters completed ({pct}%)
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-[#6541F5] hover:text-[#5230E8] hover:bg-[#6541F5]/10 shrink-0"
                    >
                      <Link to="/learn" search={{ q: item.subject }}>
                        Study
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION F — ASK AI CHATBOT, TALK WITH VIDYAVOICE & GO TO SIMULATIONS   */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Learning Assistants & STEM Simulations
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Ask doubts to AI, speak with VidyaVoice, or launch hands-on labs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Ask AI Chatbot */}
              <div className="rounded-2xl border border-[#EAE7FF] bg-[#F7F5FE] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#6541F5]/15 text-[#6541F5] flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="border-[#6541F5]/30 bg-[#EAE7FF]/60 text-[#6541F5] text-[10px] font-bold">
                      Syllabus Grounded
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-[#6541F5] transition-colors">
                      Ask AI Assistant
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                      Instant concept clarity, step-by-step diagnostic breakdown, and village analogies.
                    </p>
                  </div>

                  {/* Sample questions */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Common Doubts:
                    </span>
                    <Link
                      to="/tutor"
                      search={{ q: "Why is 1/2 + 1/3 not equal to 2/5?" }}
                      className="text-[11px] text-[#6541F5] hover:underline block truncate font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#6541F5]/15"
                    >
                      💡 Why is 1/2 + 1/3 ≠ 2/5?
                    </Link>
                    <Link
                      to="/tutor"
                      search={{ q: "How does a switch work in an electric circuit?" }}
                      className="text-[11px] text-[#6541F5] hover:underline block truncate font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#6541F5]/15"
                    >
                      💡 How does a circuit switch work?
                    </Link>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                  >
                    <Link to="/tutor">
                      Ask AI Chatbot <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Card 2: Talk with VidyaVoice */}
              <div className="rounded-2xl border border-[#CEF5EC] bg-[#F2FBF8] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#19B99A]/15 text-[#19B99A] flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="border-[#19B99A]/30 bg-[#CEF5EC]/60 text-[#19B99A] text-[10px] font-bold">
                      Hands-Free Voice
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-[#19B99A] transition-colors">
                      Talk with VidyaVoice
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                      Hands-free voice assistant. Speak in English, हिन्दी, or ಕನ್ನಡ for read-aloud lessons and practice.
                    </p>
                  </div>

                  {/* Sample voice triggers */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Try Saying:
                    </span>
                    <div className="text-[11px] text-[#19B99A] font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#19B99A]/15 truncate">
                      🎙️ "Start fractions quiz"
                    </div>
                    <div className="text-[11px] text-[#19B99A] font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#19B99A]/15 truncate">
                      🎙️ "Open electric circuits"
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-[#19B99A] hover:bg-[#19B99A]/90 text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                  >
                    <Link to="/voice">
                      Talk with VidyaVoice <Volume2 className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Card 3: Go to Simulations */}
              <div className="rounded-2xl border border-[#FFE2CC] bg-[#FFF8F2] dark:bg-card dark:border-border p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FA6400]/15 text-[#FA6400] flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="border-[#FA6400]/30 bg-[#FFE2CC]/60 text-[#FA6400] text-[10px] font-bold">
                      Interactive Labs
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-[#FA6400] transition-colors">
                      Go to Simulations
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                      Experiment in virtual physics sandboxes, wire circuits, and visual fraction strip cutouts.
                    </p>
                  </div>

                  {/* Quick Simulation shortcuts */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Active Sandboxes:
                    </span>
                    <Link
                      to="/playlab"
                      className="text-[11px] text-[#FA6400] hover:underline block truncate font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#FA6400]/15"
                    >
                      🎮 PlayLab Math & Physics Arena
                    </Link>
                    <Link
                      to="/circuitverse"
                      className="text-[11px] text-[#FA6400] hover:underline block truncate font-medium bg-white/70 dark:bg-muted/40 p-1.5 rounded-lg border border-[#FA6400]/15"
                    >
                      ⚡ CircuitVerse Electronics Lab
                    </Link>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-[#FA6400] hover:bg-[#e05800] text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                  >
                    <Link to="/playlab">
                      Launch Simulations <FlaskConical className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT CONTEXTUAL PANEL (SECTION E — 4 Columns on lg)                    */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Student Profile Summary */}
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6541F5] to-[#8C6BFF] flex items-center justify-center text-white font-black text-lg shadow-sm">
                {studentName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground leading-tight truncate">
                  {studentName}
                </h3>
                <span className="text-xs text-muted-foreground font-medium block truncate">
                  Class {studentClass} {demoStudent.section || "B"} · {demoStudent.school}
                </span>
              </div>
            </div>

            {/* Daily Learning Goal */}
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#6541F5]" /> Daily Learning Goal
                </span>
                <span className="font-bold text-[#6541F5]">3 / 4 Lessons</span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-[#6541F5] rounded-full w-[75%]" />
              </div>
              <span className="text-[11px] text-muted-foreground block">
                1 more lesson to complete today's goal!
              </span>
            </div>

            {/* Learning Streak Banner */}
            <div className="rounded-2xl bg-[#FFF8F2] dark:bg-card border border-[#FFE2CC] dark:border-border p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FA6400]/15 text-[#FA6400] flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="font-bold text-xs text-foreground block">
                    {demoStudent.streakDays} Day Learning Streak
                  </span>
                  <span className="text-[11px] text-muted-foreground">Keep studying daily</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#FA6400]">+25 XP</span>
            </div>
          </div>

          {/* 2. Weekly Learning Activity Chart */}
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground">
                Minutes of interactive learning per school day
              </p>
            </div>

            <div className="h-36 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6541F5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6541F5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[0, 80]} ticks={[0, 40, 80]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(val: any) => [`${val} mins`, "Time"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#6541F5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleWeekly)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Quick Doubt & Assistant Bar */}
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6541F5]" /> Quick Doubt Solver
              </h3>
              <Badge variant="outline" className="text-[10px] text-[#6541F5] border-[#6541F5]/30">
                AI + Voice
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              Type any question from your NCERT Class {studentClass} textbook:
            </p>

            <form onSubmit={handleQuickDoubtSubmit} className="flex gap-2">
              <input
                type="text"
                value={quickDoubt}
                onChange={(e) => setQuickDoubt(e.target.value)}
                placeholder="Ask about fractions, circuits..."
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6541F5]"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!quickDoubt.trim()}
                className="bg-[#6541F5] text-white hover:bg-[#5230E8] h-8 px-3 rounded-xl font-bold text-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="pt-1 flex gap-2">
              <Link
                to="/voice"
                className="flex-1 rounded-xl border border-[#19B99A]/30 bg-[#F2FBF8] dark:bg-[#19B99A]/10 p-2 text-center text-xs font-bold text-[#19B99A] hover:bg-[#19B99A]/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" /> Speak Query
              </Link>
              <Link
                to="/playlab"
                className="flex-1 rounded-xl border border-[#FA6400]/30 bg-[#FFF8F2] dark:bg-[#FA6400]/10 p-2 text-center text-xs font-bold text-[#FA6400] hover:bg-[#FA6400]/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Simulation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
