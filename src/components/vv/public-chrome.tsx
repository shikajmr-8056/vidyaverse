import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Logo } from "@/components/vv/primitives";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" aria-label="VidyaVerse home" className="shrink-0">
          <Logo />
        </Link>

        {/* Product Navigation */}
        <nav
          aria-label="Public"
          className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex"
        >
          <Link to="/learn" className="hover:text-foreground transition-colors">
            Curriculum
          </Link>
          <Link to="/playlab" className="hover:text-foreground transition-colors">
            PlayLab Games
          </Link>
          <Link to="/circuitverse" className="hover:text-foreground transition-colors">
            Electronics Lab
          </Link>
          <Link to="/codeverse" className="hover:text-foreground transition-colors">
            Code Studio
          </Link>
          <Link to="/mesh" className="hover:text-foreground transition-colors">
            Offline Mesh
          </Link>
        </nav>

        {/* Auth CTA Actions: Sign in and Get Started */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#5037ED] hover:bg-[#432BCF] text-white text-sm font-bold px-4 rounded-xl shadow-sm shadow-[#5037ED]/25"
          >
            <Link to="/auth" search={{ mode: "register" }}>
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  const [accessOpen, setAccessOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6 text-sm">
        {/* Brand & Purpose */}
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Interactive, curriculum-aligned STEM learning platform built for school students across India,
            operating online and offline.
          </p>
        </div>

        {/* Learn Modules */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Learning Modules</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/learn" className="hover:text-foreground transition-colors">
                NCERT Curriculum Library
              </Link>
            </li>
            <li>
              <Link to="/playlab" className="hover:text-foreground transition-colors">
                PlayLab Board & Digital Games
              </Link>
            </li>
            <li>
              <Link to="/circuitverse" className="hover:text-foreground transition-colors">
                CircuitVerse Breadboard Lab
              </Link>
            </li>
            <li>
              <Link to="/codeverse" className="hover:text-foreground transition-colors">
                CodeVerse Block Algorithms
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals for Stakeholders */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Portals & Community</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/auth" search={{ role: "student" }} className="hover:text-foreground transition-colors">
                Student Explorer Portal
              </Link>
            </li>
            <li>
              <Link to="/auth" search={{ role: "teacher" }} className="hover:text-foreground transition-colors">
                Teacher & Diagnostic Hub
              </Link>
            </li>
            <li>
              <Link to="/auth" search={{ role: "parent" }} className="hover:text-foreground transition-colors">
                Parent Guardian View
              </Link>
            </li>
            <li>
              <Link to="/mesh" className="hover:text-foreground transition-colors">
                Village Mesh Infrastructure
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal, Accessibility & Contact */}
        <div>
          <h2 className="font-bold text-foreground text-sm mb-3">Trust, Privacy & Support</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Child Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Dialog open={accessOpen} onOpenChange={setAccessOpen}>
                <DialogTrigger asChild>
                  <button className="hover:text-foreground transition-colors text-left">
                    Accessibility Statement
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border text-foreground max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#6541F5]">
                      VidyaVerse Accessibility Commitment
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 text-xs text-muted-foreground leading-relaxed py-2">
                    <p>
                      VidyaVerse is designed to meet WCAG 2.1 AA accessibility standards for diverse learners:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Full keyboard navigation with visible focus rings across all labs.</li>
                      <li>High-contrast text tokens supporting students in direct sunlight.</li>
                      <li>Multilingual voice companion (Kannada, Hindi, English) for low-literacy learners.</li>
                      <li>Reduced motion toggles for distraction-free learning.</li>
                      <li>Zero data requirement: runs on low-power solar school servers.</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </li>
            <li className="pt-2 text-muted-foreground">
              Contact:{" "}
              <a href="mailto:support@vidyaverse.org" className="text-primary hover:underline font-medium">
                support@vidyaverse.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-4 text-center text-[11px] text-muted-foreground">
        © 2026 VidyaVerse Project. Built for rural and underserved learners.
      </div>
    </footer>
  );
}

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; body: ReactNode }[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <p className="inline-flex rounded-md border border-dashed border-warning/40 bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">
          Draft. Not legally reviewed. Placeholders in [brackets].
        </p>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{updated}</p>
        <nav aria-label="Sections" className="card-surface mt-6 p-4">
          <ol className="grid gap-1 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a className="text-primary hover:underline" href={`#s${i}`}>
                  {i + 1}. {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.h} id={`#s${i}`} className="scroll-mt-20">
              <h2 className="text-xl font-semibold">
                {i + 1}. {s.h}
              </h2>
              <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
