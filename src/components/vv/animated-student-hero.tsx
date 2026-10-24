import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Zap,
  Atom,
  Rocket,
  Lightbulb,
  Gamepad2,
  CircuitBoard,
  Code2,
  RotateCw,
  Flame,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SubjectMode = "space" | "circuit" | "atom" | "math";

export function AnimatedStudentHero() {
  const [activeMode, setActiveMode] = useState<SubjectMode>("space");
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);
  const [sparksEarned, setSparksEarned] = useState(0);
  const [showSparkBurst, setShowSparkBurst] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState<"normal" | "turbo">("normal");
  const [funFactIndex, setFunFactIndex] = useState(0);

  const funFacts = [
    { title: "Gravity in Action", fact: "Earth orbits the Sun at ~30 km per second without burning fuel!" },
    { title: "Electric Currents", fact: "Electrons flow through copper wires near the speed of light waves!" },
    { title: "Atomic Wonder", fact: "Everything you touch is 99.9999999% empty space inside atoms!" },
    { title: "Geometric Magic", fact: "The Pythagorean Theorem was used 3,000 years ago to build pyramids!" },
  ];

  const handleSparkClick = () => {
    setSparksEarned((prev) => prev + 25);
    setShowSparkBurst(true);
    setFunFactIndex((prev) => (prev + 1) % funFacts.length);
    setTimeout(() => setShowSparkBurst(false), 1600);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Background Soft Glow Aura */}
      <div className="absolute -inset-2.5 rounded-[36px] bg-gradient-to-tr from-[#6541F5]/25 via-[#42A5E8]/20 to-[#FA6400]/20 blur-2xl opacity-80" />

      {/* Main Glassmorphic Showcase Container */}
      <div className="relative overflow-hidden rounded-[30px] border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl text-card-foreground p-4 sm:p-6 space-y-4">

        {/* Top Header: Student Profile + Interactive Spark Counter */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            {/* Animated Student Avatar with Glowing Aura */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFE7D6] via-[#FFF3EA] to-[#EAE7FF] p-1 flex items-center justify-center shadow-md ring-2 ring-[#6541F5]/30">
                <svg viewBox="0 0 100 100" className="w-full h-full select-none" aria-hidden="true">
                  {/* Hair bun */}
                  <circle cx="28" cy="24" r="13" fill="#3D2314">
                    <animate attributeName="cy" values="24;23;24" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="72" cy="24" r="13" fill="#3D2314">
                    <animate attributeName="cy" values="24;23;24" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Face */}
                  <ellipse cx="50" cy="40" rx="22" ry="22" fill="#99603D" />
                  {/* Eyes blinking */}
                  <ellipse cx="41" cy="39" rx="2.8" ry="3.2" fill="#1C1008">
                    <animate attributeName="ry" values="3.2;0.5;3.2" dur="3.5s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="59" cy="39" rx="2.8" ry="3.2" fill="#1C1008">
                    <animate attributeName="ry" values="3.2;0.5;3.2" dur="3.5s" repeatCount="indefinite" />
                  </ellipse>
                  {/* Cheerful Smile */}
                  <path d="M 43 49 Q 50 55 57 49" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Yellow School Kurti / Uniform */}
                  <path d="M 32 68 Q 50 72 68 68 L 74 100 L 26 100 Z" fill="#F5A623" />
                  {/* Pencil in hand waving */}
                  <g transform="translate(68, 62)">
                    <rect x="0" y="0" width="4" height="22" rx="2" fill="#42A5E8" transform="rotate(25)">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="20;35;20"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <polygon points="12,18 16,14 19,23" fill="#FA6400" />
                  </g>
                </svg>
              </div>

              {/* Pulsing Lightbulb "Aha!" Moment */}
              <div className="absolute -top-1.5 -right-1.5 bg-[#F5A623] text-white p-1 rounded-full shadow-md animate-bounce">
                <Lightbulb className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-foreground leading-tight">
                  Ananya's STEM Lab
                </h3>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                Class 7 · Live Interactive Visualizer
              </span>
            </div>
          </div>

          {/* Sparks Counter & Streak Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSparkClick}
              title="Click to spark an idea!"
              className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FA6400]/15 to-[#F5A623]/20 text-[#FA6400] text-xs font-bold border border-[#FA6400]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 fill-[#FA6400]" />
              <span>{120 + sparksEarned} Sparks</span>

              {/* Floating Spark Burst +25 XP notification */}
              {showSparkBurst && (
                <span className="absolute -top-6 right-0 font-black text-xs text-[#FA6400] bg-white dark:bg-zinc-900 border border-[#FA6400]/40 px-2 py-0.5 rounded-full shadow-lg animate-out fade-out slide-out-to-top-4 duration-1000">
                  +25 XP! 🌟
                </span>
              )}
            </button>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6541F5]/10 text-[#6541F5] text-xs font-bold">
              <Flame className="h-3.5 w-3.5 fill-current" /> 7d Streak
            </span>
          </div>
        </div>

        {/* Subject Mode Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted/70 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveMode("space")}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${activeMode === "space"
                ? "bg-card text-[#6541F5] shadow-xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Space</span>
          </button>

          <button
            onClick={() => setActiveMode("circuit")}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${activeMode === "circuit"
                ? "bg-card text-[#19B99A] shadow-xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Circuit</span>
          </button>

          <button
            onClick={() => setActiveMode("atom")}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${activeMode === "atom"
                ? "bg-card text-[#42A5E8] shadow-xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Atom</span>
          </button>

          <button
            onClick={() => setActiveMode("math")}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${activeMode === "math"
                ? "bg-card text-[#FA6400] shadow-xs font-extrabold"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Math</span>
          </button>
        </div>

        {/* Dynamic Interactive Animated Educational Canvas */}
        <div className="relative rounded-2xl border border-border/80 bg-gradient-to-b from-card via-[#F9F9FC] to-card dark:from-card dark:via-[#191928] dark:to-card p-4 overflow-hidden min-h-[220px] flex flex-col justify-between">

          {/* Subtle Canvas Grid Pattern */}
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

          {/* MODE 1: Space & Planetary Orbits */}
          {activeMode === "space" && (
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <svg viewBox="0 0 360 180" className="w-full h-full select-none" aria-label="Interactive Solar System Orbit">
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF066" />
                    <stop offset="60%" stopColor="#F5A623" />
                    <stop offset="100%" stopColor="#FA6400" stopOpacity="0.1" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Star background twinkling */}
                <circle cx="45" cy="35" r="1.5" fill="#42A5E8" opacity="0.6">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="310" cy="40" r="1.5" fill="#FA6400" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="85" cy="140" r="1.2" fill="#6541F5" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="280" cy="150" r="1.8" fill="#19B99A" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Inner Orbit Track */}
                <ellipse cx="180" cy="90" rx="70" ry="34" fill="none" stroke="#6541F5" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
                {/* Outer Orbit Track */}
                <ellipse cx="180" cy="90" rx="135" ry="62" fill="none" stroke="#42A5E8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.35" />

                {/* Central Glowing Star / Sun */}
                <circle cx="180" cy="90" r="22" fill="url(#sunGlow)" filter="url(#glow)">
                  <animate attributeName="r" values="22;23.5;22" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="180" cy="90" r="16" fill="#F5A623" />
                <circle cx="175" cy="85" r="3" fill="#FFF8D6" opacity="0.8" />

                {/* Inner Orbiting Planet (Earth-like) */}
                <g>
                  {/* Orbit Path Animation */}
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 180 90"
                    to="360 180 90"
                    dur={orbitSpeed === "turbo" ? "4s" : "9s"}
                    repeatCount="indefinite"
                  />
                  {/* Planet & Atmosphere */}
                  <circle cx="250" cy="90" r="9" fill="#42A5E8" />
                  <path d="M 246 88 Q 251 86 254 92 Z" fill="#28B987" />
                  {/* Orbiting Moon */}
                  <circle cx="264" cy="90" r="2.5" fill="#EAE7FF" />
                </g>

                {/* Outer Orbiting Planet (Mars / Titan with Rings) */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="180 180 90"
                    to="540 180 90"
                    dur={orbitSpeed === "turbo" ? "7s" : "16s"}
                    repeatCount="indefinite"
                  />
                  <ellipse cx="315" cy="90" rx="14" ry="4" fill="none" stroke="#FA6400" strokeWidth="1.5" opacity="0.8" />
                  <circle cx="315" cy="90" r="8" fill="#E95778" />
                </g>

                {/* Traveling Satellite / Space Probe */}
                <g transform="translate(180, 90)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="270 180 90"
                    to="630 180 90"
                    dur={orbitSpeed === "turbo" ? "3s" : "6s"}
                    repeatCount="indefinite"
                  />
                  <g transform="translate(90, 0)">
                    <rect x="-3" y="-3" width="6" height="6" fill="#F5A623" rx="1" />
                    <line x1="-8" y1="0" x2="-3" y2="0" stroke="#42A5E8" strokeWidth="1.5" />
                    <line x1="3" y1="0" x2="8" y2="0" stroke="#42A5E8" strokeWidth="1.5" />
                  </g>
                </g>
              </svg>

              {/* Bottom Canvas Overlay Controls */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#42A5E8] animate-pulse" />
                  Orbit Velocity: <strong className="text-foreground">{orbitSpeed === "turbo" ? "58 km/s (Turbo)" : "29.8 km/s"}</strong>
                </span>

                <button
                  onClick={() => setOrbitSpeed((s) => (s === "normal" ? "turbo" : "normal"))}
                  className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-bold text-[#6541F5] hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  {orbitSpeed === "turbo" ? "Normal" : "Speed Up"}
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: Electronics & Circuit Lab */}
          {activeMode === "circuit" && (
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <svg viewBox="0 0 360 180" className="w-full h-full select-none" aria-label="Interactive Electronic Circuit">
                <defs>
                  <filter id="bulbGlow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Wire Loop Pathway */}
                <rect
                  x="60"
                  y="30"
                  width="240"
                  height="120"
                  rx="16"
                  fill="none"
                  stroke={isCircuitClosed ? "#19B99A" : "#94A3B8"}
                  strokeWidth="3.5"
                />

                {/* Animated Electron particles flowing when circuit is closed */}
                {isCircuitClosed && (
                  <rect
                    x="60"
                    y="30"
                    width="240"
                    height="120"
                    rx="16"
                    fill="none"
                    stroke="#5EEAD4"
                    strokeWidth="3"
                    strokeDasharray="6 14"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-200"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </rect>
                )}

                {/* 1. DC Battery (Left side) */}
                <g transform="translate(60, 90)">
                  <rect x="-12" y="-18" width="24" height="36" rx="4" fill="#1E293B" />
                  <rect x="-6" y="-22" width="12" height="4" rx="1" fill="#F5A623" />
                  {/* Plus & Minus symbols */}
                  <text x="0" y="-4" textAnchor="middle" fill="#19B99A" fontSize="12" fontWeight="bold">+</text>
                  <text x="0" y="12" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">-</text>
                  <text x="-20" y="4" textAnchor="end" fill="currentColor" fontSize="10" className="text-muted-foreground font-bold">9V</text>
                </g>

                {/* 2. Interactive Toggle Switch (Top side) */}
                <g transform="translate(180, 30)">
                  <circle cx="-16" cy="0" r="3.5" fill="#19B99A" />
                  <circle cx="16" cy="0" r="3.5" fill="#19B99A" />
                  {/* Switch lever: connects when closed, angled up when open */}
                  <line
                    x1="-16"
                    y1="0"
                    x2={isCircuitClosed ? "16" : "12"}
                    y2={isCircuitClosed ? "0" : "-16"}
                    stroke={isCircuitClosed ? "#19B99A" : "#FA6400"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <text x="0" y="-18" textAnchor="middle" fill="currentColor" fontSize="10" className="font-bold">
                    {isCircuitClosed ? "Switch: CLOSED" : "Switch: OPEN"}
                  </text>
                </g>

                {/* 3. Glowing LED Light Bulb (Right side) */}
                <g transform="translate(300, 90)">
                  {isCircuitClosed ? (
                    <>
                      {/* Radiating Light Beam Glow */}
                      <circle cx="0" cy="0" r="32" fill="#FACC15" fillOpacity="0.25" filter="url(#bulbGlow)">
                        <animate attributeName="r" values="30;35;30" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="0" cy="0" r="16" fill="#FACC15" />
                      <circle cx="0" cy="0" r="10" fill="#FEF08A" />
                      {/* Radiating ray lines */}
                      <line x1="20" y1="0" x2="28" y2="0" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
                      <line x1="-20" y1="0" x2="-28" y2="0" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
                      <line x1="0" y1="20" x2="0" y2="28" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
                      <line x1="0" y1="-20" x2="0" y2="-28" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="0" cy="0" r="14" fill="#94A3B8" fillOpacity="0.4" stroke="#64748B" strokeWidth="1.5" />
                      <path d="M -4 -4 L 4 4 M -4 4 L 4 -4" stroke="#64748B" strokeWidth="1.5" />
                    </>
                  )}
                  <text x="32" y="4" textAnchor="start" fill="currentColor" fontSize="10" className="text-muted-foreground font-bold">
                    LED {isCircuitClosed ? "ON" : "OFF"}
                  </text>
                </g>

                {/* 4. Resistor (Bottom side) */}
                <g transform="translate(180, 150)">
                  <path
                    d="M -30 0 L -18 0 L -14 -6 L -6 6 L 2 -6 L 10 6 L 14 -6 L 18 0 L 30 0"
                    fill="none"
                    stroke="#19B99A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <text x="0" y="16" textAnchor="middle" fill="currentColor" fontSize="10" className="text-muted-foreground font-bold">
                    330 Ω Resistor
                  </text>
                </g>
              </svg>

              {/* Bottom Canvas Overlay Controls */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isCircuitClosed ? "bg-emerald-500 animate-ping" : "bg-zinc-400"}`} />
                  Ohm's Law: <strong className="text-foreground">{isCircuitClosed ? "I = V/R = 27 mA" : "Current: 0 mA"}</strong>
                </span>

                <button
                  onClick={() => setIsCircuitClosed((c) => !c)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${isCircuitClosed
                      ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-sm"
                      : "bg-[#FA6400] text-white border-[#FA6400] hover:bg-[#E55B00] shadow-sm"
                    }`}
                >
                  {isCircuitClosed ? "Toggle Switch OFF" : "Toggle Switch ON 💡"}
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: Bohr Atom & Chemical Bonds */}
          {activeMode === "atom" && (
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <svg viewBox="0 0 360 180" className="w-full h-full select-none" aria-label="Interactive Atom Model">
                {/* Electron Orbit 1 (Horizontal tilt) */}
                <ellipse cx="180" cy="90" rx="90" ry="28" fill="none" stroke="#42A5E8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" transform="rotate(-20 180 90)" />
                {/* Electron Orbit 2 (Vertical tilt) */}
                <ellipse cx="180" cy="90" rx="90" ry="28" fill="none" stroke="#6541F5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" transform="rotate(40 180 90)" />
                {/* Electron Orbit 3 (Counter tilt) */}
                <ellipse cx="180" cy="90" rx="90" ry="28" fill="none" stroke="#19B99A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" transform="rotate(100 180 90)" />

                {/* Nucleus: Cluster of Protons (Red) & Neutrons (Indigo) */}
                <g transform="translate(180, 90)">
                  <circle cx="-5" cy="-5" r="7" fill="#EF4444" />
                  <circle cx="5" cy="-4" r="7" fill="#6541F5" />
                  <circle cx="-3" cy="5" r="7" fill="#6541F5" />
                  <circle cx="6" cy="5" r="7" fill="#EF4444" />
                  <circle cx="0" cy="0" r="5" fill="#38BDF8" opacity="0.8" />
                  <text x="0" y="2.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#FFFFFF">6p 6n</text>
                </g>

                {/* Orbiting Electron 1 */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 180 90"
                    to="360 180 90"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <circle cx="270" cy="90" r="4.5" fill="#38BDF8" />
                  <circle cx="270" cy="90" r="8" fill="#38BDF8" fillOpacity="0.3" />
                </g>

                {/* Orbiting Electron 2 */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="120 180 90"
                    to="480 180 90"
                    dur="4.5s"
                    repeatCount="indefinite"
                  />
                  <circle cx="260" cy="90" r="4.5" fill="#19B99A" />
                  <circle cx="260" cy="90" r="8" fill="#19B99A" fillOpacity="0.3" />
                </g>

                {/* Orbiting Electron 3 */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="240 180 90"
                    to="600 180 90"
                    dur="3.8s"
                    repeatCount="indefinite"
                  />
                  <circle cx="275" cy="90" r="4.5" fill="#F5A623" />
                  <circle cx="275" cy="90" r="8" fill="#F5A623" fillOpacity="0.3" />
                </g>

                {/* Chemical Beaker on the side with rising bubbles */}
                <g transform="translate(45, 110)">
                  <path d="M 0 0 L 8 28 Q 12 34 22 34 L 28 34 Q 38 34 42 28 L 50 0 Z" fill="#42A5E8" fillOpacity="0.25" stroke="#0284C7" strokeWidth="2" />
                  <circle cx="25" cy="22" r="2.5" fill="#38BDF8">
                    <animate attributeName="cy" values="26;6;26" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="32" cy="18" r="2" fill="#38BDF8">
                    <animate attributeName="cy" values="24;4;24" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>

              {/* Bottom Canvas Overlay Controls */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#42A5E8] animate-ping" />
                  Element: <strong className="text-foreground">Carbon-12 (Atomic #6)</strong>
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-bold text-[#42A5E8]">
                  Shells: 2, 4 (Octet Rule)
                </span>
              </div>
            </div>
          )}

          {/* MODE 4: Math Visualizer & Pythagorean Proof */}
          {activeMode === "math" && (
            <div className="relative w-full h-[180px] flex items-center justify-center">
              <svg viewBox="0 0 360 180" className="w-full h-full select-none" aria-label="Pythagorean Theorem Geometry Proof">
                {/* Central Right Triangle */}
                <g transform="translate(130, 40)">
                  {/* Leg A Square (3x3 = 9) */}
                  <rect x="-36" y="30" width="36" height="36" fill="#42A5E8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="2" />
                  <text x="-18" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0284C7">3² = 9</text>

                  {/* Leg B Square (4x4 = 16) */}
                  <rect x="0" y="66" width="48" height="48" fill="#19B99A" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
                  <text x="24" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">4² = 16</text>

                  {/* Triangle Itself */}
                  <polygon points="0,30 0,66 48,66" fill="#F5A623" fillOpacity="0.35" stroke="#FA6400" strokeWidth="2.5" />

                  {/* Right Angle marker */}
                  <rect x="0" y="58" width="8" height="8" fill="none" stroke="#FA6400" strokeWidth="1.5" />

                  {/* Hypotenuse C Square (5x5 = 25) with tilt */}
                  <g transform="translate(0, 30) rotate(-36.87)">
                    <rect x="0" y="-60" width="60" height="60" fill="#6541F5" fillOpacity="0.25" stroke="#5037ED" strokeWidth="2" />
                    <text x="30" y="-26" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6541F5">5² = 25</text>
                  </g>
                </g>

                {/* Animated Equation Banner */}
                <g transform="translate(290, 80)">
                  <rect x="-45" y="-25" width="95" height="50" rx="10" fill="#FFFFFF" fillOpacity="0.9" stroke="#6541F5" strokeWidth="1.5" />
                  <text x="2" y="-5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6541F5">a² + b² = c²</text>
                  <text x="2" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FA6400">9 + 16 = 25</text>
                </g>
              </svg>

              {/* Bottom Canvas Overlay Controls */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FA6400] animate-pulse" />
                  Theorem: <strong className="text-foreground">Pythagoras (Class 7 NCERT)</strong>
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-bold text-[#FA6400]">
                  Triple: (3, 4, 5)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Live Fact Banner with interactive Spark trigger */}
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6541F5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{funFacts[funFactIndex]?.title ?? "Concept Discovery"}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              {funFacts[funFactIndex]?.fact ?? "Hands-on experiments help retain 80% more concepts!"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to="/tutor"
              search={{ q: `Can you explain ${funFacts[funFactIndex]?.title ?? "this concept"}? (${funFacts[funFactIndex]?.fact ?? ""})` }}
              className="inline-flex items-center gap-1 rounded-xl border border-[#6541F5]/30 bg-[#6541F5]/10 hover:bg-[#6541F5]/20 text-[#6541F5] dark:text-[#7C5CFA] text-xs font-bold h-8 px-2.5 transition-colors cursor-pointer"
              title="Ask AI Tutor (n8n Agent)"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </Link>

            <Button
              onClick={handleSparkClick}
              size="sm"
              className="shrink-0 bg-[#6541F5] hover:bg-[#5230E8] text-white text-xs font-bold rounded-xl h-8 px-3 shadow-xs cursor-pointer"
            >
              Aha! 💡
            </Button>
          </div>
        </div>

        {/* Studio Quick Shortcuts Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-0.5">
          <Link
            to="/playlab"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#FA6400] hover:bg-[#FA6400]/5 transition-all group"
          >
            <Gamepad2 className="h-5 w-5 mx-auto text-[#FA6400] mb-1 group-hover:scale-115 transition-transform" />
            <span className="text-xs font-bold text-foreground block">PlayLab</span>
            <span className="text-[10px] text-muted-foreground">Physics Games</span>
          </Link>

          <Link
            to="/circuitverse"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#19B99A] hover:bg-[#19B99A]/5 transition-all group"
          >
            <CircuitBoard className="h-5 w-5 mx-auto text-[#19B99A] mb-1 group-hover:scale-115 transition-transform" />
            <span className="text-xs font-bold text-foreground block">Circuits</span>
            <span className="text-[10px] text-muted-foreground">Virtual Wire Lab</span>
          </Link>

          <Link
            to="/codeverse"
            className="rounded-xl border border-border p-2.5 text-center hover:border-[#6541F5] hover:bg-[#6541F5]/5 transition-all group"
          >
            <Code2 className="h-5 w-5 mx-auto text-[#6541F5] mb-1 group-hover:scale-115 transition-transform" />
            <span className="text-xs font-bold text-foreground block">CodeVerse</span>
            <span className="text-[10px] text-muted-foreground">Block Coding</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
