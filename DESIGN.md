# Focusly Design System: Calm Minimalist Study Workspace

**Document Version:** 3.0.0  
**Design Standard:** Calm Warm-White Minimalism & Human-Centered UX  
**Status:** Canonical Visual, UX & Architectural Specification  

---

## 1. Visual Foundation & Philosophy

Focusly is built for quiet clarity, emotional calm, and effortless daily study habits. High-stress academic schedules do not need flashy neon gradients, cyberpunk jargon, or jarring pitch-black mode switches. 

The interface is guided by four principles:
1. **Calm Temperatured White Canvas:** The canvas uses a soothing warm off-white (`#faf8f5`) that softens harsh screen glare during long study sessions, balanced with crisp white cards (`#ffffff`) and hairline borders (`#e8e5df`).
2. **Restrained Color Palette:** Color is an intentional signal, not decorative clutter. No neon gradients or rainbow badges. High-contrast alerts are replaced with soft, muted tones (quiet sage, warm sand, muted slate, soft rose).
3. **Clear Human Language:** Complex terminology ("circadian telemetry", "academic cockpit", "quad passing envelope", "cognitive velocity") is replaced with straightforward, friendly terms ("Today's Schedule", "Focus Timer", "Assignments", "Campus Walk Times").
4. **Light Mode Purity:** Dark mode has been deliberately retired in favor of a single, meticulously calibrated calm warm-white experience with consistent contrast ratios and breathing room.

---

## 2. Design Tokens & Color Palette

### 2.1 Canvas & Surface Tokens
- **Background Canvas:** `#faf8f5` (warm, natural calm paper)
- **Primary Card Surface:** `#ffffff` (crisp, elevated card)
- **Subtle Surface / Neutral Fill:** `#f4f1eb` / `#f0ede6` (gentle contrast for chips and inputs)
- **Borders & Dividers:** `#e8e5df` (crisp 1px hairline border)
- **Primary Text:** `#1c1d21` (warm charcoal, high contrast and soft on eyes)
- **Secondary Text:** `#64676e` (muted gray for subtitles and metadata)
- **Tertiary / Placeholder Text:** `#94979e`

### 2.2 Semantic & Accent Tokens (Restrained & Muted)
- **Primary Brand / Action:** `#1c1d21` (deep charcoal button with pure white text; clean and timeless)
- **Focus / Active Sessions:** Soft Warm Amber (`#b45309`, light bg `#fffbeb`, border `#fde68a`)
- **Completion / Healthy Status:** Soft Muted Sage (`#15803d`, light bg `#f0fdf4`, border `#bbf7d0`)
- **Attention / Due Soon:** Soft Terracotta Rose (`#be123c`, light bg `#fff1f2`, border `#fecdd3`)
- **Informational / Tags:** Soft Slate (`#475569`, light bg `#f1f5f9`, border `#e2e8f0`)

---

## 3. Typography Hierarchy

Focusly uses **Plus Jakarta Sans** and **Inter** for clean readability, paired with **JetBrains Mono** only where tabular numbers or code snippets demand strict alignment.

| Role | Font Family | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `Plus Jakarta Sans` | `22px` | `700` | Main view headers |
| **Section Header** | `Plus Jakarta Sans` | `14px` | `600` | Card headers and module titles |
| **Card Subtitle** | `Inter` | `12px` | `400` | Explanations and guidance |
| **Body (Default)** | `Inter` | `13px` | `400` / `500` | Form labels, descriptions, schedule items |
| **Monospace Data** | `JetBrains Mono` | `11px` | `500` | Clock times, scores, code lines |
| **Subtle Label** | `Inter` | `10px` | `600` | Category kickers and status pills |

---

## 4. Copywriting & Tone of Voice

| Previous Complex Phrasing | New Simple, Human Phrasing |
| :--- | :--- |
| *Academic Command Cockpit* | **Today's Overview** |
| *Week Envelope & Capacity Analyzer* | **Weekly Schedule** |
| *Day & Quad Transit Windows* | **Daily Schedule** |
| *Tasks, P-Sets & Autograders* | **Tasks & Assignments** |
| *Exam Prep, Weak Spots & Mocks* | **Exam Prep & Practice** |
| *Cognitive Immersion Cockpit / 50/10 Protocol* | **Focus Timer** |
| *Notes & Audio AI Capture* | **Study Notes** |
| *Attendance Rails & Absence Budgets* | **Attendance** |
| *Biomarkers & Circadian Velocity* | **Study Stats** |
| *High Cognitive Load* | **Deep Focus** |
| *Medium Cognitive Load* | **Core Study** |
| *Admin Cognitive Load* | **Quick Task** |
| *Stanford Quad Transit & Buffer Calculator* | **Campus Walk Times** |
| *Circadian Alertness Simulator* | **Daily Energy Guide** |

---

## 5. UI Architecture & Layout Components

1. **Persistent Calm Sidebar:** Clean warm-white background, subtle dividers, understated active states (solid deep slate fill), straightforward icons and section names.
2. **Top Header:** Shows term/university badge, current date, quick search (`⌘K`), and "+ New Task" button. No dark mode toggle.
3. **Calm Card Containers:** Rounded corners (`12px`), pure white cards on warm-white canvas, hairline border (`#e8e5df`), light shadows (`0 1px 2px rgba(0,0,0,0.03)`).
4. **Focus Timer:** Replaces dark black panels with an elegant, bright, serene timer card with a gentle circular progress ring and muted ambient sound controls.
5. **Autograder & Code Preview:** Clean light code viewer with soft gray background, clear test badges, and zero harsh neon terminal contrasts.
6. **Command Bar (`⌘K`):** Fast keyboard-driven command modal in calm white with instant navigation and search.
