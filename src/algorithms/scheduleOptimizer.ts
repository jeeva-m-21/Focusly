import { Task, ScheduleBlock, CognitiveLoadLevel } from '../types';
import { calculateCircadianAlertness } from './circadianModel';

export interface TimeSlot {
  startMinutes: number; // e.g. 8 * 60 = 480
  endMinutes: number;   // e.g. 10 * 60 = 600
  durationMinutes: number;
}

export interface OptimizationResult {
  optimizedBlocks: ScheduleBlock[];
  scheduledTaskIds: string[];
  totalFocusMinutes: number;
  circadianAlignmentScore: number; // 0 - 100
}

/**
 * Converts "HH:MM" string to minutes from midnight.
 */
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes from midnight to "HH:MM" string.
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Solves interval scheduling and bin-packing for student tasks.
 */
export function optimizeStudySchedule(
  tasks: Task[],
  existingFixedBlocks: ScheduleBlock[],
  chronotype: 'lark' | 'afternoon' | 'owl' = 'afternoon',
  dayStartMinutes: number = 8 * 60 + 30, // 08:30 AM
  dayEndMinutes: number = 20 * 60        // 08:00 PM
): OptimizationResult {
  // 1. Identify non-negotiable busy intervals (classes, transit, lunch)
  const busyIntervals: TimeSlot[] = existingFixedBlocks
    .map((b) => ({
      startMinutes: timeStringToMinutes(b.startTime),
      endMinutes: timeStringToMinutes(b.endTime),
      durationMinutes: timeStringToMinutes(b.endTime) - timeStringToMinutes(b.startTime)
    }))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  // 2. Compute available free intervals (inverted busy intervals)
  const freeIntervals: TimeSlot[] = [];
  let currentPointer = dayStartMinutes;

  for (const busy of busyIntervals) {
    if (busy.startMinutes > currentPointer + 15) {
      // Free window found
      freeIntervals.push({
        startMinutes: currentPointer,
        endMinutes: Math.min(dayEndMinutes, busy.startMinutes),
        durationMinutes: Math.min(dayEndMinutes, busy.startMinutes) - currentPointer
      });
    }
    currentPointer = Math.max(currentPointer, busy.endMinutes);
  }

  if (currentPointer < dayEndMinutes - 20) {
    freeIntervals.push({
      startMinutes: currentPointer,
      endMinutes: dayEndMinutes,
      durationMinutes: dayEndMinutes - currentPointer
    });
  }

  // 3. Sort pending tasks by urgency and cognitive demand
  const incompleteTasks = [...tasks.filter((t) => !t.completed)].sort((a, b) => {
    const priorityWeight: Record<CognitiveLoadLevel, number> = { high: 3, medium: 2, admin: 1 };
    const aWeight = priorityWeight[a.cognitiveLoad] || 1;
    const bWeight = priorityWeight[b.cognitiveLoad] || 1;
    // Higher cognitive load & pinned tasks first
    return (b.pinned ? 4 : 0) + bWeight - ((a.pinned ? 4 : 0) + aWeight);
  });

  const scheduledBlocks: ScheduleBlock[] = [...existingFixedBlocks];
  const scheduledTaskIds: string[] = [];
  let totalFocusMinutes = 0;
  let totalAlignment = 0;
  let slotAssessments = 0;

  // 4. Greedy Bin-Packing with Circadian Alertness Matching
  for (const task of incompleteTasks) {
    const taskDuration = Math.min(90, Math.max(30, task.estimatedMinutes || 45));

    // Find the best fitting free slot
    let bestSlotIndex = -1;
    let bestSlotScore = -Infinity;

    for (let i = 0; i < freeIntervals.length; i++) {
      const slot = freeIntervals[i];
      if (slot.durationMinutes >= taskDuration) {
        const slotHourDecimal = slot.startMinutes / 60;
        const telemetry = calculateCircadianAlertness(slotHourDecimal, chronotype);

        // Score: match high cognitive load with high alertness
        let matchScore = telemetry.alertnessScore;
        if (task.cognitiveLoad === 'high') {
          matchScore += telemetry.alertnessScore >= 80 ? 30 : -20;
        } else if (task.cognitiveLoad === 'admin') {
          matchScore += telemetry.alertnessScore < 70 ? 25 : 0;
        }

        if (matchScore > bestSlotScore) {
          bestSlotScore = matchScore;
          bestSlotIndex = i;
        }
      }
    }

    if (bestSlotIndex !== -1) {
      const slot = freeIntervals[bestSlotIndex];
      const startMin = slot.startMinutes;
      const endMin = startMin + taskDuration;

      const newBlock: ScheduleBlock = {
        id: `opt-${task.id}-${Date.now()}`,
        title: task.title,
        startTime: minutesToTimeString(startMin),
        endTime: minutesToTimeString(endMin),
        courseCode: task.courseId.toUpperCase(),
        type: 'deep_work',
        cognitiveLoad: task.cognitiveLoad,
        isPeakWindow: bestSlotScore >= 85
      };

      scheduledBlocks.push(newBlock);
      scheduledTaskIds.push(task.id);
      totalFocusMinutes += taskDuration;
      totalAlignment += Math.max(40, bestSlotScore);
      slotAssessments += 1;

      // Update remaining free slot
      if (slot.durationMinutes - taskDuration >= 20) {
        freeIntervals[bestSlotIndex] = {
          startMinutes: endMin + 5, // 5 min transition buffer
          endMinutes: slot.endMinutes,
          durationMinutes: slot.endMinutes - (endMin + 5)
        };
      } else {
        freeIntervals.splice(bestSlotIndex, 1);
      }
    }
  }

  // Sort final blocks chronologically
  scheduledBlocks.sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  const circadianAlignmentScore = slotAssessments > 0 ? Math.round(totalAlignment / slotAssessments) : 88;

  return {
    optimizedBlocks: scheduledBlocks,
    scheduledTaskIds,
    totalFocusMinutes,
    circadianAlignmentScore
  };
}
