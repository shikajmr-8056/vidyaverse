# VidyaVerse — System Architecture & Technology Decisions

> **Architecture Style:** Component-driven, Offline-First Jamstack / SSR Client  
> **Primary Framework:** TanStack Start + React 19 + Vite  
> **Source of Truth:** `package.json`, `src/routes/`, `src/lib/demo-store.tsx`, `src/lib/services/sync-service.ts`

---

## 1. Verified Technology Stack

| Layer | Technology | Version | Purpose in VidyaVerse |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `5.8.3` | Strict type safety across all routes, stores, and components |
| **Runtime & Bundler** | Vite | `8.1.5` | Fast HMR dev server and production asset compilation |
| **UI Framework** | React | `19.2.0` | Declarative UI and component tree |
| **Routing & SSR** | TanStack Start / Router | `1.170.x` | File-based type-safe routing with layout nesting |
| **Styling Engine** | Tailwind CSS v4 | `4.2.1` | Native `@theme` engine with CSS variable tokens |
| **Headless UI** | Radix UI | Latest | Accessible dialogs, dropdowns, switches, tabs |
| **Command Palette** | `cmdk` | `1.1.1` | Keyboard shortcut (`Ctrl+K`) search across modules |
| **Icons** | Lucide React | `0.575.0` | Comprehensive icon library |
| **Toast Notifications**| Sonner | `2.0.7` | Action feedback and achievement notifications |
| **Testing Engine** | Vitest + JSDOM | `4.1.x` | Unit and integration test runner (74 tests across 10 files) |

---

## 2. Repository Directory Structure (Feature-Based Architecture)

```
d:/repos/pixel-perfect-match-9202/
├── docs/                     # Vibe Coding project documentation & specifications
├── public/                   # Static assets, manifests, icons
├── src/
│   ├── components/
│   │   ├── ui/               # Radix/shadcn atomic primitives (Button, Badge, Dialog, etc.)
│   │   ├── shared/           # Reusable application shell and state primitives:
│   │   │   ├── AppSidebar.tsx       # Collapsible desktop/tablet navigation sidebar with role-isolated sections
│   │   │   ├── AppHeader.tsx        # Top sticky header with context, search, language, theme & role switcher
│   │   │   ├── BottomNavigation.tsx # Role-specific 5-tab mobile bottom bar (4 destinations + More drawer)
│   │   │   ├── MobileNavigation.tsx # Slide-out drawer navigation with role badges and isolated routes
│   │   │   ├── PageHeader.tsx       # Standardized page title, description & actions header
│   │   │   ├── EmptyState.tsx       # Accessible empty container with icon and action
│   │   │   ├── LoadingState.tsx     # Accessible spinner and message skeleton
│   │   │   ├── ErrorState.tsx       # Accessible error card with retry button
│   │   │   └── DemoStatus.tsx       # Understandable network states (Online, Offline, Syncing, Sync Needed)
│   │   └── vv/               # VidyaVerse primitives (Logo, Panel, Meter, Nav, SimNote)
│   ├── config/
│   │   └── site.ts           # Site configuration, route constants, and storage keys
│   ├── data/
│   │   └── demo.ts           # Centralized mock dataset, curriculum definitions, and subject themes
│   ├── features/             # Feature-based modular architecture
│   │   ├── ai-tutor/         # Concept Detective diagnostic chat & village analogies
│   │   ├── auth/             # Role selection & portal switcher modal
│   │   ├── circuitverse/     # Interactive Ohm's Law breadboard circuit simulator
│   │   ├── classrooms/       # Cohort collaboration, assignments & announcements
│   │   ├── codeverse/        # Visual block coding workspace with Python/C++ code preview
│   │   ├── downloads/        # Offline content cache & storage quota manager
│   │   ├── gamification/     # Leaderboard (fair sync), Quests, and Rewards Bazaar
│   │   ├── learning/         # Curriculum library tabs and interactive lesson view
│   │   ├── offline-sync/     # Autonomous school mesh visualizer & sync queue manager
│   │   ├── parent/           # Supportive, encouraging family guardian overview
│   │   ├── playlab/          # CodeBot Maze, Math Ludo, and physical kit catalog
│   │   ├── progress/         # Historical analytics, subject mastery & study charts
│   │   ├── projects/         # Student STEM portfolio and printable dilution certificate
│   │   ├── quizzes/          # Interactive quiz engine with Concept Detective revision
│   │   ├── settings/         # Profile, theme switcher, regional language & cache policies
│   │   ├── student/          # Student dashboard view & learning-focused homepage
│   │   ├── teacher/          # Instructor dashboard: diagnostics, heatmaps & assignment broadcast
│   │   └── voice/            # Multilingual audio assistant (Kannada, Hindi, English)
│   ├── hooks/                # Reusable React hooks (use-mobile, etc.)
│   ├── lib/
│   │   ├── persistence/      # LocalStorage persistence wrapper with in-memory fallback
│   │   ├── services/         # Offline sync queue service, XP clamping & late-sync policy
│   │   ├── demo-store.tsx    # Single source of truth React Context store
│   │   └── utils.ts          # Class merging (`cn`) helper
│   ├── routes/               # Thin TanStack route wrappers (<35 lines)
│   ├── types/                # Centralized TypeScript interfaces and domain types
│   ├── test/                 # Vitest test suites (offline lifecycle, portals, routing, STEM)
│   ├── styles.css            # Tailwind v4 theme, tokens & utility rules
│   └── routeTree.gen.ts      # TanStack Router auto-generated route tree
├── AGENTS.md                 # Root instructions for AI coding assistants
├── package.json              # Project dependencies and script commands
├── tsconfig.json             # Strict TypeScript compiler options
└── vite.config.ts            # Vite & TanStack Router compiler plugins
```

---

## 3. Client State Management & Persistence Strategy

### 3.1 Actual Persistence Implementation (`src/lib/persistence/storage.ts`)

VidyaVerse uses a resilient, safe wrapper around browser storage called `safeStorage`:
- **Primary Storage:** `window.localStorage` under the key `vidyaverse-demo-v4`.
- **SSR & Fallback:** `MemoryStorageFallback` (in-memory `Map<string, string>`) automatically engaged during SSR, private browsing quota exhaustion, or restricted iframe contexts.
- **Refresh & Restart Guarantee:** All store properties—including `syncQueue`, `completed`, `completedActivities`, `completedChallenges`, `xp`, `sparks`, `weeklyXp`, and `downloads`—are serialized to JSON on mutation and reloaded upon page refresh or browser restart.

### 3.2 State Properties (`src/types/index.ts`)

```typescript
export interface DemoState {
  role: UserRole;
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
  syncQueue: SyncQueueItem[];
}
```

---

## 4. Local-Data Lifecycle & Offline Synchronization

VidyaVerse adheres to a strict 9-step local data lifecycle designed for low-connectivity and rural school deployments:

```
[1. Download Content]        Preload lessons, audio packs, and quizzes into local storage
        ↓
[2. Store Locally]           Save metadata, definitions, examples, and progress to safeStorage
        ↓
[3. Work Offline]            Permit lesson completion, quiz taking, and STEM labs without internet
        ↓
[4. Queue Events]            Generate append-only event record with unique UUID (evt-${timestamp}-${hash})
        ↓
[5. Detect Connectivity]     Listen to window 'online'/'offline' events and monitor effective network state
        ↓
[6. Safe Sync with Hub]      Reconcile queue items against Kalyan School Hub with server-side validation
        ↓
[7. Handle Drops & Retry]    On connection timeout, mark items as 'failed', increment retryCount, PRESERVE WORK
        ↓
[8. Anti-Duplication]        Guard lessons (completed) and activities (completedActivities) idempotently
        ↓
[9. Surface Audit State]     Display last successful sync timestamp, pending items, and network status pill
```

### 4.1 Sync Queue Record Structure (`src/lib/services/sync-service.ts`)

Every offline action creates a discrete `SyncQueueItem`:

```typescript
export interface SyncQueueItem {
  id: string; // Unique event UUID (e.g., `evt-1728800000000-asdfg`)
  type: "lesson_completed" | "quiz_score" | "activity_xp" | "challenge_completed" | "project_submitted";
  entityId: string; // Target lessonId, quizId, activityId
  title: string;
  xpEarned: number;
  timestamp: string; // ISO 8601 string recorded at completion
  status: "pending" | "synced" | "failed";
  retryCount: number;
  payload?: Record<string, unknown>;
}
```

### 4.2 Anti-Tampering & Client XP Clamping

Client-supplied XP values are never trusted naively. When enqueued and when reconciled by the hub, values are clamped against `MAX_ALLOWED_XP`:

| Event Type | Maximum Allowed XP | Rationale |
| :--- | :--- | :--- |
| `lesson_completed` | **25 XP** | Standard reading & concept completion |
| `quiz_score` | **50 XP** | Full marks assessment bonus |
| `activity_xp` | **35 XP** | PlayLab / CircuitVerse experiment clearance |
| `challenge_completed`| **40 XP** | Daily challenge checkpoint |
| `project_submitted` | **150 XP** | Comprehensive STEM lab portfolio submission |

Values `< 0` or `NaN` are clamped to `0`.

### 4.3 Transparent Late-Sync Competition Policy

To maintain competitive fairness for students without weekly home connectivity:
1. **Lifetime XP is Strictly Monotonic:** Lifetime XP measures permanent educational mastery and level progression (`XP / 250`). It is **never wiped or reset** by weekly leaderboard cycles.
2. **72-Hour Late-Sync Grace Period:** Activities completed offline carry cryptographic local ISO timestamps. If synchronized within 72 hours of weekly cycle cutoff (e.g., Monday–Tuesday after a weekend), points retroactively apply to that week's tournament.
3. **Past 72-Hour Cutoff:** If synced beyond 72 hours, the weekly tournament has concluded, but **100% of the earned XP is credited to Lifetime XP**. No student effort is discarded.

### 4.4 Four Understandable Network States

VidyaVerse surfaces four clear, understandable network states in `DemoStatus` and `OfflineSyncView`:
1. **`Online` (Green):** Normal internet connection. All outbox items synchronized.
2. **`Offline` (Slate/Gray):** Local storage cache active. Learning happens autonomously; actions are queued.
3. **`Syncing` (Purple/Animated Spin):** Active cryptographic packet transmission with the school hub.
4. **`Sync Needed` (Orange/Pulse):** Device has pending or previously failed items in the outbox awaiting connection.

### 4.5 Pedagogical Distinction: Unsynced vs Unlearned

VidyaVerse distinguishes students based on actual effort rather than network access:
- **Learned & Synced:** Task completed and verified on the school hub master roster.
- **Learned Offline (Pending Hub Sync):** Task completed locally with verified ISO timestamp; tablet awaiting Wi-Fi Direct proximity to the school Raspberry Pi. Roster displays `"Offline Queued"`.
- **Not Started / Not Attempted:** No activity recorded on device or hub. Roster displays `"Not Started"`.

---

## 5. Implementation Reality & Technical Disclaimer

To maintain total engineering honesty, VidyaVerse distinguishes genuine implementations from simulated components and future roadmap targets:

### 5.1 Genuinely Implemented
* `safeStorage` LocalStorage persistence with memory fallback across page refresh and browser restart.
* Outbox event queue with unique event UUIDs, retry counting, and status transitions (`pending` → `synced` / `failed`).
* Anti-tampering client XP bounds clamping (`validateAndClampXp`).
* Transparent late-sync competition policy evaluation (`evaluateLateSyncPolicy`).
* Safe work preservation upon sync failure (items remain in queue with status `"failed"` and incremented `retryCount`; zero data loss).
* Idempotent deduplication for quizzes (`completedActivities`), lessons (`completed`), and challenges (`completedChallenges`).
* 4 understandable network states (`Online`, `Offline`, `Syncing`, `Sync Needed`).
* Native browser `online` and `offline` event detection.

### 5.2 Simulated Component
* **School Micro-Server Network Transit (`simulateHubSync`):** Simulates the 350ms Wi-Fi Direct latency and socket timeout to a Raspberry Pi micro-server (`Kalyan-Hub-Node-01`).

### 5.3 Documented Migration Roadmap (Future Capabilities)
When migrating to production multi-device rural deployments:
1. **IndexedDB:** Introduce `idb-keyval` or Dexie.js for large offline content packs (>50MB) and audio synthesizer blobs that exceed LocalStorage's 5MB quota.
2. **Service Worker:** Implement a native Workbox / Service Worker script with Cache API for static bundle caching and asset interception.
3. **BackgroundSync API:** Register periodic background sync tasks to auto-drain the outbox queue when the OS detects network availability.
4. **School Server Backend:** Deploy an ultra-lightweight Go or Node SQLite server on solar-powered Raspberry Pi 4 units running inside rural schools.

---

## 6. Verification Testing Strategy

All offline capabilities are continuously verified via automated tests:

```bash
# Run unit and integration test suite
npm run test -- --run

# Run TypeScript compilation check
npx tsc --noEmit

# Run production build
npm run build
```

**Test Suite Coverage (`src/test/offline-lifecycle.test.ts`):**
- Anti-tampering XP clamping for excessive, negative, and legitimate values.
- Late-sync competition policy (under 72h grace period vs past 72h).
- Local work preservation on simulated network timeout.
- Successful retry of previously failed outbox items.
- Idempotent quiz and lesson deduplication.
- Monotonic Lifetime XP protection against weekly resets.
- Storage serialization across simulated browser refresh.
- Pedagogical distinction between unsynced and unlearned students.
- Understandable network states computation.
