import { UserProfile, Course, Task, ExamTopic, Flashcard, NoteItem, ScheduleBlock, MockExamQuestion, CampusRoute } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma2022@vitstudent.ac.in',
  institution: 'Vellore Institute of Technology (VIT)',
  term: 'Winter Semester 2025-26',
  degree: 'B.Tech Computer Science and Engineering (SCOPE) \'26',
  targetUnits: 23,
  chronotype: 'lark',
  circadianPeak: {
    start: '08:30',
    end: '11:45'
  },
  weeklyDeepWorkTargetHours: 24,
  onboardingCompleted: true
};

export const initialCourses: Course[] = [
  {
    id: 'cse2005',
    code: 'CSE2005',
    name: 'Operating Systems',
    instructor: 'Dr. K. Senthil Kumar (SJT 411)',
    units: 4,
    color: '#F59E0B',
    badgeBg: '#FFF7E6',
    badgeText: '#D97706',
    attendance: {
      attended: 30,
      total: 32,
      maxAllowedAbsences: 8,
      currentAbsences: 2,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Today, 09:20 AM (SJT 411)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 15, score: 89.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 15, score: 92.0 },
      { category: 'Digital Assignments (DA1 & DA2)', weightPercent: 10, score: 97.5 },
      { category: 'Quizzes & Lab Assessment', weightPercent: 20, score: 90.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 40, score: undefined }
    ],
    lateDaysTotal: 3,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: true,
      location: 'SJT 411 (Faculty Cabin) & MS Teams',
      studentsInLine: 3,
      waitMinutes: 10
    },
    syllabus: [
      { id: 's1', week: 1, topic: 'OS Architecture, Dual-Mode & System Call Internals', date: 'Jul 22', readings: 'Silberschatz Ch 1-2', hasSlides: true, hasCodeRepo: true },
      { id: 's2', week: 2, topic: 'Process Scheduling, PCB & Context Switch Overheads', date: 'Jul 29', readings: 'Silberschatz Ch 3', hasSlides: true, hasCodeRepo: true },
      { id: 's3', week: 3, topic: 'Threads, Kernel vs User Level & POSIX Pthreads', date: 'Aug 05', readings: 'Silberschatz Ch 4', hasSlides: true, hasCodeRepo: true },
      { id: 's4', week: 4, topic: 'Critical Section, Hardware Instructions & Peterson Algorithm', date: 'Aug 12', readings: 'Silberschatz Ch 5', hasSlides: true, hasCodeRepo: true },
      { id: 's5', week: 5, topic: 'Semaphores, Mutex Locks & Classical IPC Synchronization', date: 'Aug 19', readings: 'Silberschatz Ch 6', hasSlides: true, hasCodeRepo: true, isCurrentWeek: true, edPostUrl: 'https://vtopcc.vit.ac.in' },
      { id: 's6', week: 6, topic: 'Deadlock Detection, Prevention & Banker\'s Algorithm', date: 'Aug 26', readings: 'Silberschatz Ch 7', hasSlides: true, hasCodeRepo: true },
      { id: 's7', week: 7, topic: 'Main Memory, Paging, TLB & Multi-Level Page Tables', date: 'Sep 02', readings: 'Silberschatz Ch 8', hasSlides: false, hasCodeRepo: false },
      { id: 's8', week: 8, topic: 'Virtual Memory, Demand Paging & Page Replacement Algorithms', date: 'Sep 09', readings: 'Silberschatz Ch 9', hasSlides: false, hasCodeRepo: false },
      { id: 's9', week: 9, topic: 'File System Interface, Inodes & Directory Allocations', date: 'Sep 16', readings: 'Silberschatz Ch 10', hasSlides: false, hasCodeRepo: false },
      { id: 's10', week: 10, topic: 'I/O Hardware & Disk Scheduling (SCAN, C-LOOK)', date: 'Sep 23', readings: 'Silberschatz Ch 11', hasSlides: false, hasCodeRepo: false }
    ]
  },
  {
    id: 'cse2006',
    code: 'CSE2006',
    name: 'Data Structures and Algorithms',
    instructor: 'Dr. Priya R (TT 204)',
    units: 4,
    color: '#6366F1',
    badgeBg: '#EEF2FF',
    badgeText: '#4F46E5',
    attendance: {
      attended: 23,
      total: 26,
      maxAllowedAbsences: 6,
      currentAbsences: 3,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Today, 10:20 AM (TT 204)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 15, score: 84.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 15, score: 88.0 },
      { category: 'Digital Assignments & Coding P-Sets', weightPercent: 20, score: 95.0 },
      { category: 'Lab Assessment & Model Exam', weightPercent: 15, score: 92.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 35, score: undefined }
    ],
    lateDaysTotal: 2,
    lateDaysUsed: 1,
    taQueue: {
      isOpen: false,
      location: 'TT 204 Faculty Cabin',
      studentsInLine: 0,
      waitMinutes: 0
    },
    syllabus: [
      { id: 'd1', week: 1, topic: 'Asymptotic Analysis & Recurrence Relations (Master Theorem)', date: 'Jul 22', readings: 'CLRS Ch 1-4', hasSlides: true, hasCodeRepo: true },
      { id: 'd2', week: 2, topic: 'Linear Data Structures: Stacks, Queues, Circular Buffers', date: 'Jul 29', readings: 'CLRS Ch 10', hasSlides: true, hasCodeRepo: true },
      { id: 'd3', week: 3, topic: 'Binary Search Trees & AVL Balanced Trees', date: 'Aug 05', readings: 'CLRS Ch 12-13', hasSlides: true, hasCodeRepo: true },
      { id: 'd4', week: 4, topic: 'Red-Black Tree Insertion & Deletion Properties', date: 'Aug 12', readings: 'CLRS Ch 13', hasSlides: true, hasCodeRepo: true },
      { id: 'd5', week: 5, topic: 'Heaps, Priority Queues & Disjoint Set Union (DSU)', date: 'Aug 19', readings: 'CLRS Ch 6, 21', hasSlides: true, hasCodeRepo: true, isCurrentWeek: true },
      { id: 'd6', week: 6, topic: 'Graph Traversals: BFS, DFS & Topological Sort', date: 'Aug 26', readings: 'CLRS Ch 22', hasSlides: false, hasCodeRepo: true },
      { id: 'd7', week: 7, topic: 'Shortest Paths: Dijkstra and Bellman-Ford Algorithms', date: 'Sep 02', readings: 'CLRS Ch 24', hasSlides: false, hasCodeRepo: false },
      { id: 'd8', week: 8, topic: 'Minimum Spanning Trees: Kruskal and Prim Algorithms', date: 'Sep 09', readings: 'CLRS Ch 23', hasSlides: false, hasCodeRepo: false }
    ]
  },
  {
    id: 'mat2002',
    code: 'MAT2002',
    name: 'Discrete Mathematics and Graph Theory',
    instructor: 'Dr. Ramesh Babu (MB 112)',
    units: 3,
    color: '#10B981',
    badgeBg: '#ECFDF5',
    badgeText: '#047857',
    attendance: {
      attended: 31,
      total: 34,
      maxAllowedAbsences: 8,
      currentAbsences: 3,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Yesterday, 11:30 AM (MB 112)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 15, score: 96.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 15, score: 91.0 },
      { category: 'Digital Assignments & Quizzes', weightPercent: 20, score: 95.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 50, score: undefined }
    ],
    lateDaysTotal: 2,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: true,
      location: 'MB 112 Faculty Desk',
      studentsInLine: 1,
      waitMinutes: 4
    },
    syllabus: [
      { id: 'm1', week: 1, topic: 'Propositional & Predicate Logic, Inference Rules', date: 'Jul 22', readings: 'Rosen Ch 1', hasSlides: true, hasCodeRepo: false },
      { id: 'm2', week: 2, topic: 'Set Theory, Relations & Equivalence Classes', date: 'Jul 29', readings: 'Rosen Ch 2', hasSlides: true, hasCodeRepo: false },
      { id: 'm3', week: 3, topic: 'Mathematical Induction & Pigeonhole Principle', date: 'Aug 05', readings: 'Rosen Ch 5-6', hasSlides: true, hasCodeRepo: false },
      { id: 'm4', week: 4, topic: 'Recurrence Relations & Generating Functions', date: 'Aug 12', readings: 'Rosen Ch 8', hasSlides: true, hasCodeRepo: false },
      { id: 'm5', week: 5, topic: 'Graph Models, Isomorphism & Euler vs Hamiltonian Paths', date: 'Aug 19', readings: 'Rosen Ch 10', hasSlides: true, hasCodeRepo: false, isCurrentWeek: true },
      { id: 'm6', week: 6, topic: 'Planar Graphs, Euler\'s Formula & Chromatic Numbers', date: 'Aug 26', readings: 'Rosen Ch 10', hasSlides: false, hasCodeRepo: false }
    ]
  },
  {
    id: 'ece2001',
    code: 'ECE2001',
    name: 'Digital Logic Design',
    instructor: 'Prof. Anitha M (TT 418)',
    units: 4,
    color: '#EC4899',
    badgeBg: '#FDF2F8',
    badgeText: '#BE185D',
    attendance: {
      attended: 21,
      total: 25,
      maxAllowedAbsences: 6,
      currentAbsences: 4,
      policyWarningThreshold: 1, // Alert: 1 absence away from debarment threshold
      lastVerifiedDate: 'Mon, 12:20 PM (TT 418)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 15, score: 79.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 15, score: 82.0 },
      { category: 'Digital Assignments & Verilog Simulations', weightPercent: 15, score: 85.0 },
      { category: 'Lab Continuous Assessment & Model Exam', weightPercent: 15, score: 88.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 35, score: undefined }
    ],
    lateDaysTotal: 2,
    lateDaysUsed: 1,
    taQueue: {
      isOpen: false,
      location: 'TT 401 Digital Electronics Lab',
      studentsInLine: 0,
      waitMinutes: 0
    },
    syllabus: [
      { id: 'e1', week: 1, topic: 'Boolean Algebra, Logic Gates & Universal NAND/NOR', date: 'Jul 22', readings: 'Mano Ch 1-2', hasSlides: true, hasCodeRepo: true },
      { id: 'e2', week: 2, topic: 'K-Map Minimization (2-5 Variables) & Don\'t Care Conditions', date: 'Jul 29', readings: 'Mano Ch 3', hasSlides: true, hasCodeRepo: true },
      { id: 'e3', week: 3, topic: 'Combinational Circuits: Adders, Subtractors, Encoders, Decoders', date: 'Aug 05', readings: 'Mano Ch 4', hasSlides: true, hasCodeRepo: true },
      { id: 'e4', week: 4, topic: 'Multiplexers, Demultiplexers & Verilog HDL Modules', date: 'Aug 12', readings: 'Mano Ch 4', hasSlides: true, hasCodeRepo: true },
      { id: 'e5', week: 5, topic: 'Sequential Circuits: Latches, Flip-Flops & State Machine Design', date: 'Aug 19', readings: 'Mano Ch 5', hasSlides: true, hasCodeRepo: true, isCurrentWeek: true }
    ]
  },
  {
    id: 'cse2004',
    code: 'CSE2004',
    name: 'Database Management Systems',
    instructor: 'Dr. V. Rajesh (SJT 314)',
    units: 3,
    color: '#0EA5E9',
    badgeBg: '#F0F9FF',
    badgeText: '#0369A1',
    attendance: {
      attended: 28,
      total: 29,
      maxAllowedAbsences: 7,
      currentAbsences: 1,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Yesterday, 10:20 AM (SJT 314)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 15, score: 93.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 15, score: 94.0 },
      { category: 'Digital Assignments & SQL Challenges', weightPercent: 20, score: 100.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 50, score: undefined }
    ],
    lateDaysTotal: 3,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: true,
      location: 'SJT 314 Cabin',
      studentsInLine: 2,
      waitMinutes: 6
    },
    syllabus: [
      { id: 'db1', week: 1, topic: 'Relational Model, Relational Algebra & Calculus', date: 'Jul 22', readings: 'Korth Ch 1-2', hasSlides: true, hasCodeRepo: true },
      { id: 'db2', week: 2, topic: 'SQL Queries, Joins, Aggregations & Subqueries', date: 'Jul 29', readings: 'Korth Ch 3-4', hasSlides: true, hasCodeRepo: true },
      { id: 'db3', week: 3, topic: 'Database Normalization: 1NF, 2NF, 3NF & BCNF', date: 'Aug 05', readings: 'Korth Ch 7', hasSlides: true, hasCodeRepo: true },
      { id: 'db4', week: 4, topic: 'Transaction Processing, ACID Properties & Serializability', date: 'Aug 12', readings: 'Korth Ch 14', hasSlides: true, hasCodeRepo: true },
      { id: 'db5', week: 5, topic: 'Indexing & Hashing: B+ Trees & Query Optimization', date: 'Aug 19', readings: 'Korth Ch 11-12', hasSlides: true, hasCodeRepo: true, isCurrentWeek: true }
    ]
  },
  {
    id: 'hum1021',
    code: 'HUM1021',
    name: 'Ethics and Values',
    instructor: 'Dr. Meenakshi S (CDMM 102)',
    units: 2,
    color: '#8B5CF6',
    badgeBg: '#F5F3FF',
    badgeText: '#6D28D9',
    attendance: {
      attended: 19,
      total: 20,
      maxAllowedAbsences: 5,
      currentAbsences: 1,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Thu, 12:20 PM (CDMM 102)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Continuous Assessment 1 (CAT-1)', weightPercent: 20, score: 90.0 },
      { category: 'Continuous Assessment 2 (CAT-2)', weightPercent: 20, score: 88.0 },
      { category: 'Digital Assignments & Case Studies', weightPercent: 20, score: 95.0 },
      { category: 'Final Assessment Test (FAT)', weightPercent: 40, score: undefined }
    ],
    lateDaysTotal: 2,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: false,
      location: 'CDMM 102 Cabin',
      studentsInLine: 0,
      waitMinutes: 0
    },
    syllabus: [
      { id: 'h1', week: 1, topic: 'Professional Ethics in Engineering & AI Systems', date: 'Jul 22', readings: 'Handout Ch 1', hasSlides: true, hasCodeRepo: false },
      { id: 'h2', week: 2, topic: 'Environmental Sustainability & Corporate Responsibility', date: 'Jul 29', readings: 'Handout Ch 2', hasSlides: true, hasCodeRepo: false }
    ]
  }
];

export const initialTasks: Task[] = [
  {
    id: 't-1',
    courseId: 'cse2005',
    title: 'CSE2005 Lab: Multi-threaded Producer-Consumer with POSIX Semaphores',
    description: 'Implement circular bounded buffer using sem_init, sem_wait, and sem_post to eliminate race conditions.',
    cognitiveLoad: 'high',
    dueDate: 'Today at 5:00 PM',
    scheduledDate: '2026-10-24',
    pinned: true,
    estimatedMinutes: 120,
    completed: false,
    status: 'today',
    progressPercent: 75,
    subtasks: [
      { id: 'st-1', title: 'Initialize binary mutex and counting empty/full semaphores', completed: true },
      { id: 'st-2', title: 'Implement thread synchronization loops for producer & consumer', completed: true },
      { id: 'st-3', title: 'Verify Valgrind memory deallocation on process termination', completed: false },
      { id: 'st-4', title: 'Submit code archive on VTOP Digital Assignment portal', completed: false }
    ],
    autograder: {
      testsPassing: 19,
      testsTotal: 20,
      valgrindLeaks: 0,
      lateDaysUsed: 0,
      coveragePercent: 95,
      lastRunTimestamp: 'Today, 11:35 AM'
    }
  },
  {
    id: 't-2',
    courseId: 'cse2006',
    title: 'CSE2006 DA-2: Red-Black Tree Balancing & AVL Rotation Proofs',
    description: 'Analytical proof of logarithmic height bounds and implementation of left/right tree rotations.',
    cognitiveLoad: 'high',
    dueDate: 'Friday at 11:59 PM',
    scheduledDate: '2026-10-25',
    pinned: true,
    estimatedMinutes: 90,
    completed: false,
    status: 'this_week',
    progressPercent: 40,
    subtasks: [
      { id: 'st-21', title: 'Solve 4 cases of Red-Black node insertion violations', completed: true },
      { id: 'st-22', title: 'Write double-rotation C++ implementation for AVL trees', completed: false },
      { id: 'st-23', title: 'Generate benchmark chart comparing BST vs AVL search times', completed: false }
    ]
  },
  {
    id: 't-3',
    courseId: 'mat2002',
    title: 'MAT2002 CAT-2 Practice: Planar Graphs & Chromatic Polynomials',
    description: 'Solve tutorial sheet problems on Euler\'s formula (V - E + F = 2) and 4-color theorem bounds.',
    cognitiveLoad: 'medium',
    dueDate: 'Thursday at 9:00 AM',
    scheduledDate: '2026-10-24',
    pinned: false,
    estimatedMinutes: 45,
    completed: true,
    status: 'done',
    progressPercent: 100,
    subtasks: [
      { id: 'st-31', title: 'Prove K5 and K3,3 non-planarity using Kuratowski Theorem', completed: true },
      { id: 'st-32', title: 'Compute chromatic polynomials for cycle graphs', completed: true }
    ]
  },
  {
    id: 't-4',
    courseId: 'ece2001',
    title: 'ECE2001 Lab: Verilog HDL Module for 4-Bit Carry Lookahead Adder',
    description: 'Simulate generate/propagate logic gates in ModelSim and verify timing waveform diagrams.',
    cognitiveLoad: 'medium',
    dueDate: 'Tomorrow at 2:00 PM',
    scheduledDate: '2026-10-25',
    pinned: true,
    estimatedMinutes: 60,
    completed: false,
    status: 'today',
    progressPercent: 50,
    subtasks: [
      { id: 'st-41', title: 'Draft Verilog structural module using generate logic', completed: true },
      { id: 'st-42', title: 'Create testbench vectors for overflow edge cases', completed: false },
      { id: 'st-43', title: 'Export simulation waveform PDF for lab report', completed: false }
    ]
  },
  {
    id: 't-5',
    courseId: 'cse2004',
    title: 'CSE2004 Benchmark: B+ Tree Indexing vs Hash Indexing in PostgreSQL',
    description: 'Benchmark query plans using EXPLAIN ANALYZE on a 1-million record schema.',
    cognitiveLoad: 'admin',
    dueDate: 'Saturday at 5:00 PM',
    scheduledDate: '2026-10-26',
    pinned: false,
    estimatedMinutes: 30,
    completed: false,
    status: 'this_week',
    progressPercent: 20,
    subtasks: [
      { id: 'st-51', title: 'Generate synthetic dataset using Python script', completed: true },
      { id: 'st-52', title: 'Execute range query performance comparisons', completed: false }
    ]
  },
  {
    id: 't-6',
    courseId: 'cse2005',
    title: 'Verify VTOP CAT-1 Marks Revaluation Window',
    description: 'Verify 44.5/50 score entry in VTOP and cross-check question 4 rubric attribution.',
    cognitiveLoad: 'admin',
    dueDate: 'Yesterday',
    scheduledDate: '2026-10-23',
    pinned: false,
    estimatedMinutes: 10,
    completed: true,
    status: 'done',
    progressPercent: 100
  }
];

export const initialScheduleBlocks: ScheduleBlock[] = [
  {
    id: 'sb-1',
    title: 'CSE2005: Operating Systems (Slot A1)',
    courseCode: 'CSE2005',
    startTime: '08:30',
    endTime: '09:20',
    location: 'SJT 411 (Silver Jubilee Tower)',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-2',
    title: 'CSE2006: Data Structures and Algorithms (Slot B1)',
    courseCode: 'CSE2006',
    startTime: '09:30',
    endTime: '10:20',
    location: 'TT 204 (Technology Tower)',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-3',
    title: 'MAT2002: Discrete Mathematics & Graph Theory (Slot C1)',
    courseCode: 'MAT2002',
    startTime: '10:30',
    endTime: '11:20',
    location: 'MB 112 (Main Building / Dr. MGR Block)',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-4',
    title: 'ECE2001: Digital Logic Design (Slot D1)',
    courseCode: 'ECE2001',
    startTime: '11:30',
    endTime: '12:20',
    location: 'TT 418 (Technology Tower)',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-5',
    title: 'Foodys Gazebo Lunch & Circadian Recharge',
    startTime: '12:30',
    endTime: '13:45',
    location: 'Foodys Central / Anna Auditorium Lawn',
    type: 'break'
  },
  {
    id: 'sb-6',
    title: 'ECE2001: Digital Electronics Laboratory (Slot L15+L16)',
    courseCode: 'ECE2001',
    startTime: '14:00',
    endTime: '15:40',
    location: 'TT 401 (Digital Electronics Lab)',
    type: 'section',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-7',
    title: 'Periyar Central Library: Deep Focus Study Window',
    courseCode: 'CSE2005',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Periyar Central Library (Floor 2 Quiet Room)',
    type: 'deep_work',
    cognitiveLoad: 'high',
    isPeakWindow: true
  }
];

export const initialNotes: NoteItem[] = [
  {
    id: 'n-1',
    courseId: 'cse2005',
    title: 'POSIX Semaphores & Mutex Invariants (Dr. Senthil Kumar)',
    content: `### Operating Systems Lecture & Lab Key Insights:
- **Binary Semaphore vs Mutex**: A mutex has ownership semantics (only unlocking thread can release), whereas a binary semaphore can be signaled across different threads.
- **Counting Semaphore Formula**:
  - \`sem_init(&empty, 0, BUFFER_SIZE)\`
  - \`sem_init(&full, 0, 0)\`
- **Critical Ordering**: Always \`sem_wait(&empty)\` before \`pthread_mutex_lock(&mutex)\` to prevent deadlocks!
- **Valgrind Watchout**: Ensure \`sem_destroy(&sem)\` and \`pthread_mutex_destroy(&mutex)\` are invoked before process exit.`,
    timestamp: 'Today, 09:45 AM',
    tags: ['OS', 'Concurrency', 'Semaphores', 'CSE2005'],
    hasAudioTranscription: true
  },
  {
    id: 'n-2',
    courseId: 'cse2006',
    title: 'Red-Black Tree Properties & Rotations',
    content: `### 5 Mandatory Red-Black Properties:
1. Every node is either red or black.
2. The root is always black.
3. Every leaf (NIL sentinel) is black.
4. If a node is red, both its children are black (no consecutive red nodes).
5. For each node, all simple paths to descendant leaves contain the same number of black nodes (Black-Height).
- Height proof: Any node with black-height bh has at least 2^(bh) - 1 internal nodes, ensuring h <= 2*log2(n+1).`,
    timestamp: 'Yesterday, 10:40 AM',
    tags: ['DSA', 'Trees', 'RedBlack', 'CSE2006'],
    hasAudioTranscription: false
  }
];

export const initialExamTopics: ExamTopic[] = [
  {
    id: 'et-1',
    courseId: 'cse2005',
    topic: 'Process Synchronization & POSIX Semaphore Primitives',
    confidencePercent: 88,
    status: 'mastered',
    flashcardsCount: 14,
    mockQuestionsTested: 8
  },
  {
    id: 'et-2',
    courseId: 'cse2005',
    topic: 'Virtual Memory, Multi-level Paging & Inverted Page Tables',
    confidencePercent: 72,
    status: 'moderate',
    flashcardsCount: 16,
    mockQuestionsTested: 5
  },
  {
    id: 'et-3',
    courseId: 'cse2006',
    topic: 'AVL & Red-Black Tree Balancing Rotations',
    confidencePercent: 80,
    status: 'mastered',
    flashcardsCount: 12,
    mockQuestionsTested: 6
  },
  {
    id: 'et-4',
    courseId: 'mat2002',
    topic: 'Planar Graphs, Euler\'s Formula & Kuratowski Theorem',
    confidencePercent: 91,
    status: 'mastered',
    flashcardsCount: 10,
    mockQuestionsTested: 7
  },
  {
    id: 'et-5',
    courseId: 'ece2001',
    topic: 'Sequential Circuits, State Minimization & Flip-Flops',
    confidencePercent: 54,
    status: 'critical',
    flashcardsCount: 18,
    mockQuestionsTested: 4
  }
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    topicId: 'et-1',
    front: 'What are the 4 Coffman conditions required simultaneously for a deadlock to exist?',
    back: '1. Mutual Exclusion: At least one resource held non-shareably.\n2. Hold and Wait: A process holds resources while requesting new ones.\n3. No Preemption: Resources cannot be forcibly taken.\n4. Circular Wait: A closed chain of processes each waiting for a resource held by the next.',
    difficulty: 'medium'
  },
  {
    id: 'fc-2',
    topicId: 'et-2',
    front: 'Why does an Inverted Page Table reduce memory overhead compared to traditional hierarchical page tables?',
    back: 'Traditional page tables scale linearly with the virtual address space (size = number of virtual pages). An Inverted Page Table scales with the physical memory (size = number of physical frames), containing one entry per physical frame regardless of how large the virtual address space is.',
    difficulty: 'hard'
  },
  {
    id: 'fc-3',
    topicId: 'et-3',
    front: 'Under what condition does an AVL tree require a Left-Right (LR) double rotation?',
    back: 'When a new node is inserted into the RIGHT subtree of the LEFT child of the unbalanced ancestor node (balance factor = +2, left child balance factor = -1).',
    difficulty: 'medium'
  },
  {
    id: 'fc-4',
    topicId: 'et-4',
    front: 'State Euler\'s Planar Graph Formula relating vertices (V), edges (E), and faces (F).',
    back: 'For any connected planar graph drawn in the plane without intersecting edges: V - E + F = 2.',
    difficulty: 'easy'
  }
];

export const initialMockQuestions: MockExamQuestion[] = [
  {
    id: 'mq-1',
    question: 'In Unix/POSIX C programming, what is the effect of invoking sem_post(&sem) on a semaphore with value 0 where one thread is blocked in sem_wait(&sem)?',
    codeSnippet: `sem_t sem;\nsem_init(&sem, 0, 0);\n// Thread B is blocked in sem_wait(&sem);\nsem_post(&sem); // Invoked by Thread A`,
    options: [
      'The semaphore value becomes 1 and Thread B remains blocked.',
      'One waiting thread (Thread B) is unblocked and permitted to proceed; the semaphore value remains 0.',
      'The process terminates with a SIGSEGV signal.',
      'Both threads are deadlocked because the semaphore was initialized to 0.'
    ],
    correctIndex: 1,
    explanation: 'When threads are waiting on a semaphore with value 0, sem_post() atomically wakes up one waiting thread. The semaphore value conceptually remains 0 because the awakened thread consumes the token.'
  },
  {
    id: 'mq-2',
    question: 'Under the official VIT 75% attendance policy, if a student has attended 21 out of 25 conducted hours, what is their status?',
    options: [
      'Below 75%, debarred from Final Assessment Test (FAT).',
      'Exactly 84.0% attendance; safe margin to miss at most 3 classes before dropping below 75%.',
      'Attendance policy waived for practical courses.',
      'Over 90% attendance; eligible for full internal marks credit.'
    ],
    correctIndex: 1,
    explanation: '21 / 25 = 84.0%. To stay >= 75%: (21) / (25 + x) >= 0.75 => 21 >= 18.75 + 0.75x => 2.25 >= 0.75x => x <= 3. The student can miss 3 more classes safely.'
  },
  {
    id: 'mq-3',
    question: 'In a B+ Tree index with internal order m, what is the maximum number of child pointers an internal node can store?',
    options: [
      'm - 1',
      'm',
      '2 * m',
      'ceil(m / 2)'
    ],
    correctIndex: 1,
    explanation: 'By definition of a B+ Tree of order m, each internal node can hold at most m child pointers and at most m - 1 search keys.'
  },
  {
    id: 'mq-4',
    question: 'For a simple connected planar graph with V >= 3 vertices and no triangles (girth >= 4), what upper bound on the number of edges E is enforced by Euler\'s formula?',
    options: [
      'E <= 3V - 6',
      'E <= 2V - 4',
      'E <= V - 1',
      'E <= 4V - 8'
    ],
    correctIndex: 1,
    explanation: 'Since every face is bounded by at least 4 edges: 2E = sum(deg(F)) >= 4F => F <= E/2. Substituting into Euler\'s V - E + F = 2 yields V - E + E/2 >= 2 => E <= 2V - 4.'
  }
];

export const initialCampusRoutes: CampusRoute[] = [
  {
    id: 'cr-1',
    from: 'SJT (Silver Jubilee Tower)',
    to: 'TT (Technology Tower)',
    walkMinutes: 5,
    bikeMinutes: 2,
    distanceMiles: 0.22,
    quadCrowdLevel: 'Moderate',
    bufferRecommendation: 'Direct walkway past Foodys Gazebo. Clear 10-minute passing window between slots.'
  },
  {
    id: 'cr-2',
    from: 'TT (Technology Tower)',
    to: 'MB (Dr. MGR Block / Main Building)',
    walkMinutes: 6,
    bikeMinutes: 2,
    distanceMiles: 0.28,
    quadCrowdLevel: 'Moderate',
    bufferRecommendation: 'Shaded path via Periyar Central Library. Optimal transit before 10:30 AM Slot C1.'
  },
  {
    id: 'cr-3',
    from: 'SJT (Silver Jubilee Tower)',
    to: 'PRP Building',
    walkMinutes: 7,
    bikeMinutes: 3,
    distanceMiles: 0.35,
    quadCrowdLevel: 'Heavy',
    bufferRecommendation: 'Transit path via Anna Auditorium and outdoor stadium during lunch hour peak.'
  },
  {
    id: 'cr-4',
    from: 'MB (Main Building)',
    to: 'CDMM (Disaster Management Center)',
    walkMinutes: 4,
    bikeMinutes: 1,
    distanceMiles: 0.16,
    quadCrowdLevel: 'Low',
    bufferRecommendation: 'Short direct walk through Academic Quad. 5-minute buffer is ample.'
  }
];
