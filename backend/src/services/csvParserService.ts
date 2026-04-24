import { parse } from 'csv-parse';
import fs from 'fs';
import logger from '../utils/logger';

export interface ParsedCandidate {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  education: string;
  category: string;
  resumeText: string;
}

/**
 * Parse a CSV file into candidate objects.
 * Expected columns: name, email, phone, skills (comma-sep), experience_years,
 *                   education, category, resume_text
 */
export async function parseCSV(filePath: string): Promise<ParsedCandidate[]> {
  return new Promise((resolve, reject) => {
    const results: ParsedCandidate[] = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row: Record<string, string>) => {
        const candidate: ParsedCandidate = {
          name: row['name'] || row['Name'] || 'Unknown',
          email: row['email'] || row['Email'] || '',
          phone: row['phone'] || row['Phone'] || undefined,
          skills: splitSkills(row['skills'] || row['Skills'] || ''),
          experienceYears: parseFloat(row['experience_years'] || row['Experience'] || '0') || 0,
          education: row['education'] || row['Education'] || '',
          category: row['category'] || row['Category'] || '',
          resumeText: row['resume_text'] || row['Resume_str'] || '',
        };

        if (candidate.email) {
          results.push(candidate);
        }
      })
      .on('end', () => {
        logger.info(`CSV parsed: ${results.length} candidates`);
        resolve(results);
      })
      .on('error', (err) => {
        logger.error(`CSV parse error: ${err.message}`);
        reject(err);
      });
  });
}

function splitSkills(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
