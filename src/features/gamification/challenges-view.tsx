import { useState } from "react";
import {
  Target, Flame, Trophy, Sparkles, CheckCircle2, Clock, Lightbulb,
  Award, Shield, ArrowRight, Zap, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

export function ChallengesView() {
  const d = useDemo();
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const challengesList = [
    {
      id: "ch-daily-1",
      title: "Fraction Division Inversion Proof",
      category: "Daily Mission",
      subject: "Mathematics",
      difficulty: "Intermediate",
      rewardXp: 40,
      due: "Tonight 8:00 PM",
      offline: true,
      desc: "Explain why dividing by 1/2 is the same as multiplying by 2 using visual circles.",
      hint: "How many half-cups of water are needed to fill a 1-cup pitcher? Exactly 2!",
    },
    {
      id: "ch-circuit-2",
      title: "Zero-Resistance Hazard Inspection",
      category: "STEM Build",
      subject: "Science",
      difficulty: "Beginner",
      rewardXp: 60,
      due: "Thursday",
      offline: true,
      desc: "Demonstrate in CircuitVerse why connecting a battery directly to an LED without a resistor causes a burnout.",
      hint: "An LED has very small internal resistance. Without R, current I = V/R becomes unsafely huge.",
    },
    {
      id: "ch-code-3",
      title: "Optimized Loop Maze Runner",
      category: "Coding",
      subject: "Computing",
      difficulty: "Advanced",
      rewardXp: 80,
      due: "Saturday",
      offline: true,
      desc: "Reach the goal in CodeBot Maze using no more than 4 instruction blocks by utilizing repeat loops.",
      hint: "Look for repeating patterns of 'move forward'. Wrap them in a loop block.",
    },
    {
      id: "ch-team-4",
      title: "Class 7B School Clean Energy Quest",
      category: "Team Challenge",
      subject: "Environmental Science",
      difficulty: "Intermediate",
      rewardXp: 120,
      due: "Next Monday",
      offline: false,
      desc: "Document three solar energy implementations across Kalyan village with your team.",
      hint: "Check rooftop solar heaters, irrigation pump panels, and street lamp batteries.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challenges & Academic Mission Center"
        description="Earn XP, unlock rare astronaut badges, and prove conceptual mastery through interactive problem-solving quests."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
            <Target className="h-3 w-3" /> Gamified Quests
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
          <span className="text-xs text-muted-foreground">Completed Quests</span>
          <div className="text-2xl font-bold text-[#28B987] mt-1">{d.completedChallenges.length} Done</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
          <span className="text-xs text-muted-foreground">Available Quests</span>
          <div className="text-2xl font-bold text-[#6541F5] dark:text-[#7C5CFA] mt-1">{challengesList.length} Active</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
          <span className="text-xs text-muted-foreground">Potential Quest XP</span>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">+300 XP</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
          <span className="text-xs text-muted-foreground">Offline Ready</span>
          <div className="text-2xl font-bold text-[#28B987] mt-1">100% Cached</div>
        </div>
      </div>

      <div className="space-y-4">
        {challengesList.map((ch) => {
          const isCompleted = d.completedChallenges.includes(ch.id);

          return (
            <div
              key={ch.id}
              className={`rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isCompleted
                  ? "bg-[#DDF8EE]/30 dark:bg-[#19B99A]/10 border-[#28B987]/40 shadow-xs"
                  : "bg-card border-border hover:border-[#6541F5]/40 shadow-xs"
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#6541F5]/30 text-[#6541F5] dark:text-[#7C5CFA] text-[10px]">
                    {ch.category}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground">{ch.subject}</span>
                  {ch.offline && (
                    <span className="text-[10px] text-[#28B987] bg-[#DDF8EE] dark:bg-[#19B99A]/20 px-2 py-0.5 rounded font-medium">
                      Offline Capable ✓
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-foreground">{ch.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ch.desc}</p>

                {activeHintId === ch.id && (
                  <div className="rounded-lg bg-[#FFF0D5] dark:bg-[#F5A623]/15 border border-[#F5A623]/40 p-2.5 text-xs text-[#F5A623] flex items-center gap-2 mt-2 font-medium">
                    <Lightbulb className="h-4 w-4 shrink-0" />
                    <span>{ch.hint}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-right sm:mr-2">
                  <span className="font-mono font-bold text-sm text-[#F5A623] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> +{ch.rewardXp} XP
                  </span>
                  <span className="text-[10px] text-muted-foreground">Due: {ch.due}</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveHintId(activeHintId === ch.id ? null : ch.id)}
                  className="border-border text-xs h-8 text-foreground"
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#F5A623]" />
                  {activeHintId === ch.id ? "Hide Hint" : "Hint"}
                </Button>

                {isCompleted ? (
                  <Button size="sm" disabled className="bg-[#DDF8EE] dark:bg-[#19B99A]/20 text-[#28B987] border border-[#28B987]/30 text-xs h-8">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Completed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => d.completeChallenge(ch.id, ch.rewardXp, ch.title)}
                    className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs h-8 shadow-xs"
                  >
                    Solve Quest
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SimNote>
        Challenge completions earn verified XP and update the school leaderboard automatically upon sync.
      </SimNote>
    </div>
  );
}
