import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  CircuitBoard,
  Code2,
  Sparkles,
  Languages,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  User,
  ShieldCheck,
  Server,
  Award,
  Flame,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicFooter, PublicHeader } from "@/components/vv/public-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VidyaVerse · A Universe of Learning" },
      {
        name: "description",
        content:
          "Offline-first, gamified STEM & curriculum learning platform built for school students across India.",
      },
      { property: "og:title", content: "VidyaVerse · A Universe of Learning" },
      {
        property: "og:description",
        content:
          "NCERT curriculum lessons, PlayLab physics games, CircuitVerse breadboard, and CodeVerse algorithms.",
      },
    ],
  }),
  component: LandingPage,
});

function HeroInteractivePreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Soft theme glow ring */}
      <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-[#5037ED]/15 via-[#6541F5]/10 to-[#FA6400]/10 blur-xl" />

      {/* Main Elevated Preview Card inspired by modern EdTech dashboards */}
      <div className="relative rounded-[28px] border border-border/80 bg-card p-5 sm:p-6 shadow-xl text-card-foreground space-y-4">
        {/* Card Header with Student Profile */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FFE7D6] via-[#FFF3EA] to-[#EAE7FF] p-1 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none" aria-hidden="true">
                <circle cx="28" cy="24" r="13" fill="#3D2314" />
                <circle cx="72" cy="24" r="13" fill="#3D2314" />
                <ellipse cx="50" cy="40" rx="22" ry="22" fill="#99603D" />
                <circle cx="41" cy="39" r="2.8" fill="#1C1008" />
                <circle cx="59" cy="39" r="2.8" fill="#1C1008" />
                <path d="M 44 49 Q 50 54 56 49" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 32 68 Q 50 72 68 68 L 74 100 L 26 100 Z" fill="#F5A623" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">Ananya R.</h3>
              <span className="text-xs text-muted-foreground font-medium">Class 7 · Kalyan School</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FA6400]/10 text-[#FA6400] text-xs font-bold">
              <Flame className="h-3.5 w-3.5 fill-current" /> 6 Day Streak
            </span>
          </div>
        </div>

        {/* Current Active Lesson Card */}
        <div className="rounded-2xl border border-[#EDEDF5] bg-[#F7F7FC] dark:bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-[#5037ED] text-white text-xs font-bold px-2.5 py-0.5">
              Active Lecture
            </Badge>
            <span className="text-xs font-bold text-[#5037ED]">Mathematics</span>
          </div>

          <div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              What a Fraction Really Means
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chapter 2 · Fractions & Decimals (NCERT)
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Lecture Progress</span>
              <span>65%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full bg-[#5037ED] rounded-full w-[65%]" />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Duration: 12 Mins</span>
            <Button
              asChild
              size="sm"
              className="bg-[#FA6400] hover:bg-[#E55B00] text-white font-bold text-xs h-8 px-4 rounded-xl shadow-xs"
            >
              <Link to="/lesson/$id" params={{ id: "fractions-intro" }}>
                Resume <Play className="ml-1 h-3 w-3 fill-current" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Studio Shortcut Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <Link
            to="/playlab"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#FA6400] transition-colors group"
          >
            <Gamepad2 className="h-5 w-5 mx-auto text-[#FA6400] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground block">PlayLab</span>
            <span className="text-[10px] text-muted-foreground">Physics Games</span>
          </Link>

          <Link
            to="/circuitverse"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#19B99A] transition-colors group"
          >
            <CircuitBoard className="h-5 w-5 mx-auto text-[#19B99A] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground block">Circuits</span>
            <span className="text-[10px] text-muted-foreground">Virtual Wire Lab</span>
          </Link>

          <Link
            to="/codeverse"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#5037ED] transition-colors group"
          >
            <Code2 className="h-5 w-5 mx-auto text-[#5037ED] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground block">CodeVerse</span>
            <span className="text-[10px] text-muted-foreground">Block Rover</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const learningSteps = [
    {
      step: "01",
      title: "Select Your Grade",
      desc: "Instant access to syllabus-aligned Mathematics and Science curated specifically for Classes 5 through 10.",
      icon: BookOpen,
      color: "#42A5E8",
      bg: "#DDF2FC",
    },
    {
      step: "02",
      title: "Interactive Concept Practice",
      desc: "Diagnostic practice questions that explain why answers work without penalizing exploratory learning.",
      icon: Sparkles,
      color: "#5037ED",
      bg: "#EAE7FF",
    },
    {
      step: "03",
      title: "Hands-On Experiments",
      desc: "Simulate Newton's laws in Carrom, wire circuits in CircuitVerse, and program algorithm steps in CodeVerse.",
      icon: CircuitBoard,
      color: "#19B99A",
      bg: "#DDF8EE",
    },
    {
      step: "04",
      title: "Offline Sync & Mastery",
      desc: "Collect Sparks, complete daily challenges, and sync progress automatically when near school Wi-Fi.",
      icon: Award,
      color: "#FA6400",
      bg: "#FFF0D5",
    },
  ];

  const features = [
    {
      title: "Curriculum-Mapped Lectures",
      desc: "Structured Mathematics, Science, and Computing aligned with State and NCERT textbooks for Classes 5 to 10.",
      icon: BookOpen,
      tag: "Classes 5–10",
      to: "/learn",
      color: "#42A5E8",
      bg: "#DDF2FC",
    },
    {
      title: "PlayLab Educational Games",
      desc: "Newton's Carrom physics simulation, Math Ludo, MazeBot algorithms, and Bharat Explorer geography map.",
      icon: Gamepad2,
      tag: "Interactive Physics",
      to: "/playlab",
      color: "#FA6400",
      bg: "#FFF0D5",
    },
    {
      title: "CircuitVerse Electronics Lab",
      desc: "Virtual breadboard workspace: wire cells, switches, resistors, and LEDs with live Ohm's law calculations.",
      icon: CircuitBoard,
      tag: "Virtual Hardware",
      to: "/circuitverse",
      color: "#19B99A",
      bg: "#DDF8EE",
    },
    {
      title: "CodeVerse Visual Programming",
      desc: "Visual block coding and step-by-step algorithms that teach loops, conditionals, and computational logic.",
      icon: Code2,
      tag: "Coding Logic",
      to: "/codeverse",
      color: "#5037ED",
      bg: "#EAE7FF",
    },
    {
      title: "AI Concept Tutor & Voice",
      desc: "Bite-sized step scaffolding and voice read-aloud available in Kannada, Hindi, and English.",
      icon: Languages,
      tag: "Multilingual",
      to: "/tutor",
      color: "#E95778",
      bg: "#FCE5EB",
    },
    {
      title: "Offline Learning Mesh",
      desc: "Peer-to-peer Wi-Fi distributes interactive lessons and synchronizes quiz attempts with zero mobile data.",
      icon: Zap,
      tag: "Zero Cellular Data",
      to: "/mesh",
      color: "#31B98A",
      bg: "#DDF8EE",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* 1. Header Navigation */}
      <PublicHeader />

      <main className="flex-1 space-y-12 sm:space-y-16">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden mx-auto max-w-6xl px-4 pt-10 sm:pt-14 pb-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5037ED]/25 bg-[#5037ED]/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-[#5037ED]">
                <Sparkles className="h-4 w-4" />
                <span>Curriculum-Aligned STEM Platform · Classes 5 to 10</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                A Modern Universe of{" "}
                <span className="text-[#5037ED]">Learning & Exploration.</span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Empowering students across India with hands-on science simulations, virtual
                electronics, coding, and educational games—built to run seamlessly online and offline.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#5037ED] hover:bg-[#432BCF] text-white font-bold px-7 rounded-2xl shadow-md shadow-[#5037ED]/30 text-sm h-12"
                >
                  <Link to="/auth">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-border bg-card text-foreground hover:bg-muted font-bold text-sm h-12 px-6 rounded-2xl"
                >
                  <Link to="/learn">Browse Syllabus</Link>
                </Button>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Languages className="h-4 w-4 text-[#5037ED]" /> Kannada, Hindi & English
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-[#31B98A]" /> Child Safe & Private
                </span>
              </div>
            </div>

            {/* Right Interactive Dashboard Preview */}
            <div className="lg:col-span-5">
              <HeroInteractivePreview />
            </div>
          </div>
        </section>

        {/* 3. Core Learning Studios Section */}
        <section className="border-y border-border bg-card/40 py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5037ED]">
                Interactive STEM Studios
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Everything Learners Need to Discover & Build
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                From textbook theory to virtual electronics and computational thinking.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs hover:border-[#5037ED]/50 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl shadow-xs"
                          style={{ backgroundColor: f.bg, color: f.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {f.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-foreground mb-1.5">{f.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <Link
                        to={f.to}
                        className="text-xs sm:text-sm font-bold text-[#5037ED] hover:underline inline-flex items-center gap-1"
                      >
                        Launch Studio <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Pedagogical Flow Section */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:py-12 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#19B99A]">
              Step-by-Step Learning
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              How Students Learn & Master Concepts
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built to transition students from initial curiosity to verified mastery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                        {s.step}
                      </span>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Stakeholder Portals */}
        <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5037ED]">
                Role-Based Portals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Tailored Experiences for Everyone
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Choose your portal to enter student lessons, educator analytics, or guardian insights.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border p-5 hover:border-[#5037ED]/60 transition-all flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE7FF] text-[#5037ED]">
                      <User className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="border-[#5037ED]/30 text-[#5037ED] text-xs">
                      Classes 5–10
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">Student Portal</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Interactive lectures, quizzes, PlayLab games, CircuitVerse breadboards, and CodeVerse rovers.
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/60">
                  <Button asChild size="sm" className="w-full bg-[#5037ED] hover:bg-[#432BCF] text-white text-xs sm:text-sm font-bold h-9">
                    <Link to="/auth" search={{ role: "student" }}>
                      Enter Student Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-5 hover:border-[#19B99A]/60 transition-all flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF8EE] text-[#19B99A]">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="border-[#19B99A]/30 text-[#19B99A] text-xs">
                      Educators
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">Teacher Portal</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Classroom roster management, concept misconception diagnostics, and offline sync logs.
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/60">
                  <Button asChild size="sm" variant="outline" className="w-full border-[#19B99A]/40 text-[#19B99A] hover:bg-[#DDF8EE]/40 text-xs sm:text-sm font-bold h-9">
                    <Link to="/auth" search={{ role: "teacher" }}>
                      Enter Teacher Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-5 hover:border-[#FA6400]/60 transition-all flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0D5] text-[#FA6400]">
                      <HeartHandshake className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="border-[#FA6400]/30 text-[#FA6400] text-xs">
                      Guardians
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">Parent Portal</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Track your child's weekly activity, completed chapters, and learning hours transparently.
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/60">
                  <Button asChild size="sm" variant="outline" className="w-full border-[#FA6400]/40 text-[#FA6400] hover:bg-[#FFF0D5]/40 text-xs sm:text-sm font-bold h-9">
                    <Link to="/auth" search={{ role: "parent" }}>
                      Enter Parent Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Professional Footer */}
      <PublicFooter />
    </div>
  );
}
