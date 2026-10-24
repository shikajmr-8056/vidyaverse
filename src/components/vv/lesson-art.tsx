import React from "react";
import { cn } from "@/lib/utils";

/**
 * High-quality vector illustration for lesson cards.
 * Provides custom subject-focused pedagogical diagrams without heavy stock photos or broken URLs.
 */
export function LessonThumbnailArt({
  lessonId,
  subject,
  className,
}: {
  lessonId: string;
  subject: string;
  className?: string;
}) {
  // 1. Math: Fractions Intro (Roti / Pizza pie slice & fraction diagram)
  if (lessonId === "fractions-intro") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EBF5FF] to-[#DDF2FC] dark:from-[#1E293B] dark:to-[#0F172A]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <circle cx="70" cy="60" r="40" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M70 60 L70 20 A40 40 0 1 1 30 60 Z" fill="#0284C7" fillOpacity="0.85" />
          <path d="M70 60 L30 60 A40 40 0 0 1 70 20 Z" fill="#F43F5E" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="2 2" />
          <g transform="translate(130, 42)">
            <rect x="-8" y="-12" width="46" height="52" rx="10" fill="#FFFFFF" fillOpacity="0.9" />
            <text x="15" y="10" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0369A1" fontFamily="sans-serif">3</text>
            <line x1="2" y1="16" x2="28" y2="16" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
            <text x="15" y="34" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0369A1" fontFamily="sans-serif">4</text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. Math: Fractions Multiply (Repeated strip blocks)
  if (lessonId === "fractions-multiply") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EBF5FF] to-[#DDF2FC] dark:from-[#1E293B] dark:to-[#0F172A]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <rect x="25" y="24" width="110" height="18" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="25" y="24" width="44" height="18" rx="4" fill="#0284C7" />
          <rect x="25" y="50" width="110" height="18" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="25" y="50" width="44" height="18" rx="4" fill="#0284C7" />
          <rect x="25" y="76" width="110" height="18" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="25" y="76" width="44" height="18" rx="4" fill="#0284C7" />
          <g transform="translate(150, 42)">
            <circle cx="16" cy="16" r="22" fill="#FFFFFF" fillOpacity="0.9" />
            <text x="16" y="21" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0284C7" fontFamily="sans-serif">3 × ⅖</text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. Math: Decimals Place Value & Large Numbers
  if (lessonId === "decimals-place-value" || lessonId === "knowing-numbers-6" || lessonId === "math-large-numbers") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EBF5FF] to-[#DDF2FC] dark:from-[#1E293B] dark:to-[#0F172A]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <rect x="35" y="20" width="75" height="75" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="50" y2="95" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="65" y1="20" x2="65" y2="95" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="80" y1="20" x2="80" y2="95" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="95" y1="20" x2="95" y2="95" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="35" y1="35" x2="110" y2="35" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="35" y1="50" x2="110" y2="50" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="35" y1="65" x2="110" y2="65" stroke="#BAE6FD" strokeWidth="1" />
          <line x1="35" y1="80" x2="110" y2="80" stroke="#BAE6FD" strokeWidth="1" />
          <rect x="35" y="20" width="30" height="75" fill="#0284C7" fillOpacity="0.8" />
          <g transform="translate(125, 42)">
            <rect x="0" y="0" width="55" height="34" rx="8" fill="#FFFFFF" fillOpacity="0.9" />
            <text x="27" y="23" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0284C7" fontFamily="sans-serif">
              {lessonId === "knowing-numbers-6" ? "10⁶" : "0.25"}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. Science: Electric Circuits & Heating Effect
  if (lessonId === "electric-circuits" || lessonId === "heating-effect" || lessonId === "electric-heating") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#DDF8EE] dark:from-[#064E3B] dark:to-[#022C22]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <path d="M45 60 L45 35 Q45 25 55 25 L145 25 Q155 25 155 35 L155 85 Q155 95 145 95 L55 95 Q45 95 45 85 Z" fill="none" stroke="#059669" strokeWidth="2.5" />
          <rect x="35" y="48" width="20" height="24" rx="3" fill="#059669" />
          <rect x="42" y="44" width="6" height="4" fill="#F59E0B" />
          <circle cx="100" cy="25" r="3.5" fill="#059669" />
          <circle cx="120" cy="25" r="3.5" fill="#059669" />
          <line x1="100" y1="25" x2="120" y2="25" stroke="#059669" strokeWidth="2.5" />
          <circle cx="155" cy="60" r="16" fill="#FEF08A" fillOpacity="0.7" />
          <circle cx="155" cy="60" r="9" fill="#FACC15" />
          <path d="M152 70 L158 70 L156 74 L154 74 Z" fill="#6B7280" />
          <line x1="175" y1="60" x2="183" y2="60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="170" y1="46" x2="176" y2="41" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="170" y1="74" x2="176" y2="79" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 5. Science: Plants & Nutrition in Food
  if (lessonId === "nutrition-plants" || lessonId === "plant-nutrition" || lessonId === "components-food-6" || lessonId === "sci-nutrients-diet") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#DDF8EE] dark:from-[#064E3B] dark:to-[#022C22]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <circle cx="45" cy="35" r="14" fill="#FACC15" />
          <path d="M45 12 L45 17 M45 53 L45 58 M22 35 L27 35 M63 35 L68 35 M29 19 L33 23 M57 47 L61 51 M29 51 L33 47 M57 23 L61 19" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <path d="M80 85 C80 45 120 40 160 45 C160 85 120 90 80 85 Z" fill="#10B981" />
          <path d="M80 85 Q120 65 160 45" stroke="#047857" strokeWidth="2" fill="none" />
          <path d="M105 73 Q110 65 120 64" stroke="#047857" strokeWidth="1.5" fill="none" />
          <path d="M125 61 Q132 55 140 56" stroke="#047857" strokeWidth="1.5" fill="none" />
          <g transform="translate(105, 80)">
            <rect x="0" y="0" width="75" height="22" rx="6" fill="#FFFFFF" fillOpacity="0.95" />
            <text x="37" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857" fontFamily="sans-serif">
              {lessonId.includes("food") ? "Protein + Fe" : "H₂O + CO₂"}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 6. Science: Force and Pressure (P = F / A)
  if (lessonId === "force-pressure-8") {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#DDF8EE] dark:from-[#064E3B] dark:to-[#022C22]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <line x1="30" y1="85" x2="170" y2="85" stroke="#059669" strokeWidth="3" />
          <rect x="75" y="55" width="50" height="30" rx="4" fill="#10B981" />
          {/* Force vectors */}
          <line x1="100" y1="20" x2="100" y2="50" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <polygon points="100,55 94,45 106,45" fill="#EF4444" />
          <text x="115" y="38" fontSize="13" fontWeight="bold" fill="#EF4444" fontFamily="sans-serif">F↓</text>
          <g transform="translate(130, 68)">
            <rect x="0" y="0" width="55" height="20" rx="4" fill="#FFFFFF" fillOpacity="0.9" />
            <text x="27" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857" fontFamily="sans-serif">P = F / A</text>
          </g>
        </svg>
      </div>
    );
  }

  // 7. Computing: Algorithms & Code
  if (subject === "Computing" || lessonId.startsWith("cs-") || lessonId.includes("algorithm")) {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F5F3FF] to-[#EAE7FF] dark:from-[#312E81] dark:to-[#1E1B4B]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <path d="M35 25 L85 25 Q90 25 90 30 L90 45 Q85 45 85 50 Q85 55 90 55 L90 70 Q85 70 85 75 L35 75 Q30 75 30 70 L30 30 Q30 25 35 25 Z" fill="#6541F5" />
          <text x="56" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FFFFFF" fontFamily="sans-serif">STEP 1</text>
          <path d="M90 25 L145 25 Q150 25 150 30 L150 70 Q145 70 145 75 L90 75 Q85 75 85 70 L85 55 Q90 55 90 50 Q90 45 85 45 L85 30 Q85 25 90 25 Z" fill="#3B82F6" />
          <text x="118" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FFFFFF" fontFamily="sans-serif">REPEAT(4)</text>
          <text x="100" y="98" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6541F5" fontFamily="monospace">&lt;algorithm /&gt;</text>
        </svg>
      </div>
    );
  }

  // 8. Social Science: Deccan Rivers & Karnataka Heritage
  if (subject === "Social Science" || lessonId.includes("deccan") || lessonId.includes("river") || lessonId.includes("karnataka")) {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFBEB] to-[#FFF0D5] dark:from-[#78350F] dark:to-[#451A03]", className)}>
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
          <path d="M20 95 L55 45 L90 75 L130 35 L180 95 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <path d="M125 38 Q110 65 125 80 Q135 90 155 95" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <path d="M125 38 Q110 65 125 80 Q135 90 155 95" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="45" cy="30" r="14" fill="#FFFFFF" fillOpacity="0.85" stroke="#D97706" strokeWidth="1" />
          <polygon points="45,20 48,30 45,28 42,30" fill="#EF4444" />
          <polygon points="45,40 48,30 45,32 42,30" fill="#6B7280" />
        </svg>
      </div>
    );
  }

  // 9. English / Default: Grammar & Stories
  return (
    <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF2F8] to-[#FCE5EB] dark:from-[#831843] dark:to-[#500724]", className)}>
      <svg viewBox="0 0 200 120" className="w-full h-full max-h-28" aria-hidden="true">
        <path d="M40 75 C60 70 85 70 100 80 C115 70 140 70 160 75 L160 40 C140 35 115 35 100 45 C85 35 60 35 40 40 Z" fill="#FFFFFF" stroke="#E11D48" strokeWidth="1.5" />
        <line x1="100" y1="45" x2="100" y2="80" stroke="#E11D48" strokeWidth="1.5" />
        <text x="68" y="58" fontSize="24" fontWeight="black" fill="#FB7185" fontFamily="serif">“</text>
        <text x="130" y="62" fontSize="24" fontWeight="black" fill="#FB7185" fontFamily="serif">”</text>
        <line x1="50" y1="52" x2="85" y2="52" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="60" x2="75" y2="60" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="115" y1="52" x2="150" y2="52" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="115" y1="60" x2="140" y2="60" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Visual illustration banners for the 4 core exploration hubs
 */
export function StemStudioArt({
  hub,
  className,
}: {
  hub: "learn" | "playlab" | "circuitverse" | "codeverse";
  className?: string;
}) {
  if (hub === "playlab") {
    return (
      <div className={cn("relative w-full h-28 rounded-t-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFBEB] to-[#FFF0D5] dark:from-[#451A03] dark:to-[#2A1202]", className)}>
        <svg viewBox="0 0 160 90" className="w-full h-full max-h-24" aria-hidden="true">
          <rect x="35" y="24" width="90" height="48" rx="20" fill="#F5A623" fillOpacity="0.9" />
          <rect x="52" y="42" width="16" height="6" rx="2" fill="#FFFFFF" />
          <rect x="57" y="37" width="6" height="16" rx="2" fill="#FFFFFF" />
          <circle cx="100" cy="42" r="3.5" fill="#FFFFFF" />
          <circle cx="110" cy="48" r="3.5" fill="#FFFFFF" />
          <polygon points="80,12 82,18 88,18 83,22 85,28 80,24 75,28 77,22 72,18 78,18" fill="#F5A623" />
        </svg>
      </div>
    );
  }

  if (hub === "circuitverse") {
    return (
      <div className={cn("relative w-full h-28 rounded-t-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#DDF8EE] dark:from-[#064E3B] dark:to-[#022C22]", className)}>
        <svg viewBox="0 0 160 90" className="w-full h-full max-h-24" aria-hidden="true">
          <rect x="25" y="20" width="110" height="50" rx="8" fill="#FFFFFF" stroke="#19B99A" strokeWidth="1.5" />
          <circle cx="45" cy="35" r="2.5" fill="#19B99A" />
          <circle cx="60" cy="35" r="2.5" fill="#19B99A" />
          <circle cx="75" cy="35" r="2.5" fill="#19B99A" />
          <circle cx="90" cy="35" r="2.5" fill="#19B99A" />
          <circle cx="105" cy="35" r="2.5" fill="#19B99A" />
          <path d="M45 55 Q75 75 105 55" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="62" y="32" width="24" height="6" rx="2" fill="#DDF8EE" stroke="#19B99A" strokeWidth="1" />
          <line x1="68" y1="32" x2="68" y2="38" stroke="#EF4444" strokeWidth="1.5" />
          <line x1="74" y1="32" x2="74" y2="38" stroke="#F5A623" strokeWidth="1.5" />
          <line x1="80" y1="32" x2="80" y2="38" stroke="#3B82F6" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (hub === "codeverse") {
    return (
      <div className={cn("relative w-full h-28 rounded-t-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-[#DDF2FC] dark:from-[#1E3A8A] dark:to-[#0F172A]", className)}>
        <svg viewBox="0 0 160 90" className="w-full h-full max-h-24" aria-hidden="true">
          <rect x="28" y="16" width="104" height="58" rx="8" fill="#1E293B" />
          <circle cx="38" cy="24" r="2" fill="#EF4444" />
          <circle cx="45" cy="24" r="2" fill="#F59E0B" />
          <circle cx="52" cy="24" r="2" fill="#10B981" />
          <path d="M50 42 L42 48 L50 54" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 42 L78 48 L70 54" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="62" y1="40" x2="58" y2="56" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="90" y="38" width="28" height="6" rx="2" fill="#F43F5E" />
          <rect x="90" y="50" width="20" height="6" rx="2" fill="#FACC15" />
        </svg>
      </div>
    );
  }

  // Learn
  return (
    <div className={cn("relative w-full h-28 rounded-t-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F5F3FF] to-[#EAE7FF] dark:from-[#312E81] dark:to-[#1E1B4B]", className)}>
      <svg viewBox="0 0 160 90" className="w-full h-full max-h-24" aria-hidden="true">
        <ellipse cx="80" cy="45" rx="55" ry="20" fill="none" stroke="#6541F5" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M45 55 C60 50 75 50 80 56 C85 50 100 50 115 55 L115 28 C100 23 85 23 80 30 C75 23 60 23 45 28 Z" fill="#FFFFFF" stroke="#6541F5" strokeWidth="1.5" />
        <circle cx="120" cy="32" r="3" fill="#F5A623" />
        <circle cx="40" cy="58" r="2" fill="#3B82F6" />
      </svg>
    </div>
  );
}
