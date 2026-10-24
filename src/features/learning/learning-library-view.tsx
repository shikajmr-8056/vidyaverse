import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  Download,
  Cloud,
  Clock,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Code2,
  RefreshCw,
  X,
  Play,
  FileText,
  Gamepad2,
  SearchX,
  Check,
  ChevronRight,
  ListChecks,
  HardDriveDownload,
  SlidersHorizontal,
  LayoutGrid,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { DemoTag, PageHeader } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import {
  lessons,
  subjects,
  getSubjectTheme,
  learningPacks,
  type Subject,
  type Lesson,
  type CurriculumBoard,
  type Lang,
} from "@/data/demo";
import { useDemo, type DownloadState } from "@/lib/demo-store";
import { LessonThumbnailArt } from "@/components/vv/lesson-art";
import { cn } from "@/lib/utils";

// Pack mapping for offline subject collections
const packOf: Record<Subject, string> = {
  Mathematics: "pack-math7",
  Science: "pack-sci7",
  "Social Science": "pack-sst7",
  English: "pack-sst7",
  Computing: "pack-math7",
};

export function isLessonSaved(lesson: Lesson, downloads: Record<string, DownloadState>): boolean {
  if (downloads[lesson.id] === "saved") return true;
  if (lesson.packId && downloads[lesson.packId] === "saved") return true;
  const defaultPack = packOf[lesson.subject];
  return Boolean(defaultPack && downloads[defaultPack] === "saved" && lesson.classLevel === 7);
}

export function isLessonDownloading(lesson: Lesson, downloads: Record<string, DownloadState>): boolean {
  if (downloads[lesson.id] === "downloading") return true;
  if (lesson.packId && downloads[lesson.packId] === "downloading") return true;
  const defaultPack = packOf[lesson.subject];
  return Boolean(defaultPack && downloads[defaultPack] === "downloading" && lesson.classLevel === 7);
}

const subjectIcons: Record<Subject, React.ComponentType<{ className?: string }>> = {
  Mathematics: Calculator,
  Science: FlaskConical,
  English: BookOpen,
  "Social Science": Globe,
  Computing: Code2,
};

type ProgressStatusFilter = "All" | "completed" | "in-progress" | "not-started";
type SortOption = "curriculum" | "duration-asc" | "duration-desc" | "title-asc";

interface LearningLibraryViewProps {
  initialQuery?: string;
}

export function LearningLibraryView({ initialQuery = "" }: LearningLibraryViewProps) {
  const navigate = useNavigate();
  const d = useDemo();

  // Filters state
  const [q, setQ] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState<Subject | "All">("All");
  const [cls, setCls] = useState<string>(
    d.role === "student" && d.studentClass ? String(d.studentClass) : "All"
  );
  const [progressStatus, setProgressStatus] = useState<ProgressStatusFilter>("All");
  const [contentType, setContentType] = useState<string>("All");
  const [availability, setAvailability] = useState<"All" | "offline-only" | "online">("All");
  const [board, setBoard] = useState<CurriculumBoard | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("curriculum");
  const [viewLayout, setViewLayout] = useState<"chapters" | "grid">("chapters");

  // Filtered & sorted lessons
  const filteredLessons = useMemo(() => {
    const list = lessons.filter((l) => {
      // Board
      if (board !== "All" && l.board !== board) return false;
      // Class
      if (cls !== "All" && String(l.classLevel) !== cls) return false;
      // Subject
      if (selectedSubject !== "All" && l.subject !== selectedSubject) return false;
      // Format
      if (contentType !== "All" && l.type !== contentType) return false;

      // Progress status
      const isCompleted = d.completed.includes(l.id);
      if (progressStatus === "completed" && !isCompleted) return false;
      if (progressStatus === "not-started" && isCompleted) return false;
      // If in-progress, we check if chapter has partial progress
      if (progressStatus === "in-progress") {
        const chapterLessons = lessons.filter(
          (item) => item.chapter === l.chapter && item.subject === l.subject,
        );
        const hasChapterProgress = chapterLessons.some((item) => d.completed.includes(item.id));
        if (isCompleted || !hasChapterProgress) return false;
      }

      // Offline availability
      const isSaved = isLessonSaved(l, d.downloads);
      if (availability === "offline-only" && !isSaved) return false;
      if (availability === "online" && isSaved) return false;

      // Search query
      if (q.trim()) {
        const query = q.toLowerCase();
        const searchable = [
          l.title,
          l.chapter,
          l.subject,
          l.summary ?? "",
          ...l.objectives,
          ...l.notes,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "duration-asc") return a.durationMin - b.durationMin;
      if (sortBy === "duration-desc") return b.durationMin - a.durationMin;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      return 0; // default curriculum order
    });
  }, [board, cls, selectedSubject, contentType, progressStatus, availability, q, sortBy, d.completed, d.downloads]);

  // Group filtered lessons by chapter
  const chaptersInView = useMemo(() => {
    const set = new Set<string>();
    filteredLessons.forEach((l) => set.add(l.chapter));
    return Array.from(set);
  }, [filteredLessons]);

  // Reset all filters
  const resetFilters = () => {
    setQ("");
    setSelectedSubject("All");
    setCls("All");
    setProgressStatus("All");
    setContentType("All");
    setAvailability("All");
    setBoard("All");
    setSortBy("curriculum");
    navigate({ to: "/learn", search: {} });
  };

  const hasActiveFilters =
    q !== "" ||
    selectedSubject !== "All" ||
    cls !== "All" ||
    progressStatus !== "All" ||
    contentType !== "All" ||
    availability !== "All" ||
    board !== "All";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Page Header & Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DemoTag>NCERT &amp; State Syllabus</DemoTag>
              <span className="text-xs font-semibold text-muted-foreground">
                · {lessons.length} Learning Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Learning Library
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Explore interactive lessons across Mathematics, Science, Computing, and Social Studies.
              Download chapter packs to study anywhere without an internet connection.
            </p>
          </div>

          {/* Quick search input */}
          <div className="w-full md:w-80 relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-[#6541F5] focus:outline-none focus:ring-1 focus:ring-[#6541F5]"
              value={q}
              placeholder="Search concepts, chapters, formulas..."
              onChange={(e) => {
                const val = e.target.value;
                setQ(val);
                navigate({ to: "/learn", search: { q: val || undefined }, replace: true });
              }}
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  navigate({ to: "/learn", search: {} });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Clean Subject Filter Pills / Cards */}
      <section aria-labelledby="subjects-tabs-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="subjects-tabs-heading" className="text-sm font-bold text-foreground">
            Subject Navigation
          </h2>
          <span className="text-xs text-muted-foreground">
            {lessons.filter((l) => d.completed.includes(l.id)).length} of {lessons.length} finished
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(["All", ...subjects] as const).map((s) => {
            const isAll = s === "All";
            const isSelected = selectedSubject === s;
            const subLessons = isAll ? lessons : lessons.filter((l) => l.subject === s);
            const completedCount = subLessons.filter((l) => d.completed.includes(l.id)).length;
            const pct = subLessons.length > 0 ? Math.round((completedCount / subLessons.length) * 100) : 0;
            const theme = !isAll
              ? getSubjectTheme(s)
              : { primary: "#6541F5", tint: "#EAE7FF", border: "#6541F5" };
            const Icon = !isAll ? subjectIcons[s] : BookOpen;

            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={cn(
                  "flex flex-col text-left p-3.5 rounded-xl border transition-all shadow-sm",
                  isSelected
                    ? "border-[#6541F5] ring-2 ring-[#6541F5]/20 bg-card shadow-md"
                    : "border-border bg-card hover:border-[#6541F5]/40 hover:bg-[#F5F5FF]/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: theme.tint, color: theme.primary }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{pct}%</span>
                </div>

                <div className="mt-2.5">
                  <p className="font-bold text-xs text-foreground truncate">{isAll ? "All Subjects" : s}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {subLessons.length} {subLessons.length === 1 ? "lesson" : "lessons"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Streamlined Filter Controls Bar */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Filter &amp; Sort
          </div>

          <div className="flex items-center gap-3">
            {/* View layout toggle: Chapters or Flat Grid */}
            <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewLayout("chapters")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all",
                  viewLayout === "chapters"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="View grouped by chapters"
              >
                <Layers className="h-3.5 w-3.5" /> Chapters
              </button>
              <button
                type="button"
                onClick={() => setViewLayout("grid")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all",
                  viewLayout === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label="View as all lessons grid"
              >
                <LayoutGrid className="h-3.5 w-3.5" /> All Grid
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reset all
              </Button>
            )}
          </div>
        </div>

        {/* 5 Clean Dropdown Selectors */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 text-xs">
          {/* Grade / Class */}
          <label className="font-semibold text-muted-foreground">
            Grade / Class
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={cls}
              onChange={(e) => setCls(e.target.value)}
            >
              <option value="All">All Grades (6-8)</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>
          </label>

          {/* Progress Status */}
          <label className="font-semibold text-muted-foreground">
            Progress Status
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={progressStatus}
              onChange={(e) => setProgressStatus(e.target.value as ProgressStatusFilter)}
            >
              <option value="All">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed ✓</option>
            </select>
          </label>

          {/* Learning Type */}
          <label className="font-semibold text-muted-foreground">
            Learning Type
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="All">All Formats</option>
              <option value="Video">Video Lessons</option>
              <option value="Reading">Illustrated Reading</option>
              <option value="Activity">Interactive Activity</option>
            </select>
          </label>

          {/* Offline Storage */}
          <label className="font-semibold text-muted-foreground">
            Offline Storage
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={availability}
              onChange={(e) => setAvailability(e.target.value as "All" | "offline-only" | "online")}
            >
              <option value="All">All Storage</option>
              <option value="offline-only">Downloaded Only ✓</option>
              <option value="online">Online / Needs Download</option>
            </select>
          </label>

          {/* Sort By */}
          <label className="font-semibold text-muted-foreground">
            Sort Order
            <select
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-[#6541F5] focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="curriculum">Curriculum Syllabus</option>
              <option value="duration-asc">Duration (Shortest first)</option>
              <option value="duration-desc">Duration (Longest first)</option>
              <option value="title-asc">Title (A to Z)</option>
            </select>
          </label>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground border-t border-border/60">
          <span>
            Showing <strong>{filteredLessons.length}</strong> {filteredLessons.length === 1 ? "lesson" : "lessons"}
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] font-semibold text-[#6541F5]">Filtered results</span>
          )}
        </div>
      </section>

      {/* 4. Lesson Content Area */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          title="No lessons match these filters"
          description={
            availability === "offline-only"
              ? "You do not have any downloaded lessons matching this filter yet. Clear the filter or download packs for offline learning."
              : "Try choosing a different subject, grade level, or clearing your search query."
          }
          icon={SearchX}
          action={{
            label: "Reset all filters",
            onClick: resetFilters,
          }}
        />
      ) : viewLayout === "grid" ? (
        /* Flat Grid View: All lessons rendered in a responsive card grid */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <LessonCardItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        /* Chapters View: Organized by chapter syllabus with chapter pack action */
        <div className="space-y-8">
          {chaptersInView.map((chapterTitle) => {
            const chapterLessons = filteredLessons.filter((l) => l.chapter === chapterTitle);
            const firstLesson = chapterLessons[0]!;
            const theme = getSubjectTheme(firstLesson.subject);
            const chapterCompletedCount = chapterLessons.filter((l) => d.completed.includes(l.id)).length;
            const chapterPct = Math.round((chapterCompletedCount / chapterLessons.length) * 100);

            // Related chapter pack
            const pack =
              learningPacks.find((p) => p.id === firstLesson.packId) ||
              learningPacks.find((p) =>
                p.name.toLowerCase().includes(firstLesson.subject.toLowerCase().split(" ")[0] || ""),
              );
            const packState = pack ? d.downloads[pack.id] : undefined;

            return (
              <section
                key={chapterTitle}
                className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                {/* Chapter Header */}
                <div className="flex flex-col gap-3 pb-3 border-b border-border/70 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          backgroundColor: theme.tint,
                          color: theme.primary,
                          border: `1px solid ${theme.border}40`,
                        }}
                      >
                        {firstLesson.subject}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        Class {firstLesson.classLevel} · {firstLesson.board ?? "NCERT"}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-black text-foreground tracking-tight">
                      {chapterTitle}
                    </h3>
                    {firstLesson.summary && (
                      <p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                        {firstLesson.summary}
                      </p>
                    )}
                  </div>

                  {/* Chapter Progress & Offline Pack Download Action */}
                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">
                        {chapterCompletedCount} of {chapterLessons.length} finished
                      </p>
                      <div className="mt-1 w-28">
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${chapterPct}%`, backgroundColor: theme.primary }}
                          />
                        </div>
                      </div>
                    </div>

                    {pack && (
                      <Button
                        size="sm"
                        variant={packState === "saved" ? "secondary" : "outline"}
                        disabled={packState === "downloading"}
                        onClick={() => d.startDownload(pack.id)}
                        className={cn(
                          "h-8 text-xs font-bold min-h-[36px]",
                          packState === "saved" &&
                            "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 hover:bg-[#DDF8EE]",
                        )}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        {packState === "saved"
                          ? "Chapter Offline ✓"
                          : packState === "downloading"
                          ? "Downloading..."
                          : `Download Pack (${pack.sizeMb} MB)`}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Chapter Lesson Cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {chapterLessons.map((lesson) => (
                    <LessonCardItem key={lesson.id} lesson={lesson} />
                  ))}
                </div>

                {/* Chapter Footer Links: Assessment Quiz & STEM Sandbox */}
                <div className="pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs bg-muted/30 p-3 rounded-xl">
                  <div className="flex flex-wrap items-center gap-4">
                    {firstLesson.quizId && (
                      <Link
                        to="/quiz/$id"
                        params={{ id: firstLesson.quizId }}
                        className="inline-flex items-center gap-1.5 font-bold text-[#6541F5] hover:underline"
                      >
                        <ListChecks className="h-3.5 w-3.5 text-[#6541F5]" /> Chapter Assessment Quiz →
                      </Link>
                    )}
                    {firstLesson.stemActivity && (
                      <Link
                        to={firstLesson.stemActivity.route as any}
                        className="inline-flex items-center gap-1.5 font-bold text-[#19B99A] hover:underline"
                      >
                        <Gamepad2 className="h-3.5 w-3.5 text-[#19B99A]" /> {firstLesson.stemActivity.badge}:{" "}
                        {firstLesson.stemActivity.title} →
                      </Link>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Ver: {firstLesson.version ?? "v2.0.0"} · Multi-lingual Transcripts
                  </span>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Image-Led Lesson Card Item Component
 * Displays a stylized SVG illustration thumbnail, subject pill, progress status,
 * learning objectives, and action button.
 */
function LessonCardItem({ lesson }: { lesson: Lesson }) {
  const d = useDemo();
  const isCompleted = d.completed.includes(lesson.id);
  const isSaved = isLessonSaved(lesson, d.downloads);
  const isDownloading = isLessonDownloading(lesson, d.downloads);
  const theme = getSubjectTheme(lesson.subject);

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-2xl border bg-card shadow-sm transition-all overflow-hidden hover:shadow-md",
        isCompleted
          ? "border-[#19B99A]/30 hover:border-[#19B99A]/60"
          : "border-border hover:border-[#6541F5]/40",
      )}
    >
      <div>
        {/* Visual Thumbnail Art Header */}
        <div className="relative h-28 w-full border-b border-border/60 overflow-hidden">
          <LessonThumbnailArt lessonId={lesson.id} subject={lesson.subject} />

          {/* Top Floating Badge Bar */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-sm"
              style={{
                backgroundColor: theme.tint,
                color: theme.primary,
                border: `1px solid ${theme.border}40`,
              }}
            >
              {lesson.subject}
            </span>

            {/* Status Pill */}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#DDF8EE] px-2 py-0.5 text-[10px] font-bold text-[#19B99A] border border-[#19B99A]/40 shadow-xs">
                <CheckCircle2 className="h-3 w-3" /> Done
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/90 dark:bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-xs">
                {lesson.type} · {lesson.durationMin}m
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold">
            <span>Class {lesson.classLevel}</span>
            <span>·</span>
            <span className="truncate">{lesson.chapter}</span>
          </div>

          <Link
            to="/lesson/$id"
            params={{ id: lesson.id }}
            className="block font-bold text-sm text-foreground group-hover:text-[#6541F5] leading-snug transition-colors line-clamp-1"
          >
            {lesson.title}
          </Link>

          {/* Learning Objectives Preview */}
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Objectives:
            </p>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              {lesson.objectives.slice(0, 2).map((obj) => (
                <li key={obj} className="flex items-start gap-1.5 leading-snug">
                  <Check className="h-3 w-3 mt-0.5 shrink-0 text-[#19B99A]" />
                  <span className="line-clamp-1">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 mt-3">
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          {/* Offline / Storage Status Badge */}
          <div className="flex items-center gap-1.5">
            {isSaved ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#19B99A]">
                <HardDriveDownload className="h-3 w-3" /> Offline Cached
              </span>
            ) : isDownloading ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0284C7] animate-pulse">
                <Download className="h-3 w-3" /> Downloading...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Cloud className="h-3 w-3" /> Online ({lesson.sizeMb} MB)
              </span>
            )}
          </div>

          {/* Open Lesson Button */}
          <Button
            asChild
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            className={cn(
              "h-8 text-xs font-bold min-h-[36px]",
              isCompleted
                ? "border-border text-foreground hover:bg-muted"
                : "bg-[#6541F5] text-white hover:bg-[#5230E8]",
            )}
          >
            <Link to="/lesson/$id" params={{ id: lesson.id }}>
              {isCompleted ? "Review" : "Study"} <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
