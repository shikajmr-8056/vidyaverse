import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, Search, ChevronDown, Play, BookOpen, Sparkles, Trophy,
  RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, Heart, Star,
  Compass, Award, Lightbulb, Clock, Check
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo-store";
import { demoStudent, lessons } from "@/data/demo";
import { cn } from "@/lib/utils";

// Academic Progress Dual Spline Chart Data matching reference image
const academicProgressData = [
  { month: "Feb", exams: 38, assignments: 68 },
  { month: "Mar", exams: 52, assignments: 78 },
  { month: "Apr", exams: 42, assignments: 35 },
  { month: "May", exams: 80, assignments: 60, tag: "GPA 80" },
  { month: "June", exams: 48, assignments: 78 },
  { month: "July", exams: 62, assignments: 52 },
];

export function StudentDashboardView() {
  const d = useDemo();
  const [activeCourseTab, setActiveCourseTab] = useState("Photography I");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRightCard, setActiveRightCard] = useState("Photography 1");
  const [monthlyFilter, setMonthlyFilter] = useState("Monthly Progress");
  const [viewMode, setViewMode] = useState<"reference" | "stem">("reference");

  // Filter courses based on search
  const coursesList = [
    {
      id: "space-review",
      title: "Space Review",
      stemTitle: "What a Fraction Really Means",
      duration: "2 Hours",
      desc: "Compose a picture in regards to the negative space you use within it.",
      stemDesc: "Understand numerator and denominator parts using circular food sharing.",
      progress: 20,
      lessonId: "fractions-intro",
      iconType: "spiral",
      buttonText: "Continue",
      buttonStyle: "outline",
    },
    {
      id: "reflections",
      title: "Reflections",
      stemTitle: "Electric Current & Closed Circuits",
      duration: "3 Hours",
      desc: "Using reflections is an excellent way of adding interest into your photograph.",
      stemDesc: "Trace electron loops from battery terminals through switch and LED.",
      progress: 50,
      lessonId: "electric-circuits",
      iconType: "candy",
      buttonText: "Continue",
      buttonStyle: "outline",
    },
    {
      id: "patterns",
      title: "Patterns",
      stemTitle: "CodeBot Sequential Algorithms",
      duration: "2.5 Hours",
      desc: "Create abstract compositions and to make interesting scenes.",
      stemDesc: "Program rover instructions step-by-step to avoid boundary barriers.",
      progress: 0,
      lessonId: "algorithms-steps",
      iconType: "cone",
      buttonText: "Start",
      buttonStyle: "solid",
    },
  ];

  const rightCoursesList = [
    {
      id: "drawing-1",
      title: "Drawing I",
      teacher: "Kayla Williams",
      credits: "3 credits",
      progress: 60,
      color: "#F5A623",
      icon: "🎨",
    },
    {
      id: "intro-art-history",
      title: "Intro to Art History",
      teacher: "Kevin Lee",
      credits: "3 credits",
      progress: 40,
      color: "#19B99A",
      icon: "🏛️",
    },
    {
      id: "photography-1",
      title: "Photography 1",
      teacher: "Krystal Gutierrez",
      credits: "1 credit",
      progress: 85,
      highlighted: true,
      color: "#5037ED",
      icon: "📷",
    },
    {
      id: "painting-1",
      title: "Painting I",
      teacher: "Kayla Williams",
      credits: "1 credit",
      progress: 25,
      color: "#E95778",
      icon: "🖌️",
    },
    {
      id: "contemporary-art",
      title: "Contemporary Art",
      teacher: "Mayra Wu",
      credits: "2 credits",
      progress: 50,
      color: "#42A5E8",
      icon: "🎭",
    },
  ];

  return (
    <div className="w-full">
      {/* Main Elevated White Surface Card matching the reference frame */}
      <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#EDEDF5] text-[#1E1B39]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT / CENTER COLUMN (8 Columns on lg)                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-7">
            {/* 1. Top Greeting Header with 3D Mascot Character */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div className="flex items-center gap-4">
                {/* 3D Illustrated Mascot Character (Student Avatar) */}
                <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FFE7D6] via-[#FFF3EA] to-[#EAE7FF] p-1 flex items-center justify-center shadow-xs">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none" aria-hidden="true">
                    {/* Hair Buns */}
                    <circle cx="28" cy="24" r="13" fill="#3D2314" />
                    <circle cx="72" cy="24" r="13" fill="#3D2314" />
                    <circle cx="28" cy="24" r="9" fill="#52321E" />
                    <circle cx="72" cy="24" r="9" fill="#52321E" />
                    {/* Head */}
                    <ellipse cx="50" cy="40" rx="22" ry="22" fill="#99603D" />
                    {/* Hair fringe */}
                    <path d="M 28 32 Q 50 16 72 32 Q 50 25 28 32 Z" fill="#3D2314" />
                    {/* Eyes */}
                    <circle cx="41" cy="39" r="2.8" fill="#1C1008" />
                    <circle cx="59" cy="39" r="2.8" fill="#1C1008" />
                    <circle cx="42" cy="38" r="0.8" fill="#FFFFFF" />
                    <circle cx="60" cy="38" r="0.8" fill="#FFFFFF" />
                    {/* Eyebrows */}
                    <path d="M 37 34 Q 41 32 45 34" stroke="#3D2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <path d="M 55 34 Q 59 32 63 34" stroke="#3D2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    {/* Nose */}
                    <ellipse cx="50" cy="44" rx="2" ry="1.5" fill="#7A482A" />
                    {/* Smile */}
                    <path d="M 44 49 Q 50 54 56 49" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    {/* Neck */}
                    <rect x="45" y="58" width="10" height="8" fill="#8A5433" rx="3" />
                    {/* Tank Top (Yellow & Cyan trim) */}
                    <path d="M 32 68 Q 50 72 68 68 L 74 100 L 26 100 Z" fill="#F5A623" />
                    <path d="M 38 68 Q 50 71 62 68 L 60 74 Q 50 76 40 74 Z" fill="#19B99A" />
                    {/* Arms with Hands on hips */}
                    <path d="M 32 68 Q 18 78 24 94 Q 28 88 34 82" stroke="#99603D" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <path d="M 68 68 Q 82 78 76 94 Q 72 88 66 82" stroke="#99603D" strokeWidth="5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B39] tracking-tight">
                    Welcome back!
                  </h1>
                  <p className="text-xs sm:text-sm text-[#7D7B93] font-medium mt-0.5 leading-snug">
                    You've learned 80% of your goal this week! Keep it up and improve your results!
                  </p>
                </div>
              </div>

              {/* Date & Weather Widget */}
              <div className="flex sm:flex-col items-start sm:items-end justify-between text-xs text-[#7D7B93]">
                <div className="flex items-center gap-1.5 font-bold text-[#1E1B39]">
                  <span>Thu, July 29, 2021</span>
                  <span className="text-sm">🌤️</span>
                </div>
                <span className="font-semibold text-[11px] text-[#7D7B93]">10:48 AM</span>
              </div>
            </div>

            {/* 2. Your Courses Section */}
            <div className="space-y-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#FA6400] tracking-tight">
                  Your Courses
                </h2>

                {/* Search Bar matching screenshot */}
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="h-9 w-full rounded-xl bg-[#F7F7FC] border border-[#EDEDF5] pl-9 pr-3 text-xs text-[#1E1B39] placeholder:text-muted-foreground focus:outline-none focus:border-[#5037ED]"
                  />
                </div>
              </div>

              {/* Category Navigation Tabs */}
              <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 text-xs font-semibold border-b border-border/40 select-none no-scrollbar">
                {[
                  "Drawing I",
                  "Intro to Art History",
                  "Photography I",
                  "Painting I",
                  "Contemporary Art",
                ].map((tab) => {
                  const isActive = activeCourseTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCourseTab(tab)}
                      className={cn(
                        "pb-2.5 transition-colors whitespace-nowrap",
                        isActive
                          ? "text-[#1E1B39] font-black border-b-2 border-[#1E1B39]"
                          : "text-[#7D7B93] hover:text-[#1E1B39]"
                      )}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* 3 Course Cards in a Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coursesList.map((course) => {
                  return (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-[#EDEDF5] bg-white p-4.5 flex flex-col justify-between shadow-xs hover:border-[#5037ED]/40 transition-all hover:shadow-sm"
                    >
                      <div className="space-y-2.5">
                        {/* Course Vector Graphic Icon */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-[#F7F7FC] flex items-center justify-center p-1.5 border border-[#EDEDF5]">
                            {course.iconType === "spiral" && (
                              <svg viewBox="0 0 40 40" className="w-7 h-7">
                                <circle cx="20" cy="20" r="14" fill="#FFE5EB" />
                                <path
                                  d="M 14 20 C 14 14 26 14 26 20 C 26 24 18 24 18 20 C 18 18 22 18 22 20"
                                  stroke="#E95778"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                              </svg>
                            )}
                            {course.iconType === "candy" && (
                              <svg viewBox="0 0 40 40" className="w-7 h-7">
                                <rect x="8" y="14" width="24" height="12" rx="6" fill="#F5A623" transform="rotate(-30 20 20)" />
                                <circle cx="12" cy="15" r="4" fill="#00B4F0" />
                                <circle cx="28" cy="25" r="4" fill="#00B4F0" />
                              </svg>
                            )}
                            {course.iconType === "cone" && (
                              <svg viewBox="0 0 40 40" className="w-7 h-7">
                                <ellipse cx="20" cy="28" rx="10" ry="4" fill="#F5A623" />
                                <ellipse cx="20" cy="22" rx="8" ry="3.5" fill="#42A5E8" />
                                <ellipse cx="20" cy="16" rx="6" ry="3" fill="#E95778" />
                                <circle cx="20" cy="11" r="3" fill="#5037ED" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Title and Hours */}
                        <div>
                          <h3 className="font-bold text-sm text-[#1E1B39] leading-snug">
                            {viewMode === "stem" ? course.stemTitle : course.title}
                          </h3>
                          <span className="text-[11px] font-bold text-[#7D7B93] block mt-0.5">
                            {course.duration}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-[#7D7B93] leading-relaxed line-clamp-2">
                          {viewMode === "stem" ? course.stemDesc : course.desc}
                        </p>

                        {/* Progress Bar with Percentage Label */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-[#7D7B93] font-semibold">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#EDEDF5] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#5037ED] rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Button: Continue or Start */}
                      <div className="pt-3.5 mt-2 flex justify-end">
                        {course.buttonStyle === "solid" ? (
                          <Button
                            asChild
                            size="sm"
                            className="bg-[#5037ED] hover:bg-[#432BCF] text-white font-bold text-xs h-8 px-5 rounded-xl shadow-xs"
                          >
                            <Link to="/playlab">Start</Link>
                          </Button>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border border-[#5037ED] text-[#5037ED] hover:bg-[#5037ED]/5 font-bold text-xs h-8 px-4 rounded-xl"
                          >
                            <Link to="/lesson/$id" params={{ id: course.lessonId }}>
                              Continue
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Academic Progress Section Card */}
            <div className="rounded-3xl border border-[#FFE7CC] bg-[#FFF8EE] p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-base text-[#1E1B39]">Academic Progress</h3>
                  {/* Legend: Purple Exams, Orange Assignments */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-xs text-[#1E1B39] font-medium">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#7C5CFA]" /> Exams
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#1E1B39] font-medium">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FA6400]" /> Assignments
                    </span>
                  </div>
                </div>

                {/* Dropdown: Monthly Progress v */}
                <div className="flex items-center gap-1 bg-white border border-[#EBE3D7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1E1B39] shadow-2xs self-start sm:self-auto cursor-pointer">
                  <span>{monthlyFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              {/* Dual Spline Curved Chart matching screenshot with floating GPA 80 tag */}
              <div className="relative h-44 sm:h-48 w-full mt-2">
                {/* Floating GPA 80 Pill Marker positioned directly over the May peak */}
                <div className="absolute -top-1 left-[67%] -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
                  <div className="bg-[#7C5CFA] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    GPA 80
                  </div>
                  <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-[#7C5CFA]" />
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={academicProgressData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C5CFA" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7C5CFA" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FA6400" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FA6400" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0E5D8" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#8C8275"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={5}
                    />
                    <YAxis
                      stroke="#8C8275"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #FFE7CC",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="assignments"
                      stroke="#FA6400"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#orangeGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="exams"
                      stroke="#7C5CFA"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#purpleGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (4 Columns on lg)                                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Student Profile Header */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="font-bold text-base text-[#1E1B39]">
                  {viewMode === "reference" ? "Claire A. McHaggen" : demoStudent.name}
                </h3>
                <span className="text-xs text-[#7D7B93] font-medium">
                  {viewMode === "reference" ? "Student" : `Class ${demoStudent.classLevel}${demoStudent.section} Student`}
                </span>
              </div>

              {/* Notification Bell with Red Badge Dot */}
              <div className="relative p-1 text-[#1E1B39] hover:text-[#5037ED] cursor-pointer">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[#E95778]" />
              </div>
            </div>

            {/* 2. Donut Progress Meter Widget directly on white canvas */}
            <div className="text-center flex flex-col items-center">
              <div>
                <h4 className="font-bold text-sm text-[#1E1B39]">
                  {viewMode === "reference" ? "Art (B.A)" : "Science & Mathematics (NCERT)"}
                </h4>
                <span className="text-[11px] text-[#7D7B93] font-medium">
                  {viewMode === "reference" ? "Until Dec 14, 2021" : "Term 1 Syllabus Completion"}
                </span>
              </div>

              {/* Circular Donut Ring Meter */}
              <div className="relative w-36 h-36 my-2.5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ECECF8"
                    strokeWidth="8"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#5037ED"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.65)}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Donut Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-[#1E1B39] tracking-tight leading-none">
                    65%
                  </span>
                  <span className="text-[10px] text-[#7D7B93] font-bold mt-1">
                    Semester I
                  </span>
                </div>
              </div>
            </div>

            {/* 3. List of 5 Subject / Course Cards */}
            <div className="space-y-3">
              {rightCoursesList.map((course) => {
                const isHighlighted = course.highlighted;
                return (
                  <div
                    key={course.id}
                    onClick={() => setActiveRightCard(course.title)}
                    className={cn(
                      "rounded-2xl p-3.5 transition-all cursor-pointer relative overflow-hidden",
                      isHighlighted
                        ? "bg-gradient-to-r from-[#5037ED] to-[#6541F5] text-white shadow-xl shadow-[#5037ED]/35"
                        : "bg-[#FAFAFC] border border-[#EDEDF5] text-[#1E1B39] hover:border-[#5037ED]/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-sm",
                            isHighlighted ? "bg-white/20 text-white" : "bg-white border border-[#EDEDF5]"
                          )}
                        >
                          {course.icon}
                        </div>
                        <div>
                          <h5
                            className={cn(
                              "font-bold text-xs leading-snug",
                              isHighlighted ? "text-white" : "text-[#1E1B39]"
                            )}
                          >
                            {course.title}
                          </h5>
                          <span
                            className={cn(
                              "text-[10px] font-medium block",
                              isHighlighted ? "text-white/80" : "text-[#7D7B93]"
                            )}
                          >
                            Teacher: {course.teacher}
                          </span>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "text-[10px] font-semibold shrink-0",
                          isHighlighted ? "text-white/90" : "text-[#7D7B93]"
                        )}
                      >
                        {course.credits}
                      </span>
                    </div>

                    {/* Progress Line */}
                    <div className="mt-2.5 h-1 w-full rounded-full bg-black/10 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          isHighlighted ? "bg-white" : "bg-[#5037ED]"
                        )}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
