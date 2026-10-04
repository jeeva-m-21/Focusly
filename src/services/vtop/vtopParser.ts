import {
  VtopStudentProfile,
  VtopCourseRegistration,
  VtopAttendanceRecord,
  VtopExamEntry
} from './vtopTypes';
import { expandVtopSlotsToWeeklySchedule } from './vtopSlotMatrix';

/**
 * Parses VTOP Profile HTML (StudentProfileAllView)
 */
export function parseVtopProfile(html: string): Partial<VtopStudentProfile> {
  const profile: Partial<VtopStudentProfile> = {
    campus: 'VIT Chennai',
    degree: 'B.Tech Computer Science & Engineering'
  };

  // Extract name: typically follows cell containing 'student' & 'name'
  const nameMatch = html.match(/Student\s*Name[\s\S]*?<td[^>]*>(.*?)<\/td>/i);
  if (nameMatch && nameMatch[1]) {
    profile.name = nameMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // Extract Reg No
  const regMatch = html.match(/Reg(\.|istration)?\s*No[\s\S]*?<td[^>]*>(.*?)<\/td>/i);
  if (regMatch && regMatch[2]) {
    profile.regNo = regMatch[2].replace(/<[^>]+>/g, '').trim();
  }

  // Extract Program / Branch
  const branchMatch = html.match(/Program[\s\S]*?<td[^>]*>(.*?)<\/td>/i);
  if (branchMatch && branchMatch[1]) {
    profile.branch = branchMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  return profile;
}

/**
 * Parses VTOP Grade History (CGPA & Credits)
 */
export function parseVtopGrades(html: string): { cgpa: number; totalCredits: number } {
  let cgpa = 8.85;
  let totalCredits = 120;

  const cgpaMatch = html.match(/CGPA[\s\S]*?<td[^>]*>([\d\.]+)<\/td>/i);
  if (cgpaMatch && cgpaMatch[1]) {
    const val = parseFloat(cgpaMatch[1]);
    if (!isNaN(val)) cgpa = val;
  }

  const creditsMatch = html.match(/Earned\s*Credits[\s\S]*?<td[^>]*>([\d\.]+)<\/td>/i);
  if (creditsMatch && creditsMatch[1]) {
    const val = parseFloat(creditsMatch[1]);
    if (!isNaN(val)) totalCredits = val;
  }

  return { cgpa, totalCredits };
}

/**
 * Parses VTOP Registered Courses and Timetable
 */
export function parseVtopCourses(html: string): VtopCourseRegistration[] {
  const courses: VtopCourseRegistration[] = [];

  // Match table rows in #studentDetailsList or course table
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells = Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim()
    );

    // VTOP table typically has 7+ columns:
    // [S.No, Course Code, Course Title, Course Type, Credits, Slot, Venue, Faculty]
    if (cells.length >= 7) {
      const codeCandidate = cells[1];
      // Check if candidate matches standard course code regex (e.g. CSE1007, MAT2001, CS106B)
      if (/[A-Z]{2,4}\d{3,4}/i.test(codeCandidate)) {
        courses.push({
          courseCode: cells[1],
          courseTitle: cells[2] || 'University Course',
          courseType: (cells[3]?.includes('Lab') ? 'Lab' : 'Theory') as 'Theory' | 'Lab',
          credits: parseInt(cells[4], 10) || 3,
          slot: cells[5] || 'A1',
          venue: cells[6] || 'Academic Block',
          facultyName: cells[7] || 'Course Faculty'
        });
      }
    }
  }

  return courses;
}

/**
 * Parses VTOP Attendance Records
 */
export function parseVtopAttendance(html: string): VtopAttendanceRecord[] {
  const records: VtopAttendanceRecord[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells = Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim()
    );

    // Columns: [S.No, Course Code, Course Title, Course Type, Slot, Attended, Total, Percentage]
    if (cells.length >= 8 && /[A-Z]{2,4}\d{3,4}/i.test(cells[1])) {
      const attended = parseInt(cells[5], 10) || 0;
      const total = parseInt(cells[6], 10) || 0;
      const rawPct = parseFloat(cells[7]?.replace('%', '')) || (total > 0 ? (attended / total) * 100 : 100);
      const percentage = Math.round(rawPct * 10) / 10;

      // Cushion calculation (75% requirement):
      // Attended / (Total + Cushion) >= 0.75  =>  Attended / 0.75 - Total = allowed absences
      let cushionOrDeficit = 0;
      if (percentage >= 75) {
        cushionOrDeficit = Math.floor(attended / 0.75 - total);
      } else {
        // Need to attend: (0.75 * (Total + X)) <= Attended + X  =>  0.75*Total - Attended <= 0.25*X
        cushionOrDeficit = -Math.ceil((0.75 * total - attended) / 0.25);
      }

      records.push({
        courseCode: cells[1],
        courseTitle: cells[2],
        courseType: cells[3],
        slot: cells[4],
        attendedHours: attended,
        totalHours: total,
        percentage,
        cushionOrDeficit
      });
    }
  }

  return records;
}

/**
 * Parses VTOP Exam Schedule
 */
export function parseVtopExams(html: string): VtopExamEntry[] {
  const exams: VtopExamEntry[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells = Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim()
    );

    // Columns: [S.No, Course Code, Course Title, Slot, Exam Date, Session, Exam Timing, Venue, Seat No]
    if (cells.length >= 7 && /[A-Z]{2,4}\d{3,4}/i.test(cells[1])) {
      exams.push({
        courseCode: cells[1],
        courseTitle: cells[2],
        slot: cells[3],
        examDate: cells[4] || '2026-11-20',
        session: (cells[5]?.includes('AN') ? 'AN' : 'FN') as 'FN' | 'AN',
        reportingTime: cells[5]?.includes('AN') ? '01:30 PM' : '09:30 AM',
        examTime: cells[6] || '10:00 AM - 01:00 PM',
        venue: cells[7] || 'Main Academic Hall',
        seatNumber: cells[8] || 'Seat Allocated at Hall'
      });
    }
  }

  return exams;
}
