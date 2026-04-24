import { getGeminiModel } from '../config/gemini';
import { IJob } from '../models/Job';
import { ICandidate } from '../models/Candidate';
import { calculateCompositeScore, scoreToLabel } from '../utils/scoreCalculator';
import logger from '../utils/logger';

export interface GeminiScreeningResult {
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  compositeScore: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Maybe' | 'Not Recommended';
}

/**
 * Use Gemini to evaluate a single candidate against a job.
 */
export async function screenCandidate(
  job: IJob,
  candidate: ICandidate
): Promise<GeminiScreeningResult> {
  const model = getGeminiModel();

  const prompt = buildPrompt(job, candidate);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiResponse(text, job, candidate);
  } catch (err) {
    logger.error(`Gemini screening error for ${candidate.name}: ${err}`);
    // Fallback to rule-based scoring if Gemini fails
    return fallbackScoring(job, candidate);
  }
}

function buildPrompt(job: IJob, candidate: ICandidate): string {
  return `
You are an expert AI recruitment screener. Evaluate the following candidate against the job requirements.

## JOB REQUIREMENTS
Title: ${job.title}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(', ')}
Preferred Skills: ${job.preferredSkills.join(', ')}
Minimum Experience: ${job.experienceYears} years
Education Level: ${job.educationLevel}

## CANDIDATE PROFILE
Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experienceYears} years
Education: ${candidate.education}
Category: ${candidate.category}
Resume Summary: ${candidate.resumeText.slice(0, 1500)}

## TASK
Provide a structured JSON evaluation with these EXACT fields:
{
  "skillScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "educationScore": <number 0-100>,
  "projectScore": <number 0-100>,
  "explanation": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "recommendation": "<one of: Strongly Recommend | Recommend | Maybe | Not Recommended>"
}

Return ONLY the JSON object, no markdown, no extra text.
`.trim();
}

function parseGeminiResponse(
  text: string,
  job: IJob,
  candidate: ICandidate
): GeminiScreeningResult {
  try {
    // Strip any markdown fences
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const skillScore = clamp(Number(parsed.skillScore) || 0);
    const experienceScore = clamp(Number(parsed.experienceScore) || 0);
    const educationScore = clamp(Number(parsed.educationScore) || 0);
    const projectScore = clamp(Number(parsed.projectScore) || 0);

    const compositeScore = calculateCompositeScore({
      skills: skillScore,
      experience: experienceScore,
      education: educationScore,
      projectMatch: projectScore,
    });

    const validRecommendations = ['Strongly Recommend', 'Recommend', 'Maybe', 'Not Recommended'];
    const recommendation = validRecommendations.includes(parsed.recommendation)
      ? parsed.recommendation
      : 'Maybe';

    return {
      skillScore,
      experienceScore,
      educationScore,
      projectScore,
      compositeScore,
      label: scoreToLabel(compositeScore),
      explanation: parsed.explanation || 'No explanation provided.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      recommendation: recommendation as GeminiScreeningResult['recommendation'],
    };
  } catch (err) {
    logger.warn(`Failed to parse Gemini JSON response, using fallback: ${err}`);
    return fallbackScoring(job, candidate);
  }
}

function fallbackScoring(job: IJob, candidate: ICandidate): GeminiScreeningResult {
  // Simple rule-based fallback
  const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase());
  const candidateSkills = candidate.skills.map((s) => s.toLowerCase());

  const matchedSkills = requiredSkills.filter((s) => candidateSkills.includes(s));
  const skillScore = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 50;

  const expRatio = job.experienceYears > 0
    ? Math.min(candidate.experienceYears / job.experienceYears, 1.5)
    : 1;
  const experienceScore = Math.round(Math.min(expRatio * 70, 100));

  const educationScore = 60;
  const projectScore = 50;

  const compositeScore = calculateCompositeScore({
    skills: skillScore,
    experience: experienceScore,
    education: educationScore,
    projectMatch: projectScore,
  });

  return {
    skillScore,
    experienceScore,
    educationScore,
    projectScore,
    compositeScore,
    label: scoreToLabel(compositeScore),
    explanation: `Candidate matches ${matchedSkills.length}/${requiredSkills.length} required skills with ${candidate.experienceYears} years of experience.`,
    strengths: matchedSkills.slice(0, 3).map((s) => `Has ${s} skill`),
    weaknesses: requiredSkills
      .filter((s) => !candidateSkills.includes(s))
      .slice(0, 2)
      .map((s) => `Missing ${s}`),
    recommendation: compositeScore >= 70 ? 'Recommend' : compositeScore >= 50 ? 'Maybe' : 'Not Recommended',
  };
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.round(Math.min(max, Math.max(min, val)));
}
