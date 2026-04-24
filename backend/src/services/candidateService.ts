import Candidate, { ICandidate } from '../models/Candidate';

export const getCandidatesByJob = (jobId: string) =>
  Candidate.find({ jobId }).sort({ createdAt: -1 });

export const getCandidateById = (id: string) => Candidate.findById(id);

export const createCandidate = (data: Partial<ICandidate>) => Candidate.create(data);

export const bulkCreateCandidates = (candidates: Partial<ICandidate>[]) =>
  Candidate.insertMany(candidates);

export const deleteCandidate = (id: string) => Candidate.findByIdAndDelete(id);

export const deleteCandidatesByJob = (jobId: string) => Candidate.deleteMany({ jobId });
