export interface Job {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  educationLevel: 'Any' | 'Bachelor' | 'Master' | 'PhD';
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'open' | 'closed' | 'screening';
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  educationLevel: 'Any' | 'Bachelor' | 'Master' | 'PhD';
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
}
