import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  HeartHandshake, Sparkles, Trophy, BookOpen, Award, CheckCircle2,
  Smile, ShieldCheck, ArrowRight, Bell, Calendar, ThumbsUp,
  Clock, Lock, FolderGit2, Check, ExternalLink, Settings,
  AlertCircle, Info, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { demoStudent, achievements } from "@/data/demo";
import { toast } from "sonner";

export function ParentView() {
  const d = useDemo();

  // Notification and privacy toggle state
  const [notifyDigest, setNotifyDigest] = useState(true);
  const [notifyAssignments, setNotifyAssignments] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [pseudonymizeLeaderboard, setPseudonymizeLeaderboard] = useState(true);

  // Role check: Is user in Parent role?
  const isParentRole = d.role === "parent";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Guardian Portal: ${demoStudent.name}'s Learning Journey`}
        description="A supportive, task-oriented family overview designed for parents and guardians. Review authorized learning milestones and discover positive ways to guide learning at home."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8EE] px-3 py-1 text-xs font-bold text-[#19B99A]">
            <HeartHandshake className="h-3.5 w-3.5" /> Guardian Role · Linked Child: {demoStudent.name}
          </span>
        }
        actions={
          !isParentRole ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                d.set("role", "parent");
                toast.success("Switched to Parent / Guardian Role");
              }}
              className="border-[#19B99A] text-[#19B99A] hover:bg-[#DDF8EE] text-xs font-bold"
            >
              Switch to Guardian Demo
            </Button>
          ) : undefined
        }
      />

      {/* Role-Based Authorization & Privacy Boundary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/40 p-3.5 text-xs">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <ShieldCheck className="h-4 w-4 text-[#19B99A] shrink-0" />
          <span>
            <strong>Authorized Account Boundary:</strong> Linked strictly to {demoStudent.name} (Class {demoStudent.classLevel}{demoStudent.section}, {demoStudent.school}). Classmate records are private and restricted.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#19B99A]/40 bg-card dark:bg-[#19B99A]/15 text-[#19B99A] text-[10px]">
            Demo Family Profile
          </Badge>
          <span className="text-[11px] text-muted-foreground">Child Privacy Safe</span>
        </div>
      </div>

      {/* Encouragement & Weekly Overview Banner */}
      <div className="rounded-2xl border border-border card-surface p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDF8EE] text-[#19B99A] border border-[#19B99A]/30 shrink-0">
            <Smile className="h-8 w-8" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {demoStudent.name} has maintained a consistent learning routine!
              </h2>
              <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 text-xs">
                {demoStudent.streakDays}-Day Active Streak
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Ananya completed all scheduled classroom science activities this week, earned <strong>{d.xp} Academic XP</strong>, and accumulated <strong>{d.sparks} spendable Sparks</strong> for educational kit rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Activity & Home Support */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Subject Progress & Completed Projects */}
        <div className="lg:col-span-8 space-y-6">
          {/* Subject Progress Cards */}
          <Panel title="Subject Mastery & Syllabus Progress">
            <p className="text-xs text-muted-foreground mb-4">
              Real progress in approved NCERT Class 7 units:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-border bg-background space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#42A5E8]" /> Mathematics
                  </span>
                  <span className="font-bold text-[#42A5E8]">75% Mastered</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-[#42A5E8] h-full" style={{ width: "75%" }} />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Completed: "What a fraction really means" · Ch 2 Fractions & Decimals
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#19B99A]" /> Science
                  </span>
                  <span className="font-bold text-[#19B99A]">85% Mastered</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-[#19B99A] h-full" style={{ width: "85%" }} />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Completed: "Electric Current & Circuits" · Tested with CircuitVerse
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#6541F5]" /> Computing
                  </span>
                  <span className="font-bold text-[#6541F5]">80% Mastered</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-[#6541F5] h-full" style={{ width: "80%" }} />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Completed: CodeBot Maze 3 levels · Block algorithms & loops
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#F5A623]" /> Social Science
                  </span>
                  <span className="font-bold text-[#F5A623]">60% Mastered</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F5A623] h-full" style={{ width: "60%" }} />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Completed: Deccan Plateau filtration experiment
                </span>
              </div>
            </div>
          </Panel>

          {/* Hands-On STEM Projects Completed */}
          <Panel title="Completed STEM Projects & Experiments">
            <p className="text-xs text-muted-foreground mb-3">
              Practical portfolio projects completed by {demoStudent.name}:
            </p>
            <div className="space-y-3">
              {d.projects.map((proj) => (
                <div key={proj.id} className="rounded-xl border border-border card-surface p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{proj.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {proj.category}
                      </Badge>
                      <Badge className="bg-[#19B99A] text-white text-[10px]">
                        Teacher Verified
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xl">
                      {proj.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#6541F5]">+{proj.xpEarned} XP</span>
                    <span className="text-[10px] text-muted-foreground block">{proj.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Supportive Home Guidance (Non-Punitive & Practical) */}
          <Panel title="How You Can Support Learning at Home (No Device Needed)">
            <p className="text-xs text-muted-foreground mb-3">
              Simple, positive ways to reinforce syllabus concepts during everyday rural household activities:
            </p>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                <strong className="text-[#F5A623] block flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-4 w-4" /> Kitchen Math Activity (Fractions & Decimals):
                </strong>
                <p className="text-muted-foreground">
                  While preparing rotis or cutting vegetables, invite Ananya to show you what $1/2$ and $1/4$ look like. Ask her: <em>"If we have half a chapati and a quarter chapati, how many quarters do we have in total?"</em> Real-world tactile food examples cement denominator understanding.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                <strong className="text-[#6541F5] block flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-4 w-4" /> Flashlight & Sluice Gate Analogy (Science):
                </strong>
                <p className="text-muted-foreground">
                  When turning on the household torch, ask: <em>"Does the switch make electricity, or does it work like an irrigation canal gate?"</em> She will be proud to explain that the battery cell holds the energy while the switch only completes the loop!
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                <strong className="text-[#19B99A] block flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-4 w-4" /> Evening Shadow Observation (Light & Angles):
                </strong>
                <p className="text-muted-foreground">
                  Before sunset, ask her why shadows become very long in the late afternoon compared to midday. Connecting classroom science to real village sunsets builds lasting curiosity.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column (4 cols): Goals, Privacy, & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Learning Goals */}
          <Panel title="Upcoming School Tasks">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-background space-y-1.5">
                <div className="flex justify-between items-center font-bold text-foreground">
                  <span>Simple Circuits Check (Quiz)</span>
                  <Badge variant="outline" className="text-[10px] text-[#F5A623] border-[#F5A623]/30">
                    Due Fri
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  4-question assessment assigned by Mrs. Lakshmi for Class 7B.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-background space-y-1.5">
                <div className="flex justify-between items-center font-bold text-foreground">
                  <span>Math Ludo Team Tournament</span>
                  <Badge variant="outline" className="text-[10px] text-[#6541F5] border-[#6541F5]/30">
                    Due Mon
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Classroom collaborative board-game practice on fractions.
                </p>
              </div>
            </div>
          </Panel>

          {/* Child Privacy & Permission Settings */}
          <Panel title="Child Privacy & Permissions">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Leaderboard Privacy</span>
                  <span className="text-[11px] text-muted-foreground">
                    {pseudonymizeLeaderboard ? "Shown as 'Ananya R.' (Pseudonymized)" : "Hidden completely"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPseudonymizeLeaderboard(!pseudonymizeLeaderboard);
                    toast.success(
                      pseudonymizeLeaderboard
                        ? "Child hidden from public leaderboards"
                        : "Child set to pseudonymized initials"
                    );
                  }}
                  className="h-7 text-xs border-border"
                >
                  {pseudonymizeLeaderboard ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                  Toggle
                </Button>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <span className="font-bold text-foreground block">Communication Preferences:</span>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Weekly Progress SMS Digest</span>
                  <input
                    type="checkbox"
                    checked={notifyDigest}
                    onChange={(e) => setNotifyDigest(e.target.checked)}
                    className="accent-[#19B99A]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Assignment Due Reminders</span>
                  <input
                    type="checkbox"
                    checked={notifyAssignments}
                    onChange={(e) => setNotifyAssignments(e.target.checked)}
                    className="accent-[#19B99A]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Streak Milestone Celebrations</span>
                  <input
                    type="checkbox"
                    checked={notifyMilestones}
                    onChange={(e) => setNotifyMilestones(e.target.checked)}
                    className="accent-[#19B99A]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground space-y-1">
                <strong className="text-[#19B99A] flex items-center gap-1 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Zero Data Commercialization:
                </strong>
                <p>
                  VidyaVerse strictly enforces child privacy standards. No personal phone numbers, biometric scans, or Aadhaar numbers are collected.
                </p>
              </div>
            </div>
          </Panel>

          <SimNote>
            Guardian portal view grounded in verified student profile. Demo data safely contained in local storage.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
