export interface VtopCredentials {
  regNo: string;
  password: string;
  captcha: string;
}

export interface VtopSession {
  authorizedID: string;
  csrfToken: string;
  cookies: string; // Cookie jar string
  semesterSubId?: string;
}

export interface VtopStudentProfile {
  regNo: string;
  name: string;
  branch: string;
  degree: string;
  school?: string;
  campus: string;
  cgpa: number;
  totalCredits: number;
}

export interface VtopCourseRegistration {
  courseCode: string;
  courseTitle: string;
  courseType: 'Theory' | 'Lab' | 'Project' | 'Embedded';
  credits: number;
  slot: string; // e.g., "A1+TA1", "L45+L46"
  venue: string; // e.g., "SJT 402", "TT 105"
  facultyName: string;
}

export interface VtopTimetableEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  slot: string;
  startTime: string; // "08:00"
  endTime: string;   // "08:50"
  courseCode: string;
  courseTitle: string;
  venue: string;
  type: 'Theory' | 'Lab';
}

export interface VtopAttendanceRecord {
  courseCode: string;
  courseTitle: string;
  courseType: string;
  slot: string;
  attendedHours: number;
  totalHours: number;
  percentage: number;
  cushionOrDeficit: number; // Positive = can miss X classes, Negative = must attend X classes
}

export interface VtopMarkComponent {
  title: string; // e.g. "CAT-1", "CAT-2", "DA-1", "FAT"
  maxMarks: number;
  scoredMarks: number;
  weightagePercent: number;
  status: string;
}

export interface VtopCourseMarks {
  courseCode: string;
  components: VtopMarkComponent[];
  totalScore: number;
}

export interface VtopExamEntry {
  courseCode: string;
  courseTitle: string;
  slot: string;
  examDate: string; // "2026-11-12"
  session: 'FN' | 'AN'; // Forenoon or Afternoon
  reportingTime: string; // "09:30 AM"
  examTime: string;      // "10:00 AM - 01:00 PM"
  venue: string;
  seatLocation?: string;
  seatNumber?: string;
}

export interface VtopSemesterOption {
  code: string;
  name: string;
  type: 'Current' | 'Previous' | 'Historical';
  description: string;
}

export const AVAILABLE_SEMESTERS: VtopSemesterOption[] = [
  {
    code: 'WS202526',
    name: 'Winter Semester 2025-26',
    type: 'Current',
    description: 'Active instructional term · Day 1-5 order · Ongoing assessments'
  },
  {
    code: 'FS202526',
    name: 'Fall Semester 2025-26',
    type: 'Previous',
    description: 'Concluded semester · Final grades & FAT transcripts available'
  },
  {
    code: 'SS202425',
    name: 'Summer Intersession 2024-25',
    type: 'Historical',
    description: 'Weekend fast-track modules & arrears'
  },
  {
    code: 'WS202425',
    name: 'Winter Semester 2024-25',
    type: 'Historical',
    description: 'Archived records & credit transfer logs'
  }
];

export interface VtopHarvestedData {
  profile: VtopStudentProfile;
  courses: VtopCourseRegistration[];
  timetable: VtopTimetableEntry[];
  attendance: VtopAttendanceRecord[];
  exams: VtopExamEntry[];
  marks?: VtopCourseMarks[];
  semesterCode?: string;
  semesterName?: string;
  syncedAt: string;
}
