import type { LucideIcon } from "lucide-react";

// ==========================================
// User & Localization Types
// ==========================================
export type Lang = "en" | "hi" | "kn";
export type UserRole = "student" | "teacher" | "parent";
export type NetworkMode = "online" | "mesh" | "offline";
export type EffectiveNetworkState = "online" | "offline" | "syncing" | "sync_needed";
export type DownloadState = "none" | "downloading" | "saved";

// ==========================================
// Curriculum & Learning Types
// ==========================================
export type Subject = "Mathematics" | "Science" | "English" | "Social Science" | "Computing";
export type CurriculumBoard = "NCERT" | "Karnataka State Board";

export interface Definition {
  term: string;
  explanation: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  solution: string;
}

export interface GuidedPractice {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StemActivityRef {
  kind: "playlab" | "circuitverse" | "codeverse";
  title: string;
  description: string;
  route: string;
  badge: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  chapter: string;
  classLevel: number;
  durationMin: number;
  type: "Video" | "Reading" | "Activity";
  sizeMb: number;
  objectives: string[];
  notes: string[];
  quizId?: string;
  // Extended fields for rich chapter experience
  board?: CurriculumBoard;
  language?: Lang;
  availableLanguages?: Lang[];
  version?: string;
  summary?: string;
  definitions?: Definition[];
  examples?: WorkedExample[];
  diagramSvg?: string;
  guidedPractice?: GuidedPractice;
  stemActivity?: StemActivityRef;
  transcript?: Record<Lang, string>;
  packId?: string;
}

export interface SubjectTheme {
  primary: string;
  tint: string;
  border: string;
  meterTone: "blue" | "teal" | "purple" | "orange" | "pink";
}

// ==========================================
// Quiz & Assessment Types
// ==========================================
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
}

export interface QuizDefinition {
  title: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export type QuizMap = Record<string, QuizDefinition>;

// ==========================================
// Project & Activity Types
// ==========================================
export interface StudentProject {
  id: string;
  title: string;
  category: "Electronics" | "Coding" | "Science" | "Math";
  date: string;
  status: "completed" | "draft" | "submitted";
  xpEarned: number;
  description: string;
  skills: string[];
}

// ==========================================
// Classroom & Teacher Types
// ==========================================
export interface ClassroomAnnouncement {
  date: string;
  text: string;
}

export interface ClassroomAssignment {
  title: string;
  kind: "Lesson" | "Quiz";
  due: string;
  lessonId?: string;
  quizId?: string;
}

export interface Classroom {
  code: string;
  name: string;
  teacher: string;
  announcements: ClassroomAnnouncement[];
  assigned: ClassroomAssignment[];
  team: string;
}

export interface TeacherRosterEntry {
  name: string;
  assignments: string;
  quiz: number | null;
  gap: string;
  lastSync: string;
}

// ==========================================
// Gamification & Rewards Types
// ==========================================
export interface Achievement {
  id: string;
  name: string;
  desc: string;
  rule: string;
}

export type AchievementId =
  | "first-lesson"
  | "quiz-ace"
  | "maze-solver"
  | "circuit-closed"
  | "coder"
  | "classmate"
  | "detective"
  | "streak-7";

export interface LearningPack {
  id: string;
  name: string;
  sizeMb: number;
  lessons: number;
}

export interface RewardItem {
  name: string;
  cost: number;
  kind: "Cosmetic" | "Content" | "Recognition";
}

// ==========================================
// Misconceptions (AI Detective) Types
// ==========================================
export interface Misconception {
  id: string;
  question: string;
  studentAnswer: string;
  rule: string;
  misconception: string;
  why: string;
  lessonId: string;
  practice: {
    text: string;
    options: string[];
    correct: number;
  };
}

// ==========================================
// Navigation & UI Types
// ==========================================
export type NavCategory =
  "learn" | "explore" | "ai-offline" | "community" | "progress" | "portals" | "settings";

export interface NavItem {
  to: string;
  label: Record<Lang, string>;
  icon: LucideIcon;
  category: NavCategory;
  badge?: string;
  roleRestricted?: "teacher" | "parent";
}

// ==========================================
// Application & Store State Types
// ==========================================
export interface DemoState {
  role: UserRole;
  studentName?: string;
  studentClass?: number;
  theme: "dark" | "light";
  networkMode: NetworkMode;
  pendingSyncCount: number;
  lastSyncTime: string;
  xp: number;
  sparks: number; // Spendable bazaar tokens (prevents depleting lifetime XP)
  weeklyXp: number;
  completed: string[];
  completedActivities: string[]; // Deduplication set to prevent infinite XP loops
  joined: string[];
  unlocked: AchievementId[];
  downloads: Record<string, DownloadState>;
  language: Lang;
  reducedMotion: boolean;
  largeText: boolean;
  notifyAssignments: boolean;
  notifyStreak: boolean;
  wifiOnlyDownloads: boolean;
  redeemedItems: string[];
  completedChallenges: string[];
  projects: StudentProject[];
  syncQueue: import("@/lib/services/sync-service").SyncQueueItem[];
}
