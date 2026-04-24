'use client';
import { useEffect, useState, useCallback } from 'react';
import { Job } from '@/types/job';
import { getJobs, createJob, deleteJob } from '@/lib/api';
import toast from 'react-hot-toast';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
      setError(null);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (data: unknown) => {
    const job = await createJob(data);
    setJobs(prev => [job, ...prev]);
    return job;
  };

  const remove = async (id: string) => {
    await deleteJob(id);
    setJobs(prev => prev.filter(j => j._id !== id));
    toast.success('Job deleted');
  };

  return { jobs, loading, error, refetch: fetch, add, remove };
}
