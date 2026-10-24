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
  Layers,
  Award,
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
          "Offline-first, gamified STEM & curriculum learning platform built for rural and underserved students across India.",
      },
      { property: "og:title", content: "VidyaVerse · A Universe of Learning" },
      {
        property: "og:description",
        content:
          "Curriculum lessons, PlayLab games, CircuitVerse virtual breadboard, CodeVerse block algorithms and offline Learning Mesh.",
      },
    ],
  }),
  component: LandingPage,
});

function HeroOrbitalGraphic() {
  return (
    <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center">
      {/* Soft theme glow ring */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#6541F5]/10 via-[#D8D5FF]/30 to-[#F4B942]/10 blur-2xl" />

      {/* Orbit Rings & Satellites SVG */}
      <svg viewBox="0 0 400 400" className="relative z-10 h-full w-full" aria-hidden="true">
        {/* Orbital Ellipses */}
        <ellipse
          cx="200"
          cy="200"
          rx="170"
          ry="75"
          fill="none"
          stroke="#6541F5"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          opacity="0.35"
          transform="rotate(-25 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="145"
          ry="65"
          fill="none"
          stroke="#31B98A"
          strokeWidth="1.2"
          opacity="0.35"
          transform="rotate(35 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="180"
          ry="85"
          fill="none"
          stroke="#F4B942"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.35"
          transform="rotate(-65 200 200)"
        />

        {/* Core Hub Center Planet */}
        <circle cx="200" cy="200" r="44" fill="#5230E8" stroke="#6541F5" strokeWidth="2" />
        <circle cx="200" cy="200" r="34" fill="#6541F5" />
        <circle cx="200" cy="200" r="14" fill="#FFFFFF" opacity="0.9" />

        {/* Orbiting Satellite Node 1: CircuitVerse (Top-Left) */}
        <g transform="translate(60, 95)">
          <rect
            width="82"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#19B99A"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          <text x="41" y="24" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle">
            CircuitVerse
          </text>
          <circle cx="41" cy="34" r="2.5" fill="#19B99A" />
        </g>

        {/* Orbiting Satellite Node 2: CodeVerse (Top-Right) */}
        <g transform="translate(265, 75)">
          <rect
            width="84"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#6541F5"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          <text x="42" y="24" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle">
            CodeVerse
          </text>
          <text
            x="42"
            y="35"
            fill="#6541F5"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            step()
          </text>
        </g>

        {/* Orbiting Satellite Node 3: PlayLab (Bottom-Left) */}
        <g transform="translate(45, 235)">
          <rect
            width="82"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#F4B942"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          <text x="41" y="24" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle">
            PlayLab
          </text>
          <circle cx="41" cy="34" r="3" fill="#F4B942" />
        </g>

        {/* Orbiting Satellite Node 4: School Mesh (Bottom-Right) */}
        <g transform="translate(265, 245)">
          <rect
            width="88"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#6541F5"
            strokeWidth="1.5"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          />
          <text x="44" y="24" fill="#242438" fontSize="10" fontWeight="bold" textAnchor="middle">
            School Mesh
          </text>
          <circle cx="44" cy="34" r="2.5" fill="#31B98A" />
        </g>
      </svg>
    </div>
  );
}

function LandingPage() {
  const learningSteps = [
    {
      step: "01",
      title: "Interactive Lesson",
      desc: "Bite-sized NCERT concept modules grounded in everyday village analogies—like explaining fractions with chapatis.",
      icon: BookOpen,
      color: "#42A5E8",
      bg: "#DDF2FC",
    },
    {
      step: "02",
      title: "Diagnostic Practice",
      desc: "Low-stakes practice questions with our Concept Detective engine that pinpoints cognitive misconceptions immediately.",
      icon: Sparkles,
      color: "#6541F5",
      bg: "#EAE7FF",
    },
    {
      step: "03",
      title: "Hands-On Lab Simulation",
      desc: "Wire virtual Ohm's Law circuits in CircuitVerse, code rover paths in CodeVerse, or play physical board games in PlayLab.",
      icon: CircuitBoard,
      color: "#19B99A",
      bg: "#DDF8EE",
    },
    {
      step: "04",
      title: "Verified Progress",
      desc: "Earn Sparks rewards, track curriculum mastery, and submit STEM projects to earn teacher-approved certificates.",
      icon: Award,
      color: "#F5A623",
      bg: "#FFF0D5",
    },
  ];

  const features = [
    {
      title: "Curriculum-Mapped Lessons",
      desc: "Rigorous Mathematics, Science and Computing aligned to State and NCERT syllabi for Classes 5 through 8.",
      icon: BookOpen,
      tag: "NCERT Aligned",
      to: "/learn",
      color: "#42A5E8",
      bg: "#DDF2FC",
    },
    {
      title: "Gamified Practice & Sparks",
      desc: "Motivating daily challenges and lifetime XP that never resets. Redeem spendable Sparks for STEM kits in the Bazaar.",
      icon: Sparkles,
      tag: "Sparks Bazaar",
      to: "/challenges",
      color: "#6541F5",
      bg: "#EAE7FF",
    },
    {
      title: "PlayLab Physical & Digital Games",
      desc: "Math Ludo, CodeBot Maze, Newton's Race and Bharat Explorer. Designed for shared tablets or printable boards.",
      icon: Gamepad2,
      tag: "Zero-Screen Option",
      to: "/playlab",
      color: "#F4B942",
      bg: "#FFF0D5",
    },
    {
      title: "CircuitVerse Breadboard Lab",
      desc: "Virtual electronics simulator: connect cells, switches, resistors, and LEDs with live Ohm's law current calculations.",
      icon: CircuitBoard,
      tag: "Hands-on STEM",
      to: "/circuitverse",
      color: "#19B99A",
      bg: "#DDF8EE",
    },
    {
      title: "CodeVerse Visual Algorithms",
      desc: "Scratch-style block coding that smoothly bridges visual loops and logic into Python and Arduino C++ syntax.",
      icon: Code2,
      tag: "Block-to-Code",
      to: "/codeverse",
      color: "#6541F5",
      bg: "#EAE7FF",
    },
    {
      title: "Multilingual Audio & Offline Mesh",
      desc: "Learn in Kannada, Hindi, and English. Peer-to-peer Wi-Fi distributes interactive lessons with zero cellular recharge cost.",
      icon: Languages,
      tag: "Zero Cellular Data",
      to: "/mesh",
      color: "#E95778",
      bg: "#FCE5EB",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Compact Header */}
      <PublicHeader />

      <main>
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden mx-auto max-w-6xl px-4 py-14 sm:py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D5FF] bg-[#D8D5FF]/35 px-3 py-1 text-xs font-semibold text-[#5230E8] dark:border-[#7C5CFA]/30 dark:bg-[#7C5CFA]/15 dark:text-[#D8D5FF]">
                <Sparkles className="h-3.5 w-3.5 text-[#6541F5]" />
                <span>Offline-First STEM & Curriculum Platform for Rural Schools</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                A Universe of <span className="text-[#6541F5] dark:text-[#7C5CFA]">Learning.</span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Empowering government schools and rural learners across India with hands-on science,
                virtual electronics, coding, and educational games—built to run flawlessly even with
                zero internet.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold px-6 shadow-sm shadow-[#6541F5]/25 text-xs sm:text-sm"
                >
                  <Link to="/auth">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-border bg-card text-foreground hover:bg-[#F4F2FF] hover:border-[#6541F5]/40 text-xs sm:text-sm"
                >
                  <Link to="/learn">Explore Curriculum</Link>
                </Button>
              </div>

              {/* Value Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Languages className="h-4 w-4 text-[#6541F5]" /> Kannada, Hindi & English
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-[#F4B942]" /> Child Privacy By Design
                </span>
              </div>
            </div>

            <HeroOrbitalGraphic />
          </div>
        </section>

        {/* 3. Feature Overview Section */}
        <section className="border-y border-border bg-[#F4F2FF]/40 dark:bg-card/40 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6541F5] dark:text-[#7C5CFA]">
                Comprehensive STEM Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Everything Learners Need to Discover & Build
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                From textbook mastery to virtual circuitry and algorithmic thinking, VidyaVerse
                bridges theory with authentic practice.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm hover:border-[#6541F5]/60 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                          style={{ backgroundColor: f.bg, color: f.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {f.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-foreground mb-2">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/70">
                      <Link
                        to={f.to}
                        className="text-xs font-bold text-[#6541F5] hover:underline inline-flex items-center gap-1"
                      >
                        Launch Module <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Simple Learning Journey Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#19B99A]">
              Step-by-Step Pedagogy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              The 4-Step VidyaVerse Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Designed to take rural students from initial curiosity to verified mastery without
              fear of failure.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-muted-foreground/35 font-mono">
                        {s.step}
                      </span>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border text-[10px]">
                        →
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. How VidyaVerse Supports Limited Connectivity */}
        <section className="border-t border-border bg-[#F5F5FF]/50 dark:bg-card/30 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 md:p-12 shadow-sm">
              <div className="grid gap-10 lg:grid-cols-2 items-center">
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#31B98A]">
                      Infrastructure Independence
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                      Designed for Zero-Cellular Realities
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Commercial edtech relies on fast 4G internet and continuous phone
                    recharges—costs that exclude underserved families. VidyaVerse uses
                    solar-assisted school micro-servers to broadcast lessons over a local Wi-Fi
                    bubble.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Zero Mobile Data Costs: </strong>
                        Students stream full curriculum videos, audio guides, and simulations from
                        the local school hub without burning phone data.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Fair Offline Sync: </strong>
                        Quizzes taken at home queue safely on device storage with tamper-resistant
                        timestamps, reconciling automatically when the student walks back into the
                        school Wi-Fi range.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-[#31B98A] shrink-0 mt-0.5" />
                      <div>
                        <strong>Teacher Diagnostic Action: </strong>
                        Teachers view cohort performance heatmaps, identify learning gaps, and
                        assign practicals directly on the offline classroom mesh.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs h-9 shadow-sm"
                    >
                      <Link to="/mesh">Inspect Mesh Network Architecture</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-border text-xs font-semibold h-9"
                    >
                      <Link to="/auth" search={{ role: "teacher" }}>
                        Educator Hub View
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Micro-Hub Simulation Diagram Card */}
                <div className="rounded-2xl border border-border bg-[#F5F5FF] dark:bg-[#12121A] p-6 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-[#6541F5]" />
                      <span className="font-bold text-xs text-foreground">
                        Kalyan School Micro-Hub
                      </span>
                    </div>
                    <Badge className="bg-[#31B98A]/15 text-[#31B98A] border-[#31B98A]/30 text-[10px]">
                      Mesh Active
                    </Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-[#6541F5] dark:text-[#7C5CFA] block">
                        24 Student Tablets Streaming
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Local Signal · 54 Mbps Transfer Rate
                      </span>
                    </div>
                    <span className="font-bold text-[#31B98A] text-xs">₹0 Mobile Cost</span>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-[#F4B942] block">Local NCERT Cache</span>
                      <span className="text-[10px] text-muted-foreground">
                        400+ Units, Voice Packs & Simulations
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">
                      128 GB NVMe
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-[#19B99A] block">Autonomous Power</span>
                      <span className="text-[10px] text-muted-foreground">
                        Runs on 12V Solar Battery during Load Shedding
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#19B99A]">8h Backup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholder Portal Selection Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6541F5] dark:text-[#7C5CFA]">
              Role-Based Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Choose Your Learning Experience
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select your persona to access tailored curriculum tools, diagnostic analytics, or family engagement views.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-[#6541F5]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAE7FF] text-[#6541F5]">
                    <User className="h-5 w-5" />
                  </span>
                  <Badge variant="outline" className="border-[#6541F5]/30 text-[#6541F5] text-[10px]">
                    Grades 5–8
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Student Explorer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Resume interactive lessons, earn Sparks in quizzes, explore CircuitVerse, and code algorithms.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-border/70">
                <Button asChild size="sm" className="w-full bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold">
                  <Link to="/auth" search={{ role: "student" }}>
                    Enter Student Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-[#19B99A]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF8EE] text-[#19B99A]">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <Badge variant="outline" className="border-[#19B99A]/30 text-[#19B99A] text-[10px]">
                    Educators
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Teacher Portal</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monitor class competency heatmaps, assign quizzes, detect misconceptions, and audit offline sync.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-border/70">
                <Button asChild size="sm" variant="outline" className="w-full border-[#19B99A]/40 text-[#19B99A] hover:bg-[#DDF8EE]/40 text-xs font-bold">
                  <Link to="/auth" search={{ role: "teacher" }}>
                    Enter Teacher Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-[#F5A623]/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0D5] text-[#F5A623]">
                    <HeartHandshake className="h-5 w-5" />
                  </span>
                  <Badge variant="outline" className="border-[#F5A623]/30 text-[#F5A623] text-[10px]">
                    Guardians
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-foreground">Parent / Guardian</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track your linked child's attendance, completed STEM activities, and teacher notifications safely.
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-border/70">
                <Button asChild size="sm" variant="outline" className="w-full border-[#F5A623]/40 text-[#F5A623] hover:bg-[#FFF0D5]/40 text-xs font-bold">
                  <Link to="/auth" search={{ role: "parent" }}>
                    Enter Parent Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Concise Footer */}
      <PublicFooter />
    </div>
  );
}
