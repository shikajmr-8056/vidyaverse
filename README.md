# VidyaVerse — A Universe of Learning

> **A Rural-First, Offline-Capable STEM & Curriculum Learning Platform**  
> Designed for government and low-resource schools across India, built with React 19, TanStack Start, TanStack Router, and Tailwind CSS v4.

---

## 1. Project Overview

**VidyaVerse** bridges educational disparities for students in remote, low-connectivity regions. Traditional edtech assumes persistent high-speed 4G, continuous phone recharges, and high-end personal devices. VidyaVerse is engineered for the realities of rural schools: shared budget tablets, intermittent electrical load-shedding, zero mobile data budgets, and local solar-powered Wi-Fi micro-hubs.

### Key Capabilities
- **Curriculum-Mapped Modules:** Rigorous NCERT Class 5–8 Mathematics, Science, Computing, and Social Science with local village analogies.
- **STEM Studios:**
  - **PlayLab:** Curriculum through gameplay (Math Ludo, CodeBot Maze, physical zero-screen companions).
  - **CircuitVerse:** Interactive breadboard simulator with real-time Ohm’s Law calculation and LED burnout warnings.
  - **CodeVerse:** Visual block-coding engine translating loops and conditionals to Python & Arduino C++.
- **Role-Based Portals:**
  - **Student Explorer:** Learning-centered dashboard, continuous lesson resumption, daily quests, and spendable Sparks Bazaar.
  - **Teacher Portal:** Cohort diagnostic heatmaps, concept misconception detection, revocable class tokens, and offline sync tracking.
  - **Parent / Guardian Portal:** Transparent child activity tracking, attendance, offline hours, and zero child data tracking.
- **Offline-First Mesh Architecture:** Operates completely offline; caches content locally; queues progress events with anti-tampering bounds; and reconciles automatically when near the school micro-hub.

---

## 2. Architecture & Technology Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router) with strict type-safe search parameters and route trees.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with customized CSS design tokens (`src/styles.css`).
- **Icons & UI Primitives:** [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), and `@/components/vv/primitives`.
- **Data Visualizations:** [Recharts](https://recharts.org/) adapted dynamically for light/dark themes.
- **Local Persistence & Sync:** In-memory store with `localStorage` fallback (`safeStorage`) and tamper-resistant event queues.

---

## 3. Honest Simulation & Prototype Boundaries

In accordance with our transparent engineering standards, this repository functions as an **advanced offline-first interactive prototype / pilot platform**:

| Feature Area | Production-Ready (Verified) | Simulated in Prototype |
| :--- | :--- | :--- |
| **Routing & Navigation** | Fully implemented across all 18 routes, role-based shells, and mobile drawers. | None |
| **STEM Studios (PlayLab, Circuit, Code)** | Full interactive logic, Ohm's law physics engine, block algorithmic execution, and maze pathfinding. | Physical hardware Bluetooth bridge |
| **Offline Persistence** | Real client-side local cache, queue management, idempotent deduplication, and retry logic. | Physical Raspberry Pi mesh hub (simulated local latency: 350ms) |
| **Gamification & Bazaar** | Strict lifetime XP monotonicity, spendable Sparks decoupling, and duplicate reward prevention. | Real payment/physical shipping integration |
| **AI Pedagogical Tutor** | In-browser NCERT Class 6–8 reasoning engine with step-by-step scaffolding and uncertainty boundaries. | Direct external Cloud LLM API (isolated for zero child data leakage) |
| **Authentication & RBAC** | Role-based navigation guards, demo personas, pin verification, and credential sanitization. | Production OAuth / SMS OTP provider |

---

## 4. Getting Started & Development

### Prerequisites
- Node.js `20.x` or later
- npm `10.x` or later

### Installation & Local Run
```bash
# Clone the repository
git clone <repository-url>
cd pixel-perfect-match-9202

# Install dependencies
npm install

# Start the development server (runs on port 8081 or next available)
npm run dev
```

Visit `http://localhost:8081` in your browser.

---

## 5. Verification & Testing

Every pull request and modification must satisfy the full automated test suite and type safety checks:

```bash
# Run Vitest test suites (10 suites, 74 automated tests passing)
npm run test -- --run

# Run strict TypeScript typecheck
npx tsc --noEmit

# Run full production build (TanStack Router + Nitro server output)
npm run build
```

---

## 6. Child Data Privacy & Security Commitments

VidyaVerse is built strictly around **Privacy by Design**:
1. **Zero Child PII:** No Aadhaar numbers, phone numbers, GPS coordinates, or biometrics are ever requested or stored.
2. **Pseudonymized Leaderboards:** Public competitions display only truncated first names and initials (`Ananya R.`).
3. **Revocable Class Tokens:** Classroom codes (e.g., `SCI7B`) are lightweight enrollment tokens that instructors can revoke or rotate instantly if compromised.
4. **Anti-Tampering XP Bounds:** Event queues enforce strict bounds on client-claimed XP (e.g. max 25 XP per lesson, 50 XP per quiz) preventing client score inflation.

---

## 7. Documentation Index

Detailed architectural specifications are maintained in the `/docs` directory:
- [`docs/PRD.md`](docs/PRD.md): Product requirements, personas, and feature matrix.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): System architecture, mesh sync lifecycle, and data flow.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md): Purple & Lavender design tokens, typography, and responsive matrix.
- [`docs/SECURITY.md`](docs/SECURITY.md): Child data protection and role authorization boundaries.
- [`docs/UX_FLOWS.md`](docs/UX_FLOWS.md): Interactive user journeys across student, teacher, and parent roles.
