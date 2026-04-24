'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Candidate } from '@/types/candidate';

export function useCandidates(jobId: string) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/candidates`
      );

      setCandidates(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
  };
}