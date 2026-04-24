import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-500';
}

export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

export function recommendationColor(rec: string): string {
  switch (rec) {
    case 'Strongly Recommend': return 'bg-green-100 text-green-800 border-green-200';
    case 'Recommend':          return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Maybe':              return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:                   return 'bg-red-100 text-red-800 border-red-200';
  }
}
