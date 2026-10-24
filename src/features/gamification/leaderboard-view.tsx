import { useState } from "react";
import {
  Trophy, Medal, Sparkles, Flame, ShieldAlert, Clock, Info,
  Users, School, Calendar, RefreshCw, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

export function LeaderboardView() {
  const d = useDemo();
  const [scope, setScope] = useState<"class" | "school" | "team">("class");
  const [timeframe, setTimeframe] = useState<"weekly" | "lifetime">("weekly");

  const weeklyRankings = [
    { rank: 1, name: "Pooja H.", avatar: "PH", xp: 340, streak: 8, missions: 5, offlineSynced: true, change: "+2" },
    { rank: 2, name: `You (${demoStudent.name})`, avatar: "AR", xp: d.weeklyXp, streak: demoStudent.streakDays, missions: 4, offlineSynced: d.pendingSyncCount === 0, change: "0" },
    { rank: 3, name: "Ravi K.", avatar: "RK", xp: 285, streak: 6, missions: 3, offlineSynced: true, change: "-1" },
    { rank: 4, name: "Suresh G.", avatar: "SG", xp: 240, streak: 5, missions: 3, offlineSynced: false, change: "+1" },
    { rank: 5, name: "Kiran D.", avatar: "KD", xp: 190, streak: 3, missions: 2, offlineSynced: false, change: "-1" },
    { rank: 6, name: "Meena B.", avatar: "MB", xp: 175, streak: 4, missions: 2, offlineSynced: true, change: "0" },
  ];

  const lifetimeRankings = [
    { rank: 1, name: `You (${demoStudent.name})`, avatar: "AR", xp: d.xp, streak: demoStudent.streakDays, level: d.level, title: "Grand Cadet" },
    { rank: 2, name: "Pooja H.", avatar: "PH", xp: 1340, streak: 8, level: 6, title: "Circuit Master" },
    { rank: 3, name: "Ravi K.", avatar: "RK", xp: 1190, streak: 6, level: 5, title: "Maze Runner" },
    { rank: 4, name: "Suresh G.", avatar: "SG", xp: 1100, streak: 5, level: 5, title: "Math Explorer" },
    { rank: 5, name: "Kiran D.", avatar: "KD", xp: 950, streak: 3, level: 4, title: "Apprentice" },
    { rank: 6, name: "Meena B.", avatar: "MB", xp: 880, streak: 4, level: 4, title: "Explorer" },
  ];

  const currentList = timeframe === "weekly" ? weeklyRankings : lifetimeRankings;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard: Cosmic Academic Standings"
        description="Celebrate consistent daily effort. Engineered with fair offline reconciliation so students without continuous data are never penalized."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
            <Trophy className="h-3 w-3" /> Gamified Standings
          </span>
        }
      />

      {/* Scope and Timeframe Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between card-surface p-4 rounded-xl border border-border shadow-sm">
        {/* Scope: Class vs School vs Team */}
        <div className="flex rounded-lg border border-border bg-background p-1 w-full sm:w-auto">
          {(["class", "school", "team"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`flex-1 sm:flex-none rounded-md px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                scope === s ? "bg-[#6541F5] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "class" ? "Class 7B" : s === "school" ? "Kalyan GHPS" : "Team Alpha"}
            </button>
          ))}
        </div>

        {/* Timeframe: Weekly vs Lifetime */}
        <div className="flex rounded-lg border border-border bg-background p-1 w-full sm:w-auto">
          {(["weekly", "lifetime"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`flex-1 sm:flex-none rounded-md px-4 py-1.5 text-xs font-bold capitalize transition-all ${
                timeframe === t ? "bg-[#F5A623] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "weekly" ? "Weekly Cup" : "Lifetime XP"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Rankings Table */}
        <div className="lg:col-span-8 card-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#F5A623]" /> Standings ({timeframe === "weekly" ? "Week 41, 2026" : "All Time"})
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Next weekly cycle in 3 days</span>
          </div>

          <div className="space-y-2.5">
            {currentList.map((item, idx) => {
              const isUser = item.name.includes("You");

              const rankStyles =
                idx === 0
                  ? { bg: "#FFF0D5", text: "#F5A623", border: "#F5A623", label: "🥇" }
                  : idx === 1
                  ? { bg: "#DDF2FC", text: "#42A5E8", border: "#42A5E8", label: "🥈" }
                  : idx === 2
                  ? { bg: "#FCE5EB", text: "#E95778", border: "#E95778", label: "🥉" }
                  : { bg: "transparent", text: "#77778D", border: "transparent", label: `${idx + 1}` };

              const avatarColors = ["#6541F5", "#42A5E8", "#19B99A", "#F5A623", "#E95778"];
              const avatarBgs = ["#EAE7FF", "#DDF2FC", "#DDF8EE", "#FFF0D5", "#FCE5EB"];
              const aColor = avatarColors[idx % avatarColors.length]!;
              const aBg = avatarBgs[idx % avatarBgs.length]!;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all ${
                    isUser
                      ? "bg-[#EAE7FF]/60 border-[#6541F5] shadow-sm"
                      : idx % 2 === 0
                      ? "bg-card border-border"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className="font-mono font-bold text-sm w-7 text-center">
                      {rankStyles.label}
                    </div>

                    {/* Avatar */}
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: aBg, color: aColor }}
                    >
                      {item.avatar}
                    </div>

                    <div>
                      <span className={`font-bold block text-sm ${isUser ? "text-[#5230E8]" : "text-foreground"}`}>
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Streak: {item.streak} days · {timeframe === "weekly" ? `${(item as any).missions} missions` : `Lvl ${(item as any).level}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {timeframe === "weekly" && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          (item as any).offlineSynced
                            ? "bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30"
                            : "bg-[#FFF0D5] text-[#F5A623] border border-[#F5A623]/30"
                        }`}
                      >
                        {(item as any).offlineSynced ? "Synced ✓" : "Offline Queued"}
                      </span>
                    )}

                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-foreground block">
                        {item.xp.toLocaleString("en-IN")} XP
                      </span>
                      {timeframe === "weekly" && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {(item as any).change === "0" ? "–" : (item as any).change} this week
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Fair Offline Competition Policy */}
        <div className="lg:col-span-4 space-y-6">
          <Panel
            title={
              <span className="inline-flex items-center gap-2 text-foreground font-bold">
                <ShieldAlert className="h-4 w-4 text-[#42A5E8]" /> Fair Offline Policy
              </span>
            }
          >
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">1. Lifetime XP is Strictly Monotonic:</strong> Your total XP never resets with weekly leaderboard updates. It tracks cumulative mastery and permanent level progression ({d.xp.toLocaleString("en-IN")} XP earned to date).
              </p>
              <p>
                <strong className="text-foreground">2. Transparent 72h Late-Sync Window:</strong> Activity completed offline carries local ISO timestamps. If synced within a 72-hour grace period of cycle cutoff, points apply retroactively to that week's cup. Past 72 hours, points are credited 100% to Lifetime XP.
              </p>
              <p>
                <strong className="text-foreground">3. Zero Data Penalty:</strong> Students are never docked rank for delayed network connectivity. Unsynced work is clearly designated as "Offline Queued" until the school hub reconciles.
              </p>
            </div>
          </Panel>

          {/* Historical Snapshot */}
          <Panel title="Historical Snapshots">
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl card-surface border border-border flex justify-between">
                <span className="font-medium text-muted-foreground">Week 40 Champion</span>
                <span className="font-bold text-[#F5A623]">Ravi K. (380 XP)</span>
              </div>
              <div className="p-3 rounded-xl card-surface border border-border flex justify-between">
                <span className="font-medium text-muted-foreground">Week 39 Champion</span>
                <span className="font-bold text-[#6541F5]">Ananya R. (410 XP)</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
