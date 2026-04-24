export interface Candidate {
  _id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  education: string;
  category: string;
  resumeText: string;
  source: 'csv' | 'json' | 'pdf' | 'manual';
  createdAt: string;
}

export interface ScreeningResult {
  _id: string;
  jobId: string;
  candidateId: Candidate;
  compositeScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Maybe' | 'Not Recommended';
  rank: number;
  screenedAt: string;
}
