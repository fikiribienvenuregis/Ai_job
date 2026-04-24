export interface ScoreWeights {
  skills: number;       // 0-1
  experience: number;   // 0-1
  education: number;    // 0-1
  projectMatch: number; // 0-1
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  skills: 0.40,
  experience: 0.30,
  education: 0.15,
  projectMatch: 0.15,
};

export interface RawScores {
  skills: number;       // 0-100
  experience: number;   // 0-100
  education: number;    // 0-100
  projectMatch: number; // 0-100
}

/**
 * Compute a weighted composite score (0-100).
 */
export function calculateCompositeScore(
  raw: RawScores,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const score =
    raw.skills * weights.skills +
    raw.experience * weights.experience +
    raw.education * weights.education +
    raw.projectMatch * weights.projectMatch;

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Convert a score to a label for display.
 */
export function scoreToLabel(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}
