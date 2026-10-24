import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  ListChecks,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Subtitles,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Languages,
  HardDriveDownload,
  Cloud,
  Check,
  AlertTriangle,
  Gamepad2,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoTag, Meter, Panel } from "@/components/vv/primitives";
import {
  lessons,
  learningPacks,
  getSubjectTheme,
  type Lesson,
  type Lang,
} from "@/data/demo";
import { useDemo } from "@/lib/demo-store";
import { isLessonSaved, isLessonDownloading } from "./learning-library-view";
import { cn } from "@/lib/utils";

interface LessonViewProps {
  lesson: Lesson;
}

export function LessonView({ lesson }: LessonViewProps) {
  const d = useDemo();

  // Chapter context & navigation
  const chapter = lessons.filter((l) => l.chapter === lesson.chapter);
  const idx = chapter.findIndex((l) => l.id === lesson.id);
  const prev = chapter[idx - 1];
  const next = chapter[idx + 1];
  const isCompleted = d.completed.includes(lesson.id);
  const chapterDone = chapter.filter((l) => d.completed.includes(l.id)).length;
  const theme = getSubjectTheme(lesson.subject);

  // Storage & Offline state
  const isSaved = isLessonSaved(lesson, d.downloads);
  const isDownloading = isLessonDownloading(lesson, d.downloads);
  const isOfflineMode = d.networkMode === "offline";
  const pack = learningPacks.find((p) => p.id === lesson.packId) ||
    learningPacks.find((p) => p.name.toLowerCase().includes(lesson.subject.toLowerCase().split(" ")[0] || ""));

  // Video / Interactive Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(145);
  const totalDurationSec = (lesson.durationMin ?? 12) * 60;
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "examples" | "practice" | "transcript">("content");
  const [transcriptLang, setTranscriptLang] = useState<Lang>(d.language ?? "en");

  // In-lesson Guided Practice interactive state
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  // Simulated video playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeSec((t) => {
          if (t >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return t + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Caption text for player overlay
  const activeCaption =
    lesson.transcript?.[transcriptLang] ??
    lesson.transcript?.en ??
    lesson.notes[0] ??
    "Video explanation running. Follow along with interactive notes below.";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Accessible Lesson Header */}
      <div>
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum Library
        </Link>

        {/* Board, Subject & Chapter Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2.5 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: theme.tint,
              color: theme.primary,
              border: `1px solid ${theme.border}40`,
            }}
          >
            {lesson.subject}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">· {lesson.chapter}</span>
          <Badge variant="outline" className="text-[10px] font-bold border-border bg-card">
            {lesson.board ?? "NCERT"} · Class {lesson.classLevel}
          </Badge>
          <span className="text-[11px] text-muted-foreground ml-auto font-medium">
            Ver: {lesson.version ?? "v2.1.0"}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-2 text-2xl font-black text-foreground md:text-3xl tracking-tight">
          {lesson.title}
        </h1>

        {/* Chapter Progress Bar */}
        <div className="mt-3 flex max-w-md items-center gap-3 text-xs text-muted-foreground">
          <Meter
            value={(chapterDone / chapter.length) * 100}
            label="Chapter progress"
            tone={theme.meterTone}
          />
          <span className="shrink-0 font-bold text-foreground">
            Lesson {idx + 1} of {chapter.length}
          </span>
        </div>
      </div>

      {/* Offline Mode Warning when content is not downloaded */}
      {isOfflineMode && !isSaved && (
        <div className="flex items-start gap-3 rounded-xl border border-[#F5A623]/40 bg-[#FFF0D5]/50 p-4 text-xs text-[#B45309]">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#F5A623]" />
          <div>
            <p className="font-bold">Offline Device Notice</p>
            <p className="mt-0.5">
              You are currently in offline mode and this specific lesson is not yet cached on this device. Connect to the school mesh or Wi-Fi to download it for offline study.
            </p>
          </div>
        </div>
      )}

      {/* 2. Primary Learning Area & Interactive Player */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Main Visual Player Canvas with Controls */}
          <div className="card-surface overflow-hidden rounded-2xl border border-border shadow-sm">
            {/* Visual Player Display */}
            <div className="relative aspect-video bg-neutral-950 flex flex-col items-center justify-center p-6 text-center select-none">
              {/* Play / Pause Overlay Icon */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#6541F5]/90 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 fill-current" />
                ) : (
                  <Play className="h-7 w-7 fill-current translate-x-0.5" />
                )}
              </button>

              <div className="mt-4">
                <p className="font-bold text-sm text-white">{lesson.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isPlaying ? "Playing interactive lesson" : "Tap play to begin audio-visual explanation"}
                </p>
              </div>

              {/* Subtitles Overlay Bar */}
              {showCaptions && (
                <div className="absolute bottom-14 left-4 right-4 rounded-lg bg-black/85 px-4 py-2 text-xs text-white/95 backdrop-blur-sm line-clamp-2">
                  <span className="text-[10px] font-bold text-[#F4B942] uppercase mr-1">
                    CC [{transcriptLang.toUpperCase()}]:
                  </span>
                  {activeCaption}
                </div>
              )}

              {/* Video Scrubber & Playback Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6 flex flex-col gap-2">
                {/* Progress Scrubber */}
                <div className="flex items-center gap-2 text-[10px] text-white/80 font-mono">
                  <span>{formatTime(currentTimeSec)}</span>
                  <input
                    type="range"
                    min={0}
                    max={totalDurationSec}
                    value={currentTimeSec}
                    onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer accent-[#6541F5] bg-neutral-700 rounded-lg"
                    aria-label="Seek video position"
                  />
                  <span>{formatTime(totalDurationSec)}</span>
                </div>

                {/* Secondary Controls Bar: Speed, CC, Audio, Fullscreen */}
                <div className="flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 hover:text-white"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTimeSec(0)}
                      className="p-1 hover:text-white"
                      aria-label="Replay from start"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 hover:text-white"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-white/60">Speed:</span>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="bg-neutral-800 rounded px-1.5 py-0.5 text-[11px] text-white border-0 focus:outline-none"
                      >
                        <option value={0.75}>0.75x</option>
                        <option value={1.0}>1.0x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>
                    </div>

                    {/* Captions Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowCaptions(!showCaptions)}
                      className={cn(
                        "flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors",
                        showCaptions ? "bg-[#6541F5] text-white" : "text-white/60 hover:text-white",
                      )}
                      aria-label="Toggle subtitles"
                    >
                      <Subtitles className="h-3.5 w-3.5" /> CC
                    </button>

                    {/* Language for captions */}
                    <select
                      value={transcriptLang}
                      onChange={(e) => setTranscriptLang(e.target.value as Lang)}
                      className="bg-neutral-800 rounded px-1.5 py-0.5 text-[11px] text-white border-0 focus:outline-none"
                    >
                      <option value="en">EN</option>
                      <option value="hi">HI</option>
                      <option value="kn">KN</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Seven-Part Chapter Content Tabs */}
          <div className="space-y-4">
            {/* Tab Navigation Buttons */}
            <div className="flex flex-wrap gap-1.5 border-b border-border pb-2" role="tablist">
              {[
                { id: "content", label: "Objectives & Notes", icon: BookOpen },
                { id: "examples", label: "Worked Examples", icon: Lightbulb },
                { id: "practice", label: "Guided Practice", icon: CheckCircle2 },
                { id: "transcript", label: "Full Transcript", icon: Languages },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#6541F5] text-white shadow-sm"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Objectives & Notes */}
            {activeTab === "content" && (
              <div className="space-y-5">
                {/* Concept Summary & Learning Objectives */}
                <Panel title="What you will learn">
                  {lesson.summary && (
                    <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                      {lesson.summary}
                    </p>
                  )}
                  <ul className="space-y-2 text-xs">
                    {lesson.objectives.map((obj) => (
                      <li key={obj} className="flex items-start gap-2 text-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#19B99A]" />
                        <span className="leading-snug">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>

                {/* Key Syllabus Notes */}
                <Panel title="Core syllabus notes">
                  <ol className="space-y-3">
                    {lesson.notes.map((n, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#EAE7FF] text-xs font-bold text-[#6541F5]">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{n}</span>
                      </li>
                    ))}
                  </ol>
                </Panel>

                {/* Key Term Definitions */}
                {lesson.definitions && lesson.definitions.length > 0 && (
                  <Panel title="Definitions & key terms">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {lesson.definitions.map((def) => (
                        <div key={def.term} className="rounded-xl border border-border bg-card p-3">
                          <p className="font-bold text-xs text-[#6541F5]">{def.term}</p>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            {def.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}
              </div>
            )}

            {/* Tab 2: Worked Examples */}
            {activeTab === "examples" && (
              <div className="space-y-4">
                {lesson.examples && lesson.examples.length > 0 ? (
                  lesson.examples.map((ex, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#6541F5] text-white text-[10px]">Example {i + 1}</Badge>
                        <h4 className="font-bold text-sm text-foreground">{ex.title}</h4>
                      </div>
                      <div className="rounded-lg bg-[#F5F5FF] p-3 text-xs text-foreground font-medium">
                        <span className="font-bold text-[#5230E8] block mb-1">Problem:</span>
                        {ex.problem}
                      </div>
                      <div className="rounded-lg bg-[#DDF8EE]/60 border border-[#19B99A]/30 p-3 text-xs text-[#0F766E] leading-relaxed">
                        <span className="font-bold block mb-1">Step-by-Step Solution:</span>
                        {ex.solution}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground card-surface rounded-xl border border-border">
                    No worked examples recorded for this module yet. Review the core syllabus notes.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: In-Lesson Guided Practice Interactive Check */}
            {activeTab === "practice" && (
              <div className="space-y-4">
                {lesson.guidedPractice ? (
                  <div className="card-surface p-5 rounded-xl border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#6541F5]" />
                      <h4 className="font-bold text-sm text-foreground">
                        Quick Concept Check (In-Lesson Practice)
                      </h4>
                    </div>

                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      {lesson.guidedPractice.prompt}
                    </p>

                    <div className="space-y-2">
                      {lesson.guidedPractice.options.map((opt, i) => {
                        const isChosen = practiceAnswer === i;
                        const isCorrect = i === lesson.guidedPractice?.correctIndex;

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={practiceSubmitted}
                            onClick={() => setPracticeAnswer(i)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-between",
                              !practiceSubmitted && isChosen && "border-[#6541F5] bg-[#EAE7FF]/40 text-[#6541F5] font-bold",
                              !practiceSubmitted && !isChosen && "border-border bg-card hover:bg-muted text-foreground",
                              practiceSubmitted && isCorrect && "border-[#19B99A] bg-[#DDF8EE] text-[#19B99A] font-bold",
                              practiceSubmitted && isChosen && !isCorrect && "border-[#E11D48] bg-[#FFE4E6] text-[#E11D48] font-bold",
                              practiceSubmitted && !isChosen && !isCorrect && "border-border bg-card text-muted-foreground opacity-60",
                            )}
                          >
                            <span>{opt}</span>
                            {practiceSubmitted && isCorrect && <Check className="h-4 w-4 text-[#19B99A]" />}
                          </button>
                        );
                      })}
                    </div>

                    {practiceSubmitted && (
                      <div
                        className={cn(
                          "rounded-lg p-3 text-xs leading-relaxed",
                          practiceAnswer === lesson.guidedPractice.correctIndex
                            ? "bg-[#DDF8EE] text-[#19B99A] font-semibold"
                            : "bg-[#FFF0D5] text-[#B45309]",
                        )}
                      >
                        <p className="font-bold">
                          {practiceAnswer === lesson.guidedPractice.correctIndex ? "Correct! 🎯" : "Explanation:"}
                        </p>
                        <p className="mt-0.5">{lesson.guidedPractice.explanation}</p>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end pt-2">
                      {!practiceSubmitted ? (
                        <Button
                          size="sm"
                          disabled={practiceAnswer === null}
                          onClick={() => setPracticeSubmitted(true)}
                          className="bg-[#6541F5] text-white hover:bg-[#5230E8] text-xs font-bold"
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPracticeSubmitted(false);
                            setPracticeAnswer(null);
                          }}
                          className="text-xs font-semibold"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground card-surface rounded-xl border border-border">
                    Guided practice checkpoint is being calibrated for this lesson. Proceed to the chapter assessment quiz.
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Full Multilingual Transcript */}
            {activeTab === "transcript" && (
              <div className="card-surface p-5 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Lesson Transcript
                  </h4>
                  <div className="flex gap-1">
                    {(["en", "hi", "kn"] as const).map((langCode) => (
                      <button
                        key={langCode}
                        onClick={() => setTranscriptLang(langCode)}
                        className={cn(
                          "px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors",
                          transcriptLang === langCode
                            ? "bg-[#6541F5] text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {langCode === "en" ? "English" : langCode === "hi" ? "हिंदी" : "ಕನ್ನಡ"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-card border border-border p-4 text-xs text-foreground leading-relaxed space-y-2">
                  <p>{lesson.transcript?.[transcriptLang] ?? lesson.transcript?.en ?? "Full transcript available."}</p>
                </div>
              </div>
            )}
          </div>

          {/* 4. Lesson Navigation Footer Flow (Previous / Next Lesson) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
            {prev ? (
              <Button asChild variant="outline" className="text-xs font-semibold">
                <Link to="/lesson/$id" params={{ id: prev.id }}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous: {prev.title}
                </Link>
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground font-medium">First lesson in chapter</span>
            )}
            {next ? (
              <Button asChild variant="outline" className="text-xs font-semibold">
                <Link to="/lesson/$id" params={{ id: next.id }}>
                  Next: {next.title} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground font-medium">Last lesson in chapter</span>
            )}
          </div>
        </div>

        {/* 5. Sidebar: Completion, Quiz, STEM Activity & Offline Storage Controls */}
        <div className="space-y-6">
          {/* Action Card: Complete & Progress */}
          <div className="card-surface space-y-3.5 p-5 rounded-2xl border border-border shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lesson Completion
            </h3>

            <Button
              className={cn(
                "w-full text-xs font-bold shadow-sm transition-all",
                isCompleted
                  ? "bg-[#DDF8EE] text-[#19B99A] hover:bg-[#DDF8EE] border border-[#19B99A]/40"
                  : "bg-[#6541F5] text-white hover:bg-[#5230E8]",
              )}
              disabled={isCompleted}
              onClick={() => d.completeLesson(lesson.id)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {isCompleted ? "Completed ✓ (+25 XP Recorded)" : "Mark as Completed (+25 XP)"}
            </Button>

            {/* Assessment Quiz Direct Link */}
            {lesson.quizId && (
              <Button asChild variant="outline" className="w-full text-xs font-bold border-[#6541F5]/40 text-[#6541F5] hover:bg-[#EAE7FF]/30">
                <Link to="/quiz/$id" params={{ id: lesson.quizId }}>
                  <ListChecks className="h-4 w-4 mr-1.5" /> Take Practice Quiz
                </Link>
              </Button>
            )}

            <p className="text-[11px] text-muted-foreground text-center">
              Completing this lesson updates your syllabus progress and records XP idempotently.
            </p>
          </div>

          {/* Offline Storage & Download Controls */}
          <Panel title="Offline Device Storage">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Storage State:</span>
                {isSaved ? (
                  <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 text-[10px] font-bold">
                    Stored in Local Cache ✓
                  </Badge>
                ) : isDownloading ? (
                  <Badge className="bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/40 text-[10px] font-bold animate-pulse">
                    Downloading...
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Online Only (Needs Download)
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>File Size:</span>
                <span className="font-semibold text-foreground">{lesson.sizeMb} MB</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Languages Cached:</span>
                <span className="font-semibold text-foreground">EN, HI, KN</span>
              </div>

              {/* Download or Remove Button */}
              {isSaved ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => d.removeDownload(lesson.id)}
                  className="w-full text-xs font-semibold text-muted-foreground hover:text-destructive"
                >
                  Clear Cached Storage
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isDownloading}
                  onClick={() => d.startDownload(lesson.id)}
                  className="w-full text-xs font-bold border-[#19B99A]/40 text-[#19B99A] hover:bg-[#DDF8EE]/30"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  {isDownloading ? "Downloading (Simulated)..." : `Download for Offline Use (${lesson.sizeMb} MB)`}
                </Button>
              )}
            </div>
          </Panel>

          {/* Related STEM Exploration Card (PlayLab / CircuitVerse / CodeVerse) */}
          {lesson.stemActivity && (
            <div className="card-surface p-4.5 rounded-2xl border border-border shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6541F5]">
                <Gamepad2 className="h-4 w-4" />
                <span>Related STEM Sandbox</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{lesson.stemActivity.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lesson.stemActivity.description}
              </p>
              <Button asChild size="sm" className="w-full bg-[#19B99A] text-white hover:bg-[#19B99A]/90 text-xs font-bold mt-1">
                <Link to={lesson.stemActivity.route as any}>
                  Open {lesson.stemActivity.badge} →
                </Link>
              </Button>
            </div>
          )}

          {/* Related Lessons in this Subject */}
          <Panel title="Related in this subject">
            <ul className="space-y-2 text-xs">
              {lessons
                .filter((l) => l.subject === lesson.subject && l.id !== lesson.id)
                .slice(0, 3)
                .map((l) => (
                  <li key={l.id}>
                    <Link
                      to="/lesson/$id"
                      params={{ id: l.id }}
                      className="text-[#6541F5] font-semibold hover:underline block truncate"
                    >
                      {l.title}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">{l.chapter}</span>
                  </li>
                ))}
            </ul>
          </Panel>

          {/* Representative Curriculum Disclaimer */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-1 font-bold text-foreground mb-1">
              <Info className="h-3 w-3 text-[#6541F5]" /> Sample Curriculum Notice
            </div>
            Content shown is a verified representative syllabus sample aligned with NCERT & State Board learning standards.
          </div>
        </div>
      </div>
    </div>
  );
}
