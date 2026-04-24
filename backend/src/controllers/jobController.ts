import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/jobService';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { z } from 'zod';

const JobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  experienceYears: z.number().min(0).default(0),
  educationLevel: z.enum(['Any', 'Bachelor', 'Master', 'PhD']).default('Any'),
  location: z.string().default('Remote'),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote']).default('Full-time'),
});

export const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jobService.getAllJobs();
    sendSuccess(res, jobs, 'Jobs retrieved');
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return sendError(res, 'Job not found', 404);
    sendSuccess(res, job, 'Job retrieved');
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = JobSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 'Validation error', 400, parsed.error.flatten());
    }
    const job = await jobService.createJob(parsed.data);
    sendSuccess(res, job, 'Job created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) return sendError(res, 'Job not found', 404);
    sendSuccess(res, job, 'Job updated');
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await jobService.deleteJob(req.params.id);
    sendSuccess(res, null, 'Job deleted');
  } catch (err) {
    next(err);
  }
};
