# VidyaVerse — User Journeys & Interaction States (UX_FLOWS.md)

> **Focus:** Seamless pedagogical flow, motivating feedback loops, and intuitive navigation for rural learners.

---

## 1. Primary User Journeys

```
                    +------------------------------------+
                    |       1. Daily Learning Loop       |
                    +------------------------------------+
                                      |
                                      v
  Dashboard ────────> Continue Lesson ────────> Practice Quiz ────────> XP & Level Up
  (View Streak & XP)  (Read Analogy/Video)     (Instant Feedback)       (Toast + Sound)
                                                                               |
                                                                               v
                                                                        Daily Mission
                                                                          Completed!
```

### Journey 0: Public Entry & Role Portal Authentication Flow (`/` → `/auth`)
1. **Public Discovery (`/`):** Prospective student, educator, or parent visits the home landing page.
2. **Product Comprehension:** Learns about the 4-step learning journey, STEM modules (PlayLab, CircuitVerse, CodeVerse), and the zero-cellular school mesh.
3. **Portal Selection (`/auth`):** Taps **"Sign In"** or **"Get Started"** in the compact header. Lands on the Portal Selection screen with 3 distinct options: *Student Explorer*, *Teacher & Educator*, and *Parent & Guardian*.
4. **Credential Entry & Demo Shortcut:**
   - User selects persona.
   - Dedicated role form loads with accessible inputs, password/PIN visibility toggle, and clear validation feedback.
   - For fast trial, user taps **"Autofill Demo"** to pre-populate verified persona credentials.
5. **Authorization Verification:** Form submits with simulated 500ms authorization check.
6. **Portal Routing:** On verification, user session is assigned the authorized role (`student`, `teacher`, or `parent`) and routed directly into their corresponding portal (`/dashboard`, `/teacher`, or `/parent`).

---

### Journey 1: Student Daily Learning Routine
1. **Entry:** Student opens `http://localhost:8080/dashboard`.
2. **Status Check:** Observes streak count (`6 days`) and daily mission progress.
3. **Resume Learning:** Clicks **"Resume learning"** on the featured purple gradient banner.
4. **Lesson Engagement (`/lesson/$id`):** Reads core objectives, checks analogies, downloads offline pack if needed.
5. **Knowledge Check (`/quiz/$id`):** Takes a 4-question check. Correct answers turn green with explanations; mistakes offer clear diagnostic tips.
6. **Progression Reward:** Scores 100%, earning +50 XP and unlocking the "Quiz Ace" achievement. The dashboard mission changes to "Completed ✓".

---

### Journey 2: Hands-On STEM Lab Flows (PlayLab, CircuitVerse & CodeVerse)
#### 2.1 PlayLab Curriculum Game Flow (`/playlab`):
1. **Library Exploration:** Student filters games by subject (Mathematics, Computing, Science) and format (Digital Game, Board Game Companion).
2. **Game Card Preview:** Inspects educational objective, target grade, play duration, and instructions before starting.
3. **Interactive Play (e.g. CodeBot Maze):**
   - Reads progressive level challenge (e.g. Level 1: "Straight Line Navigation", Level 2: "90° Turn Around Obstacle").
   - Queues movement commands into program queue (`move_forward`, `turn_right`, `turn_left`).
   - Taps "Step" or "Run Program" to trace the robot's coordinates on the grid.
   - If stuck, taps "Show Progressive Hint" for strategic advice.
4. **Victory & Anti-Farming XP:** On reaching goal, receives celebration modal and idempotent XP (+30 XP once per level tier).
5. **Physical Companion Exploration:** Switches to *Bharat Explorer* companion tool, enters clue code from physical tabletop board, validates clue coordinates, and reveals solution.

#### 2.2 CircuitVerse Electronics Learning Flow (`/circuitverse`):
1. **Mode Selection:** Student selects from Guided Experiments, Virtual Breadboard Workbench, Theory, or Physical Kit Guide.
2. **Interactive Circuit Building:**
   - Selects power supply (9V battery, 5V DC rail, 3V coin cell).
   - Chooses resistor value (100Ω to 10kΩ) and LED color (Red, Green, Amber, Blue).
   - Toggles knife switch S1 to close the loop.
3. **Physics Telemetry & Diagnostics:**
   - Real-time current calculation ($I = (V_s - V_f)/R$) updates ammeter and voltmeter readouts.
   - Selecting an under-rated 100Ω resistor on 9V immediately flashes **"Burnout Danger: Current exceeds 25mA"** diagnostic alert.
   - Adjusting to recommended 330Ω restores safe illuminated state ($21.8\text{ mA}$).
4. **Guided Lab Completion:** Completes Experiment 1 ("Ohm's Law in Action") by calibrating resistance into target range and claims verified lab completion (+35 XP).
5. **Physical Kit Bridge:** Reviews physical breadboard pin diagram, LED polarity (longer anode pin), and 4-band resistor color code chart.

#### 2.3 CodeVerse Computational Thinking Flow (`/codeverse`):
1. **Curriculum Progression:** Student navigates algorithmic progression (Sequencing → Loops → Conditionals).
2. **Challenge Workspace (`/codeverse`):**
   - Inspects Challenge 1: "Rover's First Flight Path" with learning objective, worked example, and test criteria.
   - Adds visual blocks (`move_forward()`, `turn_right()`) to the command queue.
   - Taps "Step" or "Run & Test Solution".
3. **Automated Test Suite:**
   - Test cases execute against simulator state (Destination Reached, Zero Collisions, Efficiency).
   - Green checkmarks confirm tests pass; automated feedback explains any boundary violations.
4. **Real-World Code Bridge:**
   - Switches between "Visual Blocks", "Python 3 Preview", and "Arduino C++ Preview" tabs to view syntax equivalents.
   - Reads educational disclaimer clarifying block simulation vs native compiled runtime.
5. **Mobile Responsiveness:**
   - On small screens, navigates effortlessly via bottom mobile tab bar (`Blocks`, `Canvas`, `Console`, `Syntax Code`).

---

### Journey 3: Concept Detective Misconception Diagnosis (`/tutor`)
1. **Trigger & Inquiry:** Student enters query or clicks a flagged misconception: *"Why can't we add 1/2 + 1/3 as 2/5?"*
2. **Approved Syllabus Grounding:** Tutor identifies matching NCERT Class 7 unit: *Ch 2 Fractions & Decimals*. Shows grounding badge with direct lesson link.
3. **Scaffolded Explanation Tabs:**
   - **Step-by-Step Breakdown:** Steps 1 to 3 detailing denominators as slice sizes, equalizing cut sizes into sixths ($3/6 + 2/6$), and combining like pieces ($5/6$).
   - **Village Analogy:** Explains sharing chapatis at home—half a chapati plus a third gives more than a half, while $2/5$ is less than a half.
   - **Hints-First Toggle:** Student can reveal progressive hints before reading the entire solution.
4. **Knowledge Verification Check:** Follow-up multiple-choice question ($1/4 + 1/2$) rewards +20 XP upon correct answer.
5. **Recommended Follow-Ups:** Quick chips allow student to explore related questions (e.g. *"Why do we need a common denominator?"*).
6. **Uncertainty & Scope Boundary:** If an out-of-syllabus question is entered (e.g. quantum physics), the tutor transparently alerts that the topic is outside the Class 6-8 NCERT scope and advises consulting the teacher.

---

### Journey 6: VidyaVerse Voice Tap-to-Talk & Read-Aloud (`/voice`)
1. **Initiation:** Student taps the microphone touch target on the console. State transitions to `Listening`.
2. **Command Execution:**
   - Student speaks *"Open fractions lesson"* (or types it into the Text Alternative box).
   - Audio visualizer pulses during speech.
   - Command parser matches `Navigated to /lesson/fractions-intro` and displays a direct action button.
3. **Spoken Feedback & Synthesis:**
   - Browser Web Speech synthesis speaks the response aloud in English, Hindi, or Kannada.
   - Student can tap the button again or click "Cancel & Reset Audio" at any time.
4. **Curriculum Read-Aloud Practice:**
   - Student clicks "Read Aloud" on an approved textbook definition snippet.
   - Audio speaks the sentence aloud to assist low-literacy or first-generation learners.
5. **Offline Language Pack Management:**
   - Student or teacher reviews the downloadable language models (Hindi 45MB, Kannada 48MB, English 38MB) to prepare the device for zero-cellular offline use.

### Journey 4: Curriculum Navigation & Structured 7-Part Lesson Experience (`/learn` → `/lesson/$id`)
1. **Curriculum Selection (`/learn`):** Student filters by Board (NCERT / Karnataka State Board), Grade (Class 6-8), Subject (Mathematics, Science, English, Social Science, Computing), and Language (English, Hindi, Kannada).
2. **Offline Availability Filter:** Toggles "Downloaded Only" to focus on cached content when learning without cellular connectivity.
3. **Chapter Overview:** Expands chapter card to review learning objectives, duration, and completion progress.
4. **Interactive Lesson Engagement (`/lesson/$id`):**
   - Video player with play/pause, scrubber bar, playback speed options (0.75x–1.5x), and captions toggle.
   - Multilingual closed captions and full transcript tab in English, Hindi, and Kannada.
   - Core syllabus notes, key term definitions, and worked examples.
   - In-lesson Guided Practice question with instant feedback before attempting the full assessment.
5. **STEM Sandbox Exploration:** Clicks related STEM activity link (PlayLab, CircuitVerse, or CodeVerse) to apply concepts hands-on.
6. **Assessment & Completion:** Marks lesson completed (+25 XP) or launches chapter assessment quiz (`/quiz/$id`).

---

### Journey 5: Rural Classroom Cohort & Teacher Command Flow (`/teacher` & `/classrooms`)
1. **Teacher Overview & Actionable Alerts (`/teacher`):**
   - Teacher Mrs. Lakshmi logs in to the Instructor Command Hub.
   - Observes flagged alert: Demo Student 02 struggles with "Comparing fractions" (score 64%), and Demo Student 04 has not synced since 5 Oct.
   - Clicks "Deploy Assignment", selects Class 7B, sets kind to "Quiz", and queues "Simple circuits check". The task is automatically staged for broadcast over the Kalyan School Mesh Hub.
2. **Classroom Administration & Revocable Tokens (`/classrooms`):**
   - Teacher inspects section `SCI7B` and displays join code on blackboard.
   - If code security is compromised, teacher clicks **"Revoke & Regenerate"**, invalidating the old code and issuing a new token.
   - Organizes classroom resources (NCERT PDFs, circuit guides).
3. **Student Enrollment & Tri-State Offline Task Execution (`/classrooms`):**
   - Student enters join code `SCI7B` and enrolls.
   - Observes assigned tasks categorized into 3 explicit states:
     - `Completed & Synced` (Recorded on central hub).
     - `Finished Offline (Pending Sync)` (Finished on tablet, awaiting Wi-Fi Direct bubble).
     - `Incomplete / Due Soon` (Pending student action).
4. **Offline Sync Reconciliation:**
   - When student device reconnects to school Raspberry Pi hub, offline quiz results upload safely via CRDT reversible log.
   - Teacher roster reflects updated scores and clears pending alerts.
   - Teacher exports cohort diagnostic report to CSV with one click.

---

### Journey 7: Guardian Home Review & Child Privacy (`/parent`)
1. **Authorized Child Boundary:**
   - Guardian logs in and is restricted strictly to linked child *Ananya R.* (Class 7B). Classmate data remains private.
2. **Learning Overview & Real Accomplishments:**
   - Reviews Ananya's 6-day streak, 1,240 XP, and 75%+ mastery across Mathematics and Science.
   - Celebrates real completed STEM portfolio projects (Emergency Lantern circuit, Irrigation logic).
3. **Everyday Home Guidance (No Device Needed):**
   - Guardian reads practical, non-punitive suggestions:
     - *Kitchen Math:* Ask Ananya to demonstrate $1/2$ and $1/4$ slices while making chapatis.
     - *Torch Switch:* Ask how a flashlight switch works like an irrigation canal gate.
4. **Privacy & Communication Controls:**
   - Guardian toggles leaderboard pseudonymization (*Ananya R.* vs Hidden).
   - Manages weekly SMS digests and receives assurance that no child phone numbers or biometrics are ever commercialized.

---

## 2. Interaction States & Edge Cases

| State Type | Trigger Scenario | Expected UI Behavior |
| :--- | :--- | :--- |
| **Empty State** | No downloads saved in `/downloads` | Displays clear illustration, storage capacity gauge, and "Browse recommended packs" button. |
| **Offline Mode** | Simulated offline disconnect | Changes top pill to amber `#F4B942`, increments pending sync counter, displays banner explaining local caching. |
| **Circuit Overload** | 0Ω resistance set with 9V battery | Shows warning badge, flashes red LED overload indicator, and explains thermal fuse trip. |
| **Invalid Join Code** | Student enters unknown class code | Highlights input border in destructive red with helper text: *"Code not found. Ask your teacher for the 5-character class code."* |
| **Mobile Navigation** | Screen width $< 640\text{px}$ (mobile) | Desktop sidebar hides; fixed 5-tab bottom navigation provides 4 role-tailored primary destinations + 'More' drawer trigger. |
| **Tablet Navigation** | Screen width $640\text{px} - 1023\text{px}$ (tablet) | Sidebar collapses into accessible icon rail with hover/focus tooltips, maximizing horizontal reading width for STEM labs. |
| **Role Isolation** | Switching between Student, Teacher, Parent | Sidebar and mobile drawer dynamically reconfigure into role-exclusive routes; portal routes never leak across boundaries. |

---

## 3. Responsive Application Shell Specifications

### Desktop ($\ge 1024\text{px}$)
- **Collapsible Sidebar:** Full $256\text{px}$ (`w-64`) grouped navigation by default with instant collapse toggle to $80\text{px}$ (`w-20`) rail.
- **Accessible Tooltips:** When collapsed, all icons feature Radix Tooltips with localized labels and badge pills.
- **Sticky Top Bar:** Compact context with current portal badge, page heading, search bar (`Ctrl+K`), connectivity simulator, language selector, theme toggle, notifications dropdown, and role switcher.
- **Main Area:** Centered container with `max-w-7xl` constraint, uniform padding, and clear heading hierarchy without competing nested borders.

### Tablet ($640\text{px} - 1023\text{px}$)
- **Default Rail:** Sidebar starts in collapsed mode (`w-20`) to preserve wide reading widths for tables, circuits, and charts.
- **Full Usability:** Retains collapse/expand toggle on demand; touch targets strictly $\ge 44\text{px}$.

### Mobile ($< 640\text{px}$)
- **Hidden Sidebar:** Desktop sidebar is completely hidden to eliminate horizontal crowding.
- **Bottom Navigation Bar:** Fixed bottom bar with 4 role-specific primary links (e.g. Student: Home, Learn, PlayLab, Progress) + a 5th "More" tab.
- **Secondary Drawer:** Tapping "More" slides out a full left-hand drawer containing remaining categorized routes, school sync actions, and theme switchers. Safe padding on main area (`pb-24`) prevents bottom bar overlap.

