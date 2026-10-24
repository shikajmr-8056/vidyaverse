# VidyaVerse — Data Entities, Relationships & Validation (DATABASE.md)

> **Current Implementation:** In-Memory TypeScript Models (`src/data/demo.ts`) + Browser LocalStorage Persistence (`src/lib/demo-store.tsx`)  
> **Production Backend Status:** Unresolved / Not yet connected to remote database

---

## 1. Existing Data Entities & Schemas

All current models are strictly typed in `src/data/demo.ts` and `src/lib/demo-store.tsx`.

### 1.1 `Lesson`
Represents an NCERT-aligned learning module:
```typescript
interface Lesson {
  id: string;               // Unique slug (e.g., "fractions-intro")
  title: string;            // Descriptive title ("What a fraction really means")
  subject: "Mathematics" | "Science" | "English" | "Social Science" | "Computing";
  chapter: string;          // Chapter heading ("Ch 2 · Fractions and Decimals")
  classLevel: number;       // Grade level (e.g., 7)
  durationMin: number;      // Estimated completion time
  type: "Video" | "Reading" | "Activity";
  sizeMb: number;           // Offline file size footprint
  objectives: string[];     // Bullet points of learning goals
  notes: string[];          // Summary points and village analogies
  quizId?: string;          // Optional foreign key linking to Quiz
}
```

### 1.2 `Quiz` & `QuizQuestion`
Assessment module evaluating conceptual understanding:
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];        // 3 to 4 multiple choice options
  correct: number;          // 0-indexed correct option pointer
  explanation: string;      // Rationale explaining why the answer works
}

interface Quiz {
  id: string;               // Unique identifier ("fractions", "circuits")
  lessonId: string;         // Foreign key linking to Lesson
  title: string;
  questions: QuizQuestion[];
}
```

### 1.3 `Misconception` (AI Concept Detective)
Catalog of common cognitive traps identified by rural teachers:
```typescript
interface Misconception {
  id: string;               // e.g., "add-fractions"
  question: string;         // The diagnostic trigger question
  studentAnswer: string;    // Common incorrect student input ("2/5")
  rule: string;             // Root mental bug description
  misconception: string;    // Name of cognitive misconception
  why: string;              // Analogy-driven explanation correcting the trap
  lessonId: string;         // Related remedial lesson
  practice: {
    text: string;
    options: string[];
    correct: number;
  };
}
```

### 1.4 `Classroom`
School cohort assigned to a specific subject and teacher:
```typescript
interface Classroom {
  code: string;             // Unique join code (e.g., "SCI7B", "MATH7", "CODE1")
  name: string;             // "Class 7B Science"
  teacher: string;          // "Mrs. K. Lakshmi"
  announcements: { date: string; text: string }[];
  assigned: { title: string; kind: "Lesson" | "Quiz"; due: string; lessonId?: string; quizId?: string }[];
  team: string;             // Active cohort collaborative challenge
}
```

### 1.5 `StudentProject`
Hands-on STEM portfolio submission:
```typescript
interface StudentProject {
  id: string;
  title: string;
  category: "Electronics" | "Coding" | "Science" | "Math";
  date: string;
  status: "completed" | "draft" | "submitted";
  xpEarned: number;
  description: string;
  skills: string[];
}
```

### 1.6 `DemoState` (Client Persistence Model)
Central state maintained in `@/types` and persisted via `safeStorage` in `localStorage`:
```typescript
interface DemoState {
  role: "student" | "teacher" | "parent";
  theme: "dark" | "light";
  networkMode: "online" | "mesh" | "offline";
  pendingSyncCount: number;
  lastSyncTime: string;
  xp: number;                                // Lifetime non-depleting experience points
  sparks: number;                            // Spendable currency for Rewards Bazaar
  weeklyXp: number;
  completed: string[];                       // Completed lesson IDs
  completedActivities: string[];             // Deduplication set preventing runaway XP loops
  joined: string[];                          // Joined classroom codes
  unlocked: AchievementId[];
  downloads: Record<string, "none" | "downloading" | "saved">;
  language: "en" | "hi" | "kn";
  reducedMotion: boolean;
  largeText: boolean;
  notifyAssignments: boolean;
  notifyStreak: boolean;
  wifiOnlyDownloads: boolean;
  redeemedItems: string[];
  completedChallenges: string[];
  projects: StudentProject[];
}
```

---

## 2. Entity Relationships Diagram

```
+---------------+         1:N         +------------------+
|   Classroom   | ------------------> |   Announcements  |
+---------------+                     +------------------+
        |
        | 1:N
        v
+---------------+         1:1         +------------------+
|   Assigned    | ------------------> |  Lesson / Quiz   |
+---------------+                     +------------------+
                                               ^
                                               | 1:1
                                      +------------------+
                                      |  Misconception   |
                                      +------------------+
```

---

## 3. Data Validation Rules

For future API endpoints and current client mutations:
1. **Join Codes:** Must be alphanumeric, 4 to 8 characters, uppercase (`^[A-Z0-9]{4,8}$`).
2. **XP Allocations:** Positive integer increments only ($0 < \Delta XP \le 500$ per action).
3. **Quiz Answers:** Correct index must be within range $0 \le \text{correct} < \text{options.length}$.
4. **Project Submissions:** Title $\ge 5$ characters; description $\ge 20$ characters.

---

## 4. Unresolved Database Decisions

* **Target Database:** SQLite running on local Raspberry Pi micro-hub vs. cloud PostgreSQL/Supabase.
* **Offline Sync Entity:** Whether to sync delta-snapshots or event logs (`Event { type, timestamp, payload, signature }`).
* **Storage Engine for Large Files:** Local filesystem on micro-hub SD card vs. IndexedDB in browser.
