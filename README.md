# Focusly — The Cognitive Academic Operating System

> **A Circadian-Attuned Command Center for Rigorous STEM Scholars**  
> *Built with React 19, TypeScript, Vite, Tailwind CSS, Lucide React & Zustand*

---

## 1. Product Vision & Problem Statement

Generic productivity apps (Notion, Todoist, Asana) treat coursework as static strings in a to-do list. However, rigorous STEM degrees (e.g. Stanford CS '26) operate under unique academic constraints:
1. **Circadian Cognitive Limits:** Attempting pointer arithmetic or SVD proofs late at night leads to high failure rates and severe burnout.
2. **Non-Linear Grading Mechanics:** Autograder test cases, Valgrind memory leak benchmarks, and strict late-day allowances dictate assignment success.
3. **Institutional Guardrails:** Strict syllabus attendance policies (e.g. 2 unexcused absences before an automatic grade drop) can fail a student regardless of exam mastery.

**Focusly** functions as a closed-loop academic operating system that harmonizes syllabus compliance, circadian energy peaks, autograder metrics, and deep-work timers.

---

## 2. Foundational UI/UX Design Principles

Focusly was engineered specifically as a premier UI/UX showcase, applying fundamental human-computer interaction psychology:

| Principle | UI/UX Implementation in Focusly |
| :--- | :--- |
| **Cognitive Load Theory (Sweller)** | Low-saturation **Calm Academic Scholar** palette (`#1e293b` slate, `#f8f9ff` surface). Categorizes work into `⚡ High Cognitive Load`, `📖 Readings & Section Prep`, and `📋 Admin & Forms`. |
| **Hick’s Law & Progressive Disclosure** | The **"What Needs Attention Now?"** priority triage card isolates the top 1–2 immediate blockers (e.g. failing Valgrind leak test in `PriorityQueue.cpp`, attendance warning) to prevent decision paralysis. |
| **Fitts’ Law & State Continuity** | When an immersion focus session is active, navigating to any other module transitions the timer into a persistent **Floating Focus Mini-Dock** at the bottom right. |
| **Miller’s 7±2 Law** | Chunked 4-step calibrated onboarding (`03a` Profile → `03b` Rhythm → `03c` Attendance → `03d` Launch) and structured daily blocks (Morning Peak, Afternoon Core, Wind-Down). |
| **Error Prevention (Norman)** | Real-time amber late-day budget warnings and green/rose attendance margin indicators alert students before irreversible academic penalties occur. |
| **Peak-End Rule & Positive Feedback** | Subtle canvas confetti animations upon mastering flashcard concepts or completing 50-minute Pomodoro immersion sprints. |

---

## 3. Technology Architecture

A streamlined, zero-overhead stack engineered for sub-second responsiveness without complex backends:

- **Frontend Core:** React 19 + TypeScript + Vite (instant HMR, 500ms production builds).
- **Design Tokens & Styling:** Tailwind CSS v4 configured with the canonical Calm Academic Scholar slate-and-neutral design tokens.
- **Iconography:** Lucide React for crisp, stroke-balanced academic iconography.
- **Reactive State Management:** Zustand with `persist` middleware for instant client-side persistence (`localStorage`) across all tasks, notes, courses, and timer states.
- **Procedural Soundscapes:** Native Web Audio API sound generator (Brownian noise, Gentle Rain, Library Ambience) requiring zero external MP3 assets.
- **Universal Command:** Keyboard-driven `⌘K` / `Ctrl+K` Command Center for instant navigation and block creation.

---

## 4. Complete Screen & Module Index

| Screen ID | Title | Route / Scope | Interactive Trigger / Destination |
| :--- | :--- | :--- | :--- |
| `01` / `02` | **Doorway Authentication** | Doorway | Stanford Axess SSO / Google Workspace simulation |
| `03a` | **Academic Profile** | Onboarding (1/4) | Unit envelope slider (17 units target) & course sync |
| `03b` | **Study Rhythm** | Onboarding (2/4) | Chronotype selector (Morning Lark) & peak window |
| `03c` | **Attendance Guard** | Onboarding (3/4) | Absence tolerance buffer & Panopto verification toggle |
| `03d` | **Calibration Launch** | Onboarding (4/4) | Pre-flight telemetry summary & workspace handoff |
| `04` | **Overview Cockpit** | Workspace Shell | Central command hub, priority triage, circadian momentum bar |
| `05` | **Planner — Week** | Workspace Shell | 40-hour capacity visualizer vs fixed lectures & deep study |
| `06` | **Planner — Day** | Workspace Shell | Hourly timeline with physical Stanford quad travel buffers |
| `07` | **Tasks & Autograders** | Workspace Shell | 3-tier cognitive load board, Valgrind leak monitor, late-day tracker |
| `08` | **Exam Prep & Mastery** | Workspace Shell | Weak-spot diagnostic matrix, flashcard drill, 120m mock simulator |
| `09` | **Attendance Rails** | Workspace Shell | Course absence ledger, Panopto sync status, policy drops |
| `10` | **Study Analytics** | Workspace Shell | Circadian velocity curves, credit-to-effort distribution |
| `11` | **Focus Timer (50/10)** | Workspace Shell | Circular Pomodoro countdown, active task lock, procedural noise |
| `12` | **Notes & Scratchpad** | Workspace Shell | Quick markdown capture, audio synthesis, 1-click note-to-task |
| `13` | **CS 106B Course Hub** | Workspace Shell | Grade weight ledger, 10-week syllabus matrix, live Durand TA queue |

---

## 5. Getting Started

### Installation & Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:5173` to explore Focusly.
