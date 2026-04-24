import pdfParse from 'pdf-parse';
import fs from 'fs';
import logger from '../utils/logger';

export interface ParsedResume {
  text: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  education: string;
}

const SKILL_KEYWORDS = [
  'python', 'javascript', 'typescript', 'java', 'react', 'node', 'express',
  'mongodb', 'sql', 'postgresql', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
  'data science', 'devops', 'ci/cd', 'git', 'linux', 'html', 'css', 'nextjs',
  'graphql', 'rest api', 'microservices', 'agile', 'scrum',
];

/**
 * Extract text and basic structured data from a PDF resume.
 */
export async function parsePDF(filePath: string): Promise<ParsedResume> {
  const dataBuffer = fs.readFileSync(filePath);

  try {
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    return {
      text,
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: extractSkills(text),
      experienceYears: estimateExperience(text),
      education: extractEducation(text),
    };
  } catch (err) {
    logger.error(`PDF parse error: ${err}`);
    throw err;
  }
}

function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/(\+?[\d\s\-().]{10,15})/);
  return match ? match[0].trim() : undefined;
}

function extractName(text: string): string {
  // Take the first non-empty line as the name (heuristic)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines[0] || 'Unknown';
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => lower.includes(skill));
}

function estimateExperience(text: string): number {
  const match = text.match(/(\d+)\s*\+?\s*years?\s*(of\s*)?(experience|exp)/i);
  if (match) return parseInt(match[1]);
  return 0;
}

function extractEducation(text: string): string {
  const degrees = ['phd', 'doctorate', 'master', 'msc', 'mba', 'bachelor', 'bsc', 'b.s', 'b.a', 'associate'];
  const lower = text.toLowerCase();
  for (const deg of degrees) {
    if (lower.includes(deg)) return deg.charAt(0).toUpperCase() + deg.slice(1);
  }
  return '';
}
