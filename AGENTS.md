<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# VidyaVerse — AI Coding Agent Instructions & Vibe Coding Blueprint

Welcome, AI coding assistant. This repository follows **The Vibe Coding Blueprint**—a documentation-driven development process. All future AI-generated modifications must conform to the project specifications, design tokens, security boundaries, and validation criteria established here.

---

## 1. Documentation Map (Source of Truth)

Before modifying code or planning features, read the relevant documentation in `docs/`:

| Document | Path | Focus Area |
| :--- | :--- | :--- |
| **Product Requirements** | [`docs/PRD.md`](file:///d:/repos/pixel-perfect-match-9202/docs/PRD.md) | Vision, user personas, all 18 routes, status matrix |
| **Design System** | [`docs/DESIGN_SYSTEM.md`](file:///d:/repos/pixel-perfect-match-9202/docs/DESIGN_SYSTEM.md) | Colors, typography, spacing, UI primitives, dark mode |
| **System Architecture** | [`docs/ARCHITECTURE.md`](file:///d:/repos/pixel-perfect-match-9202/docs/ARCHITECTURE.md) | TanStack Start, React 19, Vite, state flow, mesh model |
| **Data Entities** | [`docs/DATABASE.md`](file:///d:/repos/pixel-perfect-match-9202/docs/DATABASE.md) | In-memory models, TypeScript types, validation rules |
| **Security & Privacy** | [`docs/SECURITY.md`](file:///d:/repos/pixel-perfect-match-9202/docs/SECURITY.md) | Child data privacy, RBAC, offline sync tamper-resistance |
| **Code Conventions** | [`docs/CODE_STYLE.md`](file:///d:/repos/pixel-perfect-match-9202/docs/CODE_STYLE.md) | TypeScript rules, Tailwind CSS v4, component guidelines |
| **Testing Strategy** | [`docs/TESTING.md`](file:///d:/repos/pixel-perfect-match-9202/docs/TESTING.md) | Verification commands, critical user flows, test cases |
| **UX Flows** | [`docs/UX_FLOWS.md`](file:///d:/repos/pixel-perfect-match-9202/docs/UX_FLOWS.md) | User journeys, interactive loops, edge cases |

---

## 2. Core Agent Instructions

When working on this repository, you must strictly obey these 12 rules:

1. **Read Relevant Documentation First:** Check `docs/` for established patterns, constraints, and requirements before writing or modifying code.
2. **Inspect Before Editing:** Always inspect existing files, dependencies, routes, and components before making edits. Do not assume APIs or props.
3. **Provide an Implementation Plan:** Identify affected files and state a concise, step-by-step plan before making changes.
4. **Reuse Existing Primitives:** Use `@/components/vv/primitives` (`Panel`, `PageHeader`, `Meter`, `IconBox`, `DemoTag`, `NetworkTag`) and Radix components from `@/components/ui/`.
5. **Preserve Visual Theme:** Keep the existing **Purple & Lavender** UI palette (`#6541F5`, `#5230E8`, `#D8D5FF`, `#F5F5FF`, `#FFFFFF`, `#31B98A`, `#F4B942`). Never revert to the old dark navy and neon cyan theme as default.
6. **Make Focused, Surgical Changes:** Avoid rewriting entire files or reconstructing working features when making targeted improvements.
7. **Enforce Child Privacy & Security:** Never introduce tracking pixels, third-party analytics, or collect personal identifiers (phone numbers, Aadhaar, biometrics).
8. **Run Quality Validation Commands:** Always execute `npx tsc --noEmit` and relevant tests. Confirm an exit code of 0 before completing your turn.
9. **Update Documentation:** If you add routes, change schemas, or alter product behavior, update the corresponding file in `docs/`.
10. **Be Transparent in Reporting:** Clearly state what changed, which commands were executed, and what items remain incomplete or simulated.
11. **Never Falsify Test Results:** NEVER claim a test, lint, or build command succeeded unless you actually executed it in the shell and verified the output.
12. **Ask When Conflicted:** If a user request contradicts the established design system or architectural requirements, ask for clarification.

---

## 3. Standard Implementation Workflow

Follow this sequence for all substantive feature work:

```
[1. Requirements]       Review docs/PRD.md and user prompt
       ↓
[2. UX Flows]           Map user steps and interaction states (docs/UX_FLOWS.md)
       ↓
[3. Design System]      Apply semantic tokens & primitives (docs/DESIGN_SYSTEM.md)
       ↓
[4. Architecture/Data]  Define types, state mutations & validation (docs/DATABASE.md)
       ↓
[5. Security]           Verify child privacy and input sanitization (docs/SECURITY.md)
       ↓
[6. Implementation]     Write minimal, high-quality, type-safe React code
       ↓
[7. Testing]            Execute npx tsc --noEmit, test suites, and browser checks
       ↓
[8. Doc Update]         Sync docs/ if specifications or capabilities evolved
```

* **UI-Only Tasks:** Focus on steps 1, 2, 3, 6, and 7. Do not introduce premature backend services.
* **Backend/Data Tasks:** Complete steps 1 through 7, paying particular attention to steps 4 and 5.
* **Single Coherent Scope:** Complete one feature or bugfix at a time with clear acceptance criteria.
