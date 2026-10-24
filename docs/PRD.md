# VidyaVerse — Product Requirements Document (PRD)

> **Tagline:** A Universe of Learning  
> **Target Audience:** Rural and underserved students, government school teachers, and guardians across India  
> **Current Version:** v2.4 (Hackathon-Ready Interactive Frontend Prototype)  
> **Status:** Live Prototype (Frontend client with simulated offline/mesh/AI capabilities)

---

## 1. Executive Summary & Vision

India's rural education system faces severe constraints: intermittent cellular connectivity, prohibitive data costs, shared household smartphones, and rote textbook memorization. 

**VidyaVerse** transforms rural STEM education into an interactive, gamified universe. Built on an offline-first foundation, it enables students to run virtual circuit simulations, solve algorithmic mazes, interact with an AI Concept Detective tutor, and sync academic progress over local school micro-mesh hubs without active internet access.

---

## 2. User Personas

| Persona | Role | Primary Needs & Pain Points |
| :--- | :--- | :--- |
| **Ananya R.** (Student, Class 7B) | Rural middle-school learner | Limited daily phone access, high data costs, wants engaging game-based learning (Math Ludo, CodeBot). |
| **Mrs. K. Lakshmi** (Teacher) | Govt. school science teacher | Multi-grade classrooms, wants automated misconception diagnosis, zero-internet classroom roster sync. |
| **Ramesh R.** (Guardian / Parent) | Rural artisan / farmer | Non-English speaker, anxious about screen time, needs vernacular progress summaries and kitchen-math home activities. |

---

## 3. Product Features & Route Matrix

### 3.1 Core Learning
* **Home Landing (`/`)**: Public hero presentation, feature cards, and offline micro-hub benefits.
* **Student Dashboard (`/dashboard`)**: Focused learning home page featuring profile summary & streak, prominent Continue Learning card, today's practice goal, My Subjects course/chapter progress, practice & revision checkpoints, STEM lab experiences (PlayLab, CircuitVerse, CodeVerse), AI Tutor & Voice companions, compact achievements & XP breakdown, and discreet offline status.
* **Curriculum Library (`/learn`)**: Comprehensive curriculum browser supporting Board (NCERT / Karnataka State Board), Grade/Class (6–8), Subject, Chapter, Language (English, Hindi, Kannada), Content Format, and Offline Storage availability filters. Features subject progress overview cards and chapter sections organized by learning objectives with quick quiz and STEM lab links.
* **Lesson Viewer (`/lesson/$id`)**: Structured 7-part lesson experience featuring video player controls (play/pause, scrubber, speed, fullscreen), multilingual closed captions (EN/HI/KN), transcript viewer, core syllabus notes, term definitions, worked examples, in-lesson guided practice check with instant feedback, chapter quiz assessment link, related STEM activity integration, and device storage management.
* **Interactive Quiz Engine (`/quiz/$id`)**: Timed/untimed single-select and multi-select questions with immediate rationale explanations, XP rewards, error tagging, and offline progress queuing.

### 3.2 Creative & STEM Labs
* **PlayLab (`/playlab`)**: Studio accent **Amber** (`#F5A623`). Curriculum-aligned game library filtered by subject, grade/class, and format. Features complete playable games: **Newton's Carrom** (2D physics engine simulating conservation of linear momentum, striker velocity impulse, cushion rebound angle of reflection, surface friction powder, pocketing detection, and Newton's Three Laws of Motion), **CodeBot Maze** across 3 difficulty tiers (grid obstacle navigation, directional robot rendering, command queue, collision detection, progressive hints, victory modals), and **Math Ludo** across 3 tiers (Halves/Quarters, Arithmetic Operations, Decimals with 24-step winding track, animated dice roll, multiple-choice questions, boost squares). Includes dedicated physical board game companion studio with *Bharat Explorer* clue validator and solution reveal alongside printable classroom blueprints. Employs idempotent anti-farming XP tracking.
* **CircuitVerse (`/circuitverse`)**: Studio accent **Emerald/Teal** (`#19B99A`). Electronics learning organized into 4 distinct modes: Guided Experiments (4 structured curriculum labs), Virtual Breadboard Workbench, Ohm's Law & Logic Theory, and Physical STEM Kit Guide. Supports tested component library (9V battery, 5V DC rail, 3V coin cell; 100Ω, 220Ω, 330Ω, 1kΩ, 10kΩ resistors; Red, Amber, Green, Blue LEDs; SPST Knife switch, secondary switch; AND, OR, NOT logic gates). Provides real-time physics telemetry ($V_s, V_f, V_R, I\text{ in mA}, P\text{ in mW}$) and actionable diagnostic states (Open Loop, Burnout Overload alert $>25\text{mA}$, Under-Voltage failure, Safe Normal). Includes step-by-step physical breadboard transition guide and explicit DC simulator limitation documentation.
* **CodeVerse (`/codeverse`)**: Studio accent **Electric Indigo** (`#6541F5`). Computational thinking progression from patterns and algorithms to sequences, loops, conditions, variables, and debugging. Features 3 guided challenges with step-by-step instructions, worked examples, progressive hints, and automated test suite evaluation. Visual block coding workspace with block toolbox, active command queue, execution tracer, and Rover grid simulator. Real-world syntax preview bridge for Python 3 and Arduino C++ with explicit educational disclaimer. Purposeful mobile-responsive tabbed workspace (`Blocks`, `Canvas`, `Console`, `Syntax Code`) with large touch targets and zero horizontal overflow.
* **AI Concept Detective (`/tutor`)**: Studio accent **Purple/Lavender** (`#6541F5`). Clean question-and-answer pedagogical interface grounded in approved NCERT Class 6–8 units (fractions addition, electric circuits, decimal place values, photosynthesis). Features hints-first progressive disclosure, structured step-by-step explanations, relatable Indian village analogies (chapati sharing, canal sluice gates, weekly market tarazu scales), follow-up practice checks with immediate diagnostic feedback, and recommended follow-up questions. Supports multilingual queries and native responses in English (`en`), Hindi (`hi`), and Kannada (`kn`). Includes loading, error, retry, and out-of-syllabus uncertainty states with explicit disclaimers confirming the local in-browser simulation and advising textbook verification.
* **VidyaVerse Voice (`/voice`)**: Studio accent **Emerald/Teal** (`#19B99A`). Tap-to-talk multilingual audio companion featuring zero always-on listening. Executes a clearly defined curriculum command vocabulary (opening lessons, starting quizzes, reading questions aloud, checking learning progress). Includes a curriculum read-aloud reader for textbook snippets with Web Speech API audio synthesis, visible microphone permission and cancellation handling, touch/keyboard text alternative input, and an offline downloadable language pack manager (Hindi 45MB, Kannada 48MB, English 38MB) honoring child data privacy.

### 3.3 Offline & Community Systems
* **Learning Mesh (`/mesh`)**: Interactive network topology visualizer simulating Raspberry Pi school hubs, Wi-Fi Direct bubbles, and offline queue reconciliation.
* **Classrooms (`/classrooms`)**: Collaborative cohort management with revocable enrollment tokens (`SCI7B`, `MATH7`, `CODE1`), teacher section creation with enrollment policies (Open vs Approval Required), announcements, curriculum resources organizer, collaborative team challenges, and tri-state offline assignment tracking (`Completed & Synced`, `Finished Offline (Pending Sync)`, and `Incomplete`).
* **Leaderboard (`/leaderboard`)**: Weekly cup and all-time XP rankings with strict pseudonymization (e.g. `Ananya R.`) and fair offline sync reconciliation rules.
* **Rewards Store (`/rewards`)**: Redemption bazaar converting academic XP into physical STEM kits, solar torches, and book vouchers.
* **My Progress (`/progress`)**: Subject mastery heatmaps, quiz accuracy logs, flagged learning gaps, and revision recommendations.
* **Downloads Manager (`/downloads`)**: Offline pack cache manager showing storage consumption, cached chapters, and download simulators.
* **Student Portfolio (`/projects`)**: STEM project showcase with project submission modals, verified badges, and printable PDF certificate previews.
* **Daily Challenges (`/challenges`)**: Rotating daily quests with incremental hint unlocks and XP rewards.

### 3.4 Stakeholder Portals & Authentication
* **Portal Sign-In & Onboarding (`/auth`)**: Dedicated role-based authentication interface with distinct Student, Teacher, and Parent/Guardian portals, password visibility toggles, validation rules, demo autofill shortcuts, and role-authorized navigation.
* **Teacher Command Hub (`/teacher`)**: Task-oriented instructor portal featuring section overview (Class 7B & 7A), students needing intervention alert drawer (concept bottlenecks & stale sync flags), classroom creation with revocable codes, assignment broadcasting & tracking, authorized student diagnostic roster with CSV export, topic-level mastery distribution charts, diagnosed misconception catalog, and Kalyan School Mesh Hub sync reconciliation.
* **Parent & Guardian Portal (`/parent`)**: Encouraging, non-punitive guardian experience strictly authorized to linked child (*Ananya R.*). Displays subject mastery, completed lessons and Sparks/XP, verified hands-on STEM portfolio projects, upcoming tasks, practical home support activities (kitchen math with roti fractions, flashlight switch analogy, evening shadows), and communication/leaderboard privacy controls.
* **Settings & Accessibility (`/settings`)**: Theme switcher (Default Purple & Lavender vs Charcoal Dark), text scaling (112.5%), reduced motion toggle, and demo localStorage reset.
* **Legal Pages (`/privacy`, `/terms`)**: Strict child privacy notice (zero biometric/location exposure) and educational terms.

---

## 4. Implementation Status Classification

| Feature Area | Current Status | Details |
| :--- | :--- | :--- |
| **All 18 Route Pages** | **Fully Implemented** | Native routes rendered via TanStack Router with complete UI and interactivity. |
| **Design System** | **Fully Implemented** | Custom purple (`#6541F5`) & lavender (`#D8D5FF`) design system with dark mode. |
| **Gamification Engine** | **Implemented (Client)** | XP, levels ($250 \text{ XP/level}$), streak, badges, and redemptions stored in `localStorage`. |
| **CodeBot & Math Ludo** | **Fully Playable** | Interactive game engines running directly in the browser. |
| **Circuit Breadboard** | **Fully Playable** | Live mathematical simulation of Ohm's Law and resistor calculations. |
| **Block Coding Engine** | **Interactive Prototype** | Step execution, terminal log, and Python/C++ code preview. |
| **AI Concept Detective** | **Mock Simulation** | Local misconception catalog with rule-based diagnostic chat responses. |
| **Voice Recognition** | **UI Prototype** | Simulated audio playback and mic wave animation; no Web Speech API or cloud STT yet. |
| **Mesh Network Sync** | **Mock Simulation** | Queued offline actions simulated in `localStorage` with manual "Sync" trigger. |
| **User Authentication** | **Mock State** | Role switcher (`student`, `teacher`, `parent`) in top header without real JWT/session backend. |
| **Database & Backend** | **Unresolved / None** | Client-only application using static datasets (`demo.ts`) and browser `localStorage`. |

---

## 5. Non-Functional & Accessibility Requirements

1. **Lightweight Execution:** Must execute smoothly on low-power devices (Android Go, low-spec tablets).
2. **Accessible Typography:** High contrast ratios ($> 4.5:1$), enlarged text mode (112.5%), and reduced motion preference toggles.
3. **Multilingual Architecture:** Interface labels and voice models structured for English (`en`), Hindi (`hi`), and Kannada (`kn`).
4. **Zero Unintended Data Usage:** Downloads disabled over mobile tethering unless explicitly permitted.
