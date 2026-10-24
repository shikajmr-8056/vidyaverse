# VidyaVerse — Testing Strategy & Quality Assurance (TESTING.md)

> **Mandatory Rule for AI Agents:** NEVER claim a test, typecheck, or build passed unless you actually executed the command and observed an exit code of 0.

---

## 1. Quality Validation Commands

Before completing any task, run the following verification pipeline in order:

```bash
# 1. Typecheck validation (Must exit with code 0)
npx tsc --noEmit

# 2. Automated test suite
npm test

# 3. Linter verification
npm run lint

# 4. Production build bundle validation
npm run build
```

---

## 2. Critical User Flows for Manual & Automated Verification

### Flow 1: Dashboard Rendering & Layout Health
* **URL:** `http://localhost:8080/dashboard`
* **Checks:**
  1. Stat tiles display XP (`1,240`), Level (`5`), and Streak (`6 days`).
  2. "Continue learning" banner renders in gradient purple (`#5230E8` $\rightarrow$ `#6541F5`) with green progress bar (`#31B98A`).
  3. Clicking "Resume learning" navigates cleanly to `/lesson/fractions-intro`.
  4. Header shows search input, connection status pill, language picker, and theme toggle.

### Flow 2: Theme Switching (Dual-Theme Stability)
* **URL:** `http://localhost:8080/dashboard` or `/settings`
* **Checks:**
  1. Clicking Moon icon switches `<html>` class to `dark`, activating the charcoal/purple surface theme.
  2. Clicking Sun icon restores `light` mode (white cards, `#F5F5FF` background).
  3. Refreshing the browser preserves the chosen theme via `localStorage`.

### Flow 3: PlayLab Maze Runner Execution
* **URL:** `http://localhost:8080/playlab`
* **Checks:**
  1. Navigate to "CodeBot Maze" tab.
  2. Click directional command buttons ("Step Forward", "Turn Right", etc.) to queue actions.
  3. Click "Run CodeBot" to animate the robot.
  4. Reaching the goal triggers success toast and awards XP.

### Flow 4: CircuitVerse Virtual Breadboard
* **URL:** `http://localhost:8080/circuitverse`
* **Checks:**
  1. Toggle Switch to "Closed".
  2. Adjust Voltage slider (e.g., 9V) and Resistor slider (e.g., 330Ω).
  3. Verify mathematical Ohm's Law calculation ($I = V/R \approx 27.27\text{ mA}$) updates.
  4. Ensure LED turns on and glows green.
  5. Dragging resistor to 0Ω triggers the overload burnout warning.

### Flow 5: AI Concept Detective Diagnosis
* **URL:** `http://localhost:8080/tutor`
* **Checks:**
  1. Click sample question: *"Why do we need equal parts in a fraction?"*
  2. Verify Concept Detective responds with village roti analogy explaining equal parts.
  3. Verify remediation practice question renders and accepts answer selection.

### Flow 6: Classroom Join Code
* **URL:** `http://localhost:8080/classrooms`
* **Checks:**
  1. Enter join code `MATH7` and submit.
  2. Verify "Class 7 Mathematics" appears in the active cohorts list.
  3. Toast notification confirms enrollment.

### Flow 7: Offline Network Simulation & Reconciliation
* **URL:** `http://localhost:8080/mesh` or top bar network dropdown
* **Checks:**
  1. Switch connection simulator to "Autonomous Offline".
  2. Complete an action (e.g., daily challenge).
  3. Verify "Pending sync" badge increments in the sidebar footer.
  4. Click "Force Sync Now" and verify queue reconciles to 0.
