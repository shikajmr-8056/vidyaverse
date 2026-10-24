import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Flame,
  Trophy,
  Play,
  BookOpen,
  Gamepad2,
  CircuitBoard,
  Code2,
  Bot,
  Mic,
  Award,
  Network,
  CheckCircle2,
  Target,
  ArrowRight,
  RefreshCw,
  Zap,
  Lightbulb,
  Clock,
  Compass,
  Check,
  Calendar,
} from "lucide-react";
import { NetworkTag, DemoTag } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo, levelFor, XP_PER_LEVEL } from "@/lib/demo-store";
import {
  achievements,
  demoStudent,
  lessons,
  misconceptions,
  getSubjectTheme,
  type Lesson,
} from "@/data/demo";
import { StemStudioArt } from "@/components/vv/lesson-art";

export function StudentDashboardView() {
  const d = useDemo();
  const [isSyncing, setIsSyncing] = useState(false);

  // Level calculations
  const currentLvl = levelFor(d.xp);
  const currentLvlXp = d.xp % XP_PER_LEVEL;
  const nextLvlPct = Math.min(100, Math.round((currentLvlXp / XP_PER_LEVEL) * 100));

  // Determine the next incomplete lesson to continue learning
  const incompleteLessons = lessons.filter((l) => !d.completed.includes(l.id));
  const continueLesson: Lesson | undefined = incompleteLessons[0] ?? lessons[0];
  const allLessonsDone = incompleteLessons.length === 0 && lessons.length > 0;

  // Chapter progress for the continue lesson
  const chapterLessons = continueLesson
    ? lessons.filter(
        (l) => l.chapter === continueLesson.chapter && l.subject === continueLesson.subject,
      )
    : [];
  const chapterCompletedCount = chapterLessons.filter((l) => d.completed.includes(l.id)).length;
  const chapterPct =
    chapterLessons.length > 0
      ? Math.round((chapterCompletedCount / chapterLessons.length) * 100)
      : 0;

  // Today's learning goal status (idempotent tracking)
  const isGoalDone =
    d.completedChallenges.includes("daily-goal-fractions") ||
    d.completedChallenges.includes("daily-fractions-1");

  const handleCompleteGoal = () => {
    if (!isGoalDone) {
      d.completeChallenge(
        "daily-goal-fractions",
        50,
        "Completed daily Fractions Concept practice quiz",
      );
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await d.syncNow();
    } finally {
      setIsSyncing(false);
    }
  };

  // Subjects configuration
  const subjectsList = [
    { id: "Mathematics", name: "Mathematics" },
    { id: "Science", name: "Science" },
    { id: "Computing", name: "Computing" },
    { id: "Social Science", name: "Social Science" },
  ] as const;

  // Saved offline packs
  const savedPacks = Object.entries(d.downloads).filter(([, st]) => st === "saved");

  // Recently completed lessons
  const completedLessonsList = lessons.filter((l) => d.completed.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          Clean Three-Part Dashboard Composition:
          - Compact left sidebar (rendered by _shell layout)
          - Spacious central learning area (8 cols on desktop)
          - Contextual right-side progress and activity panel (4 cols on desktop)
         ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            1. CENTRAL LEARNING AREA (8 Columns on xl)
           ===================================================================== */}
        <div className="xl:col-span-8 space-y-8">
          {/* A. Friendly, Concise Student Greeting */}
          <section
            aria-label="Welcome banner"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <DemoTag>Student Portal</DemoTag>
                <span className="text-xs font-semibold text-muted-foreground">
                  Class {demoStudent.classLevel}{demoStudent.section} · {demoStudent.school}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#6541F5]/10 px-2 py-0.5 text-[10px] font-bold text-[#6541F5] dark:text-[#7C5CFA]">
                  <Sparkles className="h-3 w-3" /> Term 2 Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {demoStudent.name}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {allLessonsDone
                  ? "Outstanding! You have completed all active curriculum modules. Review concepts or explore the STEM labs below."
                  : `You've completed ${d.completed.length} of ${lessons.length} core curriculum lessons so far. Ready for your next adventure?`}
              </p>
            </div>

            {/* Quick date & mode badge */}
            <div className="shrink-0 flex sm:flex-col items-end gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Today's Session
              </span>
              <span className="text-[11px] font-semibold text-foreground/80">
                NCERT & State Aligned
              </span>
            </div>
          </section>

          {/* B. Continue Learning Hero Card */}
          <section aria-label="Continue Learning">
            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#5230E8] via-[#6541F5] to-[#7C5CFA] p-6 text-white shadow-sm relative overflow-hidden min-h-[220px]">
              {/* Subtle background cosmic vector accent */}
              <div
                className="absolute -right-8 -bottom-8 h-44 w-44 rounded-full bg-white/10 pointer-events-none blur-2xl"
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 200 200"
                className="absolute right-2 top-2 h-36 w-36 text-white/5 pointer-events-none stroke-current"
                fill="none"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r="70" strokeDasharray="4 3" />
                <ellipse cx="100" cy="100" rx="90" ry="30" transform="rotate(-30 100 100)" strokeDasharray="3 2" />
                <circle cx="150" cy="60" r="4" fill="currentColor" />
                <circle cx="50" cy="140" r="3" fill="currentColor" />
              </svg>

              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Continue Learning
                  </span>
                  {continueLesson && (
                    <span className="text-xs text-white/80 font-medium">
                      {continueLesson.subject} · {continueLesson.chapter}
                    </span>
                  )}
                </div>

                {allLessonsDone ? (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                      All curriculum modules completed! 🎉
                    </h2>
                    <p className="text-xs sm:text-sm text-white/85 max-w-lg mt-1 leading-relaxed">
                      You're ahead of schedule, Ananya. You can revisit past lessons, take mastery
                      checkpoints, or build guided projects in the STEM labs.
                    </p>
                  </div>
                ) : continueLesson ? (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                      {continueLesson.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/85 max-w-lg mt-1 leading-relaxed">
                      {continueLesson.objectives[0] ??
                        `${continueLesson.type} · ${continueLesson.durationMin} min interactive lesson`}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {continueLesson && !allLessonsDone && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-white/90">
                      <span className="font-medium">Chapter progress</span>
                      <span className="font-bold">
                        {chapterCompletedCount} of {chapterLessons.length} lessons ({chapterPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-48 sm:w-56 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-300"
                        style={{ width: `${chapterPct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {continueLesson && (
                    <Button
                      asChild
                      className="bg-white text-[#5230E8] hover:bg-white/90 font-bold text-xs shadow-sm h-10 px-4 min-h-[44px]"
                    >
                      <Link to="/lesson/$id" params={{ id: continueLesson.id }}>
                        <Play className="h-4 w-4 mr-1.5 fill-[#5230E8]" />
                        {allLessonsDone ? "Review Lesson" : "Resume Lesson"}
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 text-xs font-semibold h-10 px-4 min-h-[44px]"
                  >
                    <Link to="/learn">Browse All Lessons</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* C. Today's Learning Goal Card */}
          <section aria-label="Today's Learning Goal">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0D5] text-[#F5A623]">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Today's Learning Goal</h2>
                    <p className="text-xs text-muted-foreground">Daily academic checkpoint</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-[#FFF0D5] text-[#b48216] border-[#F5A623]/30 font-bold text-[10px] self-start sm:self-auto"
                >
                  +50 XP Reward
                </Badge>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-xl">
                  <h3 className="text-sm font-bold text-foreground">
                    Complete Fractions Practice Checkpoint
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Solve 4 interactive questions on comparing, multiplying, and visualizing fractions
                    with equal shares.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Status:{" "}
                      <strong className={isGoalDone ? "text-[#19B99A]" : "text-[#F5A623]"}>
                        {isGoalDone ? "Accomplished (100%)" : "In Progress"}
                      </strong>
                    </span>
                    <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: isGoalDone ? "100%" : "30%",
                          backgroundColor: isGoalDone ? "#19B99A" : "#F5A623",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {isGoalDone ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#DDF8EE] px-4 py-2.5 text-xs font-bold text-[#19B99A] border border-[#19B99A]/30">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Goal Accomplished! +50 XP</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Button
                        asChild
                        className="bg-[#F5A623] text-white hover:bg-[#e0951b] font-bold text-xs shadow-sm h-10 px-4 min-h-[44px]"
                      >
                        <Link to="/quiz/$id" params={{ id: "fractions" }}>
                          Start Practice Quiz →
                        </Link>
                      </Button>
                      <button
                        type="button"
                        onClick={handleCompleteGoal}
                        className="text-[11px] text-muted-foreground hover:text-foreground text-center font-medium transition-colors px-2 py-1"
                      >
                        (Mark complete)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* D. Explore Learning Experiences: 4 Core STEM Studios (Image-led Cards) */}
          <section aria-labelledby="stem-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="stem-heading" className="text-lg font-bold text-foreground">
                  Explore Learning Experiences
                </h2>
                <p className="text-xs text-muted-foreground">
                  Hands-on virtual science, electronics, and creative coding studios
                </p>
              </div>
              <Link
                to="/learn"
                className="text-xs font-semibold text-[#6541F5] hover:underline flex items-center gap-1"
              >
                <span>Curriculum</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Learn */}
              <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between transition-all hover:border-[#6541F5]/40 hover:shadow-md overflow-hidden group">
                <div>
                  <StemStudioArt hub="learn" />
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6541F5] bg-[#EAE7FF] px-2 py-0.5 rounded-md">
                        Syllabus
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">13 Lessons</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[#6541F5] transition-colors">
                      Curriculum Library
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      Complete syllabus aligned to NCERT and State boards with offline packages.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-[#6541F5] hover:bg-[#EAE7FF]/50 h-8 px-2"
                  >
                    <Link to="/learn">
                      <span>Browse Library</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* 2. PlayLab */}
              <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between transition-all hover:border-[#F5A623]/40 hover:shadow-md overflow-hidden group">
                <div>
                  <StemStudioArt hub="playlab" />
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b48216] bg-[#FFF0D5] px-2 py-0.5 rounded-md">
                        Games
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">Math & Logic</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[#F5A623] transition-colors">
                      PlayLab Arenas
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      Math Ludo tournaments, CodeBot Mazes, and competitive number line challenges.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-[#b48216] hover:bg-[#FFF0D5]/50 h-8 px-2"
                  >
                    <Link to="/playlab">
                      <span>Launch PlayLab</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* 3. CircuitVerse */}
              <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between transition-all hover:border-[#19B99A]/40 hover:shadow-md overflow-hidden group">
                <div>
                  <StemStudioArt hub="circuitverse" />
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#19B99A] bg-[#DDF8EE] px-2 py-0.5 rounded-md">
                        Simulation
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">Electronics</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[#19B99A] transition-colors">
                      CircuitVerse
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      Connect knife switches, resistors, and 9V cells to observe real Ohm's Law physics.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-[#19B99A] hover:bg-[#DDF8EE]/50 h-8 px-2"
                  >
                    <Link to="/circuitverse">
                      <span>Open Circuit Lab</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* 4. CodeVerse */}
              <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between transition-all hover:border-[#42A5E8]/40 hover:shadow-md overflow-hidden group">
                <div>
                  <StemStudioArt hub="codeverse" />
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#42A5E8] bg-[#DDF2FC] px-2 py-0.5 rounded-md">
                        Coding
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">Block & Python</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[#42A5E8] transition-colors">
                      CodeVerse
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      Snap visual logic blocks together to solve automated farming puzzles and see Python.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-bold text-[#42A5E8] hover:bg-[#DDF2FC]/50 h-8 px-2"
                  >
                    <Link to="/codeverse">
                      <span>Start Coding</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* E. My Subjects: Course & Chapter Progress */}
          <section aria-labelledby="subjects-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="subjects-heading" className="text-lg font-bold text-foreground">
                  My Subjects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Course chapters, mastery progress, and next recommended lessons
                </p>
              </div>
              <Link to="/learn" className="text-xs font-semibold text-[#6541F5] hover:underline">
                View Full Library →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {subjectsList.map((sub) => {
                const theme = getSubjectTheme(sub.name);
                const subLessons = lessons.filter((l) => l.subject === sub.name);
                const subCompleted = subLessons.filter((l) => d.completed.includes(l.id)).length;
                const subPct =
                  subLessons.length > 0 ? Math.round((subCompleted / subLessons.length) * 100) : 0;
                const nextSubLesson = subLessons.find((l) => !d.completed.includes(l.id));

                return (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between transition-all hover:border-[#6541F5]/30"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: theme.tint,
                            color: theme.primary,
                            border: `1px solid ${theme.border}40`,
                          }}
                        >
                          {sub.name}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {subCompleted}/{subLessons.length} done ({subPct}%)
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${subPct}%`, backgroundColor: theme.primary }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/60">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          {nextSubLesson ? "Recommended Next" : "Subject Status"}
                        </p>
                        {nextSubLesson ? (
                          <div>
                            <p className="text-xs font-bold text-foreground line-clamp-1">
                              {nextSubLesson.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {nextSubLesson.chapter} · {nextSubLesson.durationMin}m
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-[#19B99A] flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> All chapters completed
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      {nextSubLesson ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-xs font-semibold text-[#6541F5] hover:bg-[#EAE7FF]/50 p-2 h-8"
                        >
                          <Link to="/lesson/$id" params={{ id: nextSubLesson.id }}>
                            <span>Study next</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-xs font-semibold text-muted-foreground hover:bg-muted p-2 h-8"
                        >
                          <Link to="/learn">
                            <span>Review topics</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* F. Practice & Revision (Concept Checkpoints) */}
          <section aria-labelledby="practice-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="practice-heading"
                  className="text-lg font-bold text-foreground flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4 text-[#F5A623]" /> Practice &amp; Revision
                </h2>
                <p className="text-xs text-muted-foreground">
                  Targeted concept checkpoints based on diagnostic checks and common misconceptions
                </p>
              </div>
              <Link to="/tutor" className="text-xs font-semibold text-[#6541F5] hover:underline">
                Ask AI Tutor →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {misconceptions.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="bg-[#FFF0D5] text-[#b48216] border-[#F5A623]/30 text-[10px] font-semibold"
                      >
                        Concept Checkpoint
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Diagnostic Retry
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-foreground">{m.question}</h3>
                      <p className="text-xs text-[#E95778] font-medium mt-0.5">
                        Common misconception: {m.misconception}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/40 p-3 text-xs text-foreground/90 leading-relaxed border border-border/70">
                      <span className="font-semibold text-primary">Concept Tip: </span>
                      {m.why}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground truncate mr-2">
                      Check: {m.practice.text}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold shrink-0"
                    >
                      <Link
                        to="/tutor"
                        search={{
                          q: `Why is the answer to ${encodeURIComponent(m.question)} not ${encodeURIComponent(m.studentAnswer)}?`,
                        }}
                      >
                        Solve with AI Tutor →
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================================
            2. CONTEXTUAL RIGHT PANEL (4 Columns on xl)
            Inspired by the reference dashboard: Clean progress, achievements,
            streak, and activity history summary.
           ===================================================================== */}
        <aside className="xl:col-span-4 space-y-6">
          {/* Card 1: Learning Progress & Mastery Index */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-[#6541F5]" /> Learning Mastery
              </span>
              <Badge
                variant="outline"
                className="bg-[#EAE7FF] text-[#6541F5] border-[#6541F5]/25 font-bold text-[10px]"
              >
                Level {currentLvl}
              </Badge>
            </div>

            {/* Level Progress Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Progress to Level {currentLvl + 1}</span>
                <span className="font-bold text-[#6541F5]">{nextLvlPct}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6541F5] rounded-full transition-all duration-500"
                  style={{ width: `${nextLvlPct}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {XP_PER_LEVEL - currentLvlXp} XP needed to reach Level {currentLvl + 1}
              </p>
            </div>

            {/* Lifetime XP and Weekly Activity Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-muted/40 p-3 border border-border/80">
                <p className="text-[11px] font-medium text-muted-foreground">Lifetime XP</p>
                <p className="text-xl font-black text-foreground mt-0.5">
                  {d.xp.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-muted-foreground">Permanent record</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3 border border-border/80">
                <p className="text-[11px] font-medium text-muted-foreground">Weekly Quest</p>
                <p className="text-xl font-black text-[#6541F5] mt-0.5">+{d.weeklyXp}</p>
                <p className="text-[10px] text-muted-foreground">Class 7B ranking</p>
              </div>
            </div>

            {/* Spendable Sparks Wallet */}
            <div className="rounded-xl bg-[#FFF0D5]/50 border border-[#F5A623]/25 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#b48216] flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 fill-[#F5A623]" /> Spendable Sparks
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  XP is never deducted when shopping
                </p>
              </div>
              <span className="text-lg font-black text-[#F5A623]">{d.sparks} ⚡</span>
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs font-bold text-[#6541F5] hover:bg-[#EAE7FF]/50 p-2 h-8"
              >
                <Link to="/rewards">
                  <span>Open Rewards Bazaar ({d.sparks} Sparks)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Active Streak & Weekly Cadence */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-[#E95778]" /> Active Learning Cadence
              </span>
              <span className="text-xs font-bold text-[#E95778]">{demoStudent.streakDays} Days 🔥</span>
            </div>

            <div className="flex items-center justify-between px-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                const isActive = idx < demoStudent.streakDays;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground">{day}</span>
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-[#EAE7FF] text-[#6541F5] border border-[#6541F5]/30 font-bold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isActive ? <Check className="h-3 w-3 stroke-[3]" /> : "·"}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Consistent daily study builds deep concept retention. Complete 1 lesson tomorrow to reach
              a 7-day milestone badge.
            </p>
          </div>

          {/* Card 3: Recent Unlocked Milestones */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#F5A623]" /> Badges &amp; Milestones
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {d.unlocked.length} of {achievements.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {achievements
                .filter((a) => d.unlocked.includes(a.id))
                .slice(0, 3)
                .map((a, i) => {
                  const badgeColor = [
                    "bg-[#FFF0D5] text-[#F5A623]",
                    "bg-[#DDF2FC] text-[#42A5E8]",
                    "bg-[#DDF8EE] text-[#19B99A]",
                  ][i % 3]!;

                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-2.5"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${badgeColor}`}
                      >
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{a.desc}</p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Next: <strong>Week Streak (7 Days)</strong>
              </span>
              <Link to="/leaderboard" className="text-[#6541F5] font-semibold hover:underline">
                Leaderboard →
              </Link>
            </div>
          </div>

          {/* Card 4: Recently Completed Activities */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Recent Activity
              </span>
              <Link to="/progress" className="text-xs font-semibold text-primary hover:underline">
                All History →
              </Link>
            </div>

            {completedLessonsList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No lessons completed yet. Start your first lesson today!
              </p>
            ) : (
              <div className="space-y-2.5">
                {completedLessonsList.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/70 bg-muted/20 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{l.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {l.subject} · {l.durationMin} min
                      </p>
                    </div>
                    <Link
                      to="/lesson/$id"
                      params={{ id: l.id }}
                      className="shrink-0 text-[11px] font-bold text-[#19B99A] hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 5: Kalyan School Mesh & Offline Sync Status */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Network className="h-4 w-4 text-muted-foreground" /> School Mesh Hub
              </span>
              <NetworkTag status={d.networkMode} />
            </div>

            <div className="rounded-xl bg-muted/40 p-3 border border-border/80 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Cached offline:</span>
                <span className="font-bold text-foreground">{savedPacks.length} packs ready</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pending sync:</span>
                <span className="font-bold text-primary">
                  {d.pendingSyncCount > 0 ? `${d.pendingSyncCount} activities` : "All synced ✓"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[10px] pt-1 border-t border-border/60">
                <span>Last heartbeat:</span>
                <span>{d.lastSyncTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="w-full text-xs font-bold text-primary border-primary/30 h-8"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                <Link to="/downloads">Downloads</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
