import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, Search, Play, BookOpen, Sparkles, Trophy,
  RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, Heart, Star,
  Compass, Award, Lightbulb, Clock, Check, Calendar, ChevronRight,
  Plus, Users, Flame, BookMarked, Layers, Gamepad2, CircuitBoard, Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo-store";
import { demoStudent, lessons, getSubjectTheme } from "@/data/demo";
import { cn } from "@/lib/utils";

export function StudentDashboardView() {
  const d = useDemo();
  const studentClass = d.studentClass ?? 7;
  const studentName = d.studentName || demoStudent.name;

  const [activeCourseTab, setActiveCourseTab] = useState<"All" | "In progress" | "Completed">("In progress");
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>("All");
  const [activeTaskTab, setActiveTaskTab] = useState<"All" | "To do" | "In progress" | "Done">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Strictly filter curriculum lessons for the student's selected class
  const classLessons = useMemo(() => {
    return lessons.filter((l) => l.classLevel === studentClass);
  }, [studentClass]);

  // Filtered by subject and search
  const filteredCourses = useMemo(() => {
    return classLessons.filter((l) => {
      const matchSubject = activeSubjectFilter === "All" || l.subject === activeSubjectFilter;
      const matchSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [classLessons, activeSubjectFilter, searchQuery]);

  // Derived tasks based on the student's class lessons
  const classTasks = useMemo(() => {
    return classLessons.map((l, index) => {
      const isDone = index === 0 && d.completed.includes(l.id);
      const isInProgress = !isDone && index === 0;
      return {
        id: `task-${l.id}`,
        title: `Study: ${l.title}`,
        subject: l.subject,
        chapter: l.chapter,
        lessonId: l.id,
        status: isDone ? ("Done" as const) : isInProgress ? ("In progress" as const) : ("To do" as const),
        progress: isDone ? 100 : isInProgress ? 65 : 0,
        due: index === 0 ? "Today, 5:00 PM" : index === 1 ? "Tomorrow" : "This Friday",
      };
    });
  }, [classLessons, d.completed]);

  const filteredTasks = useMemo(() => {
    if (activeTaskTab === "All") return classTasks;
    return classTasks.filter((t) => t.status === activeTaskTab);
  }, [classTasks, activeTaskTab]);

  // Extract key concept notes from class lessons
  const conceptNotes = useMemo(() => {
    const notes: { subject: string; title: string; summary: string; date: string; theme: string }[] = [];
    classLessons.forEach((l) => {
      if (l.definitions && l.definitions.length > 0) {
        l.definitions.slice(0, 1).forEach((def) => {
          notes.push({
            subject: l.subject,
            title: `${def.term}`,
            summary: def.explanation,
            date: "NCERT Class " + studentClass,
            theme: l.subject === "Mathematics" ? "bg-[#EBF7EE] text-[#1B6D3B] border-[#D1EED7]" : "bg-[#F3EEFF] text-[#5527D7] border-[#E2D5FF]",
          });
        });
      }
    });
    // Fallback if no notes
    if (notes.length === 0) {
      notes.push({
        subject: "Mathematics",
        title: "Key Formula",
        summary: `Essential concepts and formulas for NCERT Class ${studentClass}.`,
        date: `Class ${studentClass} Syllabus`,
        theme: "bg-[#EBF7EE] text-[#1B6D3B] border-[#D1EED7]",
      });
    }
    return notes.slice(0, 2);
  }, [classLessons, studentClass]);

  // Schedule for the student's class
  const classSchedule = useMemo(() => {
    const subjects = Array.from(new Set(classLessons.map((l) => l.subject)));
    const scheduleItems = [
      { time: "08:30 AM", subject: subjects[0] || "Mathematics", teacher: "Ms. Shalini Gupta", room: `B3, Room ${studentClass}01` },
      { time: "10:00 AM", subject: subjects[1] || "Science", teacher: "Mr. Ramesh Rao", room: "Science Lab 2" },
      { time: "11:30 AM", subject: "Computing & Logic", teacher: "Ms. F. Begum", room: "Computer Lab" },
      { time: "01:30 PM", subject: "PlayLab STEM Activity", teacher: "Self-Guided Arena", room: "Offline Hub" },
    ];
    return scheduleItems;
  }, [classLessons, studentClass]);

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & PROFILE BAR (Inspired by EduMate & EduWay)                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E9E9F2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar with dynamic initials */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6541F5] to-[#8C6BFF] flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            {studentName.charAt(0)}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#19B99A] border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#1E1B39] tracking-tight">
                {studentName}
              </h1>
              <Badge className="bg-[#6541F5]/10 text-[#6541F5] hover:bg-[#6541F5]/15 border-0 font-bold text-xs px-2.5 py-0.5 rounded-lg">
                Class {studentClass} {demoStudent.section}
              </Badge>
              <Badge className="bg-[#FF9F1C]/15 text-[#E06D00] hover:bg-[#FF9F1C]/20 border-0 font-bold text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#FF9F1C]" /> {demoStudent.streakDays} Day Streak
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#6C6B80] font-medium mt-0.5">
              {demoStudent.school} · Curriculum matches your enrolled Class {studentClass}
            </p>
          </div>
        </div>

        {/* Quick Class Switcher & Search Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-[#F4F4FA] p-1 rounded-xl border border-[#E5E5F0]">
            <span className="text-xs font-bold text-[#6C6B80] px-2">Grade:</span>
            {[5, 6, 7, 8, 9, 10].map((lvl) => (
              <button
                key={lvl}
                onClick={() => d.set("studentClass", lvl)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                  studentClass === lvl
                    ? "bg-[#6541F5] text-white shadow-xs"
                    : "text-[#6C6B80] hover:text-[#1E1B39] hover:bg-white/60"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures..."
              className="h-10 w-full rounded-xl bg-[#F4F4FA] border border-[#E5E5F0] pl-10 pr-3 text-xs sm:text-sm text-[#1E1B39] placeholder:text-muted-foreground focus:outline-none focus:border-[#6541F5] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN DASHBOARD GRID (Left: Courses/Tasks | Right: Notes/Schedule) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: 8 Columns on lg (Courses & Class Lectures)                 */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          {/* A. Courses & In-Progress Lectures Section (EduMate & Growly Style) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E9E9F2] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#1E1B39] tracking-tight">
                    Class {studentClass} Courses & Lectures
                  </h2>
                  <Badge variant="outline" className="border-[#6541F5] text-[#6541F5] text-xs font-bold">
                    {filteredCourses.length} Available
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-[#6C6B80] font-medium mt-0.5">
                  Showing verified NCERT syllabus lectures exclusively for Class {studentClass}
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-[#F4F4FA] p-1 rounded-xl border border-[#E5E5F0] self-start sm:self-auto">
                {(["All", "In progress", "Completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCourseTab(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all",
                      activeCourseTab === tab
                        ? "bg-[#6541F5] text-white shadow-xs"
                        : "text-[#6C6B80] hover:text-[#1E1B39]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter Pills (Growly style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold select-none no-scrollbar">
              {["All", "Mathematics", "Science", "Computing", "Social Science"].map((subj) => {
                const isActive = activeSubjectFilter === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setActiveSubjectFilter(subj)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap text-xs font-bold",
                      isActive
                        ? "bg-[#1E1B39] text-white border-[#1E1B39] shadow-xs"
                        : "bg-white text-[#6C6B80] border-[#E5E5F0] hover:border-[#1E1B39]/30"
                    )}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            {/* Course Table / Cards List */}
            {filteredCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCDCE8] p-8 text-center text-[#6C6B80]">
                <BookOpen className="w-8 h-8 mx-auto text-[#6541F5] opacity-50 mb-2" />
                <p className="text-sm font-bold text-[#1E1B39]">No lectures found for this filter</p>
                <p className="text-xs text-[#6C6B80] mt-1">Switch the filter or select a different grade above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((lesson, idx) => {
                  const theme = getSubjectTheme(lesson.subject);
                  const isCompleted = d.completed.includes(lesson.id);
                  const progressPct = isCompleted ? 100 : idx === 0 ? 60 : 25;

                  return (
                    <div
                      key={lesson.id}
                      className="rounded-2xl border border-[#EDEDF5] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6541F5]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shrink-0 border"
                          style={{ backgroundColor: theme.tint, color: theme.primary, borderColor: theme.border }}
                        >
                          {lesson.subject.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: theme.tint, color: theme.primary }}
                            >
                              {lesson.subject}
                            </span>
                            <span className="text-xs text-[#6C6B80] font-medium">
                              {lesson.chapter}
                            </span>
                            <span className="text-xs text-[#6C6B80] font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.durationMin}m
                            </span>
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-[#1E1B39] mt-1 truncate">
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-[#6C6B80] line-clamp-1 mt-0.5">
                            {lesson.summary}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Progress Bar & Action Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F0F8]">
                        <div className="w-28 sm:w-32 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-[#6C6B80]">
                            <span>Progress</span>
                            <span className="text-[#1E1B39]">{progressPct}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#EAEAF2] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${progressPct}%`,
                                backgroundColor: isCompleted ? "#19B99A" : "#6541F5",
                              }}
                            />
                          </div>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className={cn(
                            "h-9 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs",
                            isCompleted
                              ? "bg-[#19B99A] hover:bg-[#14997E] text-white"
                              : "bg-[#6541F5] hover:bg-[#5230E8] text-white"
                          )}
                        >
                          <Link to="/lesson/$id" params={{ id: lesson.id }}>
                            {isCompleted ? "Review" : "Continue"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* B. My Tasks Section (EduWay Style) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E9E9F2] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#1E1B39]">
                  My Class Tasks & Assignments
                </h3>
                <p className="text-xs sm:text-sm text-[#6C6B80] font-medium">
                  Track your chapter homework, revisions, and quiz submissions
                </p>
              </div>

              {/* Task Tabs */}
              <div className="flex items-center gap-1 bg-[#F4F4FA] p-1 rounded-xl border border-[#E5E5F0] self-start sm:self-auto">
                {(["All", "To do", "In progress", "Done"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTaskTab(tab)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      activeTaskTab === tab
                        ? "bg-[#1E1B39] text-white shadow-xs"
                        : "text-[#6C6B80] hover:text-[#1E1B39]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-[#EFEFF7] bg-[#FAFAFC] p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-white hover:border-[#6541F5]/30 transition-all"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6541F5]">
                        {task.subject}
                      </span>
                      <span className="text-xs text-[#8C8BA0]">·</span>
                      <span className="text-xs text-[#8C8BA0] font-medium">
                        Due: {task.due}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E1B39] truncate">
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-lg",
                        task.status === "Done"
                          ? "bg-[#E7F8F1] text-[#19B99A]"
                          : task.status === "In progress"
                          ? "bg-[#FFF4E5] text-[#FA6400]"
                          : "bg-[#F0EDFF] text-[#6541F5]"
                      )}
                    >
                      {task.status}
                    </span>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-[#6C6B80] hover:text-[#6541F5]"
                    >
                      <Link to="/lesson/$id" params={{ id: task.lessonId }}>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: 4 Columns on lg (Notes, Schedule, STEM Labs)             */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          {/* A. My Notes & Key Formulas (EduWay Style Sticky Notes) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E9E9F2] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-[#1E1B39]">
                My Notes & Key Concepts
              </h3>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-xl text-[#6541F5] hover:bg-[#6541F5]/10"
              >
                <Link to="/learn">
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {conceptNotes.map((note, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl p-4 border transition-transform hover:-translate-y-0.5",
                    note.theme
                  )}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{note.subject} concept</span>
                    <span>{note.date}</span>
                  </div>
                  <h4 className="font-black text-sm mt-1.5">{note.title}</h4>
                  <p className="text-xs font-medium leading-relaxed mt-1 opacity-90 line-clamp-3">
                    {note.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* B. My Schedule (EduWay Style Timetable) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E9E9F2] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-[#1E1B39]">
                Today's Schedule
              </h3>
              <span className="text-xs font-bold text-[#6541F5] bg-[#6541F5]/10 px-2.5 py-1 rounded-lg">
                Class {studentClass} Timetable
              </span>
            </div>

            <div className="space-y-2.5">
              {classSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#EDEDF5] bg-[#FBFBFE] p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-black text-[#6541F5] shrink-0 text-xs">
                      {item.time}
                    </span>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs sm:text-sm text-[#1E1B39] truncate">
                        {item.subject}
                      </h5>
                      <span className="text-[11px] text-[#7D7B93] block truncate">
                        {item.teacher}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#6C6B80] bg-white border border-[#E2E2EC] px-2 py-0.5 rounded-md shrink-0">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* C. STEM Interactive Studio Launcher (Growly "You Might Like It" Card) */}
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#6541F5] via-[#5230E8] to-[#3B1FC7] text-white shadow-lg shadow-[#6541F5]/25 space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-white/20 text-white hover:bg-white/25 border-0 font-bold text-xs px-2.5 py-0.5">
                Interactive Lab
              </Badge>
              <Gamepad2 className="w-5 h-5 text-white/80" />
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                PlayLab Physics & Games
              </h4>
              <p className="text-xs sm:text-sm text-white/85 font-medium mt-1 leading-relaxed">
                Play Newton's Carrom, Math Ludo, and MazeBot to test your Class {studentClass} physics and logic concepts.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center -space-x-2">
                {["A", "R", "S", "M"].map((ch, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full bg-white/30 border border-white/50 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  >
                    {ch}
                  </div>
                ))}
                <span className="text-xs font-semibold text-white/90 pl-3">
                  +18 playing
                </span>
              </div>

              <Button
                asChild
                size="sm"
                className="bg-white hover:bg-white/90 text-[#5230E8] font-bold text-xs h-8 px-4 rounded-xl shadow-sm"
              >
                <Link to="/playlab">Play Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
