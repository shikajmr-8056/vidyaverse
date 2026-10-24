import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  TrendingUp, Award, CheckCircle2,
  AlertTriangle, Target, Clock, ArrowRight, Brain, Zap,
  BookOpen, Sparkles, BarChart3
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, Meter } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { achievements } from "@/data/demo";

const progressTrendData = [
  { week: "W1", science: 65, math: 50, computing: 60 },
  { week: "W2", science: 72, math: 60, computing: 70 },
  { week: "W3", science: 80, math: 68, computing: 82 },
  { week: "W4", science: 88, math: 74, computing: 85 },
  { week: "W5", science: 92, math: 80, computing: 88 },
  { week: "W6", science: 95, math: 85, computing: 92 },
];

const weeklyActivityData = [
  { day: "Mon", minutes: 35, xp: 85 },
  { day: "Tue", minutes: 48, xp: 110 },
  { day: "Wed", minutes: 25, xp: 60 },
  { day: "Thu", minutes: 55, xp: 140 },
  { day: "Fri", minutes: 40, xp: 95 },
  { day: "Sat", minutes: 65, xp: 160 },
  { day: "Sun", minutes: 30, xp: 70 },
];

export function ProgressView() {
  const d = useDemo();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const masteryTopics = [
    { name: "Closed vs Open Circuits", subject: "Science", mastery: 95, status: "Mastered", color: "#19B99A", bg: "#DDF8EE" },
    { name: "Fraction Multiplication", subject: "Mathematics", mastery: 85, status: "Strong", color: "#42A5E8", bg: "#DDF2FC" },
    { name: "Algorithm Sequencing", subject: "Computing", mastery: 90, status: "Mastered", color: "#6541F5", bg: "#EAE7FF" },
    { name: "Deccan Plateau Geography", subject: "Social Science", mastery: 68, status: "Review Recommended", color: "#F5A623", bg: "#FFF0D5" },
    { name: "Decimal Place Values (0.5 vs 0.45)", subject: "Mathematics", mastery: 50, status: "Needs Practice", color: "#E95778", bg: "#FCE5EB" },
  ];

  const quizHistory = [
    { date: "10 Oct 2026", quiz: "Simple Circuits Diagnostic", score: "100%", xp: "+30 XP", verified: true, color: "#19B99A", bg: "#DDF8EE" },
    { date: "7 Oct 2026", quiz: "Fractions Mastery Test", score: "75%", xp: "+20 XP", verified: true, color: "#42A5E8", bg: "#DDF2FC" },
    { date: "4 Oct 2026", quiz: "Plateau Landforms Check", score: "80%", xp: "+25 XP", verified: true, color: "#F5A623", bg: "#FFF0D5" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Progress & Academic Analytics"
        description="Comprehensive diagnostic view of curriculum competencies, concept strengths, and targeted revision advice."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
            <Sparkles className="h-3 w-3" /> Mastery Intelligence
          </span>
        }
      />

      {/* 1. Colorful Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Curriculum Completion (Purple) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Curriculum Completion</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAE7FF] text-[#6541F5]">
                <BookOpen className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">72%</div>
            <div className="mt-2.5">
              <Meter value={72} tone="purple" label="Curriculum" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-medium">18 of 25 chapters completed</p>
        </div>

        {/* Card 2: Concept Mastery Index (Teal) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Concept Mastery Index</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF8EE] text-[#19B99A]">
                <Target className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-[#19B99A] mt-2">84% Average</div>
            <div className="mt-2.5">
              <Meter value={84} tone="teal" label="Mastery" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-medium">Verified by Concept Detective</p>
        </div>

        {/* Card 3: Study Engagement (Blue) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Study Engagement</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF2FC] text-[#42A5E8]">
                <Clock className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-[#42A5E8] mt-2">4.2 Hrs / Wk</div>
            <div className="mt-2.5">
              <Meter value={70} tone="blue" label="Time" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-medium">Supporting metric, active learning</p>
        </div>

        {/* Card 4: STEM Projects (Orange) */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">STEM Portfolios</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0D5] text-[#F5A623]">
                <Zap className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="text-2xl font-black text-[#F5A623] mt-2">{d.projects.length} Portfolios</div>
            <div className="mt-2.5">
              <Meter value={80} tone="orange" label="Projects" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-medium">Hardware & Code combined</p>
        </div>
      </div>

      {/* 2. Charts Row: Weekly Activity & Mastery Progression */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity Area Chart */}
        <div className="card-surface p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#42A5E8]" /> Weekly Study Trends
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Minutes studied vs XP earned (last 7 days)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-[#42A5E8]" /> Minutes
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-[#E95778]" /> XP
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progMin" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#42A5E8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#42A5E8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="progXp" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#E95778" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E95778" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-foreground)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#42A5E8" strokeWidth={2.5} fillOpacity={1} fill="url(#progMin)" name="Minutes" />
                  <Area type="monotone" dataKey="xp" stroke="#E95778" strokeWidth={2.5} fillOpacity={1} fill="url(#progXp)" name="XP" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading activity trends...
              </div>
            )}
          </div>
        </div>

        {/* Mastery Progression Trends (Recharts) */}
        <div className="card-surface p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#6541F5]" /> Mastery Progression Over Time
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Tracking syllabus mastery trajectory</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-[#19B99A]" /> Science
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-[#42A5E8]" /> Math
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="h-2 w-2 rounded-full bg-[#6541F5]" /> Computing
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis domain={[40, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-foreground)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  />
                  <Line type="monotone" dataKey="science" stroke="#19B99A" strokeWidth={2.5} dot={{ r: 4 }} name="Science" />
                  <Line type="monotone" dataKey="math" stroke="#42A5E8" strokeWidth={2.5} dot={{ r: 4 }} name="Mathematics" />
                  <Line type="monotone" dataKey="computing" stroke="#6541F5" strokeWidth={2.5} dot={{ r: 4 }} name="Computing" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading progress trends...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Topic Competency Heatmap & Diagnostics History */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Panel title="Topic Competency Matrix">
            <div className="space-y-3">
              {masteryTopics.map((topic) => (
                <div key={topic.name} className="card-surface p-3.5 rounded-xl border border-border shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-foreground">{topic.name}</span>
                      <span className="text-muted-foreground text-[11px] ml-2">({topic.subject})</span>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-bold"
                      style={{ color: topic.color, backgroundColor: topic.bg, border: `1px solid ${topic.color}30` }}
                    >
                      {topic.status} · {topic.mastery}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.mastery}%`, backgroundColor: topic.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Quiz Performance Log */}
          <Panel title="Verified Quiz Diagnostics History">
            <div className="space-y-2.5 text-xs">
              {quizHistory.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl card-surface border border-border shadow-sm">
                  <div>
                    <span className="font-bold text-foreground block">{q.quiz}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">{q.date} · Offline Synced via School Mesh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm" style={{ color: q.color }}>{q.score}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{ color: q.color, backgroundColor: q.bg, border: `1px solid ${q.color}30` }}
                    >
                      {q.xp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right: Revision Recommendations & Badges */}
        <div className="lg:col-span-4 space-y-6">
          <Panel
            title={
              <span className="inline-flex items-center gap-2 text-foreground font-bold">
                <Brain className="h-4 w-4 text-[#F5A623]" /> Recommended Revisions
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-[#E95778]/30 bg-[#FCE5EB] dark:bg-[#E95778]/15 p-3.5 text-[#E95778] space-y-1">
                <span className="font-bold block text-sm">1. Decimal Place Value</span>
                <p className="text-[11px] text-foreground leading-relaxed">
                  Detected misconception in 0.45 vs 0.5 comparison. Revise Tenths vs Hundredths concept.
                </p>
                <Link to="/tutor" search={{ q: "Which is greater 0.5 or 0.45?" }} className="inline-block text-[11px] font-bold underline mt-1 text-[#6541F5] dark:text-[#7C5CFA]">
                  Ask AI Tutor Analogy →
                </Link>
              </div>

              <div className="rounded-xl border border-[#42A5E8]/30 bg-[#DDF2FC] dark:bg-[#42A5E8]/15 p-3.5 text-[#42A5E8] space-y-1">
                <span className="font-bold block text-sm">2. River Direction Dynamics</span>
                <p className="text-[11px] text-foreground leading-relaxed">
                  Review why the Deccan plateau slope sends Krishna &amp; Kaveri eastward into Bay of Bengal.
                </p>
                <Link to="/lesson/$id" params={{ id: "rivers-india" }} className="inline-block text-[11px] font-bold underline mt-1 text-[#6541F5] dark:text-[#7C5CFA]">
                  Watch 13-min Lesson Video →
                </Link>
              </div>
            </div>
          </Panel>

          {/* Unlocked Badges */}
          <Panel title="Achievements Earned">
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {achievements.map((a, i) => {
                const unlocked = d.unlocked.includes(a.id);
                const colors = ["#F5A623", "#42A5E8", "#19B99A", "#6541F5"];
                const bgs = ["#FFF0D5", "#DDF2FC", "#DDF8EE", "#EAE7FF"];
                const c = colors[i % colors.length]!;
                const bg = bgs[i % bgs.length]!;

                return (
                  <div
                    key={a.id}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      unlocked
                        ? "card-surface border-border shadow-sm"
                        : "bg-muted/40 border-border opacity-40"
                    }`}
                  >
                    <span
                      className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-xs"
                      style={{ backgroundColor: unlocked ? bg : undefined, color: unlocked ? c : undefined }}
                    >
                      <Award className="h-4 w-4" />
                    </span>
                    <span className="font-bold block truncate text-[11px] text-foreground">{a.name}</span>
                    <span className="text-[10px] block text-muted-foreground truncate">{unlocked ? "Unlocked" : "Locked"}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
