# VidyaVerse — Design System Specification

> **Version:** 2.0 (Purple & Lavender Unified System)  
> **Framework:** Tailwind CSS v4 + Radix UI + CSS Variables  
> **Source of Truth:** `src/styles.css` and `src/components/vv/primitives.tsx`

---

## 1. Color Palette & Semantic Tokens

### 1.1 Primary Palette (Default Light Mode)

The default theme uses a crisp, friendly, and pedagogical palette with white card surfaces placed on an ultra-light lavender background:

| Token Name | Hex Code | Semantic Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Accent Purple** | `#6541F5` | `--primary`, `--color-purple` | Active sidebar badges, primary action buttons, selected tabs, progress bars |
| **Deep Purple** | `#5230E8` | `--color-purple-deep` | Featured "Continue Learning" card background, high-contrast headings, focus states |
| **Soft Lavender** | `#EAE7FF` | `--color-lavender` | Highlighted section backgrounds, subject pill backgrounds, subtle card accents |
| **Page Background** | `#F5F5FA` | `--background` | Clean light dashboard background surface |
| **Card Background** | `#FFFFFF` | `--card` | Elevated white card panels with subtle border |
| **Main Text** | `#26263A` | `--foreground` | Primary titles, headlines, table contents, and high-emphasis body copy |
| **Secondary Text** | `#77778D` | `--muted-foreground` | Subtitles, chapter descriptions, metadata, inactive icons, timestamps |
| **Borders** | `#E7E7EF` | `--border` | Subtle strokes separating cards, list items, and header panels |
| **Blue & Tint** | `#42A5E8` / `#DDF2FC` | `--color-blue` | Mathematics badge, Weekly Activity line, Class stats, level indicators |
| **Teal & Tint** | `#19B99A` / `#DDF8EE` | `--color-teal` | Science badge, Concept Mastery Index, Verified Mastery bars, Circuit status |
| **Green** | `#28B987` | `--color-green` | Completed quizzes, "Online" network pill, positive progress delta |
| **Pink & Tint** | `#E95778` / `#FCE5EB` | `--color-pink` | Daily Streak counter, English subject badge, Flagged interventions |
| **Orange & Tint** | `#F5A623` / `#FFF0D5` | `--color-orange` | Daily Quest progress, Social Science badge, STEM portfolio badge, Medals |
| **Destructive** | `#F43F5E` | `--color-destructive` | Reset actions, error states, circuit burnout warnings |

### 1.2 Charcoal Dark Mode

Activated via `.dark` on `<html>`. Replaces white surfaces with rich charcoal tones while keeping purple as the vivid accent:

| Token Name | Hex Code | Semantic Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#12121A` | `--background` | Deep charcoal page surface |
| **Card Background** | `#1C1C2A` | `--card` | Elevated dark card panels |
| **Sidebar Background** | `#161624` | `--sidebar` | Fixed desktop sidebar |
| **Primary Accent** | `#7C5CFA` | `--primary` | Lightened purple for dark mode contrast |
| **Border** | `#2A2A3E` | `--border` | Low-glare dark container boundaries |
| **Text Primary** | `#F0F0FA` | `--foreground` | Crisp off-white text |
| **Text Secondary** | `#9D9DB5` | `--muted-foreground` | Muted dark mode text |

---

## 2. Typography

* **Sans Font (Body & UI):** `"Inter", "Figtree", system-ui, sans-serif`
* **Display Font (Headings):** `"Lexend", "Inter", system-ui, sans-serif`
* **Monospace Font (Code & Scores):** `ui-monospace, "JetBrains Mono", monospace`

### Type Scale

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `28px` / `32px` | Bold (`700`) | `-0.02em` | Page Header, Hero title |
| **Section / H2** | `20px` / `24px` | Bold (`700`) | `-0.015em` | Panel titles, Featured Card titles |
| **Card / H3** | `15px` / `16px` | SemiBold (`600`) | `-0.01em` | Module cards, item titles |
| **Body Standard** | `14px` | Regular (`400`) | `normal` | Explanations, dialogue paragraphs |
| **Body Compact** | `12px` / `13px` | Regular / Medium | `normal` | Metadata, button labels, list items |
| **Caption / Badge** | `10px` / `11px` | Bold (`700`) | `+0.04em` | Tag uppercase labels, status pills |

---

## 3. Elevation, Radius & Spacing

* **Container Radii:**
  - Standard cards: `rounded-xl` (`12px` to `14px`)
  - Hero & Featured cards: `rounded-2xl` (`16px`)
  - Badges & Pills: `rounded-full` or `rounded-md` (`6px`)
* **Box Shadows:**
  - `shadow-soft`: `0 2px 8px 0 rgba(101, 65, 245, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)`
  - Active button shadow: `shadow-sm shadow-[#6541F5]/25`
* **Layout Geometry:**
  - Sidebar width: `w-64` (`256px`) fixed desktop navigation
  - Header height: `h-16` (`64px`) sticky top bar
  - Maximum content constraint: `max-w-7xl mx-auto` (`1280px`)

---

## 4. Reusable Primitives (`src/components/vv/primitives.tsx`)

1. **`Logo`**: Displays orbital star SVG icon with VidyaVerse branding.
2. **`DemoTag`**: Soft lavender badge (`bg-[#D8D5FF]/35 text-[#5230E8]`) indicating prototype elements.
3. **`NetworkTag`**: Color-coded pill (`#31B98A` online, `#6541F5` mesh, `#F4B942` offline).
4. **`PageHeader`**: Consistent title, description, and action button bar with bottom divider.
5. **`Panel`**: Standardized card container with optional header, icon, and right-hand action.
6. **`Meter`**: Progress bar supporting `tone="primary"`, `tone="success"`, and `tone="warning"`.
7. **`SimNote`**: Dashed lavender callout card explaining simulated prototype behaviors.
8. **`IconBox`**: 40px rounded box housing Lucide React icons with harmonious tinted backgrounds.
9. **`LessonThumbnailArt`**: Pedagogical vector SVG artwork headers for curriculum cards (fractions, circuits, plant nutrition, coding blocks, deccan topography, grammar).
10. **`StemStudioArt`**: Bespoke visual illustrations for exploration studios (PlayLab, CircuitVerse, CodeVerse, and Curriculum Library).

---

## 5. Accessibility Rules

1. **Contrast Compliance:** All text styles on light surfaces achieve WCAG AA contrast against `#FFFFFF` and `#F5F5FA` (minimum 4.5:1 for body copy).
2. **Reduced Motion:** When `reducedMotion` is toggled in Settings or system prefers reduced motion, transitions and animations collapse to `0.01ms`.
3. **Scalable Text:** The `largeText` toggle scales HTML root font-size to `112.5%` for readability on low-resolution tablets.
4. **Focus Rings:** High-visibility keyboard focus outline (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
5. **Touch Target Size:** Interactive buttons, tabs, and dismiss controls maintain a minimum target area of `44px × 44px` (or `36px × 36px` compact with surrounding padding).

---

## 6. Responsive Breakpoints & Viewport Matrix

VidyaVerse is verified across five standard responsive widths to ensure equitable access across diverse rural and urban classroom hardware:

| Breakpoint | Target Viewport | Target Device Profile | Layout Adaptations |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | `~360px` | Entry-level Android, low-cost rural smartphones | Single-column stack, mobile drawer nav, horizontal tabs overflow scrolling, compact card padding (`p-4` or `p-5`), zero horizontal overflow |
| **Standard Mobile** | `~390px` | Modern mobile phones (e.g. iPhone, Pixel) | Full-width cards, accessible touch targets, bottom bar shortcuts + drawer nav |
| **Tablet Portrait** | `~768px` | Low-cost school tablets (DIKSHA / Samagra Shiksha) | Two-column grid where beneficial, sidebar collapses to icon/drawer, touch-friendly tab list |
| **Tablet Landscape** | `~1024px` | Shared classroom displays & laptops | Collapsible sidebar expands, multi-column dashboard grid (8/4 split), detailed Recharts |
| **Desktop / Monitor** | `~1440px` | Teacher desk PCs, smart TVs & projectors | Fixed 256px sidebar, centered `max-w-7xl` content constraint, comfortable white-space |

---

## 7. Component Standardization Rules

### 7.1 Cards & Panels
- **Container:** Always use `Panel` from `@/components/vv/primitives` or `card-surface` with `rounded-2xl border border-border bg-card text-card-foreground shadow-sm`.
- **Padding:** Standard padding is `p-5 sm:p-6` (or `p-4` on compact sub-cards). Avoid nested cards inside cards that create visual clutter and double borders.
- **Accents:** Semantic accents must correlate with subject or functional state (Blue for Math, Teal for Science, Pink for Language, Orange for Quests/Rewards). Do not apply arbitrary bright borders to generic cards.

### 7.2 Dialogs & Modals
- **Mobile Centering & Safe Max-Height:** `DialogContent` utilizes `w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6`. This prevents modal clipping on small smartphone viewports.
- **Close Button:** Positioned with `h-8 w-8 rounded-full` and touch target area for accessible dismissal.

### 7.3 Tabs & Lists
- **Tab Lists:** `TabsList` includes `overflow-x-auto scrollbar-none` to allow smooth finger swiping on mobile devices without generating page horizontal scrollbars.
- **Active State:** Standardized on `data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs`.

### 7.4 Form Inputs & Search Fields
- **Input Dimensions:** `h-10 rounded-xl border border-border bg-background px-3.5 py-2 text-xs md:text-sm`.
- **Focus State:** `focus-visible:ring-2 focus-visible:ring-ring` with primary purple accent ring.

---

## 8. Gamification Currency & Lifetime Progress Decoupling

To safeguard pedagogical trust and student motivation:
- **Lifetime XP (`d.xp`):** Represents permanent, monotonic cumulative academic effort. It is strictly never decremented or reset by marketplace purchases or weekly leaderboard rollover.
- **Spendable Sparks (`d.sparks`):** Represents consumable reward tokens earned at 50% of gained XP. Bazaar transactions (e.g. avatars, solar system wallpapers) deduct solely from `d.sparks` while leaving `d.xp` intact.
