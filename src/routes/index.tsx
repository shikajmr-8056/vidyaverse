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

function HeroStudentArchShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[480px] group select-none">
      {/* Subtle outer glow */}
      <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-tr from-[#5037ED]/15 via-[#3B82F6]/15 to-[#FA6400]/10 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Main Reference Card Container */}
      <div className="relative overflow-hidden rounded-[36px] border border-border/80 bg-card/90 dark:bg-card/95 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        {/* Decorative Doodles matching reference */}
        {/* 1. Top-Left Blue Scribble Wave */}
        <svg
          className="absolute top-5 left-6 w-9 h-9 text-[#2563EB] dark:text-[#3B82F6] pointer-events-none drop-shadow-xs"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M 6 12 C 12 6, 16 16, 22 10 C 28 4, 32 14, 36 8 C 40 4, 38 20, 32 20 C 26 20, 20 28, 26 30 C 30 32, 34 28, 36 26" />
        </svg>

        {/* 2. Left Curved Swoop Line */}
        <svg
          className="absolute top-12 left-10 w-44 h-44 text-[#3B82F6]/40 pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M 8 28 Q 55 12 85 45" />
        </svg>

        {/* 3. Middle-Left Dot Matrix */}
        <div className="absolute left-6 top-1/2 -translate-y-8 grid grid-cols-4 gap-1.5 opacity-70 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
          ))}
        </div>

        {/* 4. Middle-Right Curved Arrow Doodle */}
        <svg
          className="absolute right-4 sm:right-6 top-1/2 translate-y-6 w-11 h-11 text-[#2563EB] dark:text-[#3B82F6] pointer-events-none"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M 38 12 C 34 26, 20 28, 12 38" />
          <path d="M 12 28 L 12 38 L 22 38" />
        </svg>

        {/* Floating Badge 1 (Top-Right): "More than 800,000+ students" with Avatars */}
        <div className="absolute top-5 right-4 sm:right-6 z-20 flex items-center gap-2.5 rounded-2xl bg-[#2563EB] text-white px-3.5 py-2.5 shadow-xl border border-white/20 transition-transform group-hover:scale-[1.02]">
          <div className="flex -space-x-2 shrink-0">
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Student"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Student"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
              alt="Student"
            />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#2563EB] font-black text-[11px] ring-2 ring-white">
              +
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold leading-tight">
            More than 800,000+
            <span className="block font-medium opacity-90">students</span>
          </div>
        </div>

        {/* Floating Badge 2 (Middle-Right): "Best Collaboration" Pill Button */}
        <div className="absolute top-1/2 right-2 sm:right-4 z-20 -translate-y-4 inline-flex items-center gap-2 rounded-full bg-[#2563EB] text-white px-3.5 py-2 shadow-xl border border-white/20 text-xs font-bold tracking-tight transition-transform group-hover:scale-[1.02]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
          </span>
          <span>Best Collaboration</span>
        </div>

        {/* Central Arch Portrait Frame of Class 5 Student */}
        <div className="relative mx-auto mt-4 mb-2 w-[240px] sm:w-[280px] aspect-[3/4] overflow-hidden rounded-t-[130px] sm:rounded-t-[150px] rounded-b-[36px] bg-gradient-to-b from-[#EAE7FF] via-[#F5F5FF] to-muted dark:from-[#1E1B39] dark:to-muted border-2 border-white/80 dark:border-border shadow-lg">
          <img
            src="/class-5-student.jpg"
            alt="Class 5 Student smiling confidently with folded arms in school uniform"
            className="w-full h-full object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-500"
            loading="eager"
          />
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

            {/* Right Student Arch Visual matching reference */}
            <div className="lg:col-span-5">
              <HeroStudentArchShowcase />
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
