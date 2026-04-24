import Job, { IJob } from '../models/Job';

export const getAllJobs = () => Job.find().sort({ createdAt: -1 });

export const getJobById = (id: string) => Job.findById(id);

export const createJob = (data: Partial<IJob>) => Job.create(data);

export const updateJob = (id: string, data: Partial<IJob>) =>
  Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteJob = (id: string) => Job.findByIdAndDelete(id);
