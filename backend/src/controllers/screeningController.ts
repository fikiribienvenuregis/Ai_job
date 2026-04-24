import { Request, Response, NextFunction } from 'express';
import Job from '../models/Job';
import Candidate from '../models/Candidate';
import ScreeningResult from '../models/ScreeningResult';
import { screenCandidate } from '../services/geminiService';
import { sendSuccess, sendError } from '../utils/responseHelper';
import logger from '../utils/logger';

export const triggerScreening = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return sendError(res, 'Job not found', 404);

    const candidates = await Candidate.find({ jobId });
    if (candidates.length === 0) {
      return sendError(res, 'No candidates found for this job', 400);
    }

    // Mark job as screening
    job.status = 'screening';
    await job.save();

    // Delete previous results for clean re-run
    await ScreeningResult.deleteMany({ jobId });

    logger.info(`Starting screening for job "${job.title}" — ${candidates.length} candidates`);

    const results = [];

    for (const candidate of candidates) {
      try {
        const scores = await screenCandidate(job, candidate);
        const result = await ScreeningResult.create({
          jobId,
          candidateId: candidate._id,
          ...scores,
        });
        results.push(result);
        logger.info(`Screened: ${candidate.name} → ${scores.compositeScore}`);
      } catch (err) {
        logger.error(`Failed to screen ${candidate.name}: ${err}`);
      }
    }

    // Assign ranks by composite score descending
    results.sort((a, b) => b.compositeScore - a.compositeScore);
    for (let i = 0; i < results.length; i++) {
      results[i].rank = i + 1;
      await results[i].save();
    }

    // Mark job as open again
    job.status = 'open';
    await job.save();

    sendSuccess(res, { screened: results.length }, `Screened ${results.length} candidates`);
  } catch (err) {
    next(err);
  }
};

export const getResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    const results = await ScreeningResult.find({ jobId })
      .populate('candidateId', 'name email skills experienceYears education category')
      .sort({ rank: 1 });

    if (results.length === 0) {
      return sendError(res, 'No screening results found. Run screening first.', 404);
    }

    sendSuccess(res, results, 'Results retrieved');
  } catch (err) {
    next(err);
  }
};
