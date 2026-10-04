/**
 * Borbély's Two-Process Model of Sleep-Wake Regulation & Cognitive Alertness
 * 
 * Mathematically models:
 * 1. Process S (Homeostatic sleep pressure): Adenosine debt accumulated over wakefulness
 * 2. Process C (Circadian pacemaker oscillator): 24h harmonic biological rhythm
 * 3. Alertness Index: Composite score (0-100%) indicating optimal cognitive stamina
 */

export interface CircadianTelemetry {
  hourDecimal: number;
  alertnessScore: number; // 0 - 100
  phaseId: 'morning_peak' | 'midday_lull' | 'afternoon_surge' | 'evening_taper';
  phaseName: string;
  cortisolLevel: number; // 0.0 - 1.0
  adenosineDebt: number; // 0.0 - 1.0
  optimalTaskType: 'algorithmic_deep_work' | 'light_transit' | 'analytical_problem_solving' | 'memory_consolidation';
  recommendation: string;
  recommendedDurationMinutes: number;
}

export interface ChronotypeConfig {
  wakeHour: number; // e.g., 7.5 (07:30 AM)
  sleepHour: number; // e.g., 23.5 (11:30 PM)
  phaseShiftHours: number; // 0 for Lark, +2 for Afternoon, +4 for Owl
}

export const CHRONOTYPE_PRESETS: Record<string, ChronotypeConfig> = {
  lark: { wakeHour: 6.5, sleepHour: 22.5, phaseShiftHours: -1.0 },
  afternoon: { wakeHour: 7.5, sleepHour: 23.5, phaseShiftHours: 0.0 },
  owl: { wakeHour: 9.0, sleepHour: 1.5, phaseShiftHours: 2.5 }
};

/**
 * Calculates continuous biological alertness at any hour of the day.
 */
export function calculateCircadianAlertness(
  hourDecimal: number,
  chronotype: 'lark' | 'afternoon' | 'owl' = 'afternoon'
): CircadianTelemetry {
  const config = CHRONOTYPE_PRESETS[chronotype] || CHRONOTYPE_PRESETS.afternoon;
  const shift = config.phaseShiftHours;

  // Process C: Circadian oscillator (two-harmonic cosine Fourier approximation)
  // Primary peak around 10:00 - 11:30 AM, secondary peak around 15:00 - 16:30
  const adjustedHour = (hourDecimal - shift + 24) % 24;
  const theta1 = (2 * Math.PI * (adjustedHour - 10.5)) / 24;
  const theta2 = (4 * Math.PI * (adjustedHour - 15.0)) / 24;
  const processC = 0.65 * Math.cos(theta1) + 0.35 * Math.cos(theta2);

  // Process S: Homeostatic sleep pressure (exponential accumulation since wake time)
  const wakeTime = config.wakeHour;
  const hoursAwake = adjustedHour >= wakeTime ? adjustedHour - wakeTime : adjustedHour + 24 - wakeTime;
  const tauDecay = 18.2; // homeostatic accumulation time constant
  const adenosineDebt = Math.min(1.0, 1.0 - Math.exp(-hoursAwake / tauDecay) + 0.1);

  // Cortisol level peaks ~1-2 hours after waking, then tapers
  const hoursSinceWake = Math.max(0, hoursAwake);
  const cortisol = Math.max(0.1, Math.min(1.0, Math.exp(-Math.pow(hoursSinceWake - 1.5, 2) / 12) * 0.85 + 0.15));

  // Composite Alertness (0 - 100)
  const rawScore = 50 + 40 * processC - 20 * adenosineDebt;
  const alertnessScore = Math.round(Math.max(15, Math.min(98, rawScore)));

  // Classify biological phase
  if (adjustedHour >= 8.0 && adjustedHour < 12.0) {
    return {
      hourDecimal,
      alertnessScore,
      phaseId: 'morning_peak',
      phaseName: 'Peak Cognitive Window',
      cortisolLevel: Number(cortisol.toFixed(2)),
      adenosineDebt: Number(adenosineDebt.toFixed(2)),
      optimalTaskType: 'algorithmic_deep_work',
      recommendation: 'Optimal deep work window. Focus on pointer math, C++ memory allocation, and proof derivations.',
      recommendedDurationMinutes: 50
    };
  } else if (adjustedHour >= 12.0 && adjustedHour < 13.75) {
    return {
      hourDecimal,
      alertnessScore,
      phaseId: 'midday_lull',
      phaseName: 'Post-Prandial Midday Lull',
      cortisolLevel: Number(cortisol.toFixed(2)),
      adenosineDebt: Number(adenosineDebt.toFixed(2)),
      optimalTaskType: 'light_transit',
      recommendation: 'Transient energy dip. Ideal for campus transit, healthy lunch, and administrative organization.',
      recommendedDurationMinutes: 25
    };
  } else if (adjustedHour >= 13.75 && adjustedHour < 17.5) {
    return {
      hourDecimal,
      alertnessScore,
      phaseId: 'afternoon_surge',
      phaseName: 'Afternoon Analytical Surge',
      cortisolLevel: Number(cortisol.toFixed(2)),
      adenosineDebt: Number(adenosineDebt.toFixed(2)),
      optimalTaskType: 'analytical_problem_solving',
      recommendation: 'High analytical stamina. Best for Math 51 P-Sets, physics lab problem solving, and TA debugging.',
      recommendedDurationMinutes: 50
    };
  } else {
    return {
      hourDecimal,
      alertnessScore,
      phaseId: 'evening_taper',
      phaseName: 'Twilight Melatonin Onset',
      cortisolLevel: Number(cortisol.toFixed(2)),
      adenosineDebt: Number(adenosineDebt.toFixed(2)),
      optimalTaskType: 'memory_consolidation',
      recommendation: 'Tapering alertness. Best for flashcard spaced repetition recall and sleep hygiene consolidation.',
      recommendedDurationMinutes: 30
    };
  }
}

/**
 * Finds the top biological focus windows of the day.
 */
export function getDailyPeakWindows(chronotype: 'lark' | 'afternoon' | 'owl' = 'afternoon') {
  const hours = [8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 19.0, 21.0];
  const telemetry = hours.map((h) => calculateCircadianAlertness(h, chronotype));
  return telemetry.sort((a, b) => b.alertnessScore - a.alertnessScore);
}
