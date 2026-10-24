# VidyaVerse — Security, Privacy & Compliance (SECURITY.md)

> **Core Mandate:** Absolute child privacy, zero data exploitation, and tamper-resistant offline sync  
> **Applicable Policies:** India Digital Personal Data Protection (DPDP) Act compliance, COPPA-aligned child privacy rules

---

## 1. Zero Child Data Exposure (Privacy First)

VidyaVerse is designed for rural minors who may share household devices. The platform enforces strict data minimization:

1. **No Real PII:** The platform does not collect, store, or transmit:
   - Phone numbers or email addresses of students
   - Aadhaar numbers, government IDs, or banking details
   - Real-time GPS coordinates or home addresses
   - Biometric data or raw camera facial scans
2. **Demonstration Records:** All student records (`Ananya R.`, `Class 7B`) in the codebase are mock pedagogical demonstrations.
3. **No Commercial Trackers:** No third-party behavioral analytics, ad SDKs, or social tracking pixels are permitted in the codebase.

---

## 2. Role-Based Access Control (RBAC)

### Current Implementation:
A client-side role simulator in `_shell.tsx` allows switching between:
* **`student`**: Full access to dashboard, labs, games, quizzes, and personal portfolio.
* **`teacher`**: Access to classroom grade rosters, assignments creator, and gap analytics (`/teacher`).
* **`parent`**: Access to guardian summaries, screen time tracking, and kitchen-math home activities (`/parent`).

### Future Production Requirements:
* Transition client role state to cryptographically signed JWTs or session tokens.
* Enforce server-side authorization checks on all teacher-level mutations (assignment creation, grade overrides).
* Parents must strictly authenticate via one-time PIN (OTP) linked only to their student's anonymized identifier.

---

## 3. Offline & Mesh Network Security

1. **Anti-Tampering for Offline Scores:**
   - When a student completes a quiz in `offline` mode, the action must be stored with a monotonic sequence counter and a local HMAC hash.
   - Upon mesh connection to the Raspberry Pi hub, the hub verifies timestamp coherence before crediting leaderboard XP to prevent client-side score manipulation.
2. **Local Mesh Wi-Fi Isolation:**
   - The school micro-hub operates a private subnet (`192.168.x.x`). Peer-to-peer traffic between student tablets is blocked; tablets can only communicate with the local content server port.

---

## 4. Frontend Code Security Guidelines

1. **XSS Protection:**
   - Never use `dangerouslySetInnerHTML` for student inputs or quiz rationales. All content must be rendered via React's default JSX escapement.
2. **Secret Management:**
   - Never commit API keys, cloud tokens, or database connection strings to git repositories.
   - Future backend credentials must be provided via environment variables (`.env`).
3. **Content Security Policy (CSP):**
   - Restrict external script and stylesheet injection. Only trusted fonts (Google Fonts) and CDNs may be referenced.
