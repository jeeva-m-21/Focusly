/**
 * SuperMemo SM-2 & Ebbinghaus Forgetting Curve Spaced Repetition Engine
 * 
 * Mathematically calculates:
 * 1. Interval expansion: I(1) = 1 day, I(2) = 6 days, I(n) = I(n-1) * EF
 * 2. Ease Factor update: EF' = max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
 * 3. Ebbinghaus Memory Retention Probability: R(t) = exp(-t / S)
 */

export interface SpacedCardProgress {
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewedTimestamp: number;
  nextReviewTimestamp: number;
  retentionPercent: number; // 0 - 100
}

export type ReviewGrade = 1 | 2 | 3 | 4 | 5; 
// 1 = Again (failed), 2 = Hard, 3 = Good (passed), 4 = Easy, 5 = Instant mastery

/**
 * Calculates new interval, ease factor, and next review date using SM-2.
 */
export function calculateSM2(
  current: SpacedCardProgress,
  grade: ReviewGrade
): SpacedCardProgress {
  const now = Date.now();
  let { repetitions, intervalDays, easeFactor } = current;

  // 1. Calculate new Ease Factor
  const quality = grade;
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // 2. Calculate new Repetition count & Interval
  if (quality < 3) {
    // Failed recall: reset streak
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Successful recall: expand interval
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * newEaseFactor);
    }
    repetitions += 1;
  }

  // 3. Calculate next review timestamp
  const nextReviewTimestamp = now + intervalDays * 24 * 60 * 60 * 1000;

  // 4. Estimate retention probability immediately post-review
  const retentionPercent = quality >= 4 ? 96 : quality === 3 ? 88 : quality === 2 ? 65 : 40;

  return {
    cardId: current.cardId,
    repetitions,
    intervalDays,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    lastReviewedTimestamp: now,
    nextReviewTimestamp,
    retentionPercent
  };
}

/**
 * Computes memory retention probability according to the Ebbinghaus forgetting curve:
 * R(t) = e^(-t / S), where S = intervalDays * (easeFactor / 2.5)
 */
export function calculateRetentionProbability(card: SpacedCardProgress): number {
  const now = Date.now();
  const elapsedDays = Math.max(0, (now - card.lastReviewedTimestamp) / (24 * 60 * 60 * 1000));
  const stability = Math.max(1, card.intervalDays * (card.easeFactor / 2.5));
  const probability = Math.exp(-elapsedDays / stability);
  return Math.round(Math.max(5, Math.min(100, probability * 100)));
}

/**
 * Computes aggregate mastery for an exam topic across all of its associated flashcards.
 */
export function computeTopicMastery(cards: SpacedCardProgress[]): {
  masteryPercent: number;
  status: 'critical' | 'moderate' | 'mastered';
  cardsDueCount: number;
} {
  if (cards.length === 0) {
    return { masteryPercent: 50, status: 'moderate', cardsDueCount: 0 };
  }

  const now = Date.now();
  const totalRetention = cards.reduce((sum, c) => sum + calculateRetentionProbability(c), 0);
  const masteryPercent = Math.round(totalRetention / cards.length);
  const cardsDueCount = cards.filter((c) => now >= c.nextReviewTimestamp).length;

  const status = masteryPercent >= 80 ? 'mastered' : masteryPercent >= 55 ? 'moderate' : 'critical';

  return {
    masteryPercent,
    status,
    cardsDueCount
  };
}
