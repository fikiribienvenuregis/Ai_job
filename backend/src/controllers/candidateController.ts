import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import * as candidateService from '../services/candidateService';
import { parseCSV } from '../services/csvParserService';
import { parsePDF } from '../services/pdfParserService';
import { sendSuccess, sendError } from '../utils/responseHelper';
import logger from '../utils/logger';

export const listCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.query;
    if (!jobId) return sendError(res, 'jobId query param is required', 400);
    const candidates = await candidateService.getCandidatesByJob(jobId as string);
    sendSuccess(res, candidates, 'Candidates retrieved');
  } catch (err) {
    next(err);
  }
};

export const uploadCSVOrJSON = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return sendError(res, 'jobId is required', 400);

    const file = req.file;
    if (!file) return sendError(res, 'No file uploaded', 400);

    let parsed: Awaited<ReturnType<typeof parseCSV>> = [];

    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      const raw = fs.readFileSync(file.path, 'utf-8');
      const jsonData = JSON.parse(raw);
      parsed = Array.isArray(jsonData) ? jsonData : [jsonData];
    } else {
      // CSV
      parsed = await parseCSV(file.path);
    }

    const docs = parsed.map((c) => ({ ...c, jobId }));
    const created = await candidateService.bulkCreateCandidates(docs);

    // Clean up temp file
    fs.unlinkSync(file.path);

    sendSuccess(res, { inserted: created.length }, `${created.length} candidates imported`, 201);
  } catch (err) {
    next(err);
  }
};

export const uploadResumePDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return sendError(res, 'jobId is required', 400);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return sendError(res, 'No PDF files uploaded', 400);

    const created = [];

    for (const file of files) {
      try {
        const resume = await parsePDF(file.path);
        const candidate = await candidateService.createCandidate({
          jobId,
          name: resume.name,
          email: resume.email || `${Date.now()}@unknown.com`,
          phone: resume.phone,
          skills: resume.skills,
          experienceYears: resume.experienceYears,
          education: resume.education,
          resumeText: resume.text,
          resumeFile: file.originalname,
          source: 'pdf',
        } as any);
        created.push(candidate);
        fs.unlinkSync(file.path);
      } catch (fileErr) {
        logger.warn(`Failed to process PDF ${file.originalname}: ${fileErr}`);
      }
    }

    sendSuccess(res, { inserted: created.length }, `${created.length} resumes imported`, 201);
  } catch (err) {
    next(err);
  }
};
