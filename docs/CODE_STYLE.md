# VidyaVerse — Code Style & Component Standards (CODE_STYLE.md)

> **Consistency Rule:** All AI agents and human contributors must follow these coding conventions to preserve quality and avoid regressions.

---

## 1. TypeScript & Strict Type Safety

1. **Strict Compiler Options:**
   - The repository operates under strict compiler settings in `tsconfig.json`.
   - **`exactOptionalPropertyTypes: true`:** When typing optional search parameters or object fields, declare them as `T | undefined` if undefined can be assigned. Example:
     ```typescript
     // Correct
     validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
       q: typeof search["q"] === "string" ? search["q"] : undefined,
     })
     ```
2. **No `any`:** Avoid `any` types. Use explicit interfaces or `unknown` with type narrowing.
3. **Index Signatures:** Always access unknown record keys using bracket notation (`search["key"]`) rather than dot notation (`search.key`).

---

## 2. React 19 Component & Feature Architecture

1. **Feature-Based Modular Structure (`src/features/*`):**
   - Feature views and complex UI components reside in their designated directory under `src/features/<feature-name>/`.
   - Each feature encapsulates its sub-components, dialogs, state handlers, and simulation engines.
2. **Thin Routing Wrappers (`src/routes/*`):**
   - TanStack route files in `src/routes/` serve solely as thin routing and page-composition layers (< 35 lines).
   - Route files declare `createFileRoute`, route `loader`, `validateSearch`, SEO `head` metadata, and `notFoundComponent`, delegating the actual view rendering to the corresponding `src/features/*` component.
3. **Functional Components:** Always use modern functional components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
4. **Import Ordering:**
   ```typescript
   // 1. External frameworks & router
   import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
   import { useState, useEffect } from "react";
   
   // 2. Feature Views
   import { DashboardView } from "@/features/dashboard/dashboard-view";
   
   // 3. UI Primitives & Components
   import { Button } from "@/components/ui/button";
   import { Badge } from "@/components/ui/badge";
   import { Panel, PageHeader, Meter, DemoTag, IconBox } from "@/components/vv/primitives";
   
   // 4. State & Hooks
   import { useDemo } from "@/lib/demo-store";
   
   // 5. Data & Constants
   import { lessons, demoStudent, getSubjectTheme } from "@/data/demo";
   ```
5. **Semantic HTML & Accessibility:**
   - Use `<main>`, `<nav>`, `<aside>`, `<section>`, `<article>`, `<header>`, and `<footer>`.
   - Accessible descriptions: Provide `aria-label` or `sr-only` descriptions on icon-only buttons.
   - Use `<dl>`, `<dt>`, `<dd>` for metrics and stat tiles.

---

## 3. Tailwind CSS v4 Styling Guidelines

1. **Semantic CSS Variables:** Favor semantic classes over ad-hoc colors:
   - Surfaces: `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
   - Typography: `text-foreground`, `text-muted-foreground`
   - Borders: `border-border`
   - Primary: `bg-primary text-primary-foreground`
2. **Explicit Brand Palette Usage:**
   - Primary Accent Purple: `#6541F5` (or `bg-[#6541F5]`, `text-[#6541F5]`)
   - Deep Purple: `#5230E8`
   - Soft Lavender: `#D8D5FF` (`bg-[#D8D5FF]/35 text-[#5230E8]`)
   - Success Green: `#31B98A`
   - Warning Saffron: `#F4B942`
3. **Class Merging:** Always use `cn(...)` from `@/lib/utils` for conditional styles:
   ```typescript
   className={cn(
     "rounded-xl border border-border bg-card p-4 transition-all",
     isActive && "border-[#6541F5] shadow-sm"
   )}
   ```
4. **Prohibited Patterns:**
   - **Do NOT re-introduce the old dark navy (`#0B1020`, `#171936`) and neon cyan (`#38D9F5`) as the default UI.**
   - Do NOT use inline style attributes for static layout rules. Use Tailwind classes.
