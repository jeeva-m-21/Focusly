import { UserProfile, Course, Task, ExamTopic, Flashcard, NoteItem, ScheduleBlock, MockExamQuestion, CampusRoute } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@stanford.edu',
  institution: 'Stanford University',
  term: "Fall '24",
  degree: "B.S. Computer Science '26",
  targetUnits: 17,
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
    id: 'cs106b',
    code: 'CS 106B',
    name: 'Programming Abstractions',
    instructor: 'Prof. Julie Zelenski & Keith Schwarz',
    units: 5,
    color: '#334155',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
    attendance: {
      attended: 14,
      total: 15,
      maxAllowedAbsences: 2,
      currentAbsences: 1,
      policyWarningThreshold: 1,
      lastVerifiedDate: 'Oct 23, 2024 (Gates B01)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Programming Assignments (P-Sets)', weightPercent: 45, score: 97.4 },
      { category: 'Midterm Examination', weightPercent: 20, score: 91.5 },
      { category: 'Final Examination', weightPercent: 25, score: undefined },
      { category: 'Discussion Section Attendance', weightPercent: 10, score: 100 }
    ],
    lateDaysTotal: 3,
    lateDaysUsed: 1,
    taQueue: {
      isOpen: true,
      location: 'Durand 353 & Zoom',
      studentsInLine: 4,
      waitMinutes: 12
    },
    syllabus: [
      { id: 's1', week: 1, topic: 'C++ Fundamentals, Memory & Abstract Data Types', date: 'Sep 23', readings: 'Course Reader Ch 1-3', hasSlides: true, hasCodeRepo: true },
      { id: 's2', week: 2, topic: 'Vectors, Grid, Stack, Queue implementations', date: 'Sep 30', readings: 'Course Reader Ch 4-5', hasSlides: true, hasCodeRepo: true },
      { id: 's3', week: 3, topic: 'Recursion, Backtracking & Permutations', date: 'Oct 07', readings: 'Course Reader Ch 7-8', hasSlides: true, hasCodeRepo: true },
      { id: 's4', week: 4, topic: 'Recursive Backtracking & Memoization', date: 'Oct 14', readings: 'Course Reader Ch 9', hasSlides: true, hasCodeRepo: true },
      { id: 's5', week: 5, topic: 'Pointers, Dynamic Memory & Linked Lists', date: 'Oct 21', readings: 'Course Reader Ch 11-12', hasSlides: true, hasCodeRepo: true, isCurrentWeek: true, edPostUrl: 'https://edstem.org' },
      { id: 's6', week: 6, topic: 'Binary Search Trees & Priority Queues', date: 'Oct 28', readings: 'Course Reader Ch 14', hasSlides: false, hasCodeRepo: true },
      { id: 's7', week: 7, topic: 'Hashing, Hash Tables & Collision Strategies', date: 'Nov 04', readings: 'Course Reader Ch 15', hasSlides: false, hasCodeRepo: false },
      { id: 's8', week: 8, topic: 'Graphs, BFS, DFS & Dijkstra’s Algorithm', date: 'Nov 11', readings: 'Course Reader Ch 17', hasSlides: false, hasCodeRepo: false },
      { id: 's9', week: 9, topic: 'Advanced Algorithmic Efficiency & Big-O Proofs', date: 'Nov 18', readings: 'Course Reader Ch 18', hasSlides: false, hasCodeRepo: false },
      { id: 's10', week: 10, topic: 'Final Review & Special Topics (Huffman Coding)', date: 'Dec 02', readings: 'Exam Handout', hasSlides: false, hasCodeRepo: false }
    ]
  },
  {
    id: 'math51',
    code: 'MATH 51',
    name: 'Linear Algebra & Multivariable Calculus',
    instructor: 'Prof. Rafe Mazzeo',
    units: 5,
    color: '#475569',
    badgeBg: '#f4f1eb',
    badgeText: '#475569',
    attendance: {
      attended: 15,
      total: 16,
      maxAllowedAbsences: 2,
      currentAbsences: 1,
      policyWarningThreshold: 1,
      lastVerifiedDate: 'Oct 22, 2024 (Hewlett 200)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Weekly Homework Problem Sets', weightPercent: 30, score: 94.0 },
      { category: 'Midterm 1', weightPercent: 20, score: 89.0 },
      { category: 'Midterm 2', weightPercent: 20, score: undefined },
      { category: 'Final Exam', weightPercent: 30, score: undefined }
    ],
    lateDaysTotal: 2,
    lateDaysUsed: 2, // warning!
    taQueue: {
      isOpen: false,
      location: 'Sloan Math Corner 380',
      studentsInLine: 0,
      waitMinutes: 0
    },
    syllabus: [
      { id: 'm1', week: 1, topic: 'Vector spaces, linear combinations & span', date: 'Sep 23', readings: 'Levandosky Ch 1', hasSlides: true, hasCodeRepo: false },
      { id: 'm2', week: 2, topic: 'Matrix algebra, Gaussian elimination & rank', date: 'Sep 30', readings: 'Levandosky Ch 2', hasSlides: true, hasCodeRepo: false },
      { id: 'm3', week: 3, topic: 'Subspaces: null space, column space, dimension', date: 'Oct 07', readings: 'Levandosky Ch 3', hasSlides: true, hasCodeRepo: false },
      { id: 'm4', week: 4, topic: 'Orthogonality, Gram-Schmidt & Projections', date: 'Oct 14', readings: 'Levandosky Ch 4', hasSlides: true, hasCodeRepo: false },
      { id: 'm5', week: 5, topic: 'Determinants, Eigenvalues & Eigenvectors', date: 'Oct 21', readings: 'Levandosky Ch 5', hasSlides: true, hasCodeRepo: false, isCurrentWeek: true }
    ]
  },
  {
    id: 'cs103',
    code: 'CS 103',
    name: 'Mathematical Foundations of Computing',
    instructor: 'Prof. Keith Schwarz',
    units: 5,
    color: '#52525b',
    badgeBg: '#f4f4f5',
    badgeText: '#3f3f46',
    attendance: {
      attended: 12,
      total: 12,
      maxAllowedAbsences: 3,
      currentAbsences: 0,
      policyWarningThreshold: 2,
      lastVerifiedDate: 'Oct 23, 2024 (NVidia Aud)',
      panoptoSynced: true
    },
    gradingWeights: [
      { category: 'Problem Sets (10 assignments)', weightPercent: 35, score: 98.0 },
      { category: 'Midterm Exam', weightPercent: 25, score: 94.0 },
      { category: 'Final Exam', weightPercent: 40, score: undefined }
    ],
    lateDaysTotal: 3,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: true,
      location: 'Gates B02',
      studentsInLine: 1,
      waitMinutes: 3
    },
    syllabus: [
      { id: 'c1', week: 1, topic: 'Mathematical logic, sets, and relations', date: 'Sep 23', readings: 'Guide to Logic', hasSlides: true, hasCodeRepo: false },
      { id: 'c2', week: 2, topic: 'Direct & indirect proofs, contradictions', date: 'Sep 30', readings: 'Proofwriting Guide', hasSlides: true, hasCodeRepo: false },
      { id: 'c3', week: 3, topic: 'Mathematical Induction & Well-Ordering', date: 'Oct 07', readings: 'Induction Primer', hasSlides: true, hasCodeRepo: false },
      { id: 'c4', week: 4, topic: 'Finite Automata (DFA, NFA, RegEx)', date: 'Oct 14', readings: 'Sipser Ch 1', hasSlides: true, hasCodeRepo: false },
      { id: 'c5', week: 5, topic: 'Context-Free Grammars & Pushdown Automata', date: 'Oct 21', readings: 'Sipser Ch 2', hasSlides: true, hasCodeRepo: false, isCurrentWeek: true }
    ]
  },
  {
    id: 'phys41',
    code: 'PHYS 41',
    name: 'Mechanics & Relativity',
    instructor: 'Prof. Patricia Burchat',
    units: 2,
    color: '#15803d',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    attendance: {
      attended: 8,
      total: 8,
      maxAllowedAbsences: 1,
      currentAbsences: 0,
      policyWarningThreshold: 1,
      lastVerifiedDate: 'Oct 21, 2024 (Varian Lab)',
      panoptoSynced: false
    },
    gradingWeights: [
      { category: 'Weekly Physics Labs', weightPercent: 50, score: 98.5 },
      { category: 'Pre-lab Checkpoints', weightPercent: 20, score: 100 },
      { category: 'Final Lab Practical', weightPercent: 30, score: undefined }
    ],
    lateDaysTotal: 1,
    lateDaysUsed: 0,
    taQueue: {
      isOpen: false,
      location: 'Varian Physics Bldg',
      studentsInLine: 0,
      waitMinutes: 0
    },
    syllabus: [
      { id: 'p1', week: 5, topic: 'Rotational Dynamics & Angular Momentum', date: 'Oct 21', readings: 'Taylor Classical Mech', hasSlides: true, hasCodeRepo: false, isCurrentWeek: true }
    ]
  }
];

export const initialTasks: Task[] = [
  {
    id: 't-1',
    courseId: 'cs106b',
    title: 'P-Set 4: PriorityQueue.cpp & Heap Optimization',
    description: 'Implement dynamic array resizing and min-heap sift-up/down logic. Zero memory leaks required under Valgrind.',
    cognitiveLoad: 'high',
    dueDate: 'Tomorrow at 11:59 PM',
    scheduledDate: '2026-10-24',
    pinned: true,
    estimatedMinutes: 120,
    completed: false,
    status: 'today',
    progressPercent: 70,
    subtasks: [
      { id: 'st-1', title: 'Read autograder test failures and trace dequeue() leaks', completed: true },
      { id: 'st-2', title: 'Inspect recursive sift-down child index math', completed: true },
      { id: 'st-3', title: 'Implement base case dynamic memory delete[] on resize', completed: false },
      { id: 'st-4', title: 'Run full Valgrind memory sanity check', completed: false }
    ],
    autograder: {
      testsPassing: 18,
      testsTotal: 20,
      valgrindLeaks: 1, // Alert! Memory leak in dequeue()
      lateDaysUsed: 1,
      coveragePercent: 90,
      lastRunTimestamp: 'Today, 11:22 AM',
      leakStacktrace: `==19842== 320 bytes in 1 blocks are definitely lost in loss record 1 of 1
==19842==    at 0x4C31B25: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==19842==    by 0x40182E: PriorityQueue::resize() (PriorityQueue.cpp:142)
==19842==    by 0x401A51: PriorityQueue::enqueue(std::string, int) (PriorityQueue.cpp:88)
==19842==    by 0x402D19: test_massive_heap_operations() (autograder_test.cpp:214)`
    }
  },
  {
    id: 't-2',
    courseId: 'math51',
    title: 'P-Set 5: Spectral Theorem & SVD Proofs',
    description: 'Problems 4.3 through 5.2 on Orthogonal Diagonalization and Singular Value Decomposition.',
    cognitiveLoad: 'high',
    dueDate: 'Friday at 5:00 PM',
    scheduledDate: '2026-10-25',
    pinned: true,
    estimatedMinutes: 90,
    completed: false,
    status: 'this_week',
    progressPercent: 30,
    subtasks: [
      { id: 'st-21', title: 'Review Levandosky Chapter 3 on symmetric matrices', completed: true },
      { id: 'st-22', title: 'Compute orthogonal eigenvectors for 3x3 matrix', completed: false },
      { id: 'st-23', title: 'Write SVD derivation and rank-1 approximation proof', completed: false }
    ]
  },
  {
    id: 't-3',
    courseId: 'cs103',
    title: 'Reading: Non-Deterministic Finite Automata (NFAs)',
    description: 'Read Sipser Chapter 1.2 on subset construction and epsilon transitions before discussion section.',
    cognitiveLoad: 'medium',
    dueDate: 'Thursday at 9:00 AM',
    scheduledDate: '2026-10-24',
    pinned: false,
    estimatedMinutes: 45,
    completed: true,
    status: 'done',
    progressPercent: 100,
    subtasks: [
      { id: 'st-31', title: 'Read Sipser Section 1.2 pages 47-58', completed: true },
      { id: 'st-32', title: 'Draw 3 state transition diagrams', completed: true }
    ]
  },
  {
    id: 't-4',
    courseId: 'cs106b',
    title: 'Prepare Midterm Flashcards & Tree Invariants',
    description: 'Review tree structures, BST properties, and binary heap invariants for upcoming exam.',
    cognitiveLoad: 'medium',
    dueDate: 'Thursday at 4:30 PM',
    scheduledDate: '2026-10-24',
    pinned: true,
    estimatedMinutes: 30,
    completed: false,
    status: 'today',
    progressPercent: 30,
    subtasks: [
      { id: 'st-41', title: 'Review red-black tree 5 invariant rules', completed: true },
      { id: 'st-42', title: 'Generate 12 Anki practice flashcards', completed: false },
      { id: 'st-43', title: 'Test Big-O complexity for AVL rotations', completed: false }
    ]
  },
  {
    id: 't-5',
    courseId: 'phys41',
    title: 'Pre-lab Checkpoint: Gyroscopic Precession Setup',
    description: 'Complete online Canvas quiz on torque and angular momentum vectors.',
    cognitiveLoad: 'admin',
    dueDate: 'Friday at 12:00 PM',
    scheduledDate: '2026-10-25',
    pinned: true,
    estimatedMinutes: 20,
    completed: false,
    status: 'this_week',
    progressPercent: 50,
    subtasks: [
      { id: 'st-51', title: 'Read pre-lab manual on flywheels', completed: true },
      { id: 'st-52', title: 'Submit 5 Canvas checkpoint questions', completed: false }
    ]
  },
  {
    id: 't-6',
    courseId: 'cs106b',
    title: 'Review Midterm Regrade Window on Gradescope',
    description: 'Verify Section 2 point attribution for question 3b before the regrade deadline expires.',
    cognitiveLoad: 'admin',
    dueDate: 'Yesterday',
    scheduledDate: '2026-10-23',
    pinned: false,
    estimatedMinutes: 15,
    completed: true,
    status: 'done',
    progressPercent: 100
  },
  {
    id: 't-7',
    courseId: 'cs103',
    title: 'P-Set 4: Regular Expressions & DFA Minimization',
    description: 'Construct equivalent DFAs for given regexes and apply the table-filling minimization algorithm.',
    cognitiveLoad: 'high',
    dueDate: 'Monday at 11:59 PM',
    scheduledDate: '2026-10-27',
    pinned: true,
    estimatedMinutes: 110,
    completed: false,
    status: 'backlog',
    progressPercent: 0,
    subtasks: [
      { id: 'st-71', title: 'DFA state reduction algorithm', completed: false },
      { id: 'st-72', title: 'Regex equivalence theorem write-up', completed: false }
    ]
  },
  {
    id: 't-8',
    courseId: 'math51',
    title: 'Review Lecture Notes: Matrix Kernel & Image',
    description: 'Synthesize lecture audio notes into cheat sheet for discussion section.',
    cognitiveLoad: 'medium',
    dueDate: 'Today at 6:00 PM',
    scheduledDate: '2026-10-24',
    pinned: false,
    estimatedMinutes: 40,
    completed: false,
    status: 'today',
    progressPercent: 10,
    subtasks: [
      { id: 'st-81', title: 'Annotate rank-nullity theorem proof', completed: false },
      { id: 'st-82', title: 'Extract 3 practice questions', completed: false }
    ]
  },
  {
    id: 't-9',
    courseId: 'cs106b',
    title: 'Independent Study: Cache Locality in C++ Heaps',
    description: 'Read Dan Saks paper on cache line friendly d-ary heaps vs binary heaps.',
    cognitiveLoad: 'medium',
    dueDate: 'Next Week',
    scheduledDate: '2026-10-30',
    pinned: false,
    estimatedMinutes: 60,
    completed: false,
    status: 'backlog',
    progressPercent: 0
  },
  {
    id: 't-10',
    courseId: 'phys41',
    title: 'Lab 5 Formal Write-Up: Angular Acceleration & Moments',
    description: 'Process LoggerPro sensor data, plot linear regressions, and calculate uncertainty bounds.',
    cognitiveLoad: 'medium',
    dueDate: 'Tuesday at 11:59 PM',
    scheduledDate: '2026-11-03',
    pinned: false,
    estimatedMinutes: 75,
    completed: false,
    status: 'backlog',
    progressPercent: 0
  }
];

export const initialExamTopics: ExamTopic[] = [
  {
    id: 'et-1',
    courseId: 'cs106b',
    topic: 'C++ Pointers, Dynamic Array Resizing & Valgrind Leak Debugging',
    confidencePercent: 42,
    status: 'critical',
    flashcardsCount: 14,
    mockQuestionsTested: 8
  },
  {
    id: 'et-2',
    courseId: 'math51',
    topic: 'Orthogonal Diagonalization & Singular Value Decomposition (SVD)',
    confidencePercent: 48,
    status: 'critical',
    flashcardsCount: 18,
    mockQuestionsTested: 12
  },
  {
    id: 'et-3',
    courseId: 'cs103',
    topic: 'Induction over Trees & Structural Well-Ordering Principles',
    confidencePercent: 78,
    status: 'moderate',
    flashcardsCount: 10,
    mockQuestionsTested: 6
  },
  {
    id: 'et-4',
    courseId: 'cs106b',
    topic: 'Recursive Backtracking & State Restoration',
    confidencePercent: 94,
    status: 'mastered',
    flashcardsCount: 16,
    mockQuestionsTested: 15
  },
  {
    id: 'et-5',
    courseId: 'math51',
    topic: 'Gram-Schmidt Orthonormalization Algorithm',
    confidencePercent: 91,
    status: 'mastered',
    flashcardsCount: 8,
    mockQuestionsTested: 10
  }
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    topicId: 'et-1',
    front: 'What is the exact signature of the C++ copy assignment operator for a dynamic class?',
    back: 'ClassName& operator=(const ClassName& rhs);\nRemember: Check for self-assignment (if (this != &rhs)), free old heap memory, allocate new buffer, deep-copy elements, and return *this.',
    difficulty: 'hard'
  },
  {
    id: 'fc-2',
    topicId: 'et-1',
    front: 'How does Valgrind distinguish between a "definitely lost" vs "indirectly lost" memory leak?',
    back: '• Definitely Lost: Heap memory was allocated, but no pointer anywhere in memory points to the start of the block.\n• Indirectly Lost: Memory was pointed to by a structure that is itself lost (e.g. child nodes in a lost binary tree).',
    difficulty: 'medium'
  },
  {
    id: 'fc-3',
    topicId: 'et-2',
    front: 'State the Fundamental Theorem of Linear Algebra regarding the relationship between Col(A) and Null(A^T).',
    back: 'The column space of A and the null space of A^T are orthogonal complements in R^m: Col(A) ⊥ Null(A^T), and dim(Col(A)) + dim(Null(A^T)) = m.',
    difficulty: 'hard'
  },
  {
    id: 'fc-4',
    topicId: 'et-4',
    front: 'What are the three essential components of an exhaustive recursive backtracking function?',
    back: '1. Base Case: Test for valid solution / target reached.\n2. Recursive Decision Loop: Iterate over all possible candidate choices at this step.\n3. Make choice → Recurse → Undo choice (backtrack to pristine state).',
    difficulty: 'easy'
  }
];

export const initialScheduleBlocks: ScheduleBlock[] = [
  {
    id: 'sb-1',
    title: 'Circadian Peak Focus Window',
    startTime: '08:30',
    endTime: '10:00',
    type: 'deep_work',
    cognitiveLoad: 'high',
    isPeakWindow: true
  },
  {
    id: 'sb-2',
    title: 'CS 106B Lecture: Linked Lists & Destructors',
    courseCode: 'CS 106B',
    startTime: '10:30',
    endTime: '11:20',
    location: 'Hewlett Teaching Center 200',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-3',
    title: 'Quad Transit & Buffer Time',
    startTime: '11:20',
    endTime: '11:45',
    location: 'Hewlett → Sloan Math Corner (6 min walk)',
    type: 'buffer'
  },
  {
    id: 'sb-4',
    title: 'MATH 51 Lecture: Eigenbasis & Diagonalization',
    courseCode: 'MATH 51',
    startTime: '11:45',
    endTime: '12:35',
    location: 'Sloan Math Corner 380',
    type: 'lecture',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-5',
    title: 'Cognitive Recovery / Lunch Break',
    startTime: '12:45',
    endTime: '13:45',
    location: 'Tressider Memorial Union',
    type: 'break'
  },
  {
    id: 'sb-6',
    title: 'Deep Work: P-Set 4 Valgrind Bug Hunting',
    courseCode: 'CS 106B',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Huang Engineering Library',
    type: 'deep_work',
    cognitiveLoad: 'high'
  },
  {
    id: 'sb-7',
    title: 'CS 106B Durand TA Queue Consultation',
    courseCode: 'CS 106B',
    startTime: '16:00',
    endTime: '16:45',
    location: 'Durand 353 (In-Person)',
    type: 'section',
    cognitiveLoad: 'medium'
  }
];

export const initialNotes: NoteItem[] = [
  {
    id: 'n-1',
    courseId: 'cs106b',
    title: 'Priority Queue Heap Invariants & Sift-Down Rule',
    content: `### Heap Property Notes from Keith's Office Hours:
- In a min-heap, child index formula for 1-indexed array:
  - Left child = 2 * index
  - Right child = 2 * index + 1
  - Parent = index / 2
- When dequeuing:
  1. Swap element at index 1 with the last element in dynamic buffer.
  2. Decrement size.
  3. Sift-down from index 1: pick smaller of left/right child, swap if parent > child.
  4. Repeat until heap property restored.
- **Valgrind Watchout**: Ensure destructor frees the underlying dynamic array if resizing occurred!`,
    timestamp: 'Today, 10:45 AM',
    tags: ['C++', 'Heaps', 'PriorityQueue', 'P-Set 4'],
    hasAudioTranscription: true
  },
  {
    id: 'n-2',
    courseId: 'math51',
    title: 'SVD Matrix Factorization Intuition',
    content: `### Singular Value Decomposition (A = U Σ V^T)
- V contains the orthonormal eigenvectors of A^T A (input coordinate basis).
- U contains the orthonormal eigenvectors of A A^T (output coordinate basis).
- Σ contains the singular values (square roots of positive eigenvalues of A^T A).
- Geometric meaning: Any linear transformation maps the unit sphere to a hyper-ellipse.`,
    timestamp: 'Yesterday, 3:15 PM',
    tags: ['LinearAlgebra', 'SVD', 'MidtermPrep'],
    hasAudioTranscription: false
  }
];

export const initialMockQuestions: MockExamQuestion[] = [
  {
    id: 'mq-1',
    question: 'In C++, what occurs when you invoke delete[] on a pointer allocated with single new rather than new[]?',
    codeSnippet: `int* arr = new int(10);
delete[] arr; // What is the runtime behavior?`,
    options: [
      'The memory is safely deallocated without any side-effects.',
      'Undefined Behavior (potential heap corruption or runtime crash).',
      'A std::bad_alloc exception is thrown by the C++ runtime.',
      'Only the first byte of memory is released.'
    ],
    correctIndex: 1,
    explanation: 'Matching new with delete, and new[] with delete[] is mandatory in standard C++. Mismatching leads to undefined behavior because delete[] attempts to read an array allocation header cookie.'
  },
  {
    id: 'mq-2',
    question: 'Given an array-based binary min-heap where index 1 holds the root, at what index is the right child of node i located?',
    options: [
      '2 * i',
      '2 * i + 1',
      'i / 2',
      '2 * i - 1'
    ],
    correctIndex: 1,
    explanation: 'In a 1-indexed binary heap array: Parent is floor(i/2), Left child is 2*i, and Right child is 2*i + 1.'
  },
  {
    id: 'mq-3',
    question: 'Under Valgrind Memcheck, what does a "Definitely Lost" leak report signify?',
    options: [
      'A pointer is pointing to the middle of an allocated memory block.',
      'Memory was allocated on the heap, but no valid pointer anywhere points to its start or within it.',
      'The memory was allocated in a recursive function that did not return.',
      'The memory was freed twice in the program execution.'
    ],
    correctIndex: 1,
    explanation: '"Definitely lost" means memory was allocated with malloc/new, but no pointer exists anywhere in the address space to reach it, making freeing it impossible.'
  },
  {
    id: 'mq-4',
    question: 'For a matrix A of dimension m x n with rank r, what is the dimension of the null space Null(A)?',
    options: [
      'm - r',
      'n - r (Rank-Nullity Theorem)',
      'r',
      'm * n - r'
    ],
    correctIndex: 1,
    explanation: 'By the Rank-Nullity Theorem: dim(Col(A)) + dim(Null(A)) = n (number of columns). Thus dim(Null(A)) = n - r.'
  }
];

export const initialCampusRoutes: CampusRoute[] = [
  {
    id: 'cr-1',
    from: 'Hewlett Teaching Center',
    to: 'Sloan Math Corner (Bldg 380)',
    walkMinutes: 6,
    bikeMinutes: 2,
    distanceMiles: 0.28,
    quadCrowdLevel: 'Moderate',
    bufferRecommendation: 'Direct route via Main Quad arcade. Clear 10-minute passing window.'
  },
  {
    id: 'cr-2',
    from: 'Gates Computer Science',
    to: 'Durand Building',
    walkMinutes: 4,
    bikeMinutes: 1,
    distanceMiles: 0.18,
    quadCrowdLevel: 'Low',
    bufferRecommendation: 'Short transit along Via Ortega. Optimal for rushing to TA hours.'
  },
  {
    id: 'cr-3',
    from: 'Sloan Math Corner',
    to: 'Huang Engineering Center',
    walkMinutes: 8,
    bikeMinutes: 3,
    distanceMiles: 0.42,
    quadCrowdLevel: 'Heavy',
    bufferRecommendation: 'Passing through White Plaza during lunch hour (12:30 PM). Use Panama Mall bike path.'
  }
];
