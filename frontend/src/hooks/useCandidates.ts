'use client';
import { useEffect, useState, useCallback } from 'react';
import { Candidate } from '@/types/candidate';
import { getCandidates } from '@/lib/api';

export function useCandidates(jobId: string) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const data = await getCandidates(jobId);
      setCandidates(data);
      setError(null);
    } catch {
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { candidates, loading, error, refetch: fetch };
}
