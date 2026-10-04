import { Course, GradeComponent } from '../types';

export interface CourseGradeProjection {
  courseId: string;
  courseCode: string;
  currentPercentage: number;
  currentLetterGrade: string;
  gradedWeightPercent: number;
  remainingWeightPercent: number;
  requiredForA: number | null;     // Required % on remaining deliverables for A (93%)
  requiredForAMinus: number | null; // Required % on remaining deliverables for A- (90%)
  requiredForBPlus: number | null;  // Required % on remaining deliverables for B+ (87%)
  isAtRisk: boolean;
}

export interface TermGPAProjection {
  currentGPA: number;
  projectedGPA: number;
  targetGPA: number;
  deansListThreshold: number; // 3.80
  isDeansListProjected: boolean;
}

/**
 * Converts a numeric score (0 - 100) to standard 4.0 GPA scale.
 */
export function scoreToGPAPoints(percent: number): number {
  if (percent >= 93) return 4.0;
  if (percent >= 90) return 3.7;
  if (percent >= 87) return 3.3;
  if (percent >= 83) return 3.0;
  if (percent >= 80) return 2.7;
  if (percent >= 77) return 2.3;
  if (percent >= 73) return 2.0;
  return 1.7;
}

/**
 * Converts numeric percentage to letter grade.
 */
export function scoreToLetterGrade(percent: number): string {
  if (percent >= 93) return 'A';
  if (percent >= 90) return 'A-';
  if (percent >= 87) return 'B+';
  if (percent >= 83) return 'B';
  if (percent >= 80) return 'B-';
  if (percent >= 77) return 'C+';
  if (percent >= 70) return 'C';
  return 'NP';
}

/**
 * Calculates course grade projections and required exam scores.
 */
export function calculateCourseProjection(course: Course): CourseGradeProjection {
  const components = course.gradingWeights;
  let gradedWeight = 0;
  let accumulatedPoints = 0;

  for (const comp of components) {
    if (comp.score !== undefined) {
      gradedWeight += comp.weightPercent;
      accumulatedPoints += (comp.score * comp.weightPercent) / 100;
    }
  }

  const currentPercentage = gradedWeight > 0 ? Number(((accumulatedPoints / gradedWeight) * 100).toFixed(1)) : 95.0;
  const currentLetterGrade = scoreToLetterGrade(currentPercentage);
  const remainingWeight = 100 - gradedWeight;

  const solveRequired = (targetScore: number): number | null => {
    if (remainingWeight <= 0) return null;
    const pointsNeeded = targetScore - accumulatedPoints;
    const required = (pointsNeeded / remainingWeight) * 100;
    return Number(Math.max(0, Math.min(105, required)).toFixed(1));
  };

  return {
    courseId: course.id,
    courseCode: course.code,
    currentPercentage,
    currentLetterGrade,
    gradedWeightPercent: gradedWeight,
    remainingWeightPercent: remainingWeight,
    requiredForA: solveRequired(93.0),
    requiredForAMinus: solveRequired(90.0),
    requiredForBPlus: solveRequired(87.0),
    isAtRisk: currentPercentage < 85.0
  };
}

/**
 * Calculates term GPA equilibrium across all enrolled courses.
 */
export function calculateTermGPAEquilibrium(
  courses: Course[],
  targetGPA: number = 3.90
): TermGPAProjection {
  let totalUnits = 0;
  let currentWeightedPoints = 0;
  let projectedWeightedPoints = 0;

  for (const course of courses) {
    const proj = calculateCourseProjection(course);
    const units = course.units || 4;
    totalUnits += units;

    const currentPoints = scoreToGPAPoints(proj.currentPercentage);
    currentWeightedPoints += currentPoints * units;

    // Projected assumes realistic equilibrium on remaining deliverables
    const projectedPercent = proj.currentPercentage >= 90 ? proj.currentPercentage : proj.currentPercentage + 2.0;
    projectedWeightedPoints += scoreToGPAPoints(projectedPercent) * units;
  }

  const currentGPA = totalUnits > 0 ? Number((currentWeightedPoints / totalUnits).toFixed(2)) : 3.88;
  const projectedGPA = totalUnits > 0 ? Number((projectedWeightedPoints / totalUnits).toFixed(2)) : 3.91;
  const deansListThreshold = 3.80;

  return {
    currentGPA,
    projectedGPA,
    targetGPA,
    deansListThreshold,
    isDeansListProjected: projectedGPA >= deansListThreshold
  };
}
