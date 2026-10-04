# Software Requirements Specification (SRS)
## Project Name: Focusly — The Cognitive Academic Operating System
**Document Version:** 1.0.0  
**Target Platform:** Web Application (Responsive Desktop / Tablet)  
**Design Standard:** Google Material 3 Expressive / Calm Academic Scholar  
**Status:** Approved for Implementation & Prototyping

---

## 1. Executive Summary & Product Vision

### 1.1 Product Statement
**Focusly** is an AI-augmented, circadian-attuned academic workspace engineered specifically for university undergraduates, graduate researchers, and rigorous STEM students. Unlike generic task managers (Notion, Todoist, Asana) that treat study tasks as static to-do lists, Focusly functions as a closed-loop **academic operating system**. It bridges syllabus compliance, cognitive energy levels, automated assignment pipelines, and real-time attendance guardrails into a single, high-fidelity command center.

### 1.2 Core Value Proposition
- **Cognitive Energy Attunement:** Schedules demanding academic tasks (e.g., algorithmic proofs, low-level systems programming) strictly during students' peak circadian alertness windows.
- **Academic Guardrails & Compliance:** Monitors university attendance policies, late-day budgets, syllabus grading weights, and valgrind/autograder benchmarks to eliminate administrative derailments.
- **Frictionless Academic Lifecycle:** Connects lecture scratchpad capture, flashcard synthesis, exam mastery sprints, and deep-work immersion timers in one unified environment.

---

## 2. User Personas & Target Audience

### 2.1 Primary Persona: The Rigorous Undergraduate ("Aarav Sharma")
- **Profile:** Stanford University, CS '26, taking 16–20 units across complex foundational courses (CS 106B Programming Abstractions, MATH 51 Linear Algebra, CS 103 Discrete Structures).
- **Pain Points:** 
  - Fragmented tool stack: Canvas LMS, EdStem discussion boards, Gradescope, Google Calendar, and physical paper syllabi.
  - Cognitive fatigue from studying high-difficulty mathematics late at night.
  - Anxiety over losing course credit due to strict attendance policies or missed p-set penalty deadlines.
- **Goals:** Maintain high academic standing (GPA > 3.8), eliminate submission bugs before deadlines, and maximize deep work efficiency without burnout.

### 2.2 Secondary Persona: Graduate Student / Teaching Assistant
- **Profile:** Master’s/PhD candidate balancing research deliverables with course assistance and office hour scheduling.
- **Goals:** Live queue monitoring, fast triage of student notes, and rapid access to syllabus grading weights.

---

## 3. Product Architecture & Information Architecture

The application is structured into two core domains:
1. **The Entry & Calibration Suite (Onboarding & Authentication)**: Unauthenticated and initial setup steps establishing profile, baseline circadian rhythm, and attendance policies.
2. **The Core Workspace Execution Suite**: A persistent, left-sidebar navigation shell housing the operational engines.

```
Focusly Academic Operating System
│
├── 01. Authentication Doorway
│   ├── 01. Sign In (Stanford SSO / Google Workspace)
│   └── 02. Sign Up (Academic Registration)
│
├── 02. Onboarding & Calibration Flow (4 Steps)
│   ├── 03a. Academic Profile & Units Target
│   ├── 03b. Study Rhythm & Circadian Availability
│   ├── 03c. Attendance Guard & Academic Policies
│   └── 03d. Calibration Complete & Launch Handoff
│
└── 03. Core Workspace Dashboard & Modules
    ├── TODAY
    │   └── 04. Overview (Central Command Cockpit)
    ├── PLAN
    │   ├── 05. Planner — Week (Capacity vs. Planned Work)
    │   └── 06. Planner — Day (Circadian Execution Timeline)
    ├── WORK
    │   ├── 07. Tasks & Assignments (Cognitive Load & Autograders)
    │   ├── 08. Exam Prep & Mastery Sprint (Weak-Spot Matrix & Mocks)
    │   ├── 11. Focus Timer / Deep Work Mode (Immersion Engine)
    │   └── 13. Course Detail & Syllabus Matrix (CS 106B Hub)
    ├── CAPTURE
    │   └── 12. Notes Inbox & Quick Capture (Scratchpad & Audio AI)
    └── INSIGHTS
        ├── 09. Attendance & Academic Guardrails (Absence Budgets)
        └── 10. Study Analytics & Cognitive Biomarkers (Velocity & Depth)
```

---

## 4. Functional Requirements by Module

### Module 1: Authentication & Onboarding
- **FR-1.1 Identity Federation:** Support one-click sign-in via Institutional Single Sign-On (Stanford Axess/Shibboleth) and Google Workspace.
- **FR-1.2 Step 1 Profile & Goals (`03a`):** Capture university identity, term (e.g., Fall '24), enrolled unit load (15–18 units target), and primary academic focus.
- **FR-1.3 Step 2 Rhythm Calibration (`03b`):** Define user chronotype (Morning/Lark, Afternoon, Night Owl), configure peak cognitive alertness intervals (08:30–11:45 AM default), and establish weekly deep work targets (24 hrs/wk).
- **FR-1.4 Step 3 Attendance Guard (`03c`):** Configure course absence tolerances (e.g., 2 free absences before grade drops) and automated notification thresholds.
- **FR-1.5 Step 4 Validation & Launch (`03d`):** Display aggregated baseline telemetry and deliver a seamless transition into the primary workspace.

### Module 2: Central Overview Cockpit (`04`)
- **FR-2.1 What Needs Attention:** Priority triage card displaying urgent blockers (e.g., P-Set autograder test failures, TA queue opening, imminent assignment deadlines).
- **FR-2.2 Circadian Momentum Bar:** Visual representation of elapsed vs. remaining productive energy for the calendar day.
- **FR-2.3 Live Academic Pulse:** Quick statistics summarizing today’s study blocks, attendance health (e.g., 94%), and overall weekly velocity.

### Module 3: Planning Engine (`05` & `06`)
- **FR-3.1 Weekly Capacity Analyzer (`05`):** Dual-axis visualizer contrasting hard scheduled commitments (lectures, sections, labs) with flexible deep study blocks against a 40-hour academic cap.
- **FR-3.2 Circadian Daily Timeline (`06`):** Time-blocked agenda highlighting real-time progress, buffer periods between classes, and countdown to next active session.

### Module 4: Task Execution & Autograder Readiness (`07`)
- **FR-4.1 Cognitive Load Categorization:** Automatic sorting of deliverables into:
  - ⚡ *High Cognitive Load* (C++ Memory Management, SVD Proofs).
  - 📖 *Readings & Section Prep*.
  - 📋 *Safeguards & Administrative Forms*.
- **FR-4.2 Autograder & Leak Tracker:** Display submission status, Valgrind memory leak checks, late-day consumption warnings, and test-case coverage before final submission.

### Module 5: Exam Prep & Mastery Sprint (`08`)
- **FR-5.1 Weak-Spot Diagnostic Matrix:** Ranked breakdown of exam subtopics categorized by student confidence percentage (Critical Weakness vs. High Mastery).
- **FR-5.2 Mock Simulator Cockpit:** Built-in timed mock exam simulator with website blocking protocols, approved cheat-sheet viewer, and historical score trajectory curves.
- **FR-5.3 Spaced Repetition Decks:** Integrated formula verification sprints synced with Anki/Flashcard engines.

### Module 6: Attendance Guardrails & Syllabus Matrix (`09` & `13`)
- **FR-6.1 Absence Budget Ledger:** Dynamic tracking of attended sessions, Panopto/poll verifications, and remaining allowable misses per enrolled course.
- **FR-6.2 Course Detail Hub (`13`):** Granular single-course breakdown featuring:
  - Grade weight ledger (Midterm 20%, P-Sets 45%, Final 25%, Section 10%).
  - 10-week syllabus chronological view with downloadable lecture PDFs, code repos, and EdStem links.
  - Live TA office hour queue length and wait-time monitor.

### Module 7: Focus Immersion & Quick Capture (`11` & `12`)
- **FR-7.1 Distraction-Free Deep Work Engine (`11`):** 50/10 Pomodoro immersion timer with active task lock, ambient soundscapes, and full-screen study mode.
- **FR-7.2 Notes Inbox & Scratchpad (`12`):** Low-friction capture modal supporting markdown, syntax-highlighted code snippets, and audio lecture transcriptions with one-click conversion to tasks or flashcards.

### Module 8: Study Analytics & Cognitive Biomarkers (`10`)
- **FR-8.1 Cognitive Velocity Telemetry:** Correlation graphs mapping user focus depth against time-of-day circadian peaks.
- **FR-8.2 Subject Effort Balance:** Distribution analysis tracking whether actual study hours match course credit allocations.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Usability & Visual Aesthetics
- **Design System:** Calm Academic Scholar (`#334155` slate custom color, light-mode surface `#f8f9ff`, Plus Jakarta Sans typography, 8px corner radii).
- **Cognitive Load Reduction:** Low saturation, distraction-free neutral backgrounds, and muted semantic accents (emerald for completed/safe, amber for attention, rose for critical).
- **Accessibility:** WCAG 2.1 AA compliant color contrast across all text and interactive badges.

### 5.2 Performance & Responsiveness
- **Page Render Time:** Initial dashboard render under 800ms.
- **Interaction Latency:** In-place state updates (task completion, triage switching) under 100ms.
- **Data Integrity:** Real-time synchronization with Canvas LMS and Google Calendar API every 15 minutes.

### 5.3 Security & Academic Integrity
- **Authentication:** OAuth 2.0 / SAML 2.0 with university SSO credentials.
- **Encryption:** AES-256 encryption at rest; TLS 1.3 in transit.
- **Data Isolation:** Sandboxed local storage for scratchpad notes and diagnostic grading simulations.

---

## 6. Prototyping & Flow Matrix

| Screen ID | Title | Route / Scope | Interactive Trigger / Destination |
| :--- | :--- | :--- | :--- |
| `01` | Sign In | Doorway | Submit → `03a` Onboarding or `04` Dashboard |
| `02` | Sign Up | Doorway | Register → `03a` Onboarding |
| `03a` | Academic Profile | Onboarding (1/4) | Continue → `03b`; Exit → `04` |
| `03b` | Study Rhythm | Onboarding (2/4) | Continue → `03c`; Back → `03a` |
| `03c` | Attendance Guard | Onboarding (3/4) | Continue → `03d`; Back → `03b` |
| `03d` | Calibration Launch | Onboarding (4/4) | Launch Workspace → `04` Overview |
| `04` | Overview Cockpit | Persistent Shell | Core hub linking to all workspace modules |
| `05` | Planner — Week | Persistent Shell | Shift to Day view (`06`) |
| `06` | Planner — Day | Persistent Shell | Launch Deep Work (`11`) |
| `07` | Tasks & Assignments| Persistent Shell | Task detail / autograder link |
| `08` | Exam Prep | Persistent Shell | Launch Mock Exam / Flashcard Drill |
| `09` | Attendance Rails | Persistent Shell | View Course Syllabus (`13`) |
| `10` | Study Analytics | Persistent Shell | Insight review |
| `11` | Focus Timer | Persistent Shell | Start/Pause 50-min study sprint |
| `12` | Notes Inbox | Persistent Shell | Convert note to Task (`07`) |
| `13` | Course Detail | Persistent Shell | Syllabus inspection & TA Queue join |

---

## 7. Future Roadmap & Iterations
- **Phase 2:** Direct Gradescope autograder webhook integration for real-time compilation bug tracking.
- **Phase 3:** Native mobile companion app (iOS/Android) for geotagged lecture attendance verification and push-notification circadian alerts.
- **Phase 4:** Peer study pod synchronization for collaborative deep-work sessions.
