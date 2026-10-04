import { VtopTimetableEntry } from './vtopTypes';

export interface SlotTimeMapping {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
}

/**
 * Standard College Theory & Lab Slot Matrix (VIT / VTOP Timing Architecture)
 * Theory classes: 50-minute slots. Lab classes: 100-minute blocks (2 consecutive 50m slots).
 */
export const VTOP_SLOT_TIMETABLE: Record<string, SlotTimeMapping[]> = {
  // Morning Theory Slots
  'A1': [
    { day: 'Monday', startTime: '08:00', endTime: '08:50' },
    { day: 'Wednesday', startTime: '09:00', endTime: '09:50' }
  ],
  'B1': [
    { day: 'Tuesday', startTime: '08:00', endTime: '08:50' },
    { day: 'Thursday', startTime: '09:00', endTime: '09:50' }
  ],
  'C1': [
    { day: 'Wednesday', startTime: '08:00', endTime: '08:50' },
    { day: 'Friday', startTime: '09:00', endTime: '09:50' }
  ],
  'D1': [
    { day: 'Thursday', startTime: '08:00', endTime: '08:50' },
    { day: 'Monday', startTime: '10:00', endTime: '10:50' }
  ],
  'E1': [
    { day: 'Friday', startTime: '08:00', endTime: '08:50' },
    { day: 'Tuesday', startTime: '10:00', endTime: '10:50' }
  ],
  'F1': [
    { day: 'Monday', startTime: '09:00', endTime: '09:50' },
    { day: 'Wednesday', startTime: '10:00', endTime: '10:50' }
  ],
  'G1': [
    { day: 'Tuesday', startTime: '09:00', endTime: '09:50' },
    { day: 'Thursday', startTime: '10:00', endTime: '10:50' }
  ],
  'TA1': [
    { day: 'Friday', startTime: '10:00', endTime: '10:50' }
  ],
  'TB1': [
    { day: 'Monday', startTime: '11:00', endTime: '11:50' }
  ],
  'TC1': [
    { day: 'Tuesday', startTime: '11:00', endTime: '11:50' }
  ],
  'TD1': [
    { day: 'Wednesday', startTime: '11:00', endTime: '11:50' }
  ],
  'TE1': [
    { day: 'Thursday', startTime: '11:00', endTime: '11:50' }
  ],
  'TF1': [
    { day: 'Friday', startTime: '11:00', endTime: '11:50' }
  ],

  // Afternoon Theory Slots
  'A2': [
    { day: 'Monday', startTime: '14:00', endTime: '14:50' },
    { day: 'Wednesday', startTime: '15:00', endTime: '15:50' }
  ],
  'B2': [
    { day: 'Tuesday', startTime: '14:00', endTime: '14:50' },
    { day: 'Thursday', startTime: '15:00', endTime: '15:50' }
  ],
  'C2': [
    { day: 'Wednesday', startTime: '14:00', endTime: '14:50' },
    { day: 'Friday', startTime: '15:00', endTime: '15:50' }
  ],
  'D2': [
    { day: 'Thursday', startTime: '14:00', endTime: '14:50' },
    { day: 'Monday', startTime: '16:00', endTime: '16:50' }
  ],
  'E2': [
    { day: 'Friday', startTime: '14:00', endTime: '14:50' },
    { day: 'Tuesday', startTime: '16:00', endTime: '16:50' }
  ],
  'F2': [
    { day: 'Monday', startTime: '15:00', endTime: '15:50' },
    { day: 'Wednesday', startTime: '16:00', endTime: '16:50' }
  ],
  'G2': [
    { day: 'Tuesday', startTime: '15:00', endTime: '15:50' },
    { day: 'Thursday', startTime: '16:00', endTime: '16:50' }
  ],

  // Standard Lab Blocks
  'L1+L2': [{ day: 'Monday', startTime: '08:00', endTime: '09:40' }],
  'L3+L4': [{ day: 'Monday', startTime: '10:00', endTime: '11:40' }],
  'L7+L8': [{ day: 'Tuesday', startTime: '08:00', endTime: '09:40' }],
  'L9+L10': [{ day: 'Tuesday', startTime: '10:00', endTime: '11:40' }],
  'L13+L14': [{ day: 'Wednesday', startTime: '08:00', endTime: '09:40' }],
  'L15+L16': [{ day: 'Wednesday', startTime: '10:00', endTime: '11:40' }],
  'L19+L20': [{ day: 'Thursday', startTime: '08:00', endTime: '09:40' }],
  'L21+L22': [{ day: 'Thursday', startTime: '10:00', endTime: '11:40' }],
  'L25+L26': [{ day: 'Friday', startTime: '08:00', endTime: '09:40' }],
  'L27+L28': [{ day: 'Friday', startTime: '10:00', endTime: '11:40' }],
  
  // Afternoon Lab Blocks
  'L31+L32': [{ day: 'Monday', startTime: '14:00', endTime: '15:40' }],
  'L33+L34': [{ day: 'Monday', startTime: '16:00', endTime: '17:40' }],
  'L37+L38': [{ day: 'Tuesday', startTime: '14:00', endTime: '15:40' }],
  'L39+L40': [{ day: 'Tuesday', startTime: '16:00', endTime: '17:40' }],
  'L43+L44': [{ day: 'Wednesday', startTime: '14:00', endTime: '15:40' }],
  'L45+L46': [{ day: 'Wednesday', startTime: '16:00', endTime: '17:40' }],
  'L49+L50': [{ day: 'Thursday', startTime: '14:00', endTime: '15:40' }],
  'L51+L52': [{ day: 'Thursday', startTime: '16:00', endTime: '17:40' }],
  'L55+L56': [{ day: 'Friday', startTime: '14:00', endTime: '15:40' }],
  'L57+L58': [{ day: 'Friday', startTime: '16:00', endTime: '17:40' }]
};

/**
 * Resolves a complex VTOP slot string (e.g., "A1+TA1" or "L45+L46") into calendar schedule blocks
 */
export function expandVtopSlotsToWeeklySchedule(
  slotString: string,
  courseCode: string,
  courseTitle: string,
  venue: string,
  type: 'Theory' | 'Lab' = 'Theory'
): VtopTimetableEntry[] {
  const entries: VtopTimetableEntry[] = [];
  const individualSlots = slotString.split('+').map((s) => s.trim());

  // Check if direct composite match exists (e.g. "L45+L46")
  if (VTOP_SLOT_TIMETABLE[slotString]) {
    for (const mapping of VTOP_SLOT_TIMETABLE[slotString]) {
      entries.push({
        day: mapping.day,
        slot: slotString,
        startTime: mapping.startTime,
        endTime: mapping.endTime,
        courseCode,
        courseTitle,
        venue,
        type
      });
    }
    return entries;
  }

  // Otherwise, expand individual parts (e.g., "A1", then "TA1")
  for (const part of individualSlots) {
    const mappings = VTOP_SLOT_TIMETABLE[part];
    if (mappings) {
      for (const m of mappings) {
        entries.push({
          day: m.day,
          slot: part,
          startTime: m.startTime,
          endTime: m.endTime,
          courseCode,
          courseTitle,
          venue,
          type
        });
      }
    }
  }

  return entries;
}
